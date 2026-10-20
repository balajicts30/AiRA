// ============================================================================
// URL NORMALIZATION, SSRF PROTECTION, DENYLIST & ALLOWLIST VERIFICATION
// ============================================================================

import { RejectedSourceLog, SourceRegistryRecord } from "./types";

export const PROHIBITED_SOCIAL_DOMAINS: readonly string[] = [
  "facebook.com",
  "fb.com",
  "fb.watch",
  "instagram.com",
  "instagr.am",
  "x.com",
  "twitter.com",
  "t.co",
  "threads.net",
  "threads.com",
  "reddit.com",
  "redd.it",
  "tiktok.com",
  "linkedin.com",
  "pinterest.com",
  "quora.com",
  "tumblr.com",
  "mastodon.social",
  "bsky.app"
];

export const DISABLED_ENCYCLOPEDIA_DOMAINS: readonly string[] = [
  "wikipedia.org",
  "wikimedia.org",
  "wikidata.org",
  "wiktionary.org",
  "wikinews.org",
  "fandom.com"
];

export const UNAPPROVED_URL_SHORTENERS: readonly string[] = [
  "bit.ly",
  "tinyurl.com",
  "t.co",
  "goo.gl",
  "ow.ly",
  "is.gd",
  "buff.ly",
  "rebrand.ly",
  "shorturl.at",
  "cutt.ly",
  "rb.gy",
  "tiny.cc"
];

const PROTECTED_BRAND_KEYWORDS = [
  "reuters",
  "apnews",
  "associatedpress",
  "bbc",
  "theguardian",
  "nytimes",
  "wsj",
  "ft",
  "bloomberg",
  "cnbc",
  "thehindu",
  "indianexpress",
  "hindustantimes",
  "espn",
  "skysports",
  "nbcsports",
  "olympics",
  "fifa",
  "uefa",
  "icc-cricket",
  "bcci",
  "nba",
  "nfl",
  "formula1",
  "microsoft",
  "openai",
  "nvidia",
  "apple",
  "google",
  "cloudflare",
  "github",
  "arstechnica",
  "theverge",
  "techcrunch",
  "wired"
];

const TRACKING_PARAMS = new Set([
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "fbclid",
  "gclid",
  "msclkid",
  "twclid",
  "mc_cid",
  "mc_eid",
  "ref",
  "ref_src"
]);

/**
 * Checks whether a hostname or IP string resolves to a private, loopback,
 * link-local, or reserved network address (SSRF protection).
 */
export function isPrivateOrProhibitedHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase().replace(/^\[|\]$/g, "");
  if (!host) return true;

  // Prohibited local hostnames and suffixes
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host.endsWith(".lan") ||
    host.endsWith(".home") ||
    host.endsWith(".corp") ||
    host === "metadata.google.internal"
  ) {
    return true;
  }

  // IPv6 loopback, unique-local, link-local, unspecified
  if (
    host === "::1" ||
    host === "::" ||
    host === "0:0:0:0:0:0:0:1" ||
    host.startsWith("fc") ||
    host.startsWith("fd") ||
    host.startsWith("fe8") ||
    host.startsWith("fe9") ||
    host.startsWith("fea") ||
    host.startsWith("feb") ||
    host.startsWith("::ffff:")
  ) {
    return true;
  }

  // Reject raw integer / hex / octal IP representations (e.g., 2130706433 or 0x7f000001)
  if (/^(0x[0-9a-f]+|\d+)$/i.test(host)) {
    return true;
  }

  // IPv4 address check
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const octets = ipv4Match.slice(1, 5).map(Number);
    if (octets.some((o) => o < 0 || o > 255)) return true;
    const [a, b] = octets;
    // 0.0.0.0/8, 10.0.0.0/8, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.168.0.0/16, 100.64.0.0/10, 224.0.0.0/4
    if (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 100 && b >= 64 && b <= 127) ||
      a >= 224
    ) {
      return true;
    }
    // Disallow raw IP addresses as factual publisher domains
    return true;
  }

  // Must contain at least one dot and valid TLD characters
  const parts = host.split(".");
  if (parts.length < 2 || parts[parts.length - 1].length < 2) {
    return true;
  }

  return false;
}

export interface NormalizedUrlInfo {
  isValid: boolean;
  canonicalUrl: string;
  hostname: string;
  registrableDomain: string;
  subdomain: string;
  errorReason?: RejectedSourceLog["reasonCode"];
  errorDetail?: string;
}

const MULTI_PART_TLDS = new Set([
  "co.uk",
  "org.uk",
  "gov.uk",
  "ac.uk",
  "co.in",
  "gov.in",
  "org.in",
  "com.au",
  "org.au",
  "co.jp",
  "co.nz"
]);

export function extractDomainParts(hostname: string): {
  registrableDomain: string;
  subdomain: string;
} {
  const cleanHost = hostname.toLowerCase().replace(/\.$/, "");
  const parts = cleanHost.split(".");
  if (parts.length <= 2) {
    return { registrableDomain: cleanHost, subdomain: "" };
  }
  const lastTwo = parts.slice(-2).join(".");
  if (MULTI_PART_TLDS.has(lastTwo) && parts.length >= 3) {
    const registrableDomain = parts.slice(-3).join(".");
    const subdomain = parts.slice(0, -3).join(".");
    return { registrableDomain, subdomain };
  }
  const registrableDomain = lastTwo;
  const subdomain = parts.slice(0, -2).join(".");
  return { registrableDomain, subdomain };
}

export function normalizeAndInspectUrl(rawUrl: string): NormalizedUrlInfo {
  try {
    if (!rawUrl || typeof rawUrl !== "string") {
      return {
        isValid: false,
        canonicalUrl: "",
        hostname: "",
        registrableDomain: "",
        subdomain: "",
        errorReason: "SSRF_PRIVATE_OR_INVALID_HOST",
        errorDetail: "Empty or non-string URL"
      };
    }

    const trimmed = rawUrl.trim();
    const parsed = new URL(trimmed);

    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return {
        isValid: false,
        canonicalUrl: "",
        hostname: "",
        registrableDomain: "",
        subdomain: "",
        errorReason: "SSRF_PRIVATE_OR_INVALID_HOST",
        errorDetail: `Disallowed URL scheme: ${parsed.protocol}`
      };
    }

    if (parsed.username || parsed.password) {
      return {
        isValid: false,
        canonicalUrl: "",
        hostname: "",
        registrableDomain: "",
        subdomain: "",
        errorReason: "SSRF_PRIVATE_OR_INVALID_HOST",
        errorDetail: "URLs with embedded credentials are prohibited"
      };
    }

    const hostname = parsed.hostname.toLowerCase().replace(/\.$/, "");
    if (isPrivateOrProhibitedHost(hostname)) {
      return {
        isValid: false,
        canonicalUrl: "",
        hostname,
        registrableDomain: hostname,
        subdomain: "",
        errorReason: "SSRF_PRIVATE_OR_INVALID_HOST",
        errorDetail: `Host "${hostname}" is private, loopback, IP-literal, or prohibited`
      };
    }

    // Strip tracking query parameters and hash fragments
    parsed.hash = "";
    for (const key of Array.from(parsed.searchParams.keys())) {
      if (TRACKING_PARAMS.has(key.toLowerCase())) {
        parsed.searchParams.delete(key);
      }
    }

    const { registrableDomain, subdomain } = extractDomainParts(hostname);

    return {
      isValid: true,
      canonicalUrl: parsed.toString(),
      hostname,
      registrableDomain,
      subdomain
    };
  } catch {
    return {
      isValid: false,
      canonicalUrl: "",
      hostname: "",
      registrableDomain: "",
      subdomain: "",
      errorReason: "SSRF_PRIVATE_OR_INVALID_HOST",
      errorDetail: "Malformed URL syntax"
    };
  }
}

function matchesDomainList(hostname: string, registrableDomain: string, domainList: readonly string[]): boolean {
  return domainList.some(
    (blocked) =>
      hostname === blocked ||
      registrableDomain === blocked ||
      hostname.endsWith(`.${blocked}`)
  );
}

/**
 * Validates a URL and its optional redirect chain against:
 * 1. SSRF / Private network checks
 * 2. Social Media Denylist (Facebook, Instagram, X/Twitter, Threads, Reddit, etc.)
 * 3. Disabled Encyclopedia Denylist (Wikipedia, Wikimedia, etc.)
 * 4. Unapproved URL Shorteners (unless final destination is provided & verified)
 * 5. Lookalike / Brand-Spoofing Hostnames
 * 6. Central Approved Source Registry (canonicalDomain + approvedSubdomains + approvalStatus === 'approved')
 */
export function verifyUrlAgainstRegistry(
  rawUrl: string,
  registry: SourceRegistryRecord[],
  redirectChain: string[] = []
): {
  allowed: boolean;
  matchedSource?: SourceRegistryRecord;
  canonicalUrl: string;
  rejection?: RejectedSourceLog;
} {
  const allHops = redirectChain.length > 0 ? [...redirectChain, rawUrl] : [rawUrl];

  for (let i = 0; i < allHops.length; i++) {
    const hopUrl = allHops[i];
    const isFinalHop = i === allHops.length - 1;
    const inspected = normalizeAndInspectUrl(hopUrl);

    if (!inspected.isValid) {
      return {
        allowed: false,
        canonicalUrl: "",
        rejection: {
          timestamp: new Date().toISOString(),
          url: hopUrl,
          normalizedDomain: inspected.hostname || "invalid",
          reasonCode: inspected.errorReason || "SSRF_PRIVATE_OR_INVALID_HOST",
          detail: inspected.errorDetail || "Invalid or prohibited URL"
        }
      };
    }

    const { hostname, registrableDomain, subdomain, canonicalUrl } = inspected;

    // 1. Check Prohibited Social Media Denylist
    if (matchesDomainList(hostname, registrableDomain, PROHIBITED_SOCIAL_DOMAINS)) {
      return {
        allowed: false,
        canonicalUrl,
        rejection: {
          timestamp: new Date().toISOString(),
          url: rawUrl,
          normalizedDomain: hostname,
          reasonCode: isFinalHop ? "PROHIBITED_SOCIAL_MEDIA" : "REDIRECT_TO_UNAPPROVED_DEST",
          detail: `Blocked social media platform (${hostname}) cannot be used as a factual source`
        }
      };
    }

    // 2. Check Disabled Wikipedia / Encyclopedia Denylist
    if (matchesDomainList(hostname, registrableDomain, DISABLED_ENCYCLOPEDIA_DOMAINS)) {
      return {
        allowed: false,
        canonicalUrl,
        rejection: {
          timestamp: new Date().toISOString(),
          url: rawUrl,
          normalizedDomain: hostname,
          reasonCode: "WIKIPEDIA_DISABLED",
          detail: `Wikipedia/Wikimedia (${hostname}) is disabled for the factual search pipeline`
        }
      };
    }

    // 3. Check Unapproved URL Shorteners
    if (matchesDomainList(hostname, registrableDomain, UNAPPROVED_URL_SHORTENERS)) {
      if (isFinalHop) {
        return {
          allowed: false,
          canonicalUrl,
          rejection: {
            timestamp: new Date().toISOString(),
            url: rawUrl,
            normalizedDomain: hostname,
            reasonCode: "UNAPPROVED_SHORTENER",
            detail: `Unresolved URL shortener (${hostname}) is not trusted until destination is verified`
          }
        };
      }
      // If it's an intermediate hop in redirectChain, continue to inspect the resolved destination
      continue;
    }

    // If this is the final hop (or non-shortener intermediate hop), check against registry
    const matchedRecords = registry.filter((src) => {
      const srcDom = src.canonicalDomain.toLowerCase();
      return hostname === srcDom || registrableDomain === srcDom || hostname.endsWith(`.${srcDom}`);
    });

    if (matchedRecords.length === 0) {
      // Check if hostname is a deceptive lookalike containing a protected publisher/brand name
      const isLookalike = PROTECTED_BRAND_KEYWORDS.some(
        (brand) => hostname.includes(brand)
      );
      if (isLookalike) {
        return {
          allowed: false,
          canonicalUrl,
          rejection: {
            timestamp: new Date().toISOString(),
            url: rawUrl,
            normalizedDomain: hostname,
            reasonCode: "LOOKALIKE_SPOOF_DOMAIN",
            detail: `Rejected lookalike/spoofed domain "${hostname}" impersonating an approved publisher or brand`
          }
        };
      }

      return {
        allowed: false,
        canonicalUrl,
        rejection: {
          timestamp: new Date().toISOString(),
          url: rawUrl,
          normalizedDomain: hostname,
          reasonCode: i > 0 ? "REDIRECT_TO_UNAPPROVED_DEST" : "UNAPPROVED_DOMAIN",
          detail:
            i > 0
              ? `Redirect destination "${hostname}" is not in the approved source registry`
              : `Domain "${hostname}" is not in the approved source registry`
        }
      };
    }

    // Prefer an approved record if multiple exist for same domain
    const candidateSource =
      matchedRecords.find((r) => r.approvalStatus === "approved") || matchedRecords[0];

    if (candidateSource.approvalStatus !== "approved") {
      return {
        allowed: false,
        canonicalUrl,
        rejection: {
          timestamp: new Date().toISOString(),
          url: rawUrl,
          normalizedDomain: hostname,
          reasonCode: "SOURCE_NOT_APPROVED_STATUS",
          detail: `Source "${candidateSource.publisherName}" (${hostname}) has status "${candidateSource.approvalStatus}" (must be "approved")`
        }
      };
    }

    if (candidateSource.integrationHealth === "disabled") {
      return {
        allowed: false,
        canonicalUrl,
        rejection: {
          timestamp: new Date().toISOString(),
          url: rawUrl,
          normalizedDomain: hostname,
          reasonCode: "SOURCE_NOT_APPROVED_STATUS",
          detail: `Source "${candidateSource.publisherName}" integration is currently disabled by administrator`
        }
      };
    }

    // Validate subdomain against candidateSource.approvedSubdomains
    const relativeSubdomain =
      hostname === candidateSource.canonicalDomain.toLowerCase()
        ? ""
        : hostname.endsWith(`.${candidateSource.canonicalDomain.toLowerCase()}`)
        ? hostname.slice(0, -(candidateSource.canonicalDomain.length + 1))
        : subdomain;

    if (relativeSubdomain) {
      const allowedSubs = candidateSource.approvedSubdomains.map((s) => s.toLowerCase());
      const subParts = relativeSubdomain.split(".");
      const topSub = subParts[subParts.length - 1];
      const isSubApproved =
        allowedSubs.includes("*") ||
        allowedSubs.includes(relativeSubdomain) ||
        allowedSubs.includes(topSub);

      if (!isSubApproved) {
        return {
          allowed: false,
          canonicalUrl,
          rejection: {
            timestamp: new Date().toISOString(),
            url: rawUrl,
            normalizedDomain: hostname,
            reasonCode: "UNAPPROVED_SUBDOMAIN",
            detail: `Subdomain "${relativeSubdomain}" on "${candidateSource.canonicalDomain}" is not in approvedSubdomains [${candidateSource.approvedSubdomains.join(", ")}]`
          }
        };
      }
    }

    if (isFinalHop) {
      return {
        allowed: true,
        matchedSource: candidateSource,
        canonicalUrl
      };
    }
  }

  return {
    allowed: false,
    canonicalUrl: "",
    rejection: {
      timestamp: new Date().toISOString(),
      url: rawUrl,
      normalizedDomain: "unknown",
      reasonCode: "UNAPPROVED_DOMAIN",
      detail: "Unable to verify URL destination"
    }
  };
}
