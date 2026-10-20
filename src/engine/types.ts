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
  | "travel";

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
  approvedSubdomains: string[]; // e.g., ["www", "feeds", "api", "news", "blog", " developer"]
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
}

export interface SportParticipantScore {
  name: string;
  abbreviation: string;
  score: string;
  detail?: string; // e.g. "(20.0 ov)" or "Pens: 4-3" or "6-4, 7-5"
  isWinner?: boolean;
  logoUrl?: string;
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
  venue?: string;
  localTimeZone?: string;
  eventStatus: SportEventStatus;
  statusDetail: string; // e.g., "In Progress - 18.2 Overs", "Final", "Delayed (Rain)"
  isLive: boolean;
  isStale: boolean;
  participants: SportParticipantScore[];
  eventStartTime: string | null; // ISO 8601 UTC
  providerUpdatedAt: string | null; // ISO 8601 UTC
  retrievedAt: string; // ISO 8601 UTC
  verifiedAt: string; // ISO 8601 UTC
  expiresAt: string; // ISO 8601 UTC
  notes?: string;
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
    | "PROMPT_INJECTION_DETECTED";
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
  url: string;
  redirectChain?: string[];
  publishedAt?: string | null;
  updatedAt?: string | null;
  author?: string | null;
  category?: ContentCategory;
  tags?: string[];
  thumbnailUrl?: string;
  mediaDuration?: string;
  dataType?: StandardizedSearchResult["data_type"];
  providerName: string;
  sourceIdHint?: string;
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
  diagnostics: {
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
  };
}
