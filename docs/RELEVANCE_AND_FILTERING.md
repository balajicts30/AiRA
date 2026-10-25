# AiRA Feedly-Style Relevance & Filtering Specification
**Document:** `docs/RELEVANCE_AND_FILTERING.md`  
**Status:** Approved Specification & Implementation Reference  
**Date:** 2026-10-25  
**Version:** 1.0.0  

---

## 1. Core Principles

The AiRA content curation pipeline prioritizes **meaningful discovery over result volume**. It enforces two foundational rules:

1. **Source Credibility Cannot Compensate for Topical Irrelevance:** An approved publisher (even a Tier-1 governing body or wire agency like Reuters or the ICC) can still produce an article that is irrelevant to the user's search. Such candidates must be hard-rejected.
2. **Independent Validation Stages:** Source governance and topic relevance are strictly decoupled. A candidate must first pass security and domain eligibility, and then independently prove topic and entity alignment.

---

## 2. The 8-Factor Feedly Scoring Model

Every candidate item is evaluated across 8 normalized factors:

$$\text{Final Score} = \sum_{i=1}^{8} \left( \text{Factor}_i \times \text{Weight}_i \right)$$

### Default Factor Weights

| Factor | Weight | Evaluation Criteria |
|---|---|---|
| **1. Topic Relevance** | **35%** | Semantic alignment with the query's primary subject, token overlap in headline vs. body, and absence of off-topic keyword drift. |
| **2. Entity & Subject Matching** | **20%** | Accurate matching of resolved entities, teams, people, organizations, or comparison subjects. Strict failure on rival matchups or wrong entities. |
| **3. Source Credibility** | **15%** | Tier 1 (Governing body / Primary wire / `.edu` / `.gov`) = 1.0; Tier 2 (Established publisher) = 0.85; Tier 3 (Verified web publisher) = 0.70. |
| **4. Freshness** | **10%** | Publication age evaluated against query time-sensitivity policy (e.g. $< 2$ hours for breaking news; no penalty for historical queries). |
| **5. Content Quality** | **10%** | Headline clarity, substantive summary length ($\ge 80$ characters), author attribution, and absence of clickbait or spam tokens. |
| **6. Originality** | **5%** | Original reporting vs. syndicated wire copy. Primary official announcements receive 1.0; syndicated reprints are penalized ($0.4$). |
| **7. Media Relevance** | **5%** | Quality of verified publisher thumbnails, photo report camera specs, or video preview durations. |

---

## 3. Normalized 0–100 Ranking Tiers

Scores are normalized to a **0–100 scale** and mapped to four operational tiers:

```
[0 ---------------- 54] [55 ---------------- 69] [70 ---------------- 84] [85 ---------------- 100]
       REJECTED             SECONDARY DISCOVERY                RELEVANT               HIGHLY RELEVANT
   (Excluded from feed)     (Contextual stories)         (Strongly related)           (Direct matches)
```

* **85–100: Highly Relevant (`highly_relevant`)**  
  Direct headline and entity match from an authoritative source. Eligible for top feed positions and headline cards.
* **70–84: Relevant (`relevant`)**  
  Strong topical connection with substantive summary coverage and confirmed entity alignment.
* **55–69: Secondary Discovery (`secondary_discovery`)**  
  Contextual related stories, adjacent developments, or background analysis that enrich the primary topic.
* **Below 55: Rejected (`rejected`)**  
  Excluded from entering the main feed entirely.

---

## 4. Intent-Adaptive Weight Adaptation

Ranking weights dynamically adjust based on detected user intent:

| Intent Category | Topic | Entity | Source | Freshness | Quality | Originality | Media |
|---|---|---|---|---|---|---|---|
| **General Discovery** *(Default)* | 35% | 20% | 15% | 10% | 10% | 5% | 5% |
| **Breaking News & Live Scores** | 30% | 20% | 20% | **20%** | 5% | 3% | 2% |
| **Historical & Background Research** | 30% | 20% | 20% | **0%** | **20%** | 5% | 5% |
| **Academic & Technical Docs** | 35% | 20% | 20% | 5% | **15%** | 5% | 0% |
| **Product Discovery & Comparisons** | 30% | **30%** | 15% | 5% | 10% | 5% | 5% |
| **Photologs, Vlogs & Visual Media** | 30% | 15% | 10% | 10% | 5% | 5% | **25%** |

---

## 5. Fail-Closed Hard Rejection Rules

A candidate is **immediately rejected** regardless of overall score or source credibility if any of the following conditions trigger:

1. **Topical Irrelevance Gate:** If normalized topic relevance is $< 25\%$, the item is rejected with reason `IRRELEVANT_ENTITY_OR_TOPIC`.
2. **Cross-Domain Contamination:** Sports items from the wrong discipline (e.g. soccer scorecards during an F1 or cricket query) trigger a hard $-55$ penalty and immediate rejection.
3. **Head-to-Head Entity Mismatch:** If a query requests a specific matchup (e.g. South Africa vs. Australia), coverage of an unrelated matchup (e.g. India vs. England) triggers immediate rejection.
4. **Insufficient Content Metadata:** Titles $< 5$ characters or summaries $< 15$ characters are rejected as `INSUFFICIENT_OR_EMPTY_CONTENT`.
5. **Prompt Injection / Adversarial Scripts:** Any candidate containing script payloads or prompt injection phrases (`<script>`, `ignore previous instructions`) is rejected with `PROMPT_INJECTION_DETECTED`.

---

## 6. Implementation Reference

* Core Scorer: [`scoreItemAgainstInterpretation`](file:///data/data/com.termux/files/home/AiRA/src/engine/relevanceScorer.ts#L95-L790) in [`src/engine/relevanceScorer.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/relevanceScorer.ts).
* Pipeline Gate: [`runVerificationPipeline`](file:///data/data/com.termux/files/home/AiRA/src/engine/verificationPipeline.ts#L123-L280) in [`src/engine/verificationPipeline.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/verificationPipeline.ts).
