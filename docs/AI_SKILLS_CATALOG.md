# AiRA Reusable AI Skills Catalog & Orchestration Guide
**Document:** `docs/AI_SKILLS_CATALOG.md`  
**Status:** Approved Reference Catalog & Developer Guide  
**Date:** 2026-10-25  
**Version:** 1.0.0  

---

## 1. Overview & Architecture

AiRA provides **nine reusable AI development skills** designed to extend developer pair-programming capabilities, guide automated agent workflows, and enforce domain-specific discovery standards.

* **Location:** [`.agents/skills/`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/)
* **Format:** Standardized Antigravity/Agentic skill convention (`SKILL.md` with YAML frontmatter, operational instructions, constraints, and validation criteria).
* **Execution Rule:** Production search execution does **not** invoke subagents for basic operations. Production functionality is embedded directly in compiled engine services; skills define development, pair-programming, and quality assurance procedures.
* **Central Orchestrator:** Dynamic skill planning is coordinated by [`src/engine/skillOrchestrator.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/skillOrchestrator.ts#L70-L125).

---

## 2. Nine Reusable Skills Inventory

```
.agents/skills/
├── aira-search-intelligence/SKILL.md        (Query understanding & open-world entities)
├── aira-content-discovery/SKILL.md          (Multi-provider retrieval & resilience)
├── aira-relevance-filtering/SKILL.md        (Feedly-style 8-factor scoring & hard rejection)
├── aira-source-intelligence/SKILL.md        (Domain governance & social media denylist)
├── aira-feed-ranking/SKILL.md               (Cross-publisher clustering & deduplication)
├── aira-media-discovery/SKILL.md            (Verified image & video card discovery)
├── aira-live-event-intelligence/SKILL.md    (Specialist sports routing & scorecards)
├── aira-conversation-context/SKILL.md       (Multi-turn conversational continuity)
└── aira-search-quality-assurance/SKILL.md   (Precision benchmarking & regression testing)
```

---

## 3. Detailed Skill Specifications

### 1. `aira-search-intelligence`
* **File:** [`.agents/skills/aira-search-intelligence/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-search-intelligence/SKILL.md)
* **Category:** Core Search Intelligence
* **Activation:** Triggered when analyzing, tokenizing, or expanding user queries.
* **Responsibilities:**
  * Extracts open-world entities (quotes, comparisons `"X vs Y"`, proper nouns, acronyms).
  * Classifies queries across 14+ domains (*science, tech, sports, culinary, finance, travel, politics, culture*).
  * Expands 2–4 targeted provider search variations without semantic drift.
* **Key Implementation:** [`src/engine/queryUnderstanding.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/queryUnderstanding.ts).

### 2. `aira-content-discovery`
* **File:** [`.agents/skills/aira-content-discovery/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-content-discovery/SKILL.md)
* **Category:** Core Search Intelligence
* **Activation:** Triggered when executing candidate collection across search providers.
* **Responsibilities:**
  * Coordinates Brave Search API, Guardian Open Platform, and the Universal Open Discovery Provider.
  * Normalizes heterogeneous responses into uniform `CandidateItem[]`.
  * Manages timeouts, circuit breakers, and keyless fallback.
* **Key Implementation:** [`src/engine/discoveryLayer.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/discoveryLayer.ts).

### 3. `aira-relevance-filtering`
* **File:** [`.agents/skills/aira-relevance-filtering/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-relevance-filtering/SKILL.md)
* **Category:** Content Curation
* **Activation:** Triggered during candidate evaluation and filtering before feed presentation.
* **Responsibilities:**
  * Implements Feedly 8-factor scoring (35% Topic, 20% Entity, 15% Source, 10% Freshness, 10% Quality, 5% Originality, 5% Media).
  * Applies fail-closed hard rejection: drops off-topic candidates regardless of source authority.
  * Classifies candidates into 4 normalized tiers (`highly_relevant`, `relevant`, `secondary_discovery`, `rejected`).
* **Key Implementation:** [`src/engine/relevanceScorer.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/relevanceScorer.ts).

### 4. `aira-source-intelligence`
* **File:** [`.agents/skills/aira-source-intelligence/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-source-intelligence/SKILL.md)
* **Category:** Content Curation
* **Activation:** Triggered during URL validation, domain governance, and provenance verification.
* **Responsibilities:**
  * Enforces 100% block rate on prohibited social media (Facebook, Instagram, X, Threads, Reddit, TikTok).
  * Blocks SSRF, private IPs, loopback, and cloud metadata endpoints.
  * Rejects typosquatted / lookalike brand domains.
  * Dynamically evaluates and admits legitimate open-world publisher domains (`.edu`, `.gov`, verified news).
* **Key Implementation:** [`src/engine/urlSecurity.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/urlSecurity.ts), [`src/engine/sourceRegistry.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/sourceRegistry.ts).

### 5. `aira-feed-ranking`
* **File:** [`.agents/skills/aira-feed-ranking/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-feed-ranking/SKILL.md)
* **Category:** Content Curation
* **Activation:** Triggered during feed ranking, deduplication, and story clustering.
* **Responsibilities:**
  * Jaccard token similarity headline deduplication.
  * Groups cross-publisher coverage into primary cards with related coverage attribution.
  * Assembles `DevelopingStoryStream` chronological update streams.
  * Enforces publisher diversity to prevent single-source domination.
* **Key Implementation:** [`src/engine/storyClustering.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/storyClustering.ts).

### 6. `aira-media-discovery`
* **File:** [`.agents/skills/aira-media-discovery/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-media-discovery/SKILL.md)
* **Category:** Content Curation
* **Activation:** Triggered when discovering and presenting visual photography and video vlogs.
* **Responsibilities:**
  * Validates subject relevance of media items.
  * Enforces zero fabrication: extracts genuine photographer specs, durations, and view counts.
  * Formats responsive aspect ratios (`wide`, `square`, `tall`) for photolog cards.
* **Key Implementation:** [`src/engine/mediaResolver.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/mediaResolver.ts).

### 7. `aira-live-event-intelligence`
* **File:** [`.agents/skills/aira-live-event-intelligence/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-live-event-intelligence/SKILL.md)
* **Category:** Specialist Data
* **Activation:** Triggered when the search involves live sports, match scorecards, or fixtures.
* **Responsibilities:**
  * Routes queries to specialist scoreboard APIs (e.g. ESPN).
  * Validates participants, event timing, and venue context.
  * Enforces strict anti-contamination isolation (zero sports leakage into non-sports queries).
* **Key Implementation:** [`src/engine/sportsEventResolver.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/sportsEventResolver.ts).

### 8. `aira-conversation-context`
* **File:** [`.agents/skills/aira-conversation-context/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-conversation-context/SKILL.md)
* **Category:** Conversation & State
* **Activation:** Triggered on multi-turn conversational searches and follow-ups.
* **Responsibilities:**
  * Resolves follow-up intents (*"What's the score?"*, *"Show photos"*, *"Compare these options"*).
  * Inherits active topic, entities, and constraints across turns.
  * Flushes context cleanly on explicit topic switches to avoid state leakage.
* **Key Implementation:** [`src/engine/conversationState.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/conversationState.ts).

### 9. `aira-search-quality-assurance`
* **File:** [`.agents/skills/aira-search-quality-assurance/SKILL.md`](file:///data/data/com.termux/files/home/AiRA/.agents/skills/aira-search-quality-assurance/SKILL.md)
* **Category:** Quality Assurance
* **Activation:** Triggered during regression testing, quality auditing, and CI validation.
* **Responsibilities:**
  * Benchmarks precision@5, precision@10, and duplicate rates across diverse subjects.
  * Validates empty-state behavior for nonexistent topics.
  * Generates structured quality test reports.
* **Key Implementation:** [`scripts/run-tests.mjs`](file:///data/data/com.termux/files/home/AiRA/scripts/run-tests.mjs), [`src/engine/__tests__/trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).

---

## 4. Central Orchestration & Selective Activation

The central skill orchestrator ([`src/engine/skillOrchestrator.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/skillOrchestrator.ts)) dynamically plans which capabilities to activate:

```typescript
import { planActiveSkills } from "./engine/skillOrchestrator";

// Example: Standard culinary search
const planA = planActiveSkills({
  query: "Sourdough starter fermentation techniques",
  isSportsDomain: false,
  isFollowUp: false
});
// planA.activeSkillIds: [
//   "aira-search-intelligence",
//   "aira-content-discovery",
//   "aira-source-intelligence",
//   "aira-relevance-filtering",
//   "aira-feed-ranking"
// ] (aira-live-event-intelligence is bypassed)

// Example: Sports follow-up query with video request
const planB = planActiveSkills({
  query: "Show video highlights",
  isSportsDomain: true,
  isFollowUp: true,
  isMediaRequested: true
});
// planB.activeSkillIds includes aira-conversation-context, aira-live-event-intelligence, and aira-media-discovery
```

This guarantees optimal performance and clean separation of concerns without overhead.
