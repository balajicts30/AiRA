# AiRA Source Intelligence & Trust Governance Specification
**Document:** `docs/SOURCE_GOVERNANCE.md`  
**Status:** Approved Specification & Implementation Reference  
**Date:** 2026-10-25  
**Version:** 2.0.0 (Universal Open-World Governance)  

---

## 1. Governance Principles & Philosophy

AiRA's source governance layer guarantees that every piece of information presented to users carries verifiable authenticity, traceable provenance, and credible attribution:

1. **Provenance First:** Every factual claim, article card, and scorecard must link to a valid canonical publisher URL.
2. **Social Media Excluded for Factual Claims:** User-generated social networks (Facebook, Instagram, X/Twitter, Threads, Reddit, TikTok) are excluded as factual sources in the curated discovery pipeline.
3. **Decoupled Governance & Relevance:** An approved domain does not automatically pass into the feed; it must independently pass the Feedly-style topical relevance gate.
4. **Open-World Extensibility:** Legitimate publishers across the global web (`.edu`, `.gov`, academic journals, verified news, independent technical documentation) are dynamically admitted without requiring manual pre-registration for every new domain.

---

## 2. Source Credibility Hierarchy (Three-Tier Model)

AiRA classifies all admitted sources into three trust tiers:

```
+--------------------------------------------------------------------------------+
| TIER 1: PRIMARY & GOVERNING BODIES (Credibility Score: 90 - 100)               |
| Governing bodies (ICC, BCCI, FIFA, FIA, NASA, WHO), official government &      |
| academic institutions (.gov, .edu, .ac.uk), primary wire agencies (Reuters, AP) |
+--------------------------------------------------------------------------------+
                                       |
+--------------------------------------------------------------------------------+
| TIER 2: ESTABLISHED BROADCASTERS & SPECIALIST DESKS (Score: 75 - 89)           |
| Authorized broadcasters (BBC, ESPN, Sky Sports, NBC), major publications       |
| (The Guardian, FT, Bloomberg, Nature, Science, Ars Technica, IEEE)             |
+--------------------------------------------------------------------------------+
                                       |
+--------------------------------------------------------------------------------+
| TIER 3: VERIFIED COMMUNITY & OPEN WEB PUBLISHERS (Score: 60 - 74)              |
| Verified technical blogs (Dev.to), official open-source releases (GitHub API),  |
| authorized independent culinary, cultural, and travel publications             |
+--------------------------------------------------------------------------------+
```

### Trust Tier Definitions & Max Content Ages

| Tier | Source Types | Description | Default Max Age | Freshness Window |
|---|---|---|---|---|
| **Tier 1** | `governing_body`, `official`, `primary`, `research_organization` | Official rules, primary wire bulletins, government datasets, academic preprints, space agency telemetry. | 90 days | 6 hours (breaking) |
| **Tier 2** | `broadcaster`, `news_publisher`, `technical_documentation` | Established newsrooms, editorial photography desks, accredited sports broadcasters, peer-reviewed journals. | 60 days | 12 hours (news) |
| **Tier 3** | `news_publisher`, `technical_documentation` | Independent blogs, developer tutorials, open-source repositories, specialist cultural guides. | 30 days | 24 hours |

---

## 3. Mandatory Denylist Policies

AiRA strictly enforces three categories of mandatory domain exclusions:

### 3.1 Prohibited Social Media Denylist (`PROHIBITED_SOCIAL_DOMAINS`)
The following platforms are blocked from the factual discovery pipeline:
* `facebook.com`, `fb.com`, `fb.watch`
* `instagram.com`, `instagr.am`
* `x.com`, `twitter.com`, `t.co`
* `threads.net`, `threads.com`
* `reddit.com`, `redd.it`
* `tiktok.com`
* `linkedin.com`
* `pinterest.com`
* `quora.com`, `tumblr.com`
* `mastodon.social`, `bsky.app`

> **Rule:** Any candidate URL or redirect destination resolving to these hostnames is rejected with reason code `PROHIBITED_SOCIAL_MEDIA`.

### 3.2 Disabled Unverified Encyclopedia Denylist (`DISABLED_ENCYCLOPEDIA_DOMAINS`)
* `wikipedia.org`, `wikimedia.org`, `wikidata.org`, `wiktionary.org`, `wikinews.org`
* `fandom.com`

> **Rule:** Open-edit wikis and user-edited encyclopedias are excluded from the factual search pipeline (`WIKIPEDIA_DISABLED`) in favor of direct primary reporting.

### 3.3 Unapproved URL Shorteners (`UNAPPROVED_URL_SHORTENERS`)
* `bit.ly`, `tinyurl.com`, `goo.gl`, `ow.ly`, `is.gd`, `buff.ly`, `rebrand.ly`, `shorturl.at`

> **Rule:** Shortened links are rejected (`UNAPPROVED_SHORTENER`) unless the final destination in the redirect chain is fully resolved and validated.

---

## 4. Security Boundaries & SSRF Defense

All external URLs pass through [`normalizeAndInspectUrl`](file:///data/data/com.termux/files/home/AiRA/src/engine/urlSecurity.ts#L220-L310):

1. **Protocol Restriction:** Only `https://` and approved `http://` schemes are admitted. `javascript:`, `file:`, `data:`, `ftp:` are rejected.
2. **SSRF & Private Host Defense (`isPrivateOrProhibitedHost`):**
   * Loopback: `127.0.0.1`, `localhost`, `::1`
   * Private IPv4: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`
   * Cloud Metadata IP: `169.254.169.254` (AWS, GCP, Azure instance metadata)
   * Link-local IPv6: `fe80::/10`
   * Invalid syntax, missing TLD, or internal hostnames.
3. **Brand-Spoofing Lookalike Defense (`LOOKALIKE_SPOOF_DOMAIN`):**
   * Hostnames containing protected brand strings (e.g. `reuters-breaking-news.com`, `bbc.co.uk.attacker-domain.org`, `openai-official-docs.io`) that do not match the authentic canonical domain are rejected.

---

## 5. Dynamic Open-World Source Admission

To support universal discovery across any subject, [`SourceRegistryService.resolveOrRegisterDomain`](file:///data/data/com.termux/files/home/AiRA/src/engine/sourceRegistry.ts#L1760-L1840) dynamically evaluates and registers new domains:

1. **Denylist Check:** Verifies hostname is not on the social media, encyclopedia, or SSRF denylists.
2. **Lookalike Check:** Verifies domain is not a typosquat of an existing protected brand.
3. **Heuristic Tier Assignment:**
   * `.gov`, `.mil` $\rightarrow$ Tier 1 (`official`)
   * `.edu`, `.ac.uk` $\rightarrow$ Tier 1 (`research_organization`)
   * Recognized media/journal $\rightarrow$ Tier 1 or Tier 2
   * Standard HTTPS public web domain $\rightarrow$ Tier 2 or Tier 3
4. **Registration:** Generates a structured `SourceRegistryRecord` with approved subdomains (`www`, `news`, `blog`, `articles`, `docs`) and caches it in memory.

---

## 6. URL Sanitization & Canonical Provenance

* **Tracking Query Parameter Stripping:**
  Every admitted URL is stripped of advertising and analytics trackers:
  `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `fbclid`, `gclid`, `msclkid`, `twclid`, `mc_eid`, `_hsenc`.
* **Citation Reference Construction (`CitationReference`):**
  Each verified result carries a structured citation reference containing:
  * `citationId`: Unique citation identifier.
  * `sourceName`: Verified publisher name.
  * `sourceDomain`: Canonical domain.
  * `sourceTier`: Trust tier (1, 2, or 3).
  * `canonicalUrl`: Tracker-free URL.
  * `retrievedAt` & `verifiedAt`: ISO 8601 UTC timestamps.
  * `excerpt`: Direct substantive text excerpt.

---

## 7. Administrative API & Telemetry

* **GET `/api/source-registry`:** Returns all registered sources, recent rejection logs (up to 50), and the administrative audit trail.
* **POST `/api/source-registry`:** Allows administrative operators to:
  * Update source approval status (`approved`, `suspended`, `rejected`, `deprecated`).
  * Adjust max content age and cache duration.
  * Toggle integration health (`healthy`, `degraded`, `unhealthy`, `disabled`).
  * Register new curated publisher endpoints.
* **Rejection Telemetry:** All dropped candidates record structured rejection telemetry (`reasonCode`, `normalizedDomain`, `url`, `query`, `timestamp`) into [`SourceRegistryService.getRejectedLogs`](file:///data/data/com.termux/files/home/AiRA/src/engine/sourceRegistry.ts#L1605-L1615).
