// ============================================================================
// TRUSTED LIVE DATA SOURCING & CONTENT CURATION ENGINE — STANDARDIZED SCHEMAS
// ============================================================================

export type ContentCategory =
  | "sports"
  | "live_scores"
  | "news"
  | "technology"
  | "brands"
  | "science"
  | "government"
  | "education"
  | "entertainment"
  | "gaming"
  | "weather"
  | "finance"
  | "travel"
  | "culture"
  | "food"
  | "health"
  | "politics"
  | "business"
  | "lifestyle"
  | "environment"
  | "general_discovery"
  | (string & {});

export type SourceType =
  | "primary"
  | "official"
  | "broadcaster"
  | "news_publisher"
  | "technical_documentation"
  | "data_api"
  | "governing_body"
  | "research_organization";

export type SourceApprovalStatus =
  | "pending_review"
  | "approved"
  | "suspended"
  | "rejected"
  | "deprecated";

export type TrustTier = 1 | 2 | 3;

export type PermittedIngestionMethod =
  | "rss_atom"
  | "official_api"
  | "structured_scoreboard"
  | "release_feed"
  | "approved_discovery";

export type IntegrationHealthStatus = "healthy" | "degraded" | "unhealthy" | "disabled";

export type FreshnessStatus =
  | "live"
  | "fresh"
  | "recent"
  | "historical_valid"
  | "stale"
  | "unverified";

export type VerificationStatus =
  | "corroborated"
  | "single_source_verified"
  | "primary_official"
  | "unverified"
  | "rejected";

export type SportEventStatus =
  | "scheduled"
  | "live"
  | "halftime"
  | "innings_break"
  | "delayed"
  | "suspended"
  | "completed"
  | "abandoned"
  | "postponed"
  | "unavailable";

export interface SourceRegistryRecord {
  id: string;
  publisherName: string;
  canonicalDomain: string;
  approvedSubdomains: string[]; // e.g., ["www", "feeds", "api", "news", "blog", "developer"]
  category: ContentCategory;
  secondaryCategories?: ContentCategory[];
  sourceType: SourceType;
  approvalStatus: SourceApprovalStatus;
  geographicCoverage: string[];
  competitionCoverage?: string[];
  supportedLanguages: string[];
  permittedIngestionMethods: PermittedIngestionMethod[];
  feedUrls?: string[];
  apiEndpoint?: string;
  requiresApiKey?: boolean;
  envVarName?: string;
  commercialLicensingNotes: string;
  trustTier: TrustTier;
  maxContentAgeMs: number;
  maxCacheDurationMs: number;
  lastSuccessfulRetrieval: string | null; // ISO 8601 UTC
  lastValidationTime: string; // ISO 8601 UTC
  integrationHealth: IntegrationHealthStatus;
  recentFailureCount: number;
  lastErrorMessage?: string;
  adminNotes: string;
}

export interface CitationReference {
  citationId: string;
  sourceId: string;
  sourceName: string;
  sourceDomain: string;
  sourceTier: TrustTier;
  title: string;
  canonicalUrl: string;
  publishedAt: string | null; // ISO 8601 UTC
  updatedAt: string | null; // ISO 8601 UTC
  retrievedAt: string; // ISO 8601 UTC
  verifiedAt: string; // ISO 8601 UTC
  excerpt: string;
  isPrimarySource: boolean;
}

export interface StandardizedSearchResult {
  id: string;
  query: string;
  category: ContentCategory;
  title: string;
  summary: string;
  canonical_url: string;
  source_id: string;
  source_name: string;
  source_domain: string;
  source_type: SourceType;
  source_tier: TrustTier;
  published_at: string | null; // ISO 8601 UTC
  updated_at: string | null; // ISO 8601 UTC
  retrieved_at: string; // ISO 8601 UTC
  verified_at: string; // ISO 8601 UTC
  freshness_status: FreshnessStatus;
  verification_status: VerificationStatus;
  corroboration_count: number;
  corroborated_by: string[]; // Independent publisher names
  is_syndicated_wire: boolean;
  wire_agency?: string;
  confidence: number; // 0.0 to 1.0
  language: string;
  region: string;
  author: string | null;
  tags: string[];
  citations: CitationReference[];
  deduplication_key: string;
  provider: string;
  data_type: "article" | "documentation" | "release_note" | "press_release" | "photo_report" | "video_report";
  thumbnail_url?: string;
  media_duration?: string;
  expires_at: string; // ISO 8601 UTC
  primary_entity?: string;
  related_entities?: string[];
  event_id?: string | null;
  relevance_score?: number;
  score_breakdown?: RelevanceScoreBreakdown;
}

export interface SportParticipantScore {
  name: string;
  abbreviation: string;
  score: string;
  detail?: string; // e.g. "(20.0 ov)" or "Q3 • Soft C5" or "Pens: 4-3"
  isWinner?: boolean;
  logoUrl?: string;
  flag?: string;
  teamName?: string; // For driver-to-constructor mapping in F1
  position?: number;
}

export interface StructuredSportsEvent {
  id: string;
  providerEventId: string;
  providerName: string;
  sourceId: string;
  sourceDomain: string;
  canonicalUrl: string;
  sport: "cricket" | "soccer" | "basketball" | "formula1" | "tennis" | "football" | "multisport";
  competition: string;
  eventTitle?: string;
  matchFormat?: string; // e.g., "T20I", "Test", "ODI", "Grand Prix Qualifying"
  sessionType?: string; // For F1: "FP1", "FP2", "FP3", "Qualifying", "Sprint", "Grand Prix Race"
  venue?: string;
  location?: string;
  localTimeZone?: string;
  eventStatus: SportEventStatus;
  statusDetail: string; // e.g., "In Progress - 18.2 Overs", "Final", "Delayed (Rain)"
  isLive: boolean;
  isStale: boolean;
  freshnessStatus?: FreshnessStatus;
  participants: SportParticipantScore[];
  eventStartTime: string | null; // ISO 8601 UTC
  eventEndTime?: string | null; // ISO 8601 UTC
  providerUpdatedAt: string | null; // ISO 8601 UTC
  retrievedAt: string; // ISO 8601 UTC
  verifiedAt: string; // ISO 8601 UTC
  expiresAt: string; // ISO 8601 UTC
  notes?: string;
  nextFixtureSummary?: string;
  seriesStandingSummary?: string;
  relatedEntities?: string[];
}

export interface RejectedSourceLog {
  timestamp: string;
  url: string;
  normalizedDomain: string;
  reasonCode:
    | "PROHIBITED_SOCIAL_MEDIA"
    | "WIKIPEDIA_DISABLED"
    | "UNAPPROVED_SHORTENER"
    | "LOOKALIKE_SPOOF_DOMAIN"
    | "SSRF_PRIVATE_OR_INVALID_HOST"
    | "UNAPPROVED_DOMAIN"
    | "UNAPPROVED_SUBDOMAIN"
    | "SOURCE_NOT_APPROVED_STATUS"
    | "REDIRECT_TO_UNAPPROVED_DEST"
    | "STALE_CONTENT_EXCEEDED_POLICY"
    | "INSUFFICIENT_OR_EMPTY_CONTENT"
    | "PROMPT_INJECTION_DETECTED"
    | "IRRELEVANT_ENTITY_OR_TOPIC";
  detail: string;
  query?: string;
}

export interface RegistryAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action:
    | "APPROVE_SOURCE"
    | "REJECT_SOURCE"
    | "SUSPEND_SOURCE"
    | "DEPRECATE_SOURCE"
    | "ADD_SOURCE"
    | "UPDATE_FRESHNESS_POLICY"
    | "HEALTH_STATUS_CHANGE";
  sourceId: string;
  summary: string;
}

export interface CandidateItem {
  title: string;
  summary: string;
  fullContent?: string;
  url: string;
  redirectChain?: string[];
  publishedAt?: string | null;
  updatedAt?: string | null;
  author?: string | null;
  category?: ContentCategory;
  tags?: string[];
  thumbnailUrl?: string;
  embedUrl?: string;
  mediaDuration?: string;
  location?: string;
  cameraSpec?: string;
  viewsLabel?: string;
  isOfficialClaim?: boolean;
  dataType?: StandardizedSearchResult["data_type"];
  providerName: string;
  sourceIdHint?: string;
  primaryEntity?: string;
  relatedEntities?: string[];
  eventId?: string;
  facet?: string; // e.g., "f1_motorsport" | "road_cars_brand" | "corporate"
}

export interface GroundedSummaryOutput {
  headline: string;
  synthesizedSummary: string;
  factualClaims: {
    claimText: string;
    claimType: "confirmed_fact" | "attributed_report" | "official_announcement" | "analysis";
    citationIds: string[];
    confidence: number;
  }[];
  discrepancies: string[];
  uncertaintyNotice: string | null;
  isAiGenerated: boolean;
}

// ============================================================================
// PHASE 3: QUERY UNDERSTANDING & ENTITY RESOLUTION SCHEMAS
// ============================================================================

export type DetailedUserIntent =
  | "broad_topic_discovery"
  | "latest_news"
  | "breaking_news"
  | "live_event_or_score"
  | "fixtures_and_schedules"
  | "results_and_standings"
  | "photos_and_videos"
  | "articles_and_analysis"
  | "product_information"
  | "brand_news"
  | "reviews_and_comparisons"
  | "historical_information"
  | "follow_up_question"
  | "ambiguous_or_multi_meaning"
  | "research_and_analysis"
  | "images_and_photography"
  | "videos_and_vlogs"
  | "live_updates"
  | "product_discovery"
  | "comparisons"
  | "event_schedules"
  | "geographic_discovery"
  | "technical_documentation"
  | "academic_research"
  | (string & {});

export type EntityClassificationType =
  | "team"
  | "athlete"
  | "driver"
  | "constructor"
  | "brand"
  | "product"
  | "competition"
  | "organization"
  | "place"
  | "person"
  | "topic"
  | "concept"
  | "event"
  | "creative_work"
  | (string & {});

export type SportOrIndustryDomain =
  | "cricket"
  | "formula1"
  | "soccer"
  | "basketball"
  | "football"
  | "tennis"
  | "automotive"
  | "consumer_tech"
  | "software_ai"
  | "aerospace_science"
  | "finance"
  | "travel"
  | "general_news"
  | "politics"
  | "business"
  | "science"
  | "health"
  | "culture"
  | "food"
  | "gaming"
  | "entertainment"
  | "environment"
  | "education"
  | "general_discovery"
  | (string & {});

export interface ResolvedEntity {
  canonicalName: string;
  matchedTerm: string;
  aliases: string[];
  entityType: EntityClassificationType;
  sportOrIndustry: SportOrIndustryDomain;
  countryOrRegion?: string;
  abbreviation?: string;
  flag?: string;
  parentOrganization?: string;
}

export interface ConversationReferenceResolution {
  isFollowUp: boolean;
  isContextSwitch: boolean;
  referencedTopic: string | null;
  referencedEntities: string[];
  referencedEventId: string | null;
  followUpAction?:
    | "live_score"
    | "next_fixture"
    | "highlights_video"
    | "photos"
    | "standings_results"
    | "deep_dive"
    | "general_followup";
}

export type RelevanceClassification =
  | "direct_match"
  | "strongly_related"
  | "tangential"
  | "unrelated"
  | "unverifiable";

export interface QueryInterpretation {
  queryId?: string;
  topicId?: string;
  searchSessionId?: string;
  originalQuery: string;
  normalizedQuery: string;
  primarySubject: string;
  namedEntities: ResolvedEntity[];
  entityType: EntityClassificationType;
  sportOrIndustry: SportOrIndustryDomain;
  teamsOrCompetitors: string[];
  brandsOrProducts: string[];
  peopleOrCreators: string[];
  organizations: string[];
  competitionOrEvent: string | null;
  requestedContentType: "all" | "articles" | "photologs" | "vlogs" | "live_scorecard" | "fixtures" | "standings";
  userIntent: DetailedUserIntent;
  timeSensitivity: "live" | "breaking" | "recent" | "upcoming" | "historical" | "evergreen";
  geographicContext: string | null;
  explicitDateOrRange: string | null;
  conversationReference: ConversationReferenceResolution;
  isBroadMultiFacetEntity: boolean;
  facets: string[];
  generatedProviderQueries: string[];
  confidence: number;
  clarificationNeeded: boolean;
  clarificationQuestion?: string | null;
}

// ============================================================================
// PHASE 6: 12-FACTOR RELEVANCE SCORING ENGINE & 5-TIER ACTIVE-TOPIC GATE
// ============================================================================

export type FeedlyRelevanceTier =
  | "highly_relevant" // 85 - 100
  | "relevant" // 70 - 84
  | "secondary_discovery" // 55 - 69
  | "rejected"; // < 55

export interface RelevanceScoreBreakdown {
  // Feedly-Style Adaptive Weights (0-100)
  topicRelevanceScore?: number; // 35%
  entityMatchingScore?: number; // 20%
  sourceCredibilityScore: number; // 15% (legacy Factor 5 / Feedly factor)
  freshnessScore?: number; // 10%
  contentQualityScore?: number; // 10%
  originalityScore?: number; // 5%
  mediaRelevanceScore?: number; // 5%
  feedlyTier?: FeedlyRelevanceTier;

  // Granular Factor Breakdown & Compatibility
  primaryEntityScore: number; // Factor 1 (0-28)
  queryIntentScore: number; // Factor 2 (0-14)
  competitionTeamEventScore: number; // Factor 3 (0-16)
  semanticRelevanceScore: number; // Factor 4 (0-12)
  recencyScore: number; // Factor 6 (0-8)
  eventStatusScore: number; // Factor 7 (0-6)
  contentFormatScore: number; // Factor 8 (0-6)
  metadataCompletenessScore: number; // Factor 9 (0-4)
  diversityAdjustment: number; // Factor 10 (-12 to +6)
  duplicatePenalty: number; // Factor 11 (-20 to 0)
  userPreferenceBonus: number; // Factor 12 (0-5)
  mismatchPenalty: number; // Hard penalty when item belongs to wrong matchup/entity
  totalScore: number; // Normalized 0-100
  isRelevant: boolean;
  relevanceClass?: RelevanceClassification;
  relevanceEvidence?: string;
  extractedEntities?: string[];
  primaryTopic?: string;
  explanation: string;
}

// ============================================================================
// PHASE 7 & 8: PERSISTENT FEED CONTEXT & CONVERSATION SESSION STATE
// ============================================================================

export interface FeedContext {
  currentPrimaryTopic: string;
  resolvedEntities: string[];
  currentSportBrandCompetition: string | null;
  currentEventIds: string[];
  activeFilters: {
    mediaFilter: string | null;
    timeframe: string;
  };
  userPreferences: string[];
  conversationSessionId: string;
  latestResolvedIntent: DetailedUserIntent;
  updatedAt: string;
}

export interface ConversationSessionState {
  conversationId: string;
  currentTopic: string;
  primarySubject: string;
  resolvedEntities: ResolvedEntity[];
  sportOrIndustry: SportOrIndustryDomain;
  teamsOrCompetitors: string[];
  brandsOrProducts: string[];
  competitionOrEvent: string | null;
  previousUserQuestions: string[];
  relevantEventIds: string[];
  currentTimeRange: string;
  activeSearchIntent: DetailedUserIntent;
  previouslyRetrievedEvidence: {
    id: string;
    title: string;
    sourceName: string;
    canonicalUrl: string;
    dataType: string;
  }[];
  feedContext: FeedContext;
  userClarification: string | null;
  updatedAt: string;
}

// ============================================================================
// SOCIAL-FIRST MULTIMODAL DISCOVERY FEED MODELS
// ============================================================================

export type QueryIntentType =
  | "live_event"
  | "highlights_video"
  | "visual_photography"
  | "latest_news"
  | "product_review_specs"
  | "historical_context"
  | "broad_discovery";

export interface SearchIntentProfile {
  rawQuery: string;
  cleanTopic: string;
  entities: string[];
  primaryCategory: ContentCategory;
  relatedCategories: ContentCategory[];
  timeSensitivity: "live" | "breaking" | "recent" | "upcoming" | "historical" | "evergreen";
  intentType: QueryIntentType;
  detailedIntent?: DetailedUserIntent;
  detectedMediaFilter: "all" | "articles" | "photologs" | "vlogs" | null;
  visualTheme: "sports" | "travel" | "food" | "general";
  interpretation?: QueryInterpretation;
}

export interface SocialArticleCard {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  readTime: string;
  category: string;
  sourceName: string;
  sourceDomain: string;
  sourceUrl: string;
  coverImage?: string;
  publishedAt: string;
  publishedIso: string | null;
  timestampMs: number;
  signalScore: number;
  snippet: string;
  fullContent: string;
  tags: string[];
  likes: number;
  isOfficialSource?: boolean;
  claimDistinction?: "official_announcement" | "independent_review" | "verified_reporting";
  freshnessStatus: FreshnessStatus;
  primaryEntity?: string;
  relatedEntities?: string[];
  eventId?: string | null;
  clusterId?: string;
  relatedCoverage?: {
    sourceName: string;
    sourceUrl: string;
    sourceDomain: string;
    publishedAt: string;
    title: string;
  }[];
}

export interface SocialPhotologCard {
  id: string;
  caption: string;
  photographer: string;
  location: string;
  sourceName: string;
  sourceDomain: string;
  sourceUrl: string;
  imageUrl: string;
  aspect: "wide" | "square" | "tall";
  likes: number;
  signalScore: number;
  publishedAt: string;
  timestampMs: number;
  cameraSpec: string;
  contextualText?: string;
  primaryEntity?: string;
  relatedEntities?: string[];
  eventId?: string | null;
  clusterId?: string;
  relatedCoverage?: {
    sourceName: string;
    sourceUrl: string;
    sourceDomain: string;
    publishedAt: string;
    title: string;
  }[];
}

export interface SocialVlogCard {
  id: string;
  title: string;
  creator: string;
  sourceName: string;
  sourceDomain: string;
  sourceUrl: string;
  embedUrl?: string;
  duration: string;
  views: string;
  likes: number;
  signalScore: number;
  publishedAt: string;
  timestampMs: number;
  thumbnailUrl: string;
  highlightQuote: string;
  primaryEntity?: string;
  relatedEntities?: string[];
  eventId?: string | null;
  clusterId?: string;
  relatedCoverage?: {
    sourceName: string;
    sourceUrl: string;
    sourceDomain: string;
    publishedAt: string;
    title: string;
  }[];
}

export interface SocialMatchScorecard {
  id: string;
  event: string;
  competition?: string;
  venue?: string;
  scheduledDateLabel?: string;
  status: string;
  eventStatus?: SportEventStatus;
  isLive: boolean;
  isStale: boolean;
  team1: { name: string; score: string; overs: string; flag: string };
  team2: { name: string; score: string; overs: string; flag: string };
  playerOfMatch: string;
  upcoming: string;
  sourceName: string;
  sourceUrl: string;
  lastRefreshedAt: string;
}

export interface DevelopingStoryUpdate {
  id: string;
  headline: string;
  summary: string;
  sourceName: string;
  sourceDomain: string;
  sourceUrl: string;
  publishedAt: string;
  timestampMs: number;
  isLatest: boolean;
}

export interface DevelopingStoryStream {
  id: string;
  storyTitle: string;
  topicTag: string;
  publisherCount: number;
  latestUpdate: DevelopingStoryUpdate;
  timeline: DevelopingStoryUpdate[];
}

export interface FeedQualityMetrics {
  relevantResultsCount: number;
  distinctApprovedPublishers: number;
  publisherList: string[];
  mediaFormatCounts: {
    articles: number;
    photologs: number;
    vlogs: number;
    liveEvents: number;
    developingStories: number;
  };
  mediaFormatDiversityScore: number; // 0 to 1
  freshnessComplianceRate: number; // 0 to 1
  citationValidityRate: number; // 0 to 1
  duplicateSuppressionCount: number;
}

export interface SocialDiscoveryFeed {
  searchSessionId?: string;
  queryId?: string;
  topicId?: string;
  topicTitle: string;
  searchTopic: string;
  assistantSummary: string;
  intent: SearchIntentProfile;
  queryInterpretation?: QueryInterpretation;
  feedContext?: FeedContext;
  conversationState?: ConversationSessionState;
  matchScorecard: SocialMatchScorecard | null;
  liveScoreEvents: StructuredSportsEvent[];
  developingStories: DevelopingStoryStream[];
  articles: SocialArticleCard[];
  photologs: SocialPhotologCard[];
  vlogs: SocialVlogCard[];
  detectedMediaFilter: string | null;
  relatedTopics: string[];
  followUpPrompts: string[];
  stats: {
    totalLiveItems: number;
    filteredNoiseCount: number;
    sources: string[];
    fetchedAt: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    hasMore: boolean;
    totalAvailable: number;
  };
  qualityMetrics: FeedQualityMetrics;
}

// ============================================================================
// PHASE 10: DEVELOPMENT-ONLY SEARCH DIAGNOSTICS
// ============================================================================

export interface SearchDiagnostics {
  searchSessionId?: string;
  queryId?: string;
  topicId?: string;
  originalQuery: string;
  resolvedQuery: string;
  resolvedIntent: DetailedUserIntent;
  timeSensitivity: string;
  identifiedEntities: {
    canonicalName: string;
    entityType: EntityClassificationType;
    sportOrIndustry: SportOrIndustryDomain;
  }[];
  generatedProviderQueries: string[];
  candidatesRetrieved: number;
  candidatesVerified: number;
  candidatesRejected: number;
  rejectedBreakdown: RejectedSourceLog[];
  providersQueried: {
    providerId: string;
    status: "ok" | "error" | "rate_limited" | "circuit_open" | "unconfigured";
    latencyMs: number;
    itemsReturned: number;
    errorDetail?: string;
  }[];
  scoringDiagnostics: {
    candidateId?: string;
    title: string;
    sourceName: string;
    dataType: string;
    entityMatchScore: number;
    intentMatchScore: number;
    relevanceScore: number;
    freshnessScore: number;
    finalRankingScore: number;
    relevanceClass?: RelevanceClassification;
    relevanceEvidence?: string;
  }[];
  eventResolution: {
    outcome:
      | "live_event_verified"
      | "completed_or_upcoming_event_resolved"
      | "broad_query_scorecard_suppressed"
      | "no_matching_event_found"
      | "not_applicable";
    eventId: string | null;
    eventTitle: string | null;
    eventStatus: SportEventStatus | null;
    providerName: string | null;
    providerTimestamp: string | null;
    reason: string;
  };
  finalFeedComposition: {
    activeTopic: string;
    conversationId: string;
    searchSessionId?: string;
    queryId?: string;
    topicId?: string;
    isFollowUp: boolean;
    isContextSwitch: boolean;
    articlesCount: number;
    photologsCount: number;
    vlogsCount: number;
    hasScorecard: boolean;
    developingStoriesCount: number;
    feedValidationStrippedCount?: number;
  };
}

export interface TrustedSearchEngineResponse {
  query: string;
  detectedCategory: ContentCategory;
  isHistoricalQuery: boolean;
  executedAt: string; // ISO 8601 UTC
  fromCache: boolean;
  cacheStatus: "miss" | "hit_fresh" | "stale_revalidated";
  groundedSynthesis: GroundedSummaryOutput;
  results: StandardizedSearchResult[];
  liveScoreEvents: StructuredSportsEvent[];
  socialFeed?: SocialDiscoveryFeed;
  queryInterpretation?: QueryInterpretation;
  conversationState?: ConversationSessionState;
  diagnostics: SearchDiagnostics;
}
