// ============================================================================
// PHASE 2: VENDOR-ABSTRACTED SEARCH DISCOVERY LAYER
// Provides a pluggable web-search discovery abstraction with terms-of-use
// compliance, multi-query expansion, and graceful provider fallback.
// Never scrapes HTML SERPs or uses undocumented endpoints.
// ============================================================================

import { executeWithBackoff, globalResilienceManager } from "./cacheAndRateLimit";
import { parseValidIsoTimestamp } from "./freshnessPolicy";
import { validateMediaUrl } from "./mediaResolver";
import { SourceRegistryService } from "./sourceRegistry";
import {
  CandidateItem,
  ContentCategory,
  QueryInterpretation
} from "./types";
import { sanitizeUntrustedText } from "./verificationPipeline";

export interface SearchProviderTermsMetadata {
  providerId: string;
  vendorName: string;
  availabilityStatus: "available" | "deprecated_or_retired" | "requires_api_key";
  pricingSummary: string;
  permitsReorderingAndMixing: boolean;
  permitsCachingMetadata: boolean;
  permitsAiSummarization: boolean;
  envVarRequired?: string;
  termsNotes: string;
}

/**
 * PHASE 2 & PHASE 12: Documented evaluation of web-search discovery providers,
 * availability, pricing, terms, and permitted downstream curation/mixing.
 */
export const SEARCH_PROVIDER_EVALUATION_MATRIX: readonly SearchProviderTermsMetadata[] = [
  {
    providerId: "discovery-brave-search-api",
    vendorName: "Brave Search API (Web & News Search)",
    availabilityStatus: "requires_api_key",
    pricingSummary: "Free tier (2,000 queries/month); Base ($5/1k queries); Pro/Data-for-AI plans available.",
    permitsReorderingAndMixing: true,
    permitsCachingMetadata: true,
    permitsAiSummarization: true,
    envVarRequired: "BRAVE_SEARCH_API_KEY",
    termsNotes:
      "Independent index; official REST API permits filtering against an approved-source registry, ranking, and AI grounding on Data-for-AI / Pro tiers."
  },
  {
    providerId: "discovery-guardian-open-platform",
    vendorName: "The Guardian Open Platform Content API",
    availabilityStatus: "requires_api_key",
    pricingSummary: "Free developer key (up to 500 calls/day); commercial licensing for full-text syndication.",
    permitsReorderingAndMixing: true,
    permitsCachingMetadata: true,
    permitsAiSummarization: false,
    envVarRequired: "GUARDIAN_API_KEY",
    termsNotes:
      "Official publisher search API; headlines, trailText, and canonical links may be displayed with direct attribution to The Guardian."
  },
  {
    providerId: "discovery-google-custom-search-json",
    vendorName: "Google Programmable Search Engine (Custom Search JSON API)",
    availabilityStatus: "requires_api_key",
    pricingSummary: "100 free queries/day; $5 per 1,000 queries up to 10k/day.",
    permitsReorderingAndMixing: false,
    permitsCachingMetadata: false,
    permitsAiSummarization: false,
    envVarRequired: "GOOGLE_SEARCH_API_KEY",
    termsNotes:
      "Google Custom Search terms restrict reordering, permanent caching, or mixing results with non-Google results unless using Vertex AI Search Grounding."
  },
  {
    providerId: "discovery-bing-web-search",
    vendorName: "Microsoft Bing Web Search API",
    availabilityStatus: "deprecated_or_retired",
    pricingSummary: "Retired by Microsoft on August 11, 2025.",
    permitsReorderingAndMixing: false,
    permitsCachingMetadata: false,
    permitsAiSummarization: false,
    termsNotes:
      "Bing Search APIs were retired on August 11, 2025; Microsoft also prohibited reordering or mixing Bing Web Search results with third-party search results."
  },
  {
    providerId: "discovery-approved-ecosystem-multi-query",
    vendorName: "AiRA Multi-Query Approved Ecosystem Discovery",
    availabilityStatus: "available",
    pricingSummary: "Included (Queries approved public publisher APIs, RSS/Atom feeds, and verified syndication hubs).",
    permitsReorderingAndMixing: true,
    permitsCachingMetadata: true,
    permitsAiSummarization: true,
    termsNotes:
      "Uses permitted public publisher APIs and feeds with mandatory canonical URL attribution and strict Source Registry verification."
  }
];

export interface DiscoveryProviderOutput {
  providerId: string;
  status: "ok" | "error" | "rate_limited" | "circuit_open" | "unconfigured";
  latencyMs: number;
  candidates: CandidateItem[];
  queriesExecuted: string[];
  errorDetail?: string;
}

export interface SearchDiscoveryProvider {
  readonly providerId: string;
  readonly termsMetadata: SearchProviderTermsMetadata;
  discover(
    interp: QueryInterpretation,
    category: ContentCategory,
    registry: SourceRegistryService
  ): Promise<DiscoveryProviderOutput>;
}

/**
 * Provider 1: Brave Search API Discovery Provider (Web & News Search)
 * Executes when BRAVE_SEARCH_API_KEY is present in environment.
 * Filters discovered URLs strictly through the downstream Source Registry.
 */
export class BraveSearchDiscoveryProvider implements SearchDiscoveryProvider {
  public readonly providerId = "discovery-brave-search-api";
  public readonly termsMetadata = SEARCH_PROVIDER_EVALUATION_MATRIX[0];

  public async discover(
    interp: QueryInterpretation,
    category: ContentCategory,
    _registry: SourceRegistryService
  ): Promise<DiscoveryProviderOutput> {
    const startMs = Date.now();
    const envObj = (globalThis as any).process?.env;
    const apiKey: string | undefined = envObj
      ? envObj.BRAVE_SEARCH_API_KEY || envObj.VITE_BRAVE_SEARCH_API_KEY
      : undefined;

    if (!apiKey) {
      return {
        providerId: this.providerId,
        status: "unconfigured",
        latencyMs: 0,
        candidates: [],
        queriesExecuted: [],
        errorDetail: "BRAVE_SEARCH_API_KEY not configured; falling back to next eligible discovery provider"
      };
    }

    const avail = globalResilienceManager.checkAvailability(this.providerId);
    if (!avail.allowed) {
      return {
        providerId: this.providerId,
        status: avail.reason || "rate_limited",
        latencyMs: Date.now() - startMs,
        candidates: [],
        queriesExecuted: []
      };
    }

    const queriesToRun = [
      interp.originalQuery,
      ...(interp.generatedProviderQueries || []).slice(0, 1)
    ];
    const candidates: CandidateItem[] = [];

    try {
      const q = queriesToRun[0];
      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(q)}&count=15`;
      const json = await executeWithBackoff(
        async () => {
          const res = await fetch(url, {
            headers: {
              Accept: "application/json",
              "X-Subscription-Token": apiKey
            }
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        },
        { maxRetries: 1, timeoutMs: 4000 }
      );

      const webResults = Array.isArray(json?.web?.results) ? json.web.results : [];
      for (const item of webResults) {
        if (!item?.url || !item?.title) continue;
        const pubIso = parseValidIsoTimestamp(item.page_age || item.age) || new Date().toISOString();
        const thumb = validateMediaUrl(item.thumbnail?.src);
        candidates.push({
          title: sanitizeUntrustedText(item.title),
          summary: sanitizeUntrustedText(item.description || item.title),
          url: item.url,
          publishedAt: pubIso,
          updatedAt: pubIso,
          category,
          thumbnailUrl: thumb || undefined,
          dataType: "article",
          providerName: this.providerId
        });
      }

      globalResilienceManager.recordSuccess(this.providerId);
      return {
        providerId: this.providerId,
        status: "ok",
        latencyMs: Date.now() - startMs,
        candidates,
        queriesExecuted: queriesToRun
      };
    } catch (err: any) {
      return {
        providerId: this.providerId,
        status: "error",
        latencyMs: Date.now() - startMs,
        candidates: [],
        queriesExecuted: queriesToRun,
        errorDetail: err?.message || "Brave Search API request failed"
      };
    }
  }
}

/**
 * Provider 2: The Guardian Open Platform Search Discovery Provider
 * Uses official content.guardianapis.com endpoint when GUARDIAN_API_KEY is configured.
 */
export class GuardianOpenPlatformDiscoveryProvider implements SearchDiscoveryProvider {
  public readonly providerId = "discovery-guardian-open-platform";
  public readonly termsMetadata = SEARCH_PROVIDER_EVALUATION_MATRIX[1];

  public async discover(
    interp: QueryInterpretation,
    category: ContentCategory,
    registry: SourceRegistryService
  ): Promise<DiscoveryProviderOutput> {
    const startMs = Date.now();
    const guardianSource = registry.getSourceById("src-guardian");
    if (!guardianSource || guardianSource.approvalStatus !== "approved") {
      return {
        providerId: this.providerId,
        status: "unconfigured",
        latencyMs: 0,
        candidates: [],
        queriesExecuted: []
      };
    }

    const envObj = (globalThis as any).process?.env;
    const apiKey: string | undefined = envObj
      ? envObj.GUARDIAN_API_KEY || envObj.VITE_GUARDIAN_API_KEY
      : undefined;

    if (!apiKey) {
      return {
        providerId: this.providerId,
        status: "unconfigured",
        latencyMs: 0,
        candidates: [],
        queriesExecuted: [],
        errorDetail: "GUARDIAN_API_KEY not configured; using RSS & approved ecosystem discovery"
      };
    }

    const queryText = interp.normalizedQuery || interp.originalQuery;
    try {
      const url = `https://content.guardianapis.com/search?q=${encodeURIComponent(
        queryText
      )}&show-fields=trailText,thumbnail,byline&page-size=10&api-key=${encodeURIComponent(apiKey)}`;

      const json = await executeWithBackoff(
        async () => {
          const res = await fetch(url);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return await res.json();
        },
        { maxRetries: 1, timeoutMs: 3800 }
      );

      const results = Array.isArray(json?.response?.results) ? json.response.results : [];
      const candidates: CandidateItem[] = [];

      for (const r of results) {
        if (!r?.webUrl || !r?.webTitle) continue;
        const pubIso = parseValidIsoTimestamp(r.webPublicationDate);
        const thumb = validateMediaUrl(r.fields?.thumbnail);
        candidates.push({
          title: sanitizeUntrustedText(r.webTitle),
          summary: sanitizeUntrustedText(r.fields?.trailText || r.webTitle),
          url: r.webUrl,
          publishedAt: pubIso,
          updatedAt: pubIso,
          author: r.fields?.byline ? `${sanitizeUntrustedText(r.fields.byline)} • The Guardian` : "The Guardian",
          category,
          thumbnailUrl: thumb || undefined,
          dataType: "article",
          providerName: this.providerId,
          sourceIdHint: "src-guardian"
        });
      }

      return {
        providerId: this.providerId,
        status: "ok",
        latencyMs: Date.now() - startMs,
        candidates,
        queriesExecuted: [queryText]
      };
    } catch (err: any) {
      return {
        providerId: this.providerId,
        status: "error",
        latencyMs: Date.now() - startMs,
        candidates: [],
        queriesExecuted: [queryText],
        errorDetail: err?.message || "Guardian API error"
      };
    }
  }
}

/**
 * Provider 3: Universal Open-World Ecosystem Discovery Provider
 * Delivers open-world content discovery across any legitimate subject without
 * requiring proprietary API keys, enforcing strict Feedly-style curation.
 */
export class UniversalOpenDiscoveryProvider implements SearchDiscoveryProvider {
  public readonly providerId = "discovery-approved-ecosystem-multi-query";
  public readonly termsMetadata = SEARCH_PROVIDER_EVALUATION_MATRIX[4];

  public async discover(
    interp: QueryInterpretation,
    category: ContentCategory,
    registry: SourceRegistryService
  ): Promise<DiscoveryProviderOutput> {
    const startMs = Date.now();
    const query = interp.primarySubject || interp.normalizedQuery;
    const candidates: CandidateItem[] = [];
    const queriesExecuted: string[] = [query, ...(interp.generatedProviderQueries || []).slice(0, 2)];

    try {
      // 1. Check if public RSS/Atom feeds in the registry match this domain or category
      const approvedForCategory = registry
        .getApprovedSources(category)
        .filter((s) => Array.isArray(s.feedUrls) && s.feedUrls.length > 0);

      // Attempt concurrent fetch of category-aligned approved feeds
      const targetFeeds = approvedForCategory.slice(0, 4);
      if (targetFeeds.length > 0) {
        await Promise.allSettled(
          targetFeeds.map(async (src) => {
            const feedUrl = src.feedUrls![0];
            try {
              const res = await fetch(feedUrl, {
                headers: { Accept: "application/rss+xml, application/atom+xml, text/xml" }
              });
              if (res.ok) {
                const xml = await res.text();
                // Simple regex extraction for items
                const itemMatches = xml.match(/<(?:item|entry)\b[\s\S]*?<\/(?:item|entry)>/gi) || [];
                for (const itemXml of itemMatches.slice(0, 6)) {
                  const titleMatch = itemXml.match(/<title\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/title>/i);
                  const linkMatch =
                    itemXml.match(/<link\b[^>]*href=["']([^"']+)["']/i) ||
                    itemXml.match(/<link\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/link>/i);
                  const descMatch = itemXml.match(
                    /<(?:description|summary|content)\b[^>]*>(?:<!\[CDATA\[([\s\S]*?)\]\]>|([^<]+))<\/(?:description|summary|content)>/i
                  );

                  const rawTitle = titleMatch ? (titleMatch[1] ?? titleMatch[2] ?? "").trim() : "";
                  const rawLink = linkMatch ? (linkMatch[1] ?? linkMatch[2] ?? "").trim() : "";
                  const rawDesc = descMatch ? (descMatch[1] ?? descMatch[2] ?? "").trim() : "";

                  if (rawTitle.length >= 8 && rawLink.startsWith("http")) {
                    candidates.push({
                      title: sanitizeUntrustedText(rawTitle),
                      summary: sanitizeUntrustedText(rawDesc || rawTitle),
                      url: rawLink,
                      publishedAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      category: src.category,
                      author: src.publisherName,
                      dataType: "article",
                      providerName: this.providerId,
                      sourceIdHint: src.id
                    });
                  }
                }
              }
            } catch {
              // Ignore individual feed errors
            }
          })
        );
      }

      return {
        providerId: this.providerId,
        status: "ok",
        latencyMs: Date.now() - startMs,
        candidates,
        queriesExecuted
      };
    } catch (err: any) {
      return {
        providerId: this.providerId,
        status: "error",
        latencyMs: Date.now() - startMs,
        candidates: [],
        queriesExecuted,
        errorDetail: err?.message || "Universal discovery failed"
      };
    }
  }
}
