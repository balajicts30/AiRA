---
name: aira-relevance-filtering
description: >-
  Feedly-Style Multi-Factor Relevance Evaluation, Intent-Adaptive Weighting,
  Hard Rejection Gates, and Explainable Scoring for AiRA.
---

# AiRA Relevance Filtering Skill

## 1. Purpose & Activation Conditions
Activates whenever candidates are evaluated for entry into the social discovery feed. It enforces strict separation of source credibility and topical relevance: **a credible source cannot compensate for an irrelevant article**.

## 2. Inputs & Outputs
* **Inputs:**
  * Candidate metadata (`title`, `summary`, `tags`, `dataType`, `sourceTier`, `publishedAt`).
  * `interp`: Active `QueryInterpretation`.
* **Outputs:**
  * `RelevanceScoreBreakdown`: 0–100 Feedly score, 7-factor breakdown, ranking tier (`highly_relevant`, `relevant`, `secondary_discovery`, `rejected`), hard rejection flags, and human-readable explanation.

## 3. Core Responsibilities
1. **Feedly 8-Factor Model:** Calculate Topic Relevance (35%), Entity Matching (20%), Source Credibility (15%), Freshness (10%), Content Quality (10%), Originality (5%), Media Relevance (5%).
2. **Hard Rejection Gate:** Fail-closed reject when topic relevance is $< 25\%$, when wrong sports teams/competitors match, or when cross-domain contamination is detected.
3. **Intent-Adaptive Weighting:** Shift scoring emphasis dynamically for breaking news (boost freshness), research (boost depth), products (boost specs), or media queries.
4. **Transparent Explanations:** Produce structured diagnostic reasoning for every inclusion and exclusion.

## 4. Operational Instructions
* Score must be strictly normalized to 0–100.
* Candidates scoring $< 55$ are rejected from entering the main feed.
* Never allow high source tier (e.g. Reuters Tier 1) to pass an off-topic candidate.

## 5. Constraints & Rejection Rules
* Rejects generic keyword-only matches lacking topical cohesion.
* Rejects content with title $< 5$ chars or summary $< 15$ chars as `unverifiable`.

## 6. Implementation Guidance
* Implemented in [`src/engine/relevanceScorer.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/relevanceScorer.ts) and [`src/engine/verificationPipeline.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/verificationPipeline.ts).
* Function: [`scoreItemAgainstInterpretation`](file:///data/data/com.termux/files/home/AiRA/src/engine/relevanceScorer.ts#L95-L790).

## 7. Example Scenarios
* **Scenario A:** Search for "Quantum computing" with a candidate about "Wheat commodity harvests" from Reuters -> Rejection (`feedlyTier = "rejected"`, `isRelevant = false`).
* **Scenario B:** Search for "James Webb Space Telescope" with a candidate about "JWST Methane exoplanet atmosphere detection" -> Direct match (`feedlyScore = 92`, `feedlyTier = "highly_relevant"`).

## 8. Validation Criteria
* Passes Feedly hard rejection regression tests in [`trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).
