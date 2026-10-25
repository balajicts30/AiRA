---
name: aira-feed-ranking
description: >-
  Adaptive Feed Ranking, Cross-Publisher Story Clustering, Intelligent Deduplication,
  and Content Diversity Balancing for AiRA.
---

# AiRA Feed Ranking Skill

## 1. Purpose & Activation Conditions
Activates during the assembly and ranking of the multimodal social discovery feed. It prevents repetitive stories, groups cross-publisher coverage into coherent clusters, and balances breaking news, original reporting, and visual media.

## 2. Inputs & Outputs
* **Inputs:**
  * Verified candidates from the verification pipeline.
  * `intent`: `SearchIntentProfile`.
* **Outputs:**
  * `SocialDiscoveryFeed`: Clustered articles, related coverage links, developing story timelines, and diversity metrics.

## 3. Core Responsibilities
1. **Intelligent Deduplication:** Eliminate exact URL duplicates and near-duplicate headlines using Jaccard token similarity.
2. **Cross-Publisher Story Clustering:** Group articles from different outlets covering the same breaking development into a single primary card with related coverage links.
3. **Developing Story Timelines:** Assemble chronological multi-publisher update streams (`DevelopingStoryStream`) when multiple outlets report on an evolving story.
4. **Publisher Diversity Enforcement:** Prevent a single publisher or domain from dominating the top feed positions.

## 4. Operational Instructions
* Preserve individual publisher attribution, canonical links, and publication timestamps on clustered cards.
* Prioritize smaller numbers of highly relevant results over high volumes of loosely related items.
* Never introduce unrelated content merely to pad feed size.

## 5. Constraints & Rejection Rules
* Rejects duplicate wire copies (e.g. syndicated Reuters reprints) in favor of the primary wire release.

## 6. Implementation Guidance
* Implemented in [`src/engine/storyClustering.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/storyClustering.ts) and [`src/engine/searchOrchestrator.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/searchOrchestrator.ts#L880-L950).
* Functions: [`clusterCrossPublisherArticles`](file:///data/data/com.termux/files/home/AiRA/src/engine/storyClustering.ts#L60-L150), `buildSocialDiscoveryFeed`.

## 7. Example Scenarios
* **Scenario A:** BBC, Reuters, and The Guardian all publish reports on a major scientific announcement -> BBC article selected as lead card; Reuters and Guardian linked under "Also covered by:".
* **Scenario B:** High-volume repetitive blog summaries -> Filtered out via deduplication key.

## 8. Validation Criteria
* Duplicate rate $< 3\%$ across top 20 feed items.
* Diversity score $\ge 0.75$ across distinct publishers.
