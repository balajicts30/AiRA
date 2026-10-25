// ============================================================================
// PHASE 3 & PHASE 8: QUERY UNDERSTANDING, ENTITY DISAMBIGUATION,
// SPORTS ABBREVIATION RESOLUTION & CONVERSATIONAL FOLLOW-UP INTERPRETER
// ============================================================================

import { isBreakingNewsIntent, isHistoricalQueryIntent } from "./freshnessPolicy";
import {
  ContentCategory,
  ConversationReferenceResolution,
  ConversationSessionState,
  DetailedUserIntent,
  EntityClassificationType,
  QueryInterpretation,
  ResolvedEntity,
  SportOrIndustryDomain
} from "./types";

interface KnowledgeBaseEntitySpec {
  canonicalName: string;
  aliases: string[];
  contextualAbbreviations?: string[]; // Only matched when domain context (e.g. cricket/matchup) is active
  entityType: EntityClassificationType;
  sportOrIndustry: SportOrIndustryDomain;
  countryOrRegion?: string;
  abbreviation?: string;
  flag?: string;
  parentOrganization?: string;
  isMultiFacet?: boolean;
  facets?: string[];
}

export const ENTITY_KNOWLEDGE_BASE: readonly KnowledgeBaseEntitySpec[] = [
  // ==========================================================================
  // CRICKET TEAMS & NATIONAL BOARDS (Context-Aware Abbreviations)
  // ==========================================================================
  {
    canonicalName: "South Africa",
    aliases: ["south africa", "proteas", "cricket south africa", "south african cricket"],
    contextualAbbreviations: ["sa", "rsa"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "ZA",
    abbreviation: "SA",
    flag: "🇿🇦",
    parentOrganization: "Cricket South Africa (CSA)"
  },
  {
    canonicalName: "Australia",
    aliases: ["australia", "aussies", "cricket australia", "baggy greens", "australian cricket"],
    contextualAbbreviations: ["aus"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "AU",
    abbreviation: "AUS",
    flag: "🇦🇺",
    parentOrganization: "Cricket Australia (CA)"
  },
  {
    canonicalName: "India",
    aliases: ["india", "team india", "men in blue", "indian cricket", "bcci"],
    contextualAbbreviations: ["ind"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "IN",
    abbreviation: "IND",
    flag: "🇮🇳",
    parentOrganization: "BCCI"
  },
  {
    canonicalName: "England",
    aliases: ["england", "england cricket", "ecb", "three lions"],
    contextualAbbreviations: ["eng"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "UK",
    abbreviation: "ENG",
    flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
    parentOrganization: "England and Wales Cricket Board"
  },
  {
    canonicalName: "New Zealand",
    aliases: ["new zealand", "blackcaps", "black caps", "nz cricket"],
    contextualAbbreviations: ["nz"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "NZ",
    abbreviation: "NZ",
    flag: "🇳🇿",
    parentOrganization: "New Zealand Cricket"
  },
  {
    canonicalName: "Pakistan",
    aliases: ["pakistan", "pakistan cricket", "pcb", "shaheens"],
    contextualAbbreviations: ["pak"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "PK",
    abbreviation: "PAK",
    flag: "🇵🇰",
    parentOrganization: "Pakistan Cricket Board"
  },
  {
    canonicalName: "West Indies",
    aliases: ["west indies", "windies", "cricket west indies"],
    contextualAbbreviations: ["wi"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "Global",
    abbreviation: "WI",
    flag: "🌴",
    parentOrganization: "Cricket West Indies"
  },
  {
    canonicalName: "Sri Lanka",
    aliases: ["sri lanka", "sri lanka cricket", "slc"],
    contextualAbbreviations: ["sl"],
    entityType: "team",
    sportOrIndustry: "cricket",
    countryOrRegion: "LK",
    abbreviation: "SL",
    flag: "🇱🇰",
    parentOrganization: "Sri Lanka Cricket"
  },

  // ==========================================================================
  // CRICKET ATHLETES, COMPETITIONS & VENUES
  // ==========================================================================
  {
    canonicalName: "Indian Premier League",
    aliases: ["indian premier league", "ipl", "tata ipl"],
    entityType: "competition",
    sportOrIndustry: "cricket",
    countryOrRegion: "IN",
    abbreviation: "IPL"
  },
  {
    canonicalName: "ICC Cricket World Cup",
    aliases: ["cricket world cup", "t20 world cup", "odi world cup", "world test championship", "wtc", "icc"],
    contextualAbbreviations: ["wc"],
    entityType: "competition",
    sportOrIndustry: "cricket",
    countryOrRegion: "Global",
    abbreviation: "CWC"
  },
  {
    canonicalName: "Jasprit Bumrah",
    aliases: ["bumrah", "jasprit bumrah"],
    entityType: "athlete",
    sportOrIndustry: "cricket",
    countryOrRegion: "IN",
    parentOrganization: "India"
  },
  {
    canonicalName: "Suryakumar Yadav",
    aliases: ["suryakumar yadav", "suryakumar", "sky yadav"],
    entityType: "athlete",
    sportOrIndustry: "cricket",
    countryOrRegion: "IN",
    parentOrganization: "India"
  },
  {
    canonicalName: "Aiden Markram",
    aliases: ["aiden markram", "markram"],
    entityType: "athlete",
    sportOrIndustry: "cricket",
    countryOrRegion: "ZA",
    parentOrganization: "South Africa"
  },
  {
    canonicalName: "Kagiso Rabada",
    aliases: ["kagiso rabada", "rabada"],
    entityType: "athlete",
    sportOrIndustry: "cricket",
    countryOrRegion: "ZA",
    parentOrganization: "South Africa"
  },
  {
    canonicalName: "Travis Head",
    aliases: ["travis head"],
    entityType: "athlete",
    sportOrIndustry: "cricket",
    countryOrRegion: "AU",
    parentOrganization: "Australia"
  },
  {
    canonicalName: "Pat Cummins",
    aliases: ["pat cummins", "cummins"],
    entityType: "athlete",
    sportOrIndustry: "cricket",
    countryOrRegion: "AU",
    parentOrganization: "Australia"
  },
  {
    canonicalName: "M.A. Chidambaram Stadium (Chepauk)",
    aliases: ["chepauk", "chidambaram stadium", "chennai stadium"],
    entityType: "place",
    sportOrIndustry: "cricket",
    countryOrRegion: "IN"
  },

  // ==========================================================================
  // FORMULA 1, SCUDERIA FERRARI & AUTOMOTIVE BRANDS (Multi-Facet Entities)
  // ==========================================================================
  {
    canonicalName: "Ferrari",
    aliases: ["ferrari", "maranello", "ferrari spa", "prancing horse", "ferrari f80", "ferrari 12cilindri", "sf90"],
    entityType: "brand",
    sportOrIndustry: "automotive",
    countryOrRegion: "IT",
    abbreviation: "FER",
    flag: "🐎",
    isMultiFacet: true,
    facets: [
      "Scuderia Ferrari Formula 1",
      "Ferrari Road Cars & Supercars",
      "Ferrari Product Launches & Maranello Engineering",
      "Ferrari Corporate & Brand News",
      "Ferrari Drivers & Racing History"
    ]
  },
  {
    canonicalName: "Scuderia Ferrari",
    aliases: ["scuderia ferrari", "ferrari f1", "ferrari formula 1", "sf-25", "sf-26"],
    entityType: "constructor",
    sportOrIndustry: "formula1",
    countryOrRegion: "IT",
    abbreviation: "FER",
    flag: "🏎️",
    parentOrganization: "Ferrari"
  },
  {
    canonicalName: "Formula 1",
    aliases: ["formula 1", "formula one", "formula1", "f1", "grand prix", "fia formula 1"],
    entityType: "competition",
    sportOrIndustry: "formula1",
    countryOrRegion: "Global",
    abbreviation: "F1",
    flag: "🏁"
  },
  {
    canonicalName: "Charles Leclerc",
    aliases: ["charles leclerc", "leclerc"],
    entityType: "driver",
    sportOrIndustry: "formula1",
    countryOrRegion: "MC",
    abbreviation: "LEC",
    parentOrganization: "Scuderia Ferrari"
  },
  {
    canonicalName: "Lewis Hamilton",
    aliases: ["lewis hamilton", "hamilton"],
    entityType: "driver",
    sportOrIndustry: "formula1",
    countryOrRegion: "UK",
    abbreviation: "HAM",
    parentOrganization: "Scuderia Ferrari"
  },
  {
    canonicalName: "McLaren",
    aliases: ["mclaren", "mclaren f1", "lando norris", "norris", "oscar piastri"],
    entityType: "constructor",
    sportOrIndustry: "formula1",
    countryOrRegion: "UK",
    abbreviation: "MCL"
  },
  {
    canonicalName: "Red Bull Racing",
    aliases: ["red bull", "red bull racing", "max verstappen", "verstappen"],
    entityType: "constructor",
    sportOrIndustry: "formula1",
    countryOrRegion: "AT",
    abbreviation: "RBR"
  },

  // ==========================================================================
  // TECHNOLOGY, AI, SMARTPHONES, SCIENCE & TRAVEL
  // ==========================================================================
  {
    canonicalName: "Tesla",
    aliases: [
      "tesla",
      "tesla motors",
      "tesla roadster",
      "cybertruck",
      "model s",
      "model 3",
      "model y",
      "model x",
      "elon musk tesla"
    ],
    entityType: "brand",
    sportOrIndustry: "automotive",
    countryOrRegion: "US",
    abbreviation: "TSLA",
    flag: "⚡"
  },
  {
    canonicalName: "eVTOL & Electric Aviation",
    aliases: [
      "flying car",
      "flying cars",
      "evtol",
      "air taxi",
      "electric aircraft",
      "electric aviation",
      "vertical takeoff",
      "joby aviation",
      "archer aviation",
      "roadster thruster",
      "hover car"
    ],
    entityType: "product",
    sportOrIndustry: "automotive",
    countryOrRegion: "Global",
    flag: "🛩️"
  },
  {
    canonicalName: "Apple",
    aliases: ["apple", "iphone", "macbook", "ios", "m4", "apple newsroom"],
    entityType: "brand",
    sportOrIndustry: "consumer_tech",
    countryOrRegion: "US"
  },
  {
    canonicalName: "Samsung",
    aliases: ["samsung", "galaxy", "galaxy s25", "galaxy ultra"],
    entityType: "brand",
    sportOrIndustry: "consumer_tech",
    countryOrRegion: "KR"
  },
  {
    canonicalName: "Smartphone",
    aliases: ["smartphone", "smartphones", "flagship phone", "camera phone", "mobile phone"],
    entityType: "product",
    sportOrIndustry: "consumer_tech",
    countryOrRegion: "Global"
  },
  {
    canonicalName: "OpenAI",
    aliases: ["openai", "chatgpt", "gpt-4", "gpt-5", "ai agents"],
    entityType: "organization",
    sportOrIndustry: "software_ai",
    countryOrRegion: "US"
  },
  {
    canonicalName: "NVIDIA",
    aliases: ["nvidia", "blackwell", "tensorrt", "rtx", "cuda"],
    entityType: "organization",
    sportOrIndustry: "software_ai",
    countryOrRegion: "US"
  },
  {
    canonicalName: "Microsoft",
    aliases: ["microsoft", "typescript", "azure", "vs code"],
    entityType: "organization",
    sportOrIndustry: "software_ai",
    countryOrRegion: "US"
  },
  {
    canonicalName: "NASA",
    aliases: ["nasa", "artemis", "james webb", "lunar", "mars rover"],
    entityType: "organization",
    sportOrIndustry: "aerospace_science",
    countryOrRegion: "US"
  },
  {
    canonicalName: "Japan",
    aliases: ["japan", "kyoto", "tokyo", "kanazawa", "shinkansen", "mount fuji", "fuji", "jnto"],
    entityType: "place",
    sportOrIndustry: "travel",
    countryOrRegion: "JP"
  }
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasWordBoundaryMatch(text: string, term: string): boolean {
  const rx = new RegExp(`(?:^|[^a-z0-9])${escapeRegex(term.toLowerCase())}(?:$|[^a-z0-9])`, "i");
  return rx.test(text);
}

/**
 * Determines whether the query (or active conversation context) has sports/cricket matchup signals
 * so short abbreviations like "SA", "AUS", "IND", "ENG", "NZ", "PAK", "WI", "SL", "WC"
 * are resolved according to context rather than unconditional string substitution.
 */
export function hasCricketOrMatchupContext(
  rawQuery: string,
  priorState?: ConversationSessionState | null
): boolean {
  const lower = rawQuery.toLowerCase();
  if (
    /\b(cricket|t20|t20i|odi|test match|ipl|icc|bcci|proteas|aussies|baggy greens|wickets?|innings|overs?|run rate|scorecard|chepauk|centurion|wanderers)\b/.test(
      lower
    )
  ) {
    return true;
  }

  // Check if query is a "TEAM1 vs TEAM2" or "TEAM1 v TEAM2" matchup involving known cricket codes
  if (
    /\b(sa|rsa|aus|ind|eng|nz|pak|wi|sl|ban|afg|south africa|australia|india|england|new zealand|pakistan)\s+(?:vs?\.?|versus|against)\s+(sa|rsa|aus|ind|eng|nz|pak|wi|sl|ban|afg|south africa|australia|india|england|new zealand|pakistan)\b/i.test(
      lower
    )
  ) {
    return true;
  }

  const isExplicitSwitch =
    /^(?:now\s+show|switch\s+(?:to|gears:?)|instead\s+show|change\s+topic\s+to|new\s+topic:?)\b/i.test(
      lower.trim()
    );

  if (priorState && priorState.sportOrIndustry === "cricket" && !isExplicitSwitch) {
    return true;
  }

  return false;
}

/**
 * Detects whether the user's input is a conversational follow-up question referencing
 * the prior active topic, or a context switch to a brand-new topic.
 */
export function resolveConversationReference(
  rawQuery: string,
  explicitEntitiesInQuery: ResolvedEntity[],
  priorState?: ConversationSessionState | null
): ConversationReferenceResolution {
  if (!priorState || !priorState.currentTopic) {
    return {
      isFollowUp: false,
      isContextSwitch: false,
      referencedTopic: null,
      referencedEntities: [],
      referencedEventId: null
    };
  }

  const lower = rawQuery.trim().toLowerCase();

  // Explicit context-switch phrases: "Now show Ferrari", "Switch gears: ...", "What about Formula 1"
  const explicitSwitchPhrase =
    /^(?:now\s+show|switch\s+(?:to|gears:?)|instead\s+show|change\s+topic\s+to|new\s+topic:?)\b/i.test(
      lower
    );

  // Check if the query introduces a new primary entity that is NOT in the prior state's entities
  const priorCanonicalNames = new Set(
    priorState.resolvedEntities.map((e) => e.canonicalName.toLowerCase())
  );
  priorState.teamsOrCompetitors.forEach((t) => priorCanonicalNames.add(t.toLowerCase()));
  priorState.brandsOrProducts.forEach((b) => priorCanonicalNames.add(b.toLowerCase()));

  const hasNewUnrelatedEntity =
    explicitEntitiesInQuery.length > 0 &&
    explicitEntitiesInQuery.every(
      (ent) =>
        !priorCanonicalNames.has(ent.canonicalName.toLowerCase()) &&
        ent.sportOrIndustry !== priorState.sportOrIndustry
    );

  if (explicitSwitchPhrase || hasNewUnrelatedEntity) {
    return {
      isFollowUp: false,
      isContextSwitch: true,
      referencedTopic: null,
      referencedEntities: [],
      referencedEventId: null
    };
  }

  // Check if the user is switching to a different matchup within the same sport (e.g., IND vs AUS -> SA vs AUS)
  const newTeams = explicitEntitiesInQuery
    .filter((e) => e.entityType === "team")
    .map((e) => e.canonicalName);
  if (
    newTeams.length >= 2 &&
    priorState.teamsOrCompetitors.length >= 2 &&
    !newTeams.every((t) =>
      priorState.teamsOrCompetitors.some((pt) => pt.toLowerCase() === t.toLowerCase())
    )
  ) {
    return {
      isFollowUp: false,
      isContextSwitch: true,
      referencedTopic: null,
      referencedEntities: [],
      referencedEventId: null
    };
  }

  // Detect follow-up patterns (short questions, pronouns, score checks, next match, highlights, photos)
  const isLiveScoreFollowUp =
    /\b(what'?s?\s+the\s+score|score\s+now|current\s+score|live\s+score|who\s+is\s+winning|who\s+won|match\s+status|innings|overs)\b/i.test(
      lower
    );
  const isNextFixtureFollowUp =
    /\b(when\s+(?:is|does)\s+the\s+next\s+(?:match|game|race|session|fixture)|next\s+(?:match|fixture|race|game)|upcoming\s+(?:match|schedule|fixture)|schedule)\b/i.test(
      lower
    );
  const isHighlightsFollowUp =
    /\b(show\s+(?:me\s+)?highlights|highlights\s+too|watch\s+highlights|video\s+highlights|show\s+(?:me\s+)?videos?|show\s+(?:me\s+)?vlogs?|only\s+vlogs?)\b/i.test(
      lower
    );
  const isPhotosFollowUp =
    /\b(show\s+(?:me\s+)?photos?|show\s+(?:me\s+)?photologs?|only\s+photologs?|only\s+photos?|pictures|gallery)\b/i.test(
      lower
    );
  const isStandingsFollowUp =
    /\b(standings|points\s+table|rankings|series\s+status|leaderboard)\b/i.test(lower);
  const isDeepDiveFollowUp =
    /\b(tell\s+me\s+more|summarize\s+key\s+takeaways|more\s+details|explain|why\s+did\s+they|how\s+did\s+they|their|this\s+match|that\s+race)\b/i.test(
      lower
    );

  const isFollowUpTrigger =
    isLiveScoreFollowUp ||
    isNextFixtureFollowUp ||
    isHighlightsFollowUp ||
    isPhotosFollowUp ||
    isStandingsFollowUp ||
    isDeepDiveFollowUp ||
    (explicitEntitiesInQuery.length === 0 && lower.split(/\s+/).length <= 7);

  if (isFollowUpTrigger) {
    const followUpAction: ConversationReferenceResolution["followUpAction"] = isLiveScoreFollowUp
      ? "live_score"
      : isNextFixtureFollowUp
      ? "next_fixture"
      : isHighlightsFollowUp
      ? "highlights_video"
      : isPhotosFollowUp
      ? "photos"
      : isStandingsFollowUp
      ? "standings_results"
      : isDeepDiveFollowUp
      ? "deep_dive"
      : "general_followup";

    return {
      isFollowUp: true,
      isContextSwitch: false,
      referencedTopic: priorState.currentTopic,
      referencedEntities:
        priorState.teamsOrCompetitors.length > 0
          ? priorState.teamsOrCompetitors
          : priorState.resolvedEntities.map((e) => e.canonicalName),
      referencedEventId: priorState.relevantEventIds[0] || null,
      followUpAction
    };
  }

  // If the query mentions the exact same entity as the active conversation, maintain continuity
  const sharesActiveEntity = explicitEntitiesInQuery.some((e) =>
    priorCanonicalNames.has(e.canonicalName.toLowerCase())
  );
  if (sharesActiveEntity) {
    return {
      isFollowUp: true,
      isContextSwitch: false,
      referencedTopic: priorState.currentTopic,
      referencedEntities: priorState.resolvedEntities.map((e) => e.canonicalName),
      referencedEventId: priorState.relevantEventIds[0] || null,
      followUpAction: "general_followup"
    };
  }

  return {
    isFollowUp: false,
    isContextSwitch: true,
    referencedTopic: null,
    referencedEntities: [],
    referencedEventId: null
  };
}

/**
 * Open-world heuristic entity extraction that dynamically resolves proper nouns,
 * comparisons, quoted terms, and technical acronyms without requiring a rigid, fixed list.
 */
export function extractOpenWorldEntities(
  rawQuery: string,
  domain: SportOrIndustryDomain = "general_discovery"
): ResolvedEntity[] {
  const query = rawQuery.trim();
  const entities: ResolvedEntity[] = [];
  const seen = new Set<string>();

  // 1. Quoted exact phrases (e.g. "James Webb Space Telescope")
  const quoteMatches = query.matchAll(/["']([^"']{3,50})["']/g);
  for (const m of quoteMatches) {
    const val = m[1].trim();
    if (val && !seen.has(val.toLowerCase())) {
      seen.add(val.toLowerCase());
      entities.push({
        canonicalName: val,
        matchedTerm: val,
        aliases: [val.toLowerCase()],
        entityType: "topic",
        sportOrIndustry: domain
      });
    }
  }

  // 2. Comparisons (e.g. "Rust vs Zig", "iPhone 16 vs Galaxy S25")
  const vsMatch = query.match(
    /^(?:compare\s+)?([A-Za-z0-9\s.-]{2,30})\s+(?:vs\.?|versus|compared\s+to)\s+([A-Za-z0-9\s.-]{2,30})/i
  );
  if (vsMatch) {
    const e1 = vsMatch[1].trim();
    const e2 = vsMatch[2].trim();
    [e1, e2].forEach((compEntity) => {
      if (compEntity && !seen.has(compEntity.toLowerCase())) {
        seen.add(compEntity.toLowerCase());
        entities.push({
          canonicalName: compEntity,
          matchedTerm: compEntity,
          aliases: [compEntity.toLowerCase()],
          entityType: "concept",
          sportOrIndustry: domain
        });
      }
    });
  }

  // 3. Proper noun / Title-cased phrases (e.g., "Quantum Computing", "French Revolution", "Ludwig van Beethoven")
  const hasMixedCasing = /[A-Z]/.test(query) && /[a-z]/.test(query);
  if (hasMixedCasing) {
    const titleMatches = query.match(
      /\b([A-Z][a-z0-9]+(?:\s+(?:of|the|de|van|von|in|and|for)\s+[A-Z][a-z0-9]+|\s+[A-Z][a-z0-9]+)*)\b/g
    );
    if (titleMatches) {
      for (const t of titleMatches) {
        const clean = t.trim();
        if (/^(What|How|Why|Where|When|Who|Show|Tell|Explain|Find|Explore|Which|Can|Could|Would)$/i.test(clean)) {
          continue;
        }
        if (clean.length >= 3 && !seen.has(clean.toLowerCase())) {
          seen.add(clean.toLowerCase());
          entities.push({
            canonicalName: clean,
            matchedTerm: clean,
            aliases: [clean.toLowerCase()],
            entityType: "topic",
            sportOrIndustry: domain
          });
        }
      }
    }
  }

  // 4. Acronyms & technical tokens (e.g. "CRISPR", "LLM", "mRNA", "eVTOL", "GPU", "JWST")
  const acronymMatches = query.match(/\b([A-Z]{2,6})\b/g);
  if (acronymMatches) {
    for (const ac of acronymMatches) {
      if (ac.length >= 2 && !seen.has(ac.toLowerCase())) {
        seen.add(ac.toLowerCase());
        entities.push({
          canonicalName: ac,
          matchedTerm: ac,
          aliases: [ac.toLowerCase()],
          entityType: "concept",
          sportOrIndustry: domain
        });
      }
    }
  }

  return entities;
}

/**
 * Universal open-world domain classifier covering sports, technology, science,
 * arts, culinary, politics, business, finance, health, and philosophy.
 */
export function classifyOpenWorldDomain(query: string): SportOrIndustryDomain {
  const lower = query.toLowerCase();

  // Sports
  if (/\b(cricket|t20i?|odi|test\s+match|wicket|bcci|csa|cricinfo|proteas|baggy greens)\b/i.test(lower)) {
    return "cricket";
  }
  if (/\b(f1|formula\s*1|grand\s+prix|scuderia|leclerc|verstappen|hamilton|imola|monza)\b/i.test(lower)) {
    return "formula1";
  }
  if (/\b(soccer|premier\s+league|champions\s+league|fifa|uefa|messi|ronaldo|arsenal|barcelona)\b/i.test(lower)) {
    return "soccer";
  }
  if (/\b(nba|basketball|lakers|celtics|warriors|dunk)\b/i.test(lower)) {
    return "basketball";
  }
  if (/\b(nfl|super\s+bowl|touchdown|quarterback|chiefs|eagles)\b/i.test(lower)) {
    return "football";
  }
  if (/\b(tennis|wimbledon|atp|wta|djokovic|alcaraz|sinner)\b/i.test(lower)) {
    return "tennis";
  }

  // Automotive & Transportation
  if (
    /\b(car|cars|supercar|hypercar|ferrari|tesla|evtol|flying\s+car|air\s+taxi|aviation|electric\s+vehicle|porsche|bmw|engine|powertrain|roadster|cybertruck)\b/i.test(
      lower
    )
  ) {
    return "automotive";
  }

  // Technology, Software & AI
  if (
    /\b(ai|llm|gpt|openai|anthropic|machine\s+learning|software|typescript|react|python|rust|zig|compiler|cloud|api|database|gpu|nvidia|hardware|chip|semiconductor|cybersecurity|sdk)\b/i.test(
      lower
    )
  ) {
    return "software_ai";
  }
  if (
    /\b(smartphone|iphone|samsung|galaxy|laptop|gadget|camera\s+lens|wearable|macbook)\b/i.test(lower)
  ) {
    return "consumer_tech";
  }

  // Science, Space & Archaeology
  if (
    /\b(quantum|physics|nasa|space|spacex|starship|astronomy|telescope|mars|lunar|biology|chemistry|crispr|genetics|dna|archaeology|archaeological|fossil|neuroscience|planet|black\s+hole|qubit|superconducting)\b/i.test(
      lower
    )
  ) {
    return "science";
  }

  // Health, Nutrition & Medicine
  if (
    /\b(health|medicine|vaccine|disease|cancer|clinical|nutrition|diet|fitness|mental\s+health|therapy|hospital|symptoms|biomedical)\b/i.test(
      lower
    )
  ) {
    return "health";
  }

  // Finance, Economics & Markets
  if (
    /\b(market|stock|stocks|economy|inflation|interest\s+rate|central\s+bank|federal\s+reserve|crypto|bitcoin|trading|investing|gdp|recession|venture\s+capital|bonds|wall\s+street)\b/i.test(
      lower
    )
  ) {
    return "finance";
  }

  // Food, Cooking & Culinary
  if (
    /\b(recipe|cooking|culinary|food|baking|sourdough|fermentation|chef|restaurant|pastry|gastronomy|cuisine|ingredients|michelin|dish)\b/i.test(
      lower
    )
  ) {
    return "food";
  }

  // Travel, Geography & Tourism
  if (
    /\b(travel|destination|tourism|hotel|flight|itinerary|resort|hiking|kyoto|tokyo|paris|rome|bali|shinkansen|geography|monument|attraction)\b/i.test(
      lower
    )
  ) {
    return "travel";
  }

  // Politics & World Affairs
  if (
    /\b(election|politics|government|president|parliament|congress|diplomacy|treaty|geopolitics|minister|senate|policy|democracy|legislation)\b/i.test(
      lower
    )
  ) {
    return "politics";
  }

  // Culture, History & Arts
  if (
    /\b(art|museum|painting|exhibition|history|ancient|roman|greek|medieval|renaissance|sculpture|philosophy|literature|poetry|architecture|opera|orchestra)\b/i.test(
      lower
    )
  ) {
    return "culture";
  }

  // Entertainment, Movies & Music
  if (
    /\b(movie|film|cinema|music|album|song|concert|actor|actress|hollywood|series|streaming|theatre|oscar|grammy|director)\b/i.test(
      lower
    )
  ) {
    return "entertainment";
  }

  // Gaming
  if (/\b(game|gaming|esports|playstation|xbox|nintendo|steam|rpg|gameplay|fps|modding)\b/i.test(lower)) {
    return "gaming";
  }

  // Environment & Sustainability
  if (
    /\b(climate|environment|sustainability|renewable|solar|wind|biodiversity|ecology|carbon|conservation|wildlife|microgrid)\b/i.test(
      lower
    )
  ) {
    return "environment";
  }

  // Education & Academic
  if (
    /\b(education|university|college|school|curriculum|teaching|student|academic|scholarship|pedagogy|dissertation|peer-reviewed)\b/i.test(
      lower
    )
  ) {
    return "education";
  }

  return "general_discovery";
}

/**
 * PHASE 3: Structured Query Understanding & Entity Resolution Engine
 */
export function interpretSearchQuery(
  rawQuery: string,
  priorConversationState?: ConversationSessionState | null
): QueryInterpretation {
  const originalQuery = (rawQuery || "").trim();
  const lower = originalQuery.toLowerCase();
  const cricketContextActive = hasCricketOrMatchupContext(originalQuery, priorConversationState);

  // 1. Extract explicit named entities from the raw query (Knowledge Base + Open World)
  const matchedEntities: ResolvedEntity[] = [];
  const seenCanonicals = new Set<string>();

  for (const spec of ENTITY_KNOWLEDGE_BASE) {
    let matchedTerm: string | null = null;

    for (const alias of spec.aliases) {
      if (hasWordBoundaryMatch(lower, alias)) {
        matchedTerm = alias;
        break;
      }
    }

    if (!matchedTerm && spec.contextualAbbreviations && cricketContextActive) {
      for (const abbr of spec.contextualAbbreviations) {
        if (hasWordBoundaryMatch(lower, abbr)) {
          matchedTerm = abbr.toUpperCase();
          break;
        }
      }
    }

    if (matchedTerm && !seenCanonicals.has(spec.canonicalName.toLowerCase())) {
      seenCanonicals.add(spec.canonicalName.toLowerCase());
      matchedEntities.push({
        canonicalName: spec.canonicalName,
        matchedTerm,
        aliases: spec.aliases,
        entityType: spec.entityType,
        sportOrIndustry: spec.sportOrIndustry,
        countryOrRegion: spec.countryOrRegion,
        abbreviation: spec.abbreviation,
        flag: spec.flag,
        parentOrganization: spec.parentOrganization
      });
    }
  }

  // Open-World Entity Extraction for queries without pre-indexed KB entities
  const initialDomain = classifyOpenWorldDomain(originalQuery);
  const openWorldEntities = extractOpenWorldEntities(originalQuery, initialDomain);
  for (const owe of openWorldEntities) {
    if (!seenCanonicals.has(owe.canonicalName.toLowerCase())) {
      seenCanonicals.add(owe.canonicalName.toLowerCase());
      matchedEntities.push(owe);
    }
  }

  // 2. Resolve conversational continuity vs context switching (Phase 8)
  const conversationReference = resolveConversationReference(
    originalQuery,
    matchedEntities,
    priorConversationState
  );

  // Merge inherited entities when this is a follow-up question
  const effectiveEntities: ResolvedEntity[] = [...matchedEntities];
  if (conversationReference.isFollowUp && priorConversationState) {
    for (const priorEnt of priorConversationState.resolvedEntities) {
      if (!effectiveEntities.some((e) => e.canonicalName === priorEnt.canonicalName)) {
        effectiveEntities.push(priorEnt);
      }
    }
  }

  // 3. Disambiguate "Ferrari" broad query vs "Ferrari F1 / Ferrari F1 live" specific query (Phase 3)
  const hasExplicitF1Cue =
    /\b(f1|formula\s*1|formula1|grand\s+prix|qualifying|paddock|scuderia|leclerc|hamilton|race|pit\s+stop|telemetry)\b/i.test(
      lower
    );
  const hasFerrariEntity = effectiveEntities.some(
    (e) => e.canonicalName === "Ferrari" || e.canonicalName === "Scuderia Ferrari"
  );

  let isBroadMultiFacetEntity = false;
  let facets: string[] = [];

  if (hasFerrariEntity) {
    if (
      !hasExplicitF1Cue &&
      !/\b(road\s+car|supercar|f80|12cilindri|sf90|maranello\s+factory|stock|earnings)\b/i.test(lower)
    ) {
      // Broad "Ferrari" search: covers Scuderia Ferrari F1 + Road Cars + Product Launches + Brand News + Drivers
      isBroadMultiFacetEntity = true;
      facets = [
        "Scuderia Ferrari Formula 1",
        "Ferrari Road Cars & Supercars",
        "Ferrari Product Launches & Maranello Engineering",
        "Ferrari Corporate & Brand News",
        "Ferrari Drivers & Racing History"
      ];
    } else if (hasExplicitF1Cue) {
      if (!effectiveEntities.some((e) => e.canonicalName === "Scuderia Ferrari")) {
        effectiveEntities.push({
          canonicalName: "Scuderia Ferrari",
          matchedTerm: "Ferrari F1",
          aliases: ["scuderia ferrari", "ferrari f1"],
          entityType: "constructor",
          sportOrIndustry: "formula1",
          countryOrRegion: "IT",
          abbreviation: "FER",
          flag: "🏎️"
        });
      }
      if (!effectiveEntities.some((e) => e.canonicalName === "Formula 1")) {
        effectiveEntities.push({
          canonicalName: "Formula 1",
          matchedTerm: "F1",
          aliases: ["formula 1", "f1", "grand prix"],
          entityType: "competition",
          sportOrIndustry: "formula1",
          countryOrRegion: "Global",
          abbreviation: "F1",
          flag: "🏁"
        });
      }
    }
  }

  // 4. Determine Sport or Industry domain
  let sportOrIndustry: SportOrIndustryDomain = initialDomain;
  if (
    (!conversationReference.isContextSwitch && cricketContextActive) ||
    effectiveEntities.some((e) => e.sportOrIndustry === "cricket")
  ) {
    sportOrIndustry = "cricket";
  } else if (
    hasExplicitF1Cue ||
    effectiveEntities.some((e) => e.sportOrIndustry === "formula1")
  ) {
    sportOrIndustry = "formula1";
  } else if (isBroadMultiFacetEntity && hasFerrariEntity) {
    sportOrIndustry = "automotive";
  } else if (conversationReference.isFollowUp && priorConversationState) {
    sportOrIndustry = priorConversationState.sportOrIndustry;
  }
  } else if (/\b(market|stocks|economy|inflation|earnings|central bank|fed|bond|finance)\b/i.test(lower)) {
    sportOrIndustry = "finance";
  } else if (conversationReference.isFollowUp && priorConversationState) {
    sportOrIndustry = priorConversationState.sportOrIndustry;
  }

  // 5. Extract Teams/Competitors, Brands/Products, People, Organizations, Competition
  const teamsOrCompetitors = Array.from(
    new Set([
      ...effectiveEntities
        .filter((e) => e.entityType === "team" || e.entityType === "constructor" || e.entityType === "driver")
        .map((e) => e.canonicalName),
      ...(conversationReference.isFollowUp && priorConversationState
        ? priorConversationState.teamsOrCompetitors
        : [])
    ])
  );

  const brandsOrProducts = Array.from(
    new Set(
      effectiveEntities
        .filter((e) => e.entityType === "brand" || e.entityType === "product")
        .map((e) => e.canonicalName)
    )
  );

  const peopleOrCreators = Array.from(
    new Set(
      effectiveEntities
        .filter((e) => e.entityType === "athlete" || e.entityType === "driver" || e.entityType === "person")
        .map((e) => e.canonicalName)
    )
  );

  const organizations = Array.from(
    new Set(
      effectiveEntities
        .filter((e) => e.entityType === "organization")
        .map((e) => e.canonicalName)
    )
  );

  let competitionOrEvent: string | null =
    effectiveEntities.find((e) => e.entityType === "competition")?.canonicalName || null;

  if (!competitionOrEvent) {
    if (sportOrIndustry === "cricket") {
      if (teamsOrCompetitors.includes("South Africa") && teamsOrCompetitors.includes("Australia")) {
        competitionOrEvent = "South Africa vs Australia International Cricket Series";
      } else if (teamsOrCompetitors.includes("India") && teamsOrCompetitors.includes("Australia")) {
        competitionOrEvent = "India vs Australia T20I Series";
      } else {
        competitionOrEvent = "International Cricket";
      }
    } else if (sportOrIndustry === "formula1") {
      competitionOrEvent = "FIA Formula 1 World Championship";
    } else if (conversationReference.isFollowUp && priorConversationState?.competitionOrEvent) {
      competitionOrEvent = priorConversationState.competitionOrEvent;
    }
  }

  // 6. Classify User Intent (14 required intent categories in Phase 3)
  let userIntent: DetailedUserIntent = "broad_topic_discovery";
  let requestedContentType: QueryInterpretation["requestedContentType"] = "all";

  if (/\b(only|just)\s+(photo|photos|photolog|photologs|pictures|images)\b/i.test(lower)) {
    requestedContentType = "photologs";
  } else if (/\b(only|just)\s+(vlog|vlogs|video|videos|reels|highlights)\b/i.test(lower)) {
    requestedContentType = "vlogs";
  } else if (/\b(only|just)\s+(blog|blogs|article|articles|news|essays)\b/i.test(lower)) {
    requestedContentType = "articles";
  }

  if (conversationReference.isFollowUp) {
    if (conversationReference.followUpAction === "live_score") {
      userIntent = "live_event_or_score";
      requestedContentType = "live_scorecard";
    } else if (conversationReference.followUpAction === "next_fixture") {
      userIntent = "fixtures_and_schedules";
      requestedContentType = "fixtures";
    } else if (conversationReference.followUpAction === "highlights_video") {
      userIntent = "photos_and_videos";
      requestedContentType = "vlogs";
    } else if (conversationReference.followUpAction === "photos") {
      userIntent = "photos_and_videos";
      requestedContentType = "photologs";
    } else if (conversationReference.followUpAction === "standings_results") {
      userIntent = "results_and_standings";
      requestedContentType = "standings";
    } else {
      userIntent = "follow_up_question";
    }
  } else if (
    /\b(live|live\s+score|score\s+now|right\s+now|in\s+progress|live\s+timing|race\s+control)\b/i.test(lower)
  ) {
    userIntent = "live_event_or_score";
  } else if (
    /\b(next\s+match|upcoming|fixture|fixtures|schedule|when\s+is|when\s+does|start\s+time|calendar)\b/i.test(
      lower
    )
  ) {
    userIntent = "fixtures_and_schedules";
    requestedContentType = "fixtures";
  } else if (
    /\b(standings|points\s+table|rankings|who\s+won|result|results|scorecard|classification)\b/i.test(lower)
  ) {
    userIntent = "results_and_standings";
  } else if (
    /\b(highlights|video|videos|vlog|vlogs|photo|photos|photolog|photologs|gallery|onboard)\b/i.test(lower)
  ) {
    userIntent = "photos_and_videos";
  } else if (isHistoricalQueryIntent(originalQuery)) {
    userIntent = "historical_information";
  } else if (isBreakingNewsIntent(originalQuery)) {
    userIntent = "breaking_news";
  } else if (/\b(review|reviews|comparison|compare|blind\s+test|benchmark|hands-on|lab\s+test)\b/i.test(lower)) {
    userIntent = "reviews_and_comparisons";
  } else if (
    /\b(spec|specs|specifications|2027\s+car|2026\s+car|architecture|powertrain|features|price|flying\s+car|evtol|roadster)\b/i.test(
      lower
    )
  ) {
    userIntent = "product_information";
  } else if (
    brandsOrProducts.length > 0 &&
    /\b(launch|announcement|press\s+release|company|corporate|maranello|newsroom)\b/i.test(lower)
  ) {
    userIntent = "brand_news";
  } else if (/\b(analysis|explainer|tactical|deep\s+dive|essay|article|articles)\b/i.test(lower)) {
    userIntent = "articles_and_analysis";
  } else if (/\b(latest|news|update|updates|today)\b/i.test(lower)) {
    userIntent = "latest_news";
  } else if (isBroadMultiFacetEntity) {
    userIntent = "broad_topic_discovery";
  }

  // 7. Determine Time Sensitivity
  const timeSensitivity: QueryInterpretation["timeSensitivity"] =
    userIntent === "live_event_or_score"
      ? "live"
      : userIntent === "breaking_news"
      ? "breaking"
      : userIntent === "fixtures_and_schedules"
      ? "upcoming"
      : userIntent === "historical_information"
      ? "historical"
      : sportOrIndustry === "travel"
      ? "evergreen"
      : "recent";

  // 8. Extract Primary Subject & Normalized Query
  const hasTeslaFlyingCarCompound =
    /\btesla\b/i.test(lower) &&
    /\b(flying\s+cars?|evtol|hover|roadster|thruster|aircraft|aviation|air\s+taxi)\b/i.test(lower);

  let primarySubject = "";
  if (sportOrIndustry === "cricket" && teamsOrCompetitors.length >= 2) {
    primarySubject = `${teamsOrCompetitors[0]} vs ${teamsOrCompetitors[1]} Cricket`;
  } else if (hasTeslaFlyingCarCompound) {
    primarySubject = "Tesla Flying Car";
  } else if (hasFerrariEntity && hasExplicitF1Cue) {
    primarySubject = userIntent === "live_event_or_score" ? "Scuderia Ferrari F1 Live" : "Scuderia Ferrari Formula 1";
  } else if (hasFerrariEntity && isBroadMultiFacetEntity) {
    primarySubject = "Ferrari";
  } else if (conversationReference.isFollowUp && priorConversationState?.primarySubject) {
    primarySubject = priorConversationState.primarySubject;
  } else if (effectiveEntities.length > 0) {
    primarySubject = effectiveEntities.map((e) => e.canonicalName).slice(0, 2).join(" & ");
  } else {
    const cleaned = originalQuery
      .replace(/^(hi|hey|hello|aira|now\s+show|show\s+me|tell\s+me\s+about|what\s+happened\s+with|switch\s+to)[,\s!]*/i, "")
      .replace(/\b(only|just)\s+(photologs?|photos?|vlogs?|videos?|blogs?|articles?)\b/gi, "")
      .replace(/[?!.]+$/g, "")
      .trim();
    primarySubject = cleaned || originalQuery;
  }

  const normalizedQuery =
    sportOrIndustry === "cricket" && teamsOrCompetitors.length >= 2
      ? `${teamsOrCompetitors[0]} vs ${teamsOrCompetitors[1]} cricket ${
          userIntent === "live_event_or_score"
            ? "live score"
            : userIntent === "fixtures_and_schedules"
            ? "next match schedule"
            : userIntent === "photos_and_videos"
            ? "highlights video"
            : ""
        }`.trim()
      : hasTeslaFlyingCarCompound
      ? "Tesla flying car Roadster eVTOL aviation"
      : conversationReference.isFollowUp && priorConversationState
      ? `${primarySubject} ${originalQuery
          .replace(/\b(what|are|is|its|their|the|when|does|show|me|tell)\b/gi, " ")
          .replace(/[?!.]+/g, "")
          .replace(/\s+/g, " ")
          .trim()}`.trim()
      : primarySubject;

  // 9. Extract Geographic Context & Explicit Date
  const geographicContext =
    effectiveEntities.find((e) => e.countryOrRegion && e.countryOrRegion !== "Global")?.countryOrRegion ||
    (/\b(chennai|bengaluru|india)\b/i.test(lower)
      ? "IN"
      : /\b(centurion|johannesburg|south africa)\b/i.test(lower)
      ? "ZA"
      : /\b(melbourne|sydney|australia)\b/i.test(lower)
      ? "AU"
      : /\b(maranello|imola|monza|italy)\b/i.test(lower)
      ? "IT"
      : /\b(kyoto|tokyo|kanazawa|japan)\b/i.test(lower)
      ? "JP"
      : null);

  const dateMatch = originalQuery.match(/\b(20\d\d|19\d\d|today|tonight|yesterday|last night|this weekend|friday|saturday|sunday)\b/i);
  const explicitDateOrRange = dateMatch ? dateMatch[0] : null;

  // 10. Generate Targeted Provider Queries for the Discovery Layer (Phase 2)
  const generatedProviderQueries = buildTargetedProviderQueries({
    primarySubject,
    normalizedQuery,
    sportOrIndustry,
    teamsOrCompetitors,
    isBroadMultiFacetEntity,
    userIntent
  });

  const primaryEntityType: EntityClassificationType =
    effectiveEntities[0]?.entityType || (teamsOrCompetitors.length >= 2 ? "competition" : "topic");

  const confidence =
    effectiveEntities.length > 0
      ? Math.min(0.98, 0.84 + effectiveEntities.length * 0.05)
      : conversationReference.isFollowUp
      ? 0.9
      : 0.76;

  const topicSlug = primarySubject
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const topicId = `topic-${topicSlug || "general"}`;
  const queryId = `qry-${topicSlug || "q"}-${originalQuery.length}-${userIntent}`;
  const searchSessionId = priorConversationState?.conversationId || `sess-${topicSlug || "init"}`;

  return {
    queryId,
    topicId,
    searchSessionId,
    originalQuery,
    normalizedQuery,
    primarySubject,
    namedEntities: effectiveEntities,
    entityType: primaryEntityType,
    sportOrIndustry,
    teamsOrCompetitors,
    brandsOrProducts,
    peopleOrCreators,
    organizations,
    competitionOrEvent,
    requestedContentType,
    userIntent,
    timeSensitivity,
    geographicContext,
    explicitDateOrRange,
    conversationReference,
    isBroadMultiFacetEntity,
    facets,
    generatedProviderQueries,
    confidence: Number(confidence.toFixed(2)),
    clarificationNeeded: false,
    clarificationQuestion: null
  };
}

function buildTargetedProviderQueries(params: {
  primarySubject: string;
  normalizedQuery: string;
  sportOrIndustry: SportOrIndustryDomain;
  teamsOrCompetitors: string[];
  isBroadMultiFacetEntity: boolean;
  userIntent: DetailedUserIntent;
}): string[] {
  const {
    primarySubject,
    normalizedQuery,
    sportOrIndustry,
    teamsOrCompetitors,
    isBroadMultiFacetEntity,
    userIntent
  } = params;

  // Specific sports matchups
  if (sportOrIndustry === "cricket" && teamsOrCompetitors.length >= 2) {
    const [t1, t2] = teamsOrCompetitors;
    return [
      `${t1} vs ${t2} cricket`,
      `${t1} vs ${t2} live scorecard match report`,
      `${t1} vs ${t2} upcoming fixtures schedule`,
      `${t1} vs ${t2} cricket video highlights`
    ];
  }

  if (primarySubject.toLowerCase() === "tesla flying car") {
    return [
      "Tesla flying car Roadster SpaceX cold-gas thruster claims fact check",
      "Tesla official vehicle lineup vs flying car speculation",
      "eVTOL electric air taxi Joby Aviation Archer FAA certification analysis",
      "Tesla Roadster & electric aviation engineering video explainers"
    ];
  }

  if (isBroadMultiFacetEntity && primarySubject.toLowerCase() === "ferrari") {
    return [
      "Ferrari Maranello road cars supercar launch news",
      "Scuderia Ferrari Formula 1 team updates Leclerc Hamilton",
      "Ferrari official brand corporate news",
      "Ferrari photography and track video reviews"
    ];
  }

  if (sportOrIndustry === "formula1") {
    return [
      normalizedQuery,
      `${primarySubject} FIA Formula 1 Grand Prix session status`,
      `${primarySubject} F1 technical analysis & paddock photos`,
      `${primarySubject} F1 onboard video highlights`
    ];
  }

  if (userIntent === "live_event_or_score") {
    return [
      `${primarySubject} live score & official status`,
      `${primarySubject} match report & commentary`,
      `${primarySubject} video highlights`
    ];
  }

  // Comparisons (e.g., Rust vs Zig, iPhone 16 vs S25)
  if (userIntent === "reviews_and_comparisons" || /\b(vs|versus|compare)\b/i.test(normalizedQuery)) {
    return [
      normalizedQuery,
      `${primarySubject} detailed comparison analysis`,
      `${primarySubject} benchmarks specifications review`,
      `${primarySubject} comparison video breakdown`
    ];
  }

  // Science, Space & Research
  if (sportOrIndustry === "science" || sportOrIndustry === "aerospace_science") {
    return [
      normalizedQuery,
      `${primarySubject} scientific research paper discoveries`,
      `${primarySubject} official announcements & analysis`,
      `${primarySubject} photography visual explainer`
    ];
  }

  // Food & Culinary
  if (sportOrIndustry === "food") {
    return [
      normalizedQuery,
      `${primarySubject} authentic recipes and cooking techniques`,
      `${primarySubject} culinary history and ingredients`,
      `${primarySubject} food photography and guide`
    ];
  }

  // Travel & Culture
  if (sportOrIndustry === "travel" || sportOrIndustry === "culture") {
    return [
      normalizedQuery,
      `${primarySubject} cultural history and guide`,
      `${primarySubject} editorial photography and visual stories`,
      `${primarySubject} travel discoveries and documentary`
    ];
  }

  // Universal fallback: targeted query expansions preserving user intent
  return [
    normalizedQuery,
    `${primarySubject} official news announcements & reporting`,
    `${primarySubject} deep dive analysis & visual stories`,
    `${primarySubject} latest developments and overview`
  ];
}

export function validateQueryInterpretation(interp: QueryInterpretation): boolean {
  if (!interp || typeof interp.originalQuery !== "string") return false;
  if (!interp.normalizedQuery || !interp.primarySubject) return false;
  if (!Array.isArray(interp.namedEntities) || !Array.isArray(interp.generatedProviderQueries)) {
    return false;
  }
  if (typeof interp.confidence !== "number" || interp.confidence < 0 || interp.confidence > 1) {
    return false;
  }
  return true;
}

export function mapSportDomainToContentCategory(
  interp: QueryInterpretation
): ContentCategory {
  if (interp.isBroadMultiFacetEntity && interp.primarySubject.toLowerCase() === "ferrari") {
    return "brands"; // Broad Ferrari spans brands + sports + technology
  }
  switch (interp.sportOrIndustry) {
    case "cricket":
    case "formula1":
    case "soccer":
    case "basketball":
    case "football":
    case "tennis":
      return interp.userIntent === "live_event_or_score" ? "sports" : "sports";
    case "automotive":
    case "consumer_tech":
      return interp.userIntent === "reviews_and_comparisons" ? "technology" : "brands";
    case "software_ai":
      return "technology";
    case "aerospace_science":
    case "science":
      return "science";
    case "finance":
      return "finance";
    case "travel":
      return "travel";
    case "food":
      return "food";
    case "health":
      return "health";
    case "culture":
      return "culture";
    case "politics":
      return "politics";
    case "entertainment":
      return "entertainment";
    case "gaming":
      return "gaming";
    case "environment":
      return "environment";
    case "education":
      return "education";
    default:
      return "general_discovery";
  }
}
