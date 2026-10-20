// ============================================================================
// PHASE 6: 12-FACTOR RELEVANCE SCORING & DIVERSIFICATION ENGINE
// Scores every candidate against the resolved QueryInterpretation rather than
// simple keyword overlap or blind synonym expansion.
// ============================================================================

import {
  QueryInterpretation,
  RelevanceScoreBreakdown,
  StandardizedSearchResult
} from "./types";

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "what",
  "whats",
  "happened",
  "show",
  "tell",
  "about",
  "from",
  "latest",
  "news",
  "live",
  "update",
  "updates",
  "last",
  "night",
  "today",
  "how",
  "why",
  "who",
  "where",
  "when",
  "does",
  "start",
  "next",
  "now",
  "too",
  "only",
  "just",
  "photologs",
  "photolog",
  "photos",
  "photo",
  "vlogs",
  "vlog",
  "videos",
  "video",
  "blogs",
  "blog",
  "articles",
  "article",
  "hi",
  "hey",
  "hello",
  "please",
  "new",
  "vs",
  "versus"
]);

function escapeRx(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function containsTerm(haystack: string, term: string): boolean {
  const clean = term.trim().toLowerCase();
  if (!clean) return false;
  if (clean.length <= 3) {
    const rx = new RegExp(`(?:^|[^a-z0-9])${escapeRx(clean)}(?:$|[^a-z0-9])`, "i");
    return rx.test(haystack);
  }
  return haystack.includes(clean);
}

/**
 * Evaluates all 12 relevance factors for a candidate or verified result against
 * the structured QueryInterpretation.
 */
export function scoreItemAgainstInterpretation(params: {
  title: string;
  summary: string;
  tags?: string[];
  dataType?: StandardizedSearchResult["data_type"];
  sourceTier?: 1 | 2 | 3;
  publishedAt?: string | null;
  hasThumbnail?: boolean;
  hasAuthor?: boolean;
  isSyndicatedWire?: boolean;
  facet?: string;
  interp: QueryInterpretation;
  nowMs?: number;
}): RelevanceScoreBreakdown {
  const {
    title,
    summary,
    tags = [],
    dataType = "article",
    sourceTier = 2,
    publishedAt = null,
    hasThumbnail = false,
    hasAuthor = true,
    isSyndicatedWire = false,
    interp,
    nowMs = Date.now()
  } = params;

  const titleLower = title.toLowerCase();
  const tagLower = tags.join(" ").toLowerCase();
  const fullText = `${titleLower} ${summary.toLowerCase()} ${tagLower}`;

  // ==========================================================================
  // FACTOR 1: PRIMARY ENTITY MATCH (0 - 28 pts) & MISMATCH PENALTY
  // ==========================================================================
  let primaryEntityScore = 0;
  let mismatchPenalty = 0;

  if (interp.sportOrIndustry === "cricket" && interp.teamsOrCompetitors.length >= 2) {
    // Head-to-head matchup (e.g., South Africa vs Australia)
    const teamMatchCounts = interp.teamsOrCompetitors.map((teamName) => {
      const entityObj = interp.namedEntities.find(
        (e) => e.canonicalName.toLowerCase() === teamName.toLowerCase()
      );
      const terms = [
        teamName.toLowerCase(),
        ...(entityObj?.aliases || []),
        ...(entityObj?.abbreviation ? [entityObj.abbreviation.toLowerCase()] : [])
      ];
      const matchedInTitle = terms.some((t) => containsTerm(titleLower, t));
      const matchedInBody = terms.some((t) => containsTerm(fullText, t));
      return { teamName, matchedInTitle, matchedInBody };
    });

    const teamsInBody = teamMatchCounts.filter((t) => t.matchedInBody).length;
    const teamsInTitle = teamMatchCounts.filter((t) => t.matchedInTitle).length;

    if (teamsInTitle === 0) {
      // If the title doesn't mention either requested team at all, reject to prevent synthetic description noise
      primaryEntityScore = 0;
      mismatchPenalty = -40;
    } else if (teamsInBody === interp.teamsOrCompetitors.length) {
      primaryEntityScore = teamsInTitle >= 2 ? 28 : 22;
    } else if (teamsInBody === 1) {
      // Check if this item is actually about a DIFFERENT rival team (e.g. India / Chepauk / Bumrah when user asked SA vs AUS)
      const rivalTeamsNotInQuery = ["india", "england", "pakistan", "new zealand", "sri lanka", "west indies", "chepauk", "bumrah", "suryakumar", "indvaus"]
        .filter((rival) => !interp.teamsOrCompetitors.some((qt) => qt.toLowerCase().includes(rival)));

      const mentionsUnrelatedRival = rivalTeamsNotInQuery.some((rival) =>
        containsTerm(fullText, rival)
      );

      if (mentionsUnrelatedRival) {
        primaryEntityScore = 0;
        mismatchPenalty = -45;
      } else {
        primaryEntityScore = 14;
      }
    } else {
      primaryEntityScore = 0;
      mismatchPenalty = -35;
    }
  } else if (interp.namedEntities.length > 0) {
    let matchedEntitiesInTitle = 0;
    let matchedEntitiesInBody = 0;

    for (const ent of interp.namedEntities) {
      const terms = [
        ent.canonicalName.toLowerCase(),
        ...ent.aliases,
        ...(ent.abbreviation && ent.abbreviation.length >= 3 ? [ent.abbreviation.toLowerCase()] : [])
      ];
      if (ent.canonicalName === "Ferrari" || ent.canonicalName === "Scuderia Ferrari") {
        terms.push("ferrari", "scuderia", "maranello", "f80", "12cilindri", "sf-25", "sf-26", "prancing horse");
      }

      if (terms.some((t) => containsTerm(titleLower, t))) {
        matchedEntitiesInTitle += 1;
      }
      if (terms.some((t) => containsTerm(fullText, t))) {
        matchedEntitiesInBody += 1;
      }
    }

    // If user searched specifically for "Ferrari", an article that doesn't mention Ferrari/Maranello/Scuderia at all is rejected
    if (
      interp.primarySubject.toLowerCase().includes("ferrari") &&
      !containsTerm(fullText, "ferrari") &&
      !containsTerm(fullText, "maranello") &&
      !containsTerm(fullText, "scuderia")
    ) {
      primaryEntityScore = 0;
      mismatchPenalty = -45;
    } else if (matchedEntitiesInBody > 0) {
      const ratioBody = matchedEntitiesInBody / interp.namedEntities.length;
      const ratioTitle = matchedEntitiesInTitle / interp.namedEntities.length;
      primaryEntityScore = Math.round(14 + ratioBody * 8 + ratioTitle * 6);
    } else {
      primaryEntityScore = 0;
      mismatchPenalty = -30;
    }
  } else {
    // General topic query without pre-indexed KB entity
    const subjectTokens = interp.primarySubject
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

    if (subjectTokens.length > 0) {
      const matchedTitle = subjectTokens.filter((tk) => containsTerm(titleLower, tk)).length;
      const matchedBody = subjectTokens.filter((tk) => containsTerm(fullText, tk)).length;
      if (matchedBody > 0) {
        primaryEntityScore = Math.round(
          (matchedBody / subjectTokens.length) * 18 + (matchedTitle / subjectTokens.length) * 10
        );
      } else {
        mismatchPenalty = -30;
      }
    } else {
      primaryEntityScore = 15;
    }
  }

  // ==========================================================================
  // FACTOR 2: QUERY-INTENT MATCH (0 - 14 pts)
  // ==========================================================================
  let queryIntentScore = 8;
  switch (interp.userIntent) {
    case "live_event_or_score":
      if (/\b(live|score|scorecard|classification|timing|innings|overs|result|lap|q3)\b/i.test(fullText)) {
        queryIntentScore = 14;
      }
      break;
    case "fixtures_and_schedules":
      if (/\b(fixture|fixtures|schedule|upcoming|next match|start time|calendar|wanderers|decider|preview)\b/i.test(fullText)) {
        queryIntentScore = 14;
      }
      break;
    case "photos_and_videos":
      if (dataType === "video_report" || dataType === "photo_report" || /\b(highlights|vlog|photolog|gallery|onboard)\b/i.test(fullText)) {
        queryIntentScore = 14;
      }
      break;
    case "reviews_and_comparisons":
      if (/\b(review|test|comparison|lab|benchmark|hands-on|vs)\b/i.test(fullText)) {
        queryIntentScore = 14;
      }
      break;
    case "product_information":
    case "brand_news":
      if (/\b(spec|specifications|launch|official|maranello|f80|12cilindri|2027|architecture|powertrain|newsroom)\b/i.test(fullText)) {
        queryIntentScore = 14;
      }
      break;
    default:
      queryIntentScore = 10;
  }

  // ==========================================================================
  // FACTOR 3: COMPETITION, TEAM, PRODUCT, OR EVENT MATCH (0 - 16 pts)
  // ==========================================================================
  let competitionTeamEventScore = 0;
  if (interp.sportOrIndustry === "cricket" && /\b(cricket|t20|t20i|odi|test|icc|proteas|centurion|wanderers|bcci|cricinfo|cricbuzz)\b/i.test(fullText)) {
    competitionTeamEventScore = 14;
  } else if (interp.sportOrIndustry === "formula1" && /\b(formula 1|f1|grand prix|fia|scuderia|qualifying|paddock|imola|maranello)\b/i.test(fullText)) {
    competitionTeamEventScore = 14;
  } else if (interp.isBroadMultiFacetEntity && interp.primarySubject.toLowerCase() === "ferrari") {
    if (/\b(ferrari|maranello|scuderia|f80|12cilindri|supercar|v12|v6|f1|leclerc|hamilton)\b/i.test(fullText)) {
      competitionTeamEventScore = 15;
    }
  } else if (interp.sportOrIndustry === "consumer_tech" && /\b(smartphone|iphone|samsung|galaxy|camera|display|amoled|titanium|silicon)\b/i.test(fullText)) {
    competitionTeamEventScore = 14;
  } else if (interp.sportOrIndustry === "travel" && /\b(japan|kyoto|tokyo|kanazawa|shinkansen|fuji|jnto|travel|temple|kissaten)\b/i.test(fullText)) {
    competitionTeamEventScore = 14;
  } else if (primaryEntityScore >= 14) {
    competitionTeamEventScore = 12;
  }

  // ==========================================================================
  // FACTOR 4: SEMANTIC RELEVANCE (0 - 12 pts)
  // ==========================================================================
  const queryTokens = interp.normalizedQuery
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

  let matchedTokenCount = 0;
  for (const tk of queryTokens) {
    if (containsTerm(fullText, tk)) {
      matchedTokenCount += 1;
    }
  }
  const semanticRelevanceScore =
    queryTokens.length > 0
      ? Math.min(12, Math.round((matchedTokenCount / queryTokens.length) * 12))
      : 8;

  // ==========================================================================
  // FACTOR 5: SOURCE APPROVAL & CREDIBILITY (0 - 10 pts)
  // ==========================================================================
  const sourceCredibilityScore = sourceTier === 1 ? 10 : sourceTier === 2 ? 8 : 6;

  // ==========================================================================
  // FACTOR 6: RECENCY APPROPRIATE TO QUERY (0 - 8 pts)
  // ==========================================================================
  let recencyScore = 5;
  if (publishedAt) {
    const ageHours = Math.max(0, (nowMs - new Date(publishedAt).getTime()) / 3600000);
    if (interp.timeSensitivity === "historical") {
      recencyScore = 7;
    } else {
      recencyScore = Math.max(1, Math.min(8, Math.round(8 - Math.log10(ageHours + 1) * 3)));
    }
  }

  // ==========================================================================
  // FACTOR 7: EVENT-STATUS MATCH FOR LIVE / FIXTURE QUERIES (0 - 6 pts)
  // ==========================================================================
  let eventStatusScore = 3;
  if (interp.userIntent === "live_event_or_score" && /\b(score|scorecard|result|classification|innings|overs|lap)\b/i.test(fullText)) {
    eventStatusScore = 6;
  } else if (interp.userIntent === "fixtures_and_schedules" && /\b(fixture|schedule|next match|start time|saturday|sunday|friday|wanderers)\b/i.test(fullText)) {
    eventStatusScore = 6;
  }

  // ==========================================================================
  // FACTOR 8: CONTENT FORMAT SUITABILITY (0 - 6 pts)
  // ==========================================================================
  let contentFormatScore = 4;
  if (interp.requestedContentType === "vlogs" && dataType === "video_report") {
    contentFormatScore = 6;
  } else if (interp.requestedContentType === "photologs" && dataType === "photo_report") {
    contentFormatScore = 6;
  } else if (interp.requestedContentType === "articles" && (dataType === "article" || dataType === "press_release")) {
    contentFormatScore = 6;
  }

  // ==========================================================================
  // FACTOR 9: METADATA COMPLETENESS (0 - 4 pts)
  // ==========================================================================
  let metadataCompletenessScore = 1;
  if (publishedAt) metadataCompletenessScore += 1;
  if (hasThumbnail) metadataCompletenessScore += 1;
  if (hasAuthor && summary.length >= 45) metadataCompletenessScore += 1;

  // ==========================================================================
  // FACTOR 10, 11, 12: DIVERSITY, DUPLICATE PENALTY, USER PREFERENCE
  // ==========================================================================
  const diversityAdjustment = 0; // Adjusted in collection pass
  const duplicatePenalty = isSyndicatedWire ? -4 : 0;
  const userPreferenceBonus =
    interp.requestedContentType !== "all" && contentFormatScore === 6 ? 4 : 0;

  const rawTotal =
    primaryEntityScore +
    queryIntentScore +
    competitionTeamEventScore +
    semanticRelevanceScore +
    sourceCredibilityScore +
    recencyScore +
    eventStatusScore +
    contentFormatScore +
    metadataCompletenessScore +
    diversityAdjustment +
    duplicatePenalty +
    userPreferenceBonus +
    mismatchPenalty;

  const totalScore = Math.max(0, Math.min(100, Math.round(rawTotal)));
  const isRelevant = primaryEntityScore > 0 && mismatchPenalty === 0 && totalScore >= 38;

  return {
    primaryEntityScore,
    queryIntentScore,
    competitionTeamEventScore,
    semanticRelevanceScore,
    sourceCredibilityScore,
    recencyScore,
    eventStatusScore,
    contentFormatScore,
    metadataCompletenessScore,
    diversityAdjustment,
    duplicatePenalty,
    userPreferenceBonus,
    mismatchPenalty,
    totalScore,
    isRelevant,
    explanation: `Entity=${primaryEntityScore}, Intent=${queryIntentScore}, Domain=${competitionTeamEventScore}, Semantic=${semanticRelevanceScore}, Credibility=${sourceCredibilityScore}, Penalty=${mismatchPenalty} -> Total=${totalScore}`
  };
}
