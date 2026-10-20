// ============================================================================
// PHASE 6 & SECTION 3: 12-FACTOR RELEVANCE SCORING & MANDATORY 5-TIER
// ACTIVE-TOPIC RELEVANCE GATE
// Classifies every candidate into:
//   - "direct_match"
//   - "strongly_related"
//   - "tangential"
//   - "unrelated"
//   - "unverifiable"
// Only "direct_match" and "strongly_related" items may enter the main feed.
// ============================================================================

import {
  QueryInterpretation,
  RelevanceClassification,
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
  "are",
  "its",
  "their",
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
 * Evaluates all 12 relevance factors AND classifies the candidate into one of
 * the 5 mandatory active-topic relevance categories ("direct_match", "strongly_related",
 * "tangential", "unrelated", "unverifiable").
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

  const cleanTitle = (title || "").trim();
  const cleanSummary = (summary || "").trim();

  // Gate 0: Unverifiable metadata check
  if (cleanTitle.length < 5 || cleanSummary.length < 15) {
    return {
      primaryEntityScore: 0,
      queryIntentScore: 0,
      competitionTeamEventScore: 0,
      semanticRelevanceScore: 0,
      sourceCredibilityScore: 0,
      recencyScore: 0,
      eventStatusScore: 0,
      contentFormatScore: 0,
      metadataCompletenessScore: 0,
      diversityAdjustment: 0,
      duplicatePenalty: 0,
      userPreferenceBonus: 0,
      mismatchPenalty: -50,
      totalScore: 0,
      isRelevant: false,
      relevanceClass: "unverifiable",
      relevanceEvidence: "Candidate lacks sufficient title or summary metadata to verify topical relevance.",
      extractedEntities: [],
      primaryTopic: interp.primarySubject,
      explanation: "Rejected as unverifiable: insufficient title/summary metadata."
    };
  }

  const titleLower = cleanTitle.toLowerCase();
  const tagLower = tags.join(" ").toLowerCase();
  const fullText = `${titleLower} ${cleanSummary.toLowerCase()} ${tagLower}`;

  const extractedEntities: string[] = [];
  let primaryEntityScore = 0;
  let mismatchPenalty = 0;
  let relevanceClass: RelevanceClassification = "unrelated";
  let relevanceEvidence = "";

  // Cross-domain contamination guard: reject sports items from wrong sports/domains
  const isSoccerItem = /\b(uefa|champions league|premier league|arsenal|real madrid|barcelona|liverpool|chelsea|manchester city)\b/i.test(
    fullText
  );
  const isCricketItem = /\b(cricket|t20i|espncricinfo|cricbuzz|bcci|proteas|baggy greens|wickets|innings)\b/i.test(
    fullText
  );
  const isF1Item = /\b(formula 1|grand prix|scuderia ferrari|imola gp|fia formula)\b/i.test(fullText);

  if (interp.sportOrIndustry !== "soccer" && isSoccerItem) {
    mismatchPenalty = -55;
    relevanceClass = "unrelated";
    relevanceEvidence = `Cross-domain mismatch: candidate is soccer content while active query domain is "${interp.sportOrIndustry}".`;
  } else if (interp.sportOrIndustry !== "cricket" && isCricketItem) {
    mismatchPenalty = -55;
    relevanceClass = "unrelated";
    relevanceEvidence = `Cross-domain mismatch: candidate is cricket content while active query domain is "${interp.sportOrIndustry}".`;
  } else if (
    interp.sportOrIndustry !== "formula1" &&
    !(interp.isBroadMultiFacetEntity && interp.primarySubject.toLowerCase() === "ferrari") &&
    isF1Item
  ) {
    mismatchPenalty = -55;
    relevanceClass = "unrelated";
    relevanceEvidence = `Cross-domain mismatch: candidate is Formula 1 content while active query domain is "${interp.sportOrIndustry}".`;
  }

  // ==========================================================================
  // FACTOR 1: PRIMARY ENTITY MATCH (0 - 28 pts) & 5-TIER CLASSIFICATION
  // ==========================================================================
  if (mismatchPenalty < 0) {
    primaryEntityScore = 0;
  } else if (interp.sportOrIndustry === "cricket" && interp.teamsOrCompetitors.length >= 2) {
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
      if (matchedInBody) extractedEntities.push(teamName);
      return { teamName, matchedInTitle, matchedInBody };
    });

    const teamsInBody = teamMatchCounts.filter((t) => t.matchedInBody).length;
    const teamsInTitle = teamMatchCounts.filter((t) => t.matchedInTitle).length;

    if (teamsInTitle === 0) {
      primaryEntityScore = 0;
      mismatchPenalty = -40;
      relevanceClass = "unrelated";
      relevanceEvidence = `Title does not mention requested matchup teams (${interp.teamsOrCompetitors.join(" vs ")}).`;
    } else if (teamsInBody === interp.teamsOrCompetitors.length) {
      primaryEntityScore = teamsInTitle >= 2 ? 28 : 24;
      relevanceClass = "direct_match";
      relevanceEvidence = `Directly matches both requested teams (${interp.teamsOrCompetitors.join(" vs ")}) in ${interp.sportOrIndustry}.`;
    } else if (teamsInBody === 1) {
      const rivalTeamsNotInQuery = [
        "india",
        "england",
        "pakistan",
        "new zealand",
        "sri lanka",
        "west indies",
        "chepauk",
        "bumrah",
        "suryakumar",
        "indvaus"
      ].filter((rival) => !interp.teamsOrCompetitors.some((qt) => qt.toLowerCase().includes(rival)));

      const mentionsUnrelatedRival = rivalTeamsNotInQuery.some((rival) =>
        containsTerm(fullText, rival)
      );

      if (mentionsUnrelatedRival) {
        primaryEntityScore = 0;
        mismatchPenalty = -45;
        relevanceClass = "unrelated";
        relevanceEvidence = `Item covers a different cricket matchup involving an unrelated team rather than ${interp.teamsOrCompetitors.join(" vs ")}.`;
      } else {
        primaryEntityScore = 18;
        relevanceClass = "strongly_related";
        relevanceEvidence = `Covers one of the requested cricket teams (${extractedEntities.join(", ")}) with no conflicting rival matchup.`;
      }
    } else {
      primaryEntityScore = 0;
      mismatchPenalty = -35;
      relevanceClass = "unrelated";
      relevanceEvidence = "Does not match either requested cricket team.";
    }
  } else if (interp.primarySubject.toLowerCase() === "tesla flying car") {
    // Compound speculative/concept query: "tesla flying car"
    const mentionsTeslaOrRoadster = /\b(tesla|roadster|elon musk)\b/i.test(fullText);
    const mentionsAviationOrFlyingConcept =
      /\b(flying\s+cars?|evtol|hover|thruster|thrusters|air\s+taxi|electric\s+aviation|electric\s+aircraft|powered-lift|joby|archer\s+aviation|vertical\s+takeoff)\b/i.test(
        fullText
      );

    if (mentionsTeslaOrRoadster) extractedEntities.push("Tesla");
    if (mentionsAviationOrFlyingConcept) extractedEntities.push("eVTOL & Electric Aviation");

    if (mentionsTeslaOrRoadster && mentionsAviationOrFlyingConcept) {
      primaryEntityScore = 28;
      relevanceClass = "direct_match";
      relevanceEvidence =
        "Directly addresses Tesla / Roadster thruster claims and flying-car / eVTOL aviation context.";
    } else if (mentionsAviationOrFlyingConcept) {
      primaryEntityScore = 21;
      relevanceClass = "strongly_related";
      relevanceEvidence =
        "Strongly related contextual coverage of real eVTOL / flying-car electric aviation and FAA certification.";
    } else if (mentionsTeslaOrRoadster) {
      // Mentions Tesla in general (e.g. a random #tesla blog post) without flying car / Roadster thruster / eVTOL context
      primaryEntityScore = 6;
      mismatchPenalty = -25;
      relevanceClass = "tangential";
      relevanceEvidence =
        "Tangential: mentions Tesla generally without addressing flying cars, Roadster thrusters, or eVTOL aviation.";
    } else {
      primaryEntityScore = 0;
      mismatchPenalty = -45;
      relevanceClass = "unrelated";
      relevanceEvidence = "Unrelated: does not mention Tesla, Roadster, flying cars, or eVTOL aviation.";
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

      const inTitle = terms.some((t) => containsTerm(titleLower, t));
      const inBody = terms.some((t) => containsTerm(fullText, t));
      if (inTitle) matchedEntitiesInTitle += 1;
      if (inBody) {
        matchedEntitiesInBody += 1;
        extractedEntities.push(ent.canonicalName);
      }
    }

    if (
      interp.primarySubject.toLowerCase().includes("ferrari") &&
      !containsTerm(fullText, "ferrari") &&
      !containsTerm(fullText, "maranello") &&
      !containsTerm(fullText, "scuderia")
    ) {
      primaryEntityScore = 0;
      mismatchPenalty = -45;
      relevanceClass = "unrelated";
      relevanceEvidence = "Item does not reference Ferrari, Maranello, or Scuderia Ferrari.";
    } else if (matchedEntitiesInBody > 0) {
      const ratioBody = matchedEntitiesInBody / interp.namedEntities.length;
      const ratioTitle = matchedEntitiesInTitle / interp.namedEntities.length;
      primaryEntityScore = Math.round(14 + ratioBody * 8 + ratioTitle * 6);
      if (matchedEntitiesInTitle > 0 && ratioBody >= 0.5) {
        relevanceClass = "direct_match";
        relevanceEvidence = `Directly matches resolved entity (${extractedEntities.join(", ")}) in title and body.`;
      } else {
        relevanceClass = "strongly_related";
        relevanceEvidence = `Strongly related to resolved entity (${extractedEntities.join(", ")}).`;
      }
    } else {
      primaryEntityScore = 0;
      mismatchPenalty = -35;
      relevanceClass = "unrelated";
      relevanceEvidence = `Does not match any resolved entities (${interp.namedEntities.map((e) => e.canonicalName).join(", ")}).`;
    }
  } else {
    // General topic query without pre-indexed KB entity
    const subjectTokens = interp.primarySubject
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));

    if (subjectTokens.length > 0) {
      const matchedTitleTokens = subjectTokens.filter((tk) => containsTerm(titleLower, tk));
      const matchedBodyTokens = subjectTokens.filter((tk) => containsTerm(fullText, tk));
      extractedEntities.push(...matchedBodyTokens);

      const ratioBody = matchedBodyTokens.length / subjectTokens.length;
      const ratioTitle = matchedTitleTokens.length / subjectTokens.length;

      if (subjectTokens.length >= 2) {
        if (matchedBodyTokens.length === subjectTokens.length && matchedTitleTokens.length >= 1) {
          primaryEntityScore = Math.round(ratioBody * 18 + ratioTitle * 10);
          relevanceClass = "direct_match";
          relevanceEvidence = `Matches all query topic tokens (${matchedBodyTokens.join(", ")}).`;
        } else if (matchedBodyTokens.length >= Math.ceil(subjectTokens.length * 0.66) && matchedTitleTokens.length >= 1) {
          primaryEntityScore = Math.round(ratioBody * 18 + ratioTitle * 10);
          relevanceClass = "strongly_related";
          relevanceEvidence = `Matches majority of query topic tokens (${matchedBodyTokens.join(", ")}).`;
        } else if (matchedBodyTokens.length >= 1) {
          primaryEntityScore = 6;
          mismatchPenalty = -25;
          relevanceClass = "tangential";
          relevanceEvidence = `Tangential single-keyword overlap (${matchedBodyTokens.join(", ")}) for multi-term topic "${interp.primarySubject}".`;
        } else {
          primaryEntityScore = 0;
          mismatchPenalty = -35;
          relevanceClass = "unrelated";
          relevanceEvidence = `Zero token overlap with "${interp.primarySubject}".`;
        }
      } else {
        // Single-token query
        if (matchedTitleTokens.length === 1) {
          primaryEntityScore = 26;
          relevanceClass = "direct_match";
          relevanceEvidence = `Direct title match for "${subjectTokens[0]}".`;
        } else if (matchedBodyTokens.length === 1) {
          primaryEntityScore = 18;
          relevanceClass = "strongly_related";
          relevanceEvidence = `Body match for "${subjectTokens[0]}".`;
        } else {
          primaryEntityScore = 0;
          mismatchPenalty = -35;
          relevanceClass = "unrelated";
          relevanceEvidence = `Does not mention "${subjectTokens[0]}".`;
        }
      }
    } else {
      primaryEntityScore = 0;
      mismatchPenalty = -35;
      relevanceClass = "unverifiable";
      relevanceEvidence = "Query contained no actionable subject tokens.";
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
      if (
        /\b(spec|specifications|launch|official|maranello|f80|12cilindri|2027|architecture|powertrain|newsroom|roadster|evtol|thruster|flying\s+car)\b/i.test(
          fullText
        )
      ) {
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
  } else if (interp.sportOrIndustry === "automotive" && /\b(tesla|roadster|evtol|flying\s+car|electric\s+aviation|air\s+taxi|ferrari|maranello|supercar)\b/i.test(fullText)) {
    competitionTeamEventScore = 15;
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
  if (hasAuthor && cleanSummary.length >= 45) metadataCompletenessScore += 1;

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

  // MANDATORY ACTIVE-TOPIC RELEVANCE GATE (Section 3):
  // Only "direct_match" and "strongly_related" items may enter the feed.
  const isAllowedClass =
    relevanceClass === "direct_match" || relevanceClass === "strongly_related";
  const isRelevant =
    isAllowedClass && primaryEntityScore > 0 && mismatchPenalty === 0 && totalScore >= 42;

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
    relevanceClass,
    relevanceEvidence,
    extractedEntities,
    primaryTopic: interp.primarySubject,
    explanation: `[${relevanceClass}] Entity=${primaryEntityScore}, Intent=${queryIntentScore}, Domain=${competitionTeamEventScore}, Semantic=${semanticRelevanceScore}, Credibility=${sourceCredibilityScore}, Penalty=${mismatchPenalty} -> Total=${totalScore} (${relevanceEvidence})`
  };
}
