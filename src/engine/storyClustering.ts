// ============================================================================
// STORY CLUSTERING & INTELLIGENT CONTENT DEDUPLICATION ENGINE (SECTION 7)
// Provides:
//   1. Canonical URL Normalization
//   2. Exact & Near-Duplicate Content Detection
//   3. Cross-Publisher Story Clustering
//   4. Developing Story Timeline Assembly
// ============================================================================

import {
  DevelopingStoryStream,
  DevelopingStoryUpdate,
  SocialArticleCard,
  StandardizedSearchResult
} from "./types";

const TITLE_STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "in", "on", "at", "to", "for", "of", "with",
  "by", "from", "up", "about", "into", "over", "after", "is", "are", "was",
  "were", "be", "been", "being", "have", "has", "had", "do", "does", "did",
  "reuters", "ap", "bbc", "guardian", "exclusive", "breaking", "update", "live"
]);

/**
 * Normalizes headline into a clean bag-of-words token set for similarity calculations.
 */
export function extractHeadlineTokens(headline: string): Set<string> {
  const words = (headline || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !TITLE_STOP_WORDS.has(w));
  return new Set(words);
}

/**
 * Computes Jaccard token similarity (0.0 to 1.0) between two headlines.
 */
export function computeHeadlineSimilarity(titleA: string, titleB: string): number {
  const tokensA = extractHeadlineTokens(titleA);
  const tokensB = extractHeadlineTokens(titleB);

  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of tokensA) {
    if (tokensB.has(token)) {
      intersectionCount += 1;
    }
  }

  const unionCount = tokensA.size + tokensB.size - intersectionCount;
  return unionCount === 0 ? 0 : Number((intersectionCount / unionCount).toFixed(3));
}

export interface StoryClusterGroup<T> {
  clusterId: string;
  leadItem: T;
  secondaryItems: T[];
  distinctPublishers: string[];
}

/**
 * Clusters a list of articles by detecting cross-publisher coverage of the same event.
 * Articles with high headline similarity (>= 0.50) published within a 48-hour window
 * are grouped together. The highest-tier article becomes the lead, and secondary articles
 * become related coverage.
 */
export function clusterCrossPublisherArticles(
  articles: SocialArticleCard[]
): {
  clusteredArticles: SocialArticleCard[];
  developingStories: DevelopingStoryStream[];
} {
  if (articles.length <= 1) {
    return { clusteredArticles: articles, developingStories: [] };
  }

  const clusters: StoryClusterGroup<SocialArticleCard>[] = [];
  const assigned = new Set<string>();

  for (let i = 0; i < articles.length; i++) {
    const artA = articles[i];
    if (assigned.has(artA.id)) continue;

    const currentCluster: StoryClusterGroup<SocialArticleCard> = {
      clusterId: `cluster-${artA.id}`,
      leadItem: artA,
      secondaryItems: [],
      distinctPublishers: [artA.sourceName]
    };
    assigned.add(artA.id);

    for (let j = i + 1; j < articles.length; j++) {
      const artB = articles[j];
      if (assigned.has(artB.id)) continue;

      // Check timestamp window (within 48 hours)
      const timeDiffMs = Math.abs(artA.timestampMs - artB.timestampMs);
      const isWithinTimeWindow = timeDiffMs <= 48 * 3600 * 1000;

      if (!isWithinTimeWindow) continue;

      const sim = computeHeadlineSimilarity(artA.title, artB.title);
      // High token similarity or same primary entity + strong token match
      const isSameStory =
        sim >= 0.50 ||
        (sim >= 0.35 &&
          artA.primaryEntity &&
          artB.primaryEntity &&
          artA.primaryEntity.toLowerCase() === artB.primaryEntity.toLowerCase());

      if (isSameStory) {
        currentCluster.secondaryItems.push(artB);
        assigned.add(artB.id);
        if (!currentCluster.distinctPublishers.includes(artB.sourceName)) {
          currentCluster.distinctPublishers.push(artB.sourceName);
        }
      }
    }

    clusters.push(currentCluster);
  }

  // Build finalized SocialArticleCard list and DevelopingStoryStream timelines
  const finalArticles: SocialArticleCard[] = [];
  const developingStories: DevelopingStoryStream[] = [];

  for (const group of clusters) {
    const lead = { ...group.leadItem };
    lead.clusterId = group.clusterId;

    if (group.secondaryItems.length > 0) {
      lead.relatedCoverage = group.secondaryItems.map((sec) => ({
        sourceName: sec.sourceName,
        sourceUrl: sec.sourceUrl,
        sourceDomain: sec.sourceDomain,
        publishedAt: sec.publishedAt,
        title: sec.title
      }));

      // Assemble developing story stream if covered by multiple publishers
      if (group.distinctPublishers.length >= 2) {
        const allItemsInCluster = [group.leadItem, ...group.secondaryItems].sort(
          (a, b) => b.timestampMs - a.timestampMs
        );

        const timeline: DevelopingStoryUpdate[] = allItemsInCluster.map((item, idx) => ({
          id: `upd-${item.id}`,
          headline: item.title,
          summary: item.snippet,
          sourceName: item.sourceName,
          sourceDomain: item.sourceDomain,
          sourceUrl: item.sourceUrl,
          publishedAt: item.publishedAt,
          timestampMs: item.timestampMs,
          isLatest: idx === 0
        }));

        developingStories.push({
          id: `dev-story-${group.clusterId}`,
          storyTitle: group.leadItem.title,
          topicTag: group.leadItem.category,
          publisherCount: group.distinctPublishers.length,
          latestUpdate: timeline[0],
          timeline
        });
      }
    }

    finalArticles.push(lead);
  }

  return { clusteredArticles: finalArticles, developingStories };
}
