---
name: aira-content-discovery
description: >-
  Multi-Provider Web Discovery, Vendor Abstraction, Candidate Normalization,
  Resilient Fallback, and Caching Orchestration for AiRA.
---

# AiRA Content Discovery Skill

## 1. Purpose & Activation Conditions
Activates during the candidate collection phase of search execution. It manages the discovery lifecycle across multiple web-search providers, publisher APIs, and RSS/Atom syndication feeds with strict vendor-terms compliance and automated resilience.

## 2. Inputs & Outputs
* **Inputs:**
  * `interp`: `QueryInterpretation` from the search intelligence stage.
  * `category`: Target `ContentCategory`.
  * `registry`: `SourceRegistryService` instance.
* **Outputs:**
  * `DiscoveryProviderOutput`: Discovered candidates normalized into `CandidateItem[]`, status code, latency metrics, and execution diagnostics.

## 3. Core Responsibilities
1. **Multi-Provider Search:** Query Brave Search API, Guardian Open Platform, and the Universal Open Discovery Provider.
2. **Normalized Content Model:** Map disparate provider responses into standard `CandidateItem` schema (`title`, `summary`, `url`, `publishedAt`, `dataType`, `providerName`).
3. **Resilience & Fallbacks:** Handle timeouts, rate limits, circuit breakers, and keyless fallback seamlessly without crashing search execution.
4. **Terms-of-Use Governance:** Comply with downstream curation, caching, and AI summarization terms documented in `SEARCH_PROVIDER_EVALUATION_MATRIX`.

## 4. Operational Instructions
* Never scrape search-engine HTML result pages (SERPs) or invoke undocumented APIs.
* Always preserve canonical publisher URLs, publication timestamps, and author provenance.
* Execute discovery providers concurrently using `Promise.allSettled`.

## 5. Constraints & Rejection Rules
* Rejects candidate items missing title or URL.
* Drops unverified URL shorteners at discovery time.

## 6. Implementation Guidance
* Implemented in [`src/engine/discoveryLayer.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/discoveryLayer.ts) and [`src/engine/adapters/index.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/adapters/index.ts).
* Classes: `BraveSearchDiscoveryProvider`, `GuardianOpenPlatformDiscoveryProvider`, `UniversalOpenDiscoveryProvider`.

## 7. Example Scenarios
* **Scenario A:** Discovery running with `BRAVE_SEARCH_API_KEY` present -> Executes Brave Web REST API, fetches 15 fresh items, records success telemetry.
* **Scenario B:** Discovery running without external API keys -> Triggers `UniversalOpenDiscoveryProvider` querying category-aligned public feeds and open web syndication.

## 8. Validation Criteria
* Discovery layer returns at least 8 verified candidates for valid search queries.
* Provider latencies and status are accurately logged into search diagnostics.
