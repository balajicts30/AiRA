// ============================================================================
// CENTRAL AI SKILL ORCHESTRATION LAYER (SECTION 11)
// Selectively activates and coordinates the 9 AiRA development skills based on
// query intent, domain context, and task requirements without overhead.
// ============================================================================

export type AiRASkillId =
  | "aira-search-intelligence"
  | "aira-content-discovery"
  | "aira-relevance-filtering"
  | "aira-source-intelligence"
  | "aira-feed-ranking"
  | "aira-media-discovery"
  | "aira-live-event-intelligence"
  | "aira-conversation-context"
  | "aira-search-quality-assurance";

export interface SkillMetadata {
  id: AiRASkillId;
  name: string;
  description: string;
  activationCondition: string;
  category: "core_search" | "content_curation" | "specialist" | "conversation" | "qa";
}

export const AIRA_SKILL_REGISTRY: readonly SkillMetadata[] = [
  {
    id: "aira-search-intelligence",
    name: "AiRA Search Intelligence",
    description: "Universal query understanding, open-world entity extraction, and query expansion.",
    activationCondition: "Every incoming search query.",
    category: "core_search"
  },
  {
    id: "aira-content-discovery",
    name: "AiRA Content Discovery",
    description: "Multi-provider retrieval, candidate normalization, and resilient provider fallback.",
    activationCondition: "When collecting search candidates from external or ecosystem providers.",
    category: "core_search"
  },
  {
    id: "aira-relevance-filtering",
    name: "AiRA Relevance Filtering",
    description: "Feedly-style 8-factor relevance scoring, intent-adaptive weights, and hard rejection gates.",
    activationCondition: "When evaluating candidate items for admission to the social discovery feed.",
    category: "content_curation"
  },
  {
    id: "aira-source-intelligence",
    name: "AiRA Source Intelligence",
    description: "Source governance, trust tiering, social media denylist, and SSRF/spoof defense.",
    activationCondition: "When validating URLs, domains, and publisher provenance.",
    category: "content_curation"
  },
  {
    id: "aira-feed-ranking",
    name: "AiRA Feed Ranking",
    description: "Adaptive ranking, cross-publisher story clustering, and content diversity balancing.",
    activationCondition: "During feed assembly and story deduplication.",
    category: "content_curation"
  },
  {
    id: "aira-media-discovery",
    name: "AiRA Media Discovery",
    description: "Authentic image/video discovery, media-specific relevance, and aspect ratio formatting.",
    activationCondition: "When user intent includes photos, videos, or visual feed assembly.",
    category: "content_curation"
  },
  {
    id: "aira-live-event-intelligence",
    name: "AiRA Live Event Intelligence",
    description: "Specialist live sports routing, event matchup resolution, and anti-contamination.",
    activationCondition: "When query domain is sports or live event status.",
    category: "specialist"
  },
  {
    id: "aira-conversation-context",
    name: "AiRA Conversation Context",
    description: "Multi-turn context retention, follow-up intent resolution, and context isolation.",
    activationCondition: "When a query occurs within an existing conversational session.",
    category: "conversation"
  },
  {
    id: "aira-search-quality-assurance",
    name: "AiRA Search Quality Assurance",
    description: "Automated regression testing, precision benchmarking, and quality metrics reporting.",
    activationCondition: "During build verification, CI/CD, or automated quality auditing.",
    category: "qa"
  }
];

export interface ActiveSkillPlan {
  query: string;
  activeSkillIds: AiRASkillId[];
  rationale: string[];
}

/**
 * Determines the minimal, sufficient set of AI skills required for a given query or task.
 * Avoids executing unneeded specialist skills (e.g. live sports skill on a cooking query).
 */
export function planActiveSkills(params: {
  query: string;
  isFollowUp?: boolean;
  isSportsDomain?: boolean;
  isMediaRequested?: boolean;
  isTestExecution?: boolean;
}): ActiveSkillPlan {
  const { query, isFollowUp, isSportsDomain, isMediaRequested, isTestExecution } = params;
  const activeIds: AiRASkillId[] = [
    "aira-search-intelligence",
    "aira-content-discovery",
    "aira-source-intelligence",
    "aira-relevance-filtering",
    "aira-feed-ranking"
  ];
  const rationale: string[] = [
    "Core search intelligence, discovery, source governance, relevance, and ranking are always active."
  ];

  if (isFollowUp) {
    activeIds.push("aira-conversation-context");
    rationale.push("Activated aira-conversation-context: query is a follow-up turn in an active session.");
  }

  if (isSportsDomain) {
    activeIds.push("aira-live-event-intelligence");
    rationale.push("Activated aira-live-event-intelligence: query requires specialist sports/event data routing.");
  }

  if (isMediaRequested) {
    activeIds.push("aira-media-discovery");
    rationale.push("Activated aira-media-discovery: query requested photos, vlogs, or media-specific filtering.");
  }

  if (isTestExecution) {
    activeIds.push("aira-search-quality-assurance");
    rationale.push("Activated aira-search-quality-assurance: executing regression test harness.");
  }

  return {
    query,
    activeSkillIds: activeIds,
    rationale
  };
}
