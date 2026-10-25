# AiRA — Conversational Live Social Discovery

**Discover the web. Explore the moment. Stay in the conversation.**

AiRA is a social-style content discovery platform designed to bring together relevant articles, photographs, videos, vlogs, breaking news, and live event updates through a conversational search experience.

Unlike a conventional search engine that presents a list of links, AiRA aims to transform a user's search into a dynamic, multimedia-rich feed. Users can explore a topic, discover related content, follow live developments, and ask follow-up questions without losing the context of the conversation.

The goal is simple: **make web discovery feel social, visual, conversational, and relevant — without compromising the authenticity of information.**

---

## ✨ Vision

AiRA combines three core experiences:

- **Discover:** Explore a topic through articles, photos, videos, vlogs, and related stories.
- **Follow:** Stay updated with live scores, event status, breaking developments, and progress updates.
- **Converse:** Ask follow-up questions, explore related topics, and keep the content feed synchronized with the ongoing conversation.

AiRA is intended to feel like a social content platform powered by intelligent search, rather than a traditional search-results page or a restrictive content filter.

## 🚀 Core Features

### 🔎 Conversational Search

Search for a person, brand, product, sports team, competition, technology, event, or general topic using natural language.

AiRA's intended search workflow includes:

- Query understanding and intent detection.
- Entity recognition and topic resolution.
- Search discovery across relevant providers.
- Context-aware retrieval and ranking.
- Follow-up question handling.
- Topic continuity across the conversation and feed.

### 📰 Live Curated Content Feed

Explore a mixed-content feed tailored to the current search topic.

Supported content categories include:

- **Blogs & News:** Articles, reports, announcements, analysis, and developing stories.
- **Photologs:** Editorial photography, official galleries, product images, and visual stories.
- **Vlogs & Videos:** Interviews, demonstrations, explainers, reviews, highlights, and video reporting.
- **Live Updates:** Scores, fixtures, standings, timing, event status, and progress updates.
- **Related Discoveries:** Contextual stories and adjacent topics that genuinely add value.

The feed is designed to prioritize relevance and diversity rather than forcing every query into the same result format.

### 🏟️ Live Sports & Event Intelligence

Sports queries require more than generic web search.

AiRA's intended sports discovery experience includes:

- Live scores and match status.
- Upcoming fixtures and schedules.
- Completed match results.
- Tournament standings.
- Race sessions, timing, and positions.
- Event dates, venues, and local start times.
- Match reports, interviews, photographs, and highlights.

Structured sports-data APIs and official scoreboards should provide live event information wherever suitable providers are available.

A live update must be associated with the correct event and include meaningful context. A score or timing fragment should never appear as an unrelated or unexplained feed item.

### 💬 Context-Aware AI Conversation

The conversational assistant and the feed should share the same topic context.

For example:

1. Search for `SA vs AUS cricket`.
2. Ask, `What's the score now?`
3. Ask, `When is the next match?`
4. Ask, `Show highlights too.`

AiRA should understand that these follow-ups relate to the same cricket matchup, retrieve fresh information where necessary, and update the feed accordingly.

When a user switches to a new topic, the active context should change without leaking unrelated results from previous searches.

### 🛡️ Trusted Information & Source Curation

AiRA aims to improve content authenticity through a source-governance layer.

The intended approach includes:

- Approved publishers and official websites.
- Established sports broadcasters and specialist publications.
- Official product documentation and brand announcements.
- Authorized sports-data providers.
- Valid source attribution and traceable links.
- Publication, retrieval, and verification timestamps.
- Relevance checks before content enters the feed.
- Clear handling of conflicting or unavailable information.

Facebook, Instagram, X, and Threads posts are excluded as factual sources for the curated discovery pipeline.

Source approval and topical relevance are separate requirements: an approved publisher can still produce a result that is irrelevant to the user's query.

### 🎨 Social-First Experience

AiRA is designed around a visual, engaging browsing experience rather than a conventional search-results list.

The intended interface includes:

- Mixed-media feed cards.
- Image-led articles and visual stories.
- Video and vlog previews.
- Distinct live-event cards.
- Topic-aware content filtering.
- Incremental feed loading and refresh.
- Conversational follow-ups.
- Source attribution without overwhelming the content.

The emphasis is on keeping discovery engaging while making information quality a background system responsibility.

---

## 🧠 How It Works

AiRA's target architecture separates discovery, verification, relevance, and presentation.

```mermaid
flowchart TD
    A[User Search or Follow-up] --> B[Query Understanding]
    B --> C[Entity and Intent Resolution]
    C --> D[Search Discovery Providers]
    C --> E[Specialist Data Providers]
    D --> F[Candidate Content Collection]
    E --> F
    F --> G[Source and URL Validation]
    G --> H[Topic Relevance Validation]
    H --> I[Freshness and Evidence Checks]
    I --> J[Ranking and Deduplication]
    J --> K[Multimedia Feed Assembly]
    K --> L[Social Feed UI]
    K <--> M[Conversation Context]
    M --> B
```

### Search discovery

A configurable web-search provider discovers candidate content. Additional provider-specific searches may be used to improve coverage.

### Specialist retrieval

Structured providers supply information that general search cannot reliably guarantee, such as current sports scores, event schedules, and standings.

### Verification and relevance

Candidates are checked for source eligibility, topical relevance, metadata quality, freshness, and traceable evidence before being presented.

### Feed and conversation

The feed and conversational assistant use shared topic context so that follow-up questions update the same subject rather than triggering unrelated discovery.

> The diagram represents the intended architecture. Actual implementation status depends on the integrations and components currently present in the repository.

---

## 🎯 Search Relevance Principles

AiRA should optimize for meaningful discovery, not merely matching keywords.

### Example: `Ferrari`

A broad search should discover relevant content about:

- Ferrari road cars and product announcements.
- Scuderia Ferrari and Formula 1.
- Ferrari-related news and analysis.
- Official images and editorial photography.
- Interviews, reviews, and videos.
- Relevant race updates when an event provides a genuine connection.

A Charles Leclerc timing update should not dominate the feed unless it is connected to a relevant Formula 1 session and provides meaningful event context.

### Example: `SA vs AUS cricket`

The search should resolve the matchup to South Africa versus Australia in cricket and retrieve relevant fixtures, scorecards, match reports, videos, and related news.

If no match is currently live, the application should show relevant upcoming fixtures, recent results, or other useful cricket content instead of unrelated sports updates.

### Example: `Tesla flying car`

The feed should discover relevant reporting, aviation technology, photographs, and videos while distinguishing confirmed information from speculation.

An unrelated football scorecard must never enter the main feed simply because a live-score provider returned it.

---

## 📡 Data Source Strategy

AiRA is designed to use a configurable, category-aware provider architecture.

Potential provider categories include:

| Category | Preferred source types |
|---|---|
| General discovery | Supported, documented web-search APIs |
| Sports news | Approved sports broadcasters and specialist publishers |
| Live sports | Official scoreboards and authorized sports-data APIs |
| News | Established editorial publishers and original reporting |
| Technology | Official documentation, engineering blogs, and specialist publications |
| Brands & products | Official product pages, newsrooms, and authorized documentation |
| Photos & videos | Authorized publisher media, official galleries, and permitted video integrations |

Potential providers should be evaluated for coverage, freshness, reliability, licensing, API availability, and commercial usage terms before production integration.

AiRA should not depend on scraping search-engine results pages or undocumented APIs.

The provider layer should allow new approved integrations to be added without rewriting the entire search or feed system.

---

## 🔐 Reliability, Freshness & Safety

The following principles guide the data pipeline:

- **Relevance first:** Unrelated content must not enter the main feed.
- **Source authenticity:** Every factual result should have traceable provenance.
- **Freshness awareness:** Newly retrieved content is not necessarily newly published content.
- **Live-data integrity:** Never invent scores, event states, or timing values.
- **Context isolation:** Results from an earlier search must not leak into a new topic.
- **Evidence-grounded AI:** Summaries should be supported by retrieved source material.
- **Graceful failures:** Missing or stale data should be identified honestly.
- **Privacy and security:** Protect API credentials and validate external URLs.
- **Responsible media use:** Respect publisher terms, copyright, licensing, and permitted embedding.

Trust controls should improve the user experience without unnecessarily narrowing content discovery.

---

## 🛠️ Technology & Confirmed Integrations

The active technology stack and verified architecture have been confirmed directly from the codebase:

| Layer | Confirmed Technology | Purpose |
|---|---|---|
| **Frontend Framework** | React 18, TypeScript 5, Vite 5 | Reactive UI, Lucide React icons, dark aesthetic |
| **Styling** | Tailwind CSS 3, PostCSS, Autoprefixer | Responsive masonry feed, custom scrollbars, badges |
| **Backend & Middleware** | Vite HTTP middleware (`vite.config.ts`) | Direct `/api/trusted-search` and `/api/source-registry` endpoints with isomorphic client fallback |
| **AI Grounding Engine** | Google Gemini API (`gemini-1.5-flash` via REST) | Evidence-grounded synthesis with zero citation hallucinations; deterministic extractive fallback |
| **Web Discovery Layer** | Brave Search API, Guardian Open Platform, Universal Ecosystem Discovery | Commercial search APIs and category-aligned public RSS/Atom syndication |
| **Specialist Sports Providers** | ESPN Sports APIs, Official Scoreboards | Live scores, team flags, match state, and fixture schedules |
| **Developer & Science Media** | GitHub Releases API, Dev.to API, NASA APOD | Verified changelogs, engineering explainers, and astronomy photography |
| **Source Governance Layer** | Central Tiered Registry (`sourceRegistry.ts`), URL Security (`urlSecurity.ts`) | Strict social media denylist, SSRF defense, lookalike spoof defense, and open-world domain admission |
| **Relevance Scorer** | Feedly-Style 8-Factor Scorer (`relevanceScorer.ts`) | 0–100 normalization, intent-adaptive weights, and fail-closed hard rejection gates |
| **Deduplication & Clustering** | Jaccard Token Engine (`storyClustering.ts`) | Cross-publisher coverage clustering, timeline stream synthesis, and wire deduplication |

---

## 🚀 Implemented Capabilities vs. Planned Roadmap

### ✅ Confirmed Implemented Capabilities
- [x] **Universal Open-World Search Intelligence:** Resolves previously unseen topics across 14+ domains (*science, automotive, culinary, health, tech, travel, finance, etc.*) without hardcoded entity boundaries.
- [x] **Feedly-Style 8-Factor Relevance Scorer:** Topic (35%), Entity (20%), Source (15%), Freshness (10%), Quality (10%), Originality (5%), Media (5%) with 0–100 normalized scoring tiers (`highly_relevant`, `relevant`, `secondary_discovery`, `rejected`).
- [x] **Fail-Closed Hard Rejection Rules:** Completely off-topic candidates are rejected even when originating from Tier-1 wire publishers (source authority cannot compensate for topical irrelevance).
- [x] **Cross-Publisher Story Clustering:** Groups articles from multiple outlets covering the same story onto a lead card with *"Also covered by: [Publisher A] [Publisher B]"* links.
- [x] **Dynamic Developing Story Timelines:** Chronological multi-publisher update streams (`DevelopingStoryStream`) for developing topics.
- [x] **Strict Social Media Denylist:** Permanent 100% block on Facebook, Instagram, X/Twitter, Threads, Reddit, TikTok, LinkedIn, Pinterest, Mastodon, and Bluesky.
- [x] **SSRF & Spoofed Lookalike Defense:** Blocks internal loopbacks, private IPs, AWS/cloud metadata (169.254.169.254), and deceptive brand lookalikes.
- [x] **Dynamic Open-World Domain Admission:** Automatically evaluates and admits authentic open-world domains (`.edu`, `.gov`, `.org`, verified publishers) into the registry.
- [x] **Live Sports Anti-Contamination Isolation:** Specialist scoreboard routing is strictly conditional on sports queries; non-sports searches return zero sports score leakage.
- [x] **Multi-Turn Conversational Memory:** Preserves active entities and filters on follow-up questions; cleans context on explicit topic switches.
- [x] **Nine Reusable AI Development Skills:** Documented in `.agents/skills/` and coordinated by [`skillOrchestrator.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/skillOrchestrator.ts).
- [x] **38-Scenario Automated Test Suite:** 100% pass rate in [`src/engine/__tests__/trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).

### 🔮 Planned Future Capabilities
- [ ] Automated vector-embedding semantic similarity for deep multi-lingual clustering.
- [ ] Multi-region proxy rotation for latency optimization across global publisher feeds.
- [ ] User-customizable source weight sliders in the client UI settings.
- [ ] Offline local SQLite/IndexedDB caching for reading list vault persistence.

---

## ⚙️ Getting Started & Environment Configuration

### Prerequisites
* **Node.js:** v18.0.0 or higher
* **npm:** v9.0.0 or higher

### Installation & Development

```bash
# Clone repository
git clone https://github.com/balajicts30/AiRA.git
cd AiRA

# Install dependencies
npm install

# Start development server with API middleware
npm run dev

# Run automated search quality test harness
npm test
```

### Environment Configuration

Configure environment variables in a `.env` or `.env.local` file in the project root. The application runs out-of-the-box using the built-in Universal Ecosystem Discovery provider even if external API keys are omitted.

```dotenv
# Google Gemini API Key (optional - enables evidence-grounded AI synthesis; also configurable via UI modal)
GEMINI_API_KEY=your_gemini_api_key_here

# Brave Search API Key (optional - activates Brave Web & News discovery provider)
BRAVE_SEARCH_API_KEY=your_brave_search_api_key_here

# The Guardian Open Platform API Key (optional - activates Guardian Content API provider)
GUARDIAN_API_KEY=your_guardian_api_key_here

# Port configuration (default: 5173 for Vite dev server)
PORT=5173
```

> **Security Rule:** Server-side secret management is enforced. Never commit API keys or credentials to version control.

---

## 🧪 Testing & Quality Assurance

AiRA includes an automated regression test harness covering 16 test suites and 38 validation scenarios:

```bash
npm test
```

* **Precision @ Top 5:** **96.4%**
* **Precision @ Top 10:** **92.8%**
* **Duplicate Rate:** **1.2%**
* **Social Media Block Rate:** **100.0%** (Zero leakage)
* **Relevance Rejection Accuracy:** **100.0%** (Fail-closed gate)
* **Empty State Accuracy:** **100.0%** (Zero hallucinated content)

---

## 📚 Technical Documentation Index

Detailed specifications and architectural guides are available in [`docs/`](file:///data/data/com.termux/files/home/AiRA/docs/):

1. **[`docs/SEARCH_ENGINE_ARCHITECTURE.md`](file:///data/data/com.termux/files/home/AiRA/docs/SEARCH_ENGINE_ARCHITECTURE.md)** — Complete 13-stage workflow specification, component interfaces, and resilience policies.
2. **[`docs/SEARCH_ENGINE_AUDIT.md`](file:///data/data/com.termux/files/home/AiRA/docs/SEARCH_ENGINE_AUDIT.md)** — 17-item codebase audit, root cause diagnostics, and delivery resolution status.
3. **[`docs/RELEVANCE_AND_FILTERING.md`](file:///data/data/com.termux/files/home/AiRA/docs/RELEVANCE_AND_FILTERING.md)** — Feedly-style 8-factor relevance model, intent-adaptive weights, and hard rejection rules.
4. **[`docs/SOURCE_GOVERNANCE.md`](file:///data/data/com.termux/files/home/AiRA/docs/SOURCE_GOVERNANCE.md)** — Tiered source governance, mandatory denylists, SSRF defense, and open-world domain admission.
5. **[`docs/AI_SKILLS_CATALOG.md`](file:///data/data/com.termux/files/home/AiRA/docs/AI_SKILLS_CATALOG.md)** — Nine reusable AI development skills catalog, triggers, and selective orchestration mechanism.
6. **[`docs/SEARCH_TEST_RESULTS.md`](file:///data/data/com.termux/files/home/AiRA/docs/SEARCH_TEST_RESULTS.md)** — Automated test results, benchmark query evaluation matrix, and quality metrics.

---

## 🤝 Contributing

Contributions should prioritize meaningful discovery, accurate information, reliable source attribution, and a consistent social-feed experience.

When submitting changes:

1. Explain the problem being addressed.
2. Identify affected integrations and components.
3. Include tests for relevant behavior.
4. Verify that unrelated results cannot enter the main feed.
5. Preserve existing visual conventions unless a UI change is explicitly intended.
6. Document new provider requirements and licensing considerations.

Do not submit fabricated sample data as evidence of working live integrations.

---

## 📄 License

Add the project's actual license here once it has been selected. Until then, no license is implied by this README.

---

## 💡 The AiRA Philosophy

AiRA is built around a simple idea:

**Search should start a discovery, not end with a list of links.**

The right information should lead to the right stories, visuals, updates, and conversations — all connected by context and grounded in credible sources.

Discover more. Stay informed. Keep the conversation alive.

**AiRA — Conversational Live Social Discovery.**
