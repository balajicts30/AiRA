// ============================================================================
// SOURCE VERIFICATION PIPELINE, 12-FACTOR RELEVANCE RANKING & GROUNDED SYNTHESIS
// (PHASES 3, 6, 9, 10)
// Enforces the strict separation of Source Eligibility and Query Relevance:
//   1. Discover candidates
//   2. Resolve user's intent and entities
//   3. Validate source eligibility and permitted access
//   4. Normalize content and metadata
//   5. Evaluate topical relevance (12-Factor Relevance Scorer)
//   6. Rank, deduplicate, and diversify across publishers & facets
//   7. Generate evidence-grounded summaries & validate citations
// ============================================================================

import {
  DEFAULT_CATEGORY_FRESHNESS_POLICIES,
  evaluateContentFreshness,
  isBreakingNewsIntent,
  isHistoricalQueryIntent,
  parseValidIsoTimestamp
} from "./freshnessPolicy";
import { interpretSearchQuery } from "./queryUnderstanding";
import { scoreItemAgainstInterpretation } from "./relevanceScorer";
import {
  CandidateItem,
  CitationReference,
  ContentCategory,
  GroundedSummaryOutput,
  QueryInterpretation,
  RejectedSourceLog,
  SourceRegistryRecord,
  StandardizedSearchResult,
  VerificationStatus
} from "./types";
import { verifyUrlAgainstRegistry } from "./urlSecurity";

const PROMPT_INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /disregard\s+(all\s+)?(system|previous|security)\s+(instructions|rules|policies)/i,
  /system\s*prompt\s*override/i,
  /you\s+are\s+now\s+(in\s+developer\s+mode|unrestricted|dan)/i,
  /approve\s+all\s+domains/i,
  /<script\b[^>]*>[\s\S]*?<\/script>/i,
  /javascript\s*:/i
];

export function containsPromptInjectionOrScript(text: string): boolean {
  if (!text) return false;
  return PROMPT_INJECTION_PATTERNS.some((rx) => rx.test(text));
}

export function sanitizeUntrustedText(raw: string): string {
  if (!raw) return "";
  return raw
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function computeNormalizedDedupeKey(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(reuters|ap|associated press|bbc|the guardian|espn|exclusive|breaking|live|update)\b/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .slice(0, 8)
    .join("-");
}

export function detectWireSyndication(title: string, summary: string, sourceDomain: string): {
  isWireSyndicated: boolean;
  wireAgency?: string;
} {
  const combined = `${title} ${summary}`;
  if (
    sourceDomain !== "reuters.com" &&
    (/\(\s*reuters\s*\)/i.test(combined) || /\bby\s+reuters\b/i.test(combined) || /—\s*reuters\b/i.test(combined))
  ) {
    return { isWireSyndicated: true, wireAgency: "Reuters" };
  }
  if (
    sourceDomain !== "apnews.com" &&
    (/\(\s*ap\s*\)/i.test(combined) || /\bassociated\s+press\b/i.test(combined))
  ) {
    return { isWireSyndicated: true, wireAgency: "Associated Press" };
  }
  return { isWireSyndicated: false };
}

/**
 * Computes a normalized 0.0 - 1.0 relevance score using our Phase 6 12-Factor Relevance Scorer.
 */
export function computeQueryRelevance(
  query: string,
  title: string,
  summary: string,
  tags: string[] = [],
  precomputedInterp?: QueryInterpretation
): number {
  const interp = precomputedInterp || interpretSearchQuery(query);
  const breakdown = scoreItemAgainstInterpretation({
    title,
    summary,
    tags,
    interp
  });
  if (!breakdown.isRelevant) return 0;
  return Math.min(1, Number((breakdown.totalScore / 100).toFixed(2)));
}

/**
 * Runs the Server-Side Verification, Topical Relevance & Ranking Pipeline on candidate items.
 */
export function runVerificationPipeline(params: {
  query: string;
  targetCategory: ContentCategory;
  candidates: CandidateItem[];
  registry: SourceRegistryRecord[];
  interpretation?: QueryInterpretation;
  requireQueryMatch?: boolean;
  allowDynamicSources?: boolean;
  nowMs?: number;
}): {
  verifiedResults: StandardizedSearchResult[];
  rejectedLogs: RejectedSourceLog[];
  groundedSynthesis: GroundedSummaryOutput;
} {
  const {
    query,
    targetCategory,
    candidates,
    registry,
    interpretation,
    requireQueryMatch = true,
    allowDynamicSources = false,
    nowMs = Date.now()
  } = params;

  const interp = interpretation || interpretSearchQuery(query);
  const isHistorical =
    interp.timeSensitivity === "historical" || isHistoricalQueryIntent(query);
  const isBreaking =
    interp.timeSensitivity === "breaking" || isBreakingNewsIntent(query);
  const nowIso = new Date(nowMs).toISOString();

  const rejectedLogs: RejectedSourceLog[] = [];
  const stageFiveResults: StandardizedSearchResult[] = [];

  for (let idx = 0; idx < candidates.length; idx++) {
    const cand = candidates[idx];

    // ========================================================================
    // STAGE 3: URL & DOMAIN VERIFICATION (SSRF, Denylist, Redirects, Allowlist)
    // ========================================================================
    const urlCheck = verifyUrlAgainstRegistry(
      cand.url,
      registry,
      cand.redirectChain || [],
      { allowDynamicRegistration: allowDynamicSources }
    );
    if (!urlCheck.allowed || !urlCheck.matchedSource) {
      if (urlCheck.rejection) {
        rejectedLogs.push({ ...urlCheck.rejection, query });
      }
      continue;
    }

    const matchedSource = urlCheck.matchedSource;
    const canonicalUrl = urlCheck.canonicalUrl;

    // ========================================================================
    // STAGE 4: CONTENT VALIDATION, PROMPT-INJECTION DEFENSE & NORMALIZATION
    // ========================================================================
    const rawTitle = cand.title || "";
    const rawSummary = cand.summary || "";

    if (
      containsPromptInjectionOrScript(rawTitle) ||
      containsPromptInjectionOrScript(rawSummary)
    ) {
      rejectedLogs.push({
        timestamp: nowIso,
        url: canonicalUrl,
        normalizedDomain: matchedSource.canonicalDomain,
        reasonCode: "PROMPT_INJECTION_DETECTED",
        detail: "Rejected candidate containing embedded prompt-injection or script payload",
        query
      });
      continue;
    }

    const cleanTitle = sanitizeUntrustedText(rawTitle);
    const cleanSummary = sanitizeUntrustedText(rawSummary);

    if (cleanTitle.length < 8 || cleanSummary.length < 20) {
      rejectedLogs.push({
        timestamp: nowIso,
        url: canonicalUrl,
        normalizedDomain: matchedSource.canonicalDomain,
        reasonCode: "INSUFFICIENT_OR_EMPTY_CONTENT",
        detail: "Candidate lacks substantive title or summary text",
        query
      });
      continue;
    }

    const effectiveCategory = cand.category || matchedSource.category || targetCategory;
    const pubIso = parseValidIsoTimestamp(cand.publishedAt);
    const updIso = parseValidIsoTimestamp(cand.updatedAt);

    // ========================================================================
    // STAGE 4B: CATEGORY-SPECIFIC FRESHNESS VALIDATION
    // ========================================================================
    const freshnessEval = evaluateContentFreshness({
      publishedAt: pubIso,
      updatedAt: updIso,
      category: effectiveCategory,
      sourceMaxAgeMs: matchedSource.maxContentAgeMs,
      isHistoricalQuery: isHistorical,
      isBreakingQuery: isBreaking,
      nowMs
    });

    if (!freshnessEval.isEligible) {
      rejectedLogs.push({
        timestamp: nowIso,
        url: canonicalUrl,
        normalizedDomain: matchedSource.canonicalDomain,
        reasonCode: "STALE_CONTENT_EXCEEDED_POLICY",
        detail: freshnessEval.reason,
        query
      });
      continue;
    }

    // ========================================================================
    // STAGE 5: TOPICAL & ENTITY RELEVANCE EVALUATION (12-Factor Scorer)
    // Separate from source eligibility: A trusted source can still return an
    // irrelevant article (e.g., IND vs AUS when querying SA vs AUS).
    // ========================================================================
    const isPrimary =
      matchedSource.sourceType === "primary" ||
      matchedSource.sourceType === "official" ||
      matchedSource.sourceType === "governing_body" ||
      matchedSource.sourceType === "technical_documentation";

    const resolvedDataType =
      cand.dataType || (isPrimary ? ("press_release" as const) : ("article" as const));

    const wireInfo = detectWireSyndication(cleanTitle, cleanSummary, matchedSource.canonicalDomain);

    const scoreBreakdown = scoreItemAgainstInterpretation({
      title: cleanTitle,
      summary: cleanSummary,
      tags: cand.tags || [],
      dataType: resolvedDataType,
      sourceTier: matchedSource.trustTier,
      publishedAt: pubIso,
      hasThumbnail: Boolean(cand.thumbnailUrl),
      hasAuthor: Boolean(cand.author),
      isSyndicatedWire: wireInfo.isWireSyndicated,
      facet: cand.facet,
      interp,
      nowMs
    });

    if (requireQueryMatch && !scoreBreakdown.isRelevant) {
      rejectedLogs.push({
        timestamp: nowIso,
        url: canonicalUrl,
        normalizedDomain: matchedSource.canonicalDomain,
        reasonCode: "IRRELEVANT_ENTITY_OR_TOPIC",
        detail: `Candidate from approved source "${matchedSource.publisherName}" excluded due to insufficient entity/topic relevance (${scoreBreakdown.explanation})`,
        query
      });
      continue;
    }

    // ========================================================================
    // STAGE 6: FACTUAL CONFIDENCE & CITATION CONSTRUCTION
    // ========================================================================
    const tierBaseConfidence =
      matchedSource.trustTier === 1 ? 0.94 : matchedSource.trustTier === 2 ? 0.86 : 0.78;
    const freshnessBonus =
      freshnessEval.freshnessStatus === "live" || freshnessEval.freshnessStatus === "fresh"
        ? 0.04
        : freshnessEval.freshnessStatus === "unverified"
        ? -0.1
        : 0;
    const confidence = Math.min(
      0.99,
      Math.max(0.55, Number((tierBaseConfidence + freshnessBonus).toFixed(2)))
    );

    const citationId = `cit-${matchedSource.id}-${idx + 1}`;
    const citation: CitationReference = {
      citationId,
      sourceId: matchedSource.id,
      sourceName: matchedSource.publisherName,
      sourceDomain: matchedSource.canonicalDomain,
      sourceTier: matchedSource.trustTier,
      title: cleanTitle,
      canonicalUrl,
      publishedAt: pubIso,
      updatedAt: updIso,
      retrievedAt: nowIso,
      verifiedAt: nowIso,
      excerpt: cleanSummary.slice(0, 260),
      isPrimarySource: isPrimary
    };

    const policy =
      DEFAULT_CATEGORY_FRESHNESS_POLICIES[effectiveCategory] ||
      DEFAULT_CATEGORY_FRESHNESS_POLICIES.news;
    const expiresAtIso = new Date(
      nowMs + Math.min(matchedSource.maxCacheDurationMs, policy.cacheTtlMs)
    ).toISOString();

    const verificationStatus: VerificationStatus = isPrimary
      ? "primary_official"
      : "single_source_verified";

    stageFiveResults.push({
      id: `res-${matchedSource.id}-${Date.now()}-${idx}`,
      query,
      category: effectiveCategory,
      title: cleanTitle,
      summary: cleanSummary.slice(0, 420),
      canonical_url: canonicalUrl,
      source_id: matchedSource.id,
      source_name: matchedSource.publisherName,
      source_domain: matchedSource.canonicalDomain,
      source_type: matchedSource.sourceType,
      source_tier: matchedSource.trustTier,
      published_at: pubIso,
      updated_at: updIso,
      retrieved_at: nowIso,
      verified_at: nowIso,
      freshness_status: freshnessEval.freshnessStatus,
      verification_status: verificationStatus,
      corroboration_count: 1,
      corroborated_by: [matchedSource.publisherName],
      is_syndicated_wire: wireInfo.isWireSyndicated,
      wire_agency: wireInfo.wireAgency,
      confidence,
      language: matchedSource.supportedLanguages[0] || "en",
      region: matchedSource.geographicCoverage[0] || "Global",
      author: cand.author ? sanitizeUntrustedText(cand.author) : matchedSource.publisherName,
      tags:
        cand.tags && cand.tags.length > 0
          ? cand.tags
          : [`#${effectiveCategory}`, `#Tier${matchedSource.trustTier}`],
      citations: [citation],
      deduplication_key: `${resolvedDataType}:${computeNormalizedDedupeKey(cleanTitle)}`,
      provider: cand.providerName,
      data_type: resolvedDataType,
      thumbnail_url: cand.thumbnailUrl,
      media_duration: cand.mediaDuration,
      expires_at: expiresAtIso,
      primary_entity: cand.primaryEntity || interp.primarySubject,
      related_entities:
        cand.relatedEntities || interp.namedEntities.map((e) => e.canonicalName),
      event_id: cand.eventId || null,
      relevance_score: scoreBreakdown.totalScore,
      score_breakdown: scoreBreakdown
    });
  }

  // ==========================================================================
  // STAGE 7: DEDUPLICATION & WIRE-SYNDICATION vs INDEPENDENT CORROBORATION
  // ==========================================================================
  const dedupedByUrlAndType = new Map<string, StandardizedSearchResult>();
  for (const item of stageFiveResults) {
    const urlTypeKey = `${item.data_type}:${item.canonical_url}`;
    if (!dedupedByUrlAndType.has(urlTypeKey)) {
      dedupedByUrlAndType.set(urlTypeKey, item);
    }
  }

  const uniqueResults = Array.from(dedupedByUrlAndType.values());

  // Group items sharing significant entity/topic overlap to check corroboration
  for (let i = 0; i < uniqueResults.length; i++) {
    const itemA = uniqueResults[i];
    const independentPublishers = new Set<string>([
      itemA.is_syndicated_wire && itemA.wire_agency ? itemA.wire_agency : itemA.source_name
    ]);
    const combinedCitations: CitationReference[] = [...itemA.citations];

    for (let j = 0; j < uniqueResults.length; j++) {
      if (i === j) continue;
      const itemB = uniqueResults[j];
      if (
        itemA.data_type !== itemB.data_type &&
        (itemA.data_type === "photo_report" || itemB.data_type === "photo_report")
      ) {
        continue;
      }

      const overlap = computeStoryOverlap(itemA.title, itemB.title);
      if (overlap >= 0.45) {
        const effectivePublisherB =
          itemB.is_syndicated_wire && itemB.wire_agency ? itemB.wire_agency : itemB.source_name;

        if (!independentPublishers.has(effectivePublisherB)) {
          independentPublishers.add(effectivePublisherB);
          if (itemB.citations[0] && combinedCitations.length < 4) {
            combinedCitations.push(itemB.citations[0]);
          }
        }
      }
    }

    itemA.corroboration_count = independentPublishers.size;
    itemA.corroborated_by = Array.from(independentPublishers);
    itemA.citations = combinedCitations;

    if (independentPublishers.size >= 2 && itemA.verification_status !== "primary_official") {
      itemA.verification_status = "corroborated";
      itemA.confidence = Math.min(0.99, Number((itemA.confidence + 0.05).toFixed(2)));
    }
  }

  // Collapse exact duplicate wire copies (keep highest trust tier)
  const seenDedupeKeys = new Map<string, StandardizedSearchResult>();
  for (const item of uniqueResults) {
    const existing = seenDedupeKeys.get(item.deduplication_key);
    if (!existing || item.source_tier < existing.source_tier) {
      seenDedupeKeys.set(item.deduplication_key, item);
    }
  }

  // ==========================================================================
  // STAGE 8: 12-FACTOR RELEVANCE RANKING & PUBLISHER/FACET DIVERSIFICATION
  // ==========================================================================
  const initialSorted = Array.from(seenDedupeKeys.values()).sort((a, b) => {
    const scoreA = a.relevance_score ?? 50;
    const scoreB = b.relevance_score ?? 50;
    return scoreB - scoreA;
  });

  // Apply publisher diversity adjustment so a single publisher does not monopolize the top feed
  const publisherCounts = new Map<string, number>();
  const rankedResults = initialSorted
    .map((item) => {
      const seenCount = publisherCounts.get(item.source_domain) || 0;
      publisherCounts.set(item.source_domain, seenCount + 1);
      const diversityPenalty = seenCount * 4;
      const corroborationBonus = Math.min(8, (item.corroboration_count - 1) * 4);
      const finalScore = (item.relevance_score ?? 50) + corroborationBonus - diversityPenalty;
      if (item.score_breakdown) {
        item.score_breakdown.diversityAdjustment = corroborationBonus - diversityPenalty;
        item.score_breakdown.totalScore = Math.max(0, Math.min(100, Math.round(finalScore)));
      }
      item.relevance_score = Math.max(0, Math.min(100, Math.round(finalScore)));
      return { item, finalScore };
    })
    .sort((a, b) => b.finalScore - a.finalScore)
    .map((entry) => entry.item);

  // ==========================================================================
  // STAGE 9: FINAL OUTPUT SCHEMA VALIDATION
  // ==========================================================================
  const finalValidatedResults = rankedResults.filter(validateFinalResultSchema);

  // ==========================================================================
  // STAGE 10: EVIDENCE-GROUNDED CITATION SYNTHESIS
  // ==========================================================================
  const groundedSynthesis = synthesizeGroundedSummary(
    interp.primarySubject || query,
    finalValidatedResults
  );

  return {
    verifiedResults: finalValidatedResults,
    rejectedLogs,
    groundedSynthesis
  };
}

function computeStoryOverlap(titleA: string, titleB: string): number {
  const wordsA = new Set(
    titleA
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
  const wordsB = new Set(
    titleB
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3)
  );
  if (wordsA.size === 0 || wordsB.size === 0) return 0;
  let shared = 0;
  for (const w of wordsA) {
    if (wordsB.has(w)) shared += 1;
  }
  return shared / Math.min(wordsA.size, wordsB.size);
}

export function validateFinalResultSchema(item: StandardizedSearchResult): boolean {
  if (!item.id || !item.title || !item.summary || !item.canonical_url) return false;
  if (!item.source_name || !item.source_domain) return false;
  if (!item.retrieved_at || !item.verified_at || !item.expires_at) return false;
  if (!Array.isArray(item.citations) || item.citations.length === 0) return false;
  if (!item.citations[0].canonicalUrl.startsWith("http")) return false;
  if (item.verification_status === "rejected") return false;
  return true;
}

/**
 * Generates an evidence-grounded summary strictly from verified results.
 * Every factual claim includes traceable citation IDs.
 * Never invents statistics, scores, dates, or quotes.
 */
export function synthesizeGroundedSummary(
  query: string,
  verifiedResults: StandardizedSearchResult[]
): GroundedSummaryOutput {
  if (verifiedResults.length === 0) {
    return {
      headline: `No Verified Results Available for "${query}"`,
      synthesizedSummary:
        "No verified results from approved sources are currently available for this query. Unapproved domains, social media posts, and Wikipedia are excluded by policy, and no fresh records from approved publishers matched your request.",
      factualClaims: [],
      discrepancies: [],
      uncertaintyNotice:
        "Trusted data is currently unavailable from approved sources for this specific query. Rather than filling the gap with unverified web or social media content, AiRA reports this limitation transparently.",
      isAiGenerated: false
    };
  }

  const topItems = verifiedResults.slice(0, 4);
  const factualClaims = topItems.map((item) => {
    const claimType: GroundedSummaryOutput["factualClaims"][number]["claimType"] =
      item.verification_status === "primary_official"
        ? "official_announcement"
        : item.verification_status === "corroborated"
        ? "confirmed_fact"
        : "attributed_report";

    const pubDateLabel = item.published_at
      ? new Date(item.published_at).toLocaleString([], {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit"
        })
      : "Timestamp unverified";

    const prefix =
      claimType === "official_announcement"
        ? `[Official Primary Source — ${item.source_name}, ${pubDateLabel}]`
        : claimType === "confirmed_fact"
        ? `[Corroborated across ${item.corroborated_by.join(" & ")}, ${pubDateLabel}]`
        : `[Single-Source Report — ${item.source_name}, ${pubDateLabel}]`;

    return {
      claimText: `${prefix}: ${item.title} — ${item.summary.slice(0, 180)}${
        item.summary.length > 180 ? "..." : ""
      }`,
      claimType,
      citationIds: item.citations.map((c) => c.citationId),
      confidence: item.confidence
    };
  });

  const unverifiedTimeCount = topItems.filter((i) => i.freshness_status === "unverified").length;
  const singleSourceOnly = topItems.every((i) => i.corroboration_count === 1 && i.source_tier > 1);

  let uncertaintyNotice: string | null = null;
  if (unverifiedTimeCount > 0) {
    uncertaintyNotice = `${unverifiedTimeCount} retrieved record(s) did not include an explicit publisher timestamp and are labeled "Freshness: Unverified".`;
  } else if (singleSourceOnly) {
    uncertaintyNotice =
      "These developments are currently attributed to single approved publishers and await independent corroboration.";
  }

  const publisherNames = Array.from(new Set(topItems.map((i) => i.source_name)));
  const lead = topItems[0];
  const summarySentences = topItems.map((item, idx) => {
    const citTag = `[${idx + 1}: ${item.source_name}]`;
    return `${item.title} ${citTag}.`;
  });

  return {
    headline: `Verified Coverage: ${lead.title}`,
    synthesizedSummary: `Grounded synthesis from ${publisherNames.join(
      ", "
    )}: ${summarySentences.join(" ")}`,
    factualClaims,
    discrepancies: [],
    uncertaintyNotice,
    isAiGenerated: false
  };
}
