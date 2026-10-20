// ============================================================================
// CENTRAL SOURCE REGISTRY & ADMINISTRATIVE APPROVAL WORKFLOW (SECTIONS 3 & 5)
// ============================================================================

import {
  ContentCategory,
  IntegrationHealthStatus,
  RegistryAuditEntry,
  RejectedSourceLog,
  SourceApprovalStatus,
  SourceRegistryRecord
} from "./types";
import {
  DISABLED_ENCYCLOPEDIA_DOMAINS,
  PROHIBITED_SOCIAL_DOMAINS,
  isPrivateOrProhibitedHost
} from "./urlSecurity";

const INITIAL_VALIDATED_AT = "2026-10-20T10:00:00.000Z";

export const DEFAULT_SOURCE_REGISTRY: SourceRegistryRecord[] = [
  // ==========================================================================
  // A. SPORTS & SPORTS BROADCASTING (Tier 1 Governing Bodies & Tier 2 Broadcasters)
  // ==========================================================================
  {
    id: "src-icc-cricket",
    publisherName: "International Cricket Council (ICC)",
    canonicalDomain: "icc-cricket.com",
    approvedSubdomains: ["www", "resources", "api"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    competitionCoverage: ["ICC Men's & Women's T20 World Cup", "ODI World Cup", "World Test Championship"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["official_api", "approved_discovery"],
    commercialLicensingNotes: "Official ICC governing body portal; link attribution required.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Primary governing body for international cricket fixtures, rankings, and official releases."
  },
  {
    id: "src-bcci",
    publisherName: "Board of Control for Cricket in India (BCCI)",
    canonicalDomain: "bcci.tv",
    approvedSubdomains: ["www", "scores"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["IN", "Global"],
    competitionCoverage: ["India International Cricket", "IPL", "Domestic Indian Cricket"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official BCCI announcements, squads, and fixtures.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Primary authority for Indian cricket squad announcements and match schedules."
  },
  {
    id: "src-formula1",
    publisherName: "Formula 1 Official",
    canonicalDomain: "formula1.com",
    approvedSubdomains: ["www", "media"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    competitionCoverage: ["FIA Formula One World Championship"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "approved_discovery"],
    feedUrls: ["https://www.formula1.com/en/latest/all.xml"],
    commercialLicensingNotes: "Official Formula 1 news, race calendars, and qualifying/race classifications.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Official F1 governing commercial portal."
  },
  {
    id: "src-fifa",
    publisherName: "FIFA Official",
    canonicalDomain: "fifa.com",
    approvedSubdomains: ["www", "inside"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    competitionCoverage: ["FIFA World Cup", "International Football"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official FIFA tournament rules, rankings, and announcements.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 international football governing body."
  },
  {
    id: "src-uefa",
    publisherName: "UEFA Official",
    canonicalDomain: "uefa.com",
    approvedSubdomains: ["www", "editorial"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["EU", "Global"],
    competitionCoverage: ["UEFA Champions League", "UEFA Europa League", "UEFA Euro"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official European club and national competition source.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 European football governing body."
  },
  {
    id: "src-olympics",
    publisherName: "International Olympic Committee (Olympics.com)",
    canonicalDomain: "olympics.com",
    approvedSubdomains: ["www"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    competitionCoverage: ["Olympic Games", "World Championships"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official Olympic Games portal.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 Olympic movement source."
  },
  {
    id: "src-nba",
    publisherName: "NBA Official",
    canonicalDomain: "nba.com",
    approvedSubdomains: ["www", "cdn"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    competitionCoverage: ["National Basketball Association"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official NBA league announcements, injury reports, and standings.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 NBA official source."
  },
  {
    id: "src-nfl",
    publisherName: "NFL Official",
    canonicalDomain: "nfl.com",
    approvedSubdomains: ["www", "static"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    competitionCoverage: ["National Football League"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official NFL league news, rosters, and injury designations.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 NFL official source."
  },
  {
    id: "src-atp-wta",
    publisherName: "ATP Tour Official",
    canonicalDomain: "atptour.com",
    approvedSubdomains: ["www"],
    category: "sports",
    sourceType: "governing_body",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    competitionCoverage: ["ATP Tour", "Grand Slams"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official men's professional tennis governing body.",
    trustTier: 1,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Official ATP rankings and tournament draws."
  },
  {
    id: "src-espn",
    publisherName: "ESPN",
    canonicalDomain: "espn.com",
    approvedSubdomains: ["www", "site.api", "espncricinfo"],
    category: "sports",
    secondaryCategories: ["live_scores"],
    sourceType: "broadcaster",
    approvalStatus: "approved",
    geographicCoverage: ["Global", "US", "IN"],
    competitionCoverage: ["Cricket", "Football", "NBA", "NFL", "F1", "Tennis"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "structured_scoreboard"],
    feedUrls: [
      "https://www.espn.com/espn/rss/news",
      "https://www.espn.com/espn/rss/nba/news",
      "https://www.espn.com/espn/rss/nfl/news",
      "https://www.espn.com/espn/rss/rpm/news",
      "https://www.espn.com/espn/rss/soccer/news"
    ],
    apiEndpoint: "https://site.api.espn.com/apis/site/v2/sports",
    commercialLicensingNotes: "Public RSS feeds & documented scoreboard endpoints with ESPN source attribution.",
    trustTier: 2,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved sports broadcaster and structured live scoreboard provider."
  },
  {
    id: "src-espncricinfo",
    publisherName: "ESPNcricinfo",
    canonicalDomain: "espncricinfo.com",
    approvedSubdomains: ["www"],
    category: "sports",
    secondaryCategories: ["live_scores"],
    sourceType: "broadcaster",
    approvalStatus: "approved",
    geographicCoverage: ["Global", "IN", "UK", "AU"],
    competitionCoverage: ["International Cricket", "IPL", "T20Is", "Test Cricket"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://www.espncricinfo.com/rss/content/story/feeds/0.xml"],
    commercialLicensingNotes: "Official ESPNcricinfo RSS feed; headline & summary excerpt only with direct link.",
    trustTier: 2,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 2 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Specialist cricket news and match reporting outlet."
  },
  {
    id: "src-bbc-sport",
    publisherName: "BBC Sport",
    canonicalDomain: "bbc.co.uk",
    approvedSubdomains: ["www", "feeds"],
    category: "sports",
    secondaryCategories: ["news"],
    sourceType: "broadcaster",
    approvalStatus: "approved",
    geographicCoverage: ["UK", "Global"],
    competitionCoverage: ["Cricket", "Premier League", "Formula 1", "Tennis", "Olympics"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: [
      "https://feeds.bbci.co.uk/sport/rss.xml",
      "https://feeds.bbci.co.uk/sport/cricket/rss.xml",
      "https://feeds.bbci.co.uk/sport/football/rss.xml",
      "https://feeds.bbci.co.uk/sport/formula1/rss.xml",
      "https://feeds.bbci.co.uk/sport/tennis/rss.xml"
    ],
    commercialLicensingNotes: "BBC public RSS feeds; non-commercial/editorial link attribution required.",
    trustTier: 2,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 2 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved public-service sports broadcaster with sport-specific RSS feeds."
  },
  {
    id: "src-skysports",
    publisherName: "Sky Sports",
    canonicalDomain: "skysports.com",
    approvedSubdomains: ["www"],
    category: "sports",
    sourceType: "broadcaster",
    approvalStatus: "approved",
    geographicCoverage: ["UK", "Global"],
    competitionCoverage: ["Premier League", "Formula 1", "Cricket", "Golf"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "approved_discovery"],
    commercialLicensingNotes: "Approved broadcaster domain for sports reporting.",
    trustTier: 2,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved UK sports broadcaster."
  },
  {
    id: "src-nbcsports",
    publisherName: "NBC Sports",
    canonicalDomain: "nbcsports.com",
    approvedSubdomains: ["www"],
    category: "sports",
    sourceType: "broadcaster",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    competitionCoverage: ["NFL", "Olympics", "Premier League", "Motorsports"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Approved US sports broadcaster.",
    trustTier: 2,
    maxContentAgeMs: 72 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved US sports broadcaster."
  },

  // ==========================================================================
  // B. SPECIALIZED LIVE-SCORE PROVIDERS (Candidate Evaluation & Licensed APIs)
  // ==========================================================================
  {
    id: "src-sportradar",
    publisherName: "Sportradar Official Data API",
    canonicalDomain: "sportradar.com",
    approvedSubdomains: ["api", "developer"],
    category: "live_scores",
    sourceType: "data_api",
    approvalStatus: "pending_review",
    geographicCoverage: ["Global"],
    competitionCoverage: ["ICC", "NBA", "NHL", "ATP", "UEFA"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["official_api", "structured_scoreboard"],
    apiEndpoint: "https://api.sportradar.com",
    requiresApiKey: true,
    envVarName: "SPORTRADAR_API_KEY",
    commercialLicensingNotes: "Requires commercial license and SPORTRADAR_API_KEY before activation.",
    trustTier: 1,
    maxContentAgeMs: 60 * 1000,
    maxCacheDurationMs: 15 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Pending commercial API license configuration (SPORTRADAR_API_KEY)."
  },
  {
    id: "src-sportmonks",
    publisherName: "Sportmonks Sports Data API",
    canonicalDomain: "sportmonks.com",
    approvedSubdomains: ["api", "cricket"],
    category: "live_scores",
    sourceType: "data_api",
    approvalStatus: "pending_review",
    geographicCoverage: ["Global"],
    competitionCoverage: ["Cricket", "European Football", "Formula 1"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["official_api", "structured_scoreboard"],
    apiEndpoint: "https://cricket.sportmonks.com/api/v2.0",
    requiresApiKey: true,
    envVarName: "SPORTMONKS_API_KEY",
    commercialLicensingNotes: "Requires SPORTMONKS_API_KEY subscription.",
    trustTier: 2,
    maxContentAgeMs: 60 * 1000,
    maxCacheDurationMs: 20 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Evaluated candidate for live cricket and football scores; awaiting API key."
  },

  // ==========================================================================
  // C. REPUTABLE NEWS & JOURNALISM (Tier 1 Wire Agencies & Tier 2 Publishers)
  // ==========================================================================
  {
    id: "src-reuters",
    publisherName: "Reuters",
    canonicalDomain: "reuters.com",
    approvedSubdomains: ["www"],
    category: "news",
    secondaryCategories: ["finance", "technology", "sports", "science"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["official_api", "approved_discovery"],
    commercialLicensingNotes: "International wire agency; strict editorial standards and correction policy.",
    trustTier: 1,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 global news agency."
  },
  {
    id: "src-ap-news",
    publisherName: "Associated Press (AP News)",
    canonicalDomain: "apnews.com",
    approvedSubdomains: ["www"],
    category: "news",
    secondaryCategories: ["sports", "science", "government"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["Global", "US"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Non-profit global news agency.",
    trustTier: 1,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 global wire service."
  },
  {
    id: "src-bbc-news",
    publisherName: "BBC News",
    canonicalDomain: "bbc.com",
    approvedSubdomains: ["www", "feeds"],
    category: "news",
    secondaryCategories: ["science", "technology", "finance", "entertainment"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["Global", "UK"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: [
      "https://feeds.bbci.co.uk/news/rss.xml",
      "https://feeds.bbci.co.uk/news/world/rss.xml",
      "https://feeds.bbci.co.uk/news/business/rss.xml",
      "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml",
      "https://feeds.bbci.co.uk/news/technology/rss.xml"
    ],
    commercialLicensingNotes: "BBC News public RSS feeds with mandatory attribution link.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved global public-service news publisher."
  },
  {
    id: "src-guardian",
    publisherName: "The Guardian",
    canonicalDomain: "theguardian.com",
    approvedSubdomains: ["www", "content"],
    category: "news",
    secondaryCategories: ["sports", "technology", "science", "travel", "entertainment"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["Global", "UK", "US", "AU"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "official_api"],
    feedUrls: [
      "https://www.theguardian.com/world/rss",
      "https://www.theguardian.com/uk/sport/rss",
      "https://www.theguardian.com/uk/technology/rss",
      "https://www.theguardian.com/science/rss",
      "https://www.theguardian.com/uk/travel/rss"
    ],
    apiEndpoint: "https://content.guardianapis.com/search",
    envVarName: "GUARDIAN_API_KEY",
    commercialLicensingNotes: "Guardian Open Platform RSS & API.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved newspaper with public RSS feeds and optional Open Platform API."
  },
  {
    id: "src-the-hindu",
    publisherName: "The Hindu",
    canonicalDomain: "thehindu.com",
    approvedSubdomains: ["www", "sportstar"],
    category: "news",
    secondaryCategories: ["sports", "science", "technology", "finance"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["IN", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: [
      "https://www.thehindu.com/news/national/feeder/default.rss",
      "https://www.thehindu.com/sport/cricket/feeder/default.rss",
      "https://www.thehindu.com/sci-tech/technology/feeder/default.rss",
      "https://www.thehindu.com/business/feeder/default.rss"
    ],
    commercialLicensingNotes: "Official RSS feeds of The Hindu; metadata & summary excerpt only.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Indian national newspaper of record."
  },
  {
    id: "src-indian-express",
    publisherName: "The Indian Express",
    canonicalDomain: "indianexpress.com",
    approvedSubdomains: ["www"],
    category: "news",
    secondaryCategories: ["sports", "technology"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["IN", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: [
      "https://indianexpress.com/section/india/feed/",
      "https://indianexpress.com/section/sports/cricket/feed/",
      "https://indianexpress.com/section/technology/feed/"
    ],
    commercialLicensingNotes: "Official Indian Express RSS feeds.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Indian national daily newspaper."
  },
  {
    id: "src-hindustan-times",
    publisherName: "Hindustan Times",
    canonicalDomain: "hindustantimes.com",
    approvedSubdomains: ["www"],
    category: "news",
    secondaryCategories: ["sports"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["IN"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "approved_discovery"],
    commercialLicensingNotes: "Approved Indian news publisher.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Indian news publication."
  },
  {
    id: "src-cnbc",
    publisherName: "CNBC",
    canonicalDomain: "cnbc.com",
    approvedSubdomains: ["www", "search"],
    category: "finance",
    secondaryCategories: ["news", "technology"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: [
      "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114",
      "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=19854910"
    ],
    commercialLicensingNotes: "Official CNBC RSS feeds for business and technology news.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 3 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved financial and business news broadcaster."
  },
  {
    id: "src-ft",
    publisherName: "Financial Times",
    canonicalDomain: "ft.com",
    approvedSubdomains: ["www"],
    category: "finance",
    secondaryCategories: ["news"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["Global", "UK"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Respect paywall; metadata & public headlines only.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved global financial newspaper."
  },
  {
    id: "src-nytimes",
    publisherName: "The New York Times",
    canonicalDomain: "nytimes.com",
    approvedSubdomains: ["www", "rss"],
    category: "news",
    secondaryCategories: ["technology", "science"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: [
      "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
      "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
      "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"
    ],
    commercialLicensingNotes: "Official NYT public RSS feeds; do not bypass paywall.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved newspaper with public RSS feeds."
  },
  {
    id: "src-wsj",
    publisherName: "The Wall Street Journal",
    canonicalDomain: "wsj.com",
    approvedSubdomains: ["www", "feeds.a.dj.com"],
    category: "finance",
    secondaryCategories: ["news", "technology"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Metadata and public summaries only; respect paywall.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved financial and business journal."
  },
  {
    id: "src-bloomberg",
    publisherName: "Bloomberg",
    canonicalDomain: "bloomberg.com",
    approvedSubdomains: ["www", "feeds"],
    category: "finance",
    secondaryCategories: ["news", "technology"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Approved financial publisher.",
    trustTier: 2,
    maxContentAgeMs: 24 * 3600 * 1000,
    maxCacheDurationMs: 5 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved financial news organization."
  },

  // ==========================================================================
  // D. TECHNOLOGY, VENDOR DOCUMENTATION & ENGINEERING BLOGS (Tier 1 Primary & Tier 2 Editorial)
  // ==========================================================================
  {
    id: "src-openai",
    publisherName: "OpenAI Official",
    canonicalDomain: "openai.com",
    approvedSubdomains: ["www", "platform", "help", "cdn"],
    category: "technology",
    secondaryCategories: ["brands"],
    sourceType: "primary",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "release_feed"],
    feedUrls: ["https://openai.com/news/rss.xml"],
    commercialLicensingNotes: "Primary vendor source for OpenAI models, API docs, and safety releases.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 primary vendor documentation and newsroom."
  },
  {
    id: "src-google-blog",
    publisherName: "Google Official Blog (The Keyword)",
    canonicalDomain: "blog.google",
    approvedSubdomains: ["www"],
    category: "technology",
    secondaryCategories: ["brands"],
    sourceType: "primary",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://blog.google/rss/"],
    commercialLicensingNotes: "Official Google corporate and product announcements.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Primary Google product and AI announcements."
  },
  {
    id: "src-microsoft",
    publisherName: "Microsoft Official & DevBlogs",
    canonicalDomain: "microsoft.com",
    approvedSubdomains: ["www", "learn", "devblogs", "blogs", "azure", "news"],
    category: "technology",
    secondaryCategories: ["brands"],
    sourceType: "technical_documentation",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom", "release_feed"],
    feedUrls: ["https://devblogs.microsoft.com/landingpage/"],
    commercialLicensingNotes: "Primary Microsoft documentation, security advisories, and engineering blogs.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 primary vendor documentation."
  },
  {
    id: "src-apple",
    publisherName: "Apple Newsroom & Developer",
    canonicalDomain: "apple.com",
    approvedSubdomains: ["www", "developer", "support"],
    category: "brands",
    secondaryCategories: ["technology"],
    sourceType: "primary",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://www.apple.com/newsroom/rss-feed.rss"],
    commercialLicensingNotes: "Official Apple Newsroom press releases and hardware specifications.",
    trustTier: 1,
    maxContentAgeMs: 180 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Primary source for Apple hardware, software, and corporate announcements."
  },
  {
    id: "src-nvidia",
    publisherName: "NVIDIA Official & Technical Blog",
    canonicalDomain: "nvidia.com",
    approvedSubdomains: ["www", "blogs", "developer", "docs", "nvidianews"],
    category: "technology",
    secondaryCategories: ["brands"],
    sourceType: "primary",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://blogs.nvidia.com/feed/"],
    commercialLicensingNotes: "Official NVIDIA engineering blog and corporate announcements.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Primary GPU, AI infrastructure, and robotics vendor."
  },
  {
    id: "src-aws",
    publisherName: "Amazon Web Services (AWS Official)",
    canonicalDomain: "amazon.com",
    approvedSubdomains: ["aws"],
    category: "technology",
    secondaryCategories: ["brands"],
    sourceType: "technical_documentation",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://aws.amazon.com/blogs/aws/feed/"],
    commercialLicensingNotes: "Official AWS News Blog and cloud release documentation.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 cloud infrastructure vendor."
  },
  {
    id: "src-cloudflare",
    publisherName: "Cloudflare Official Blog & Docs",
    canonicalDomain: "cloudflare.com",
    approvedSubdomains: ["www", "blog", "developers"],
    category: "technology",
    sourceType: "primary",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://blog.cloudflare.com/rss/"],
    commercialLicensingNotes: "Primary Cloudflare engineering and network security advisories.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 internet infrastructure and security engineering source."
  },
  {
    id: "src-github",
    publisherName: "GitHub Official Blog & Releases",
    canonicalDomain: "github.com",
    approvedSubdomains: ["www", "api", "docs"],
    category: "technology",
    sourceType: "technical_documentation",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["official_api", "release_feed"],
    apiEndpoint: "https://api.github.com",
    commercialLicensingNotes: "Official GitHub Releases API for verified vendor repositories.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Used strictly for official software release notes and changelogs."
  },
  {
    id: "src-arstechnica",
    publisherName: "Ars Technica",
    canonicalDomain: "arstechnica.com",
    approvedSubdomains: ["www", "feeds"],
    category: "technology",
    secondaryCategories: ["science", "gaming"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://feeds.arstechnica.com/arstechnica/index"],
    commercialLicensingNotes: "Established technology & science publication; editorial analysis distinguished from vendor specs.",
    trustTier: 2,
    maxContentAgeMs: 30 * 24 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Tier-2 technical journalism publication."
  },
  {
    id: "src-theverge",
    publisherName: "The Verge",
    canonicalDomain: "theverge.com",
    approvedSubdomains: ["www"],
    category: "technology",
    secondaryCategories: ["brands", "entertainment", "gaming"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://www.theverge.com/rss/index.xml"],
    commercialLicensingNotes: "Established technology & consumer hardware publication.",
    trustTier: 2,
    maxContentAgeMs: 30 * 24 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Tier-2 technology publication."
  },
  {
    id: "src-techcrunch",
    publisherName: "TechCrunch",
    canonicalDomain: "techcrunch.com",
    approvedSubdomains: ["www"],
    category: "technology",
    secondaryCategories: ["finance", "brands"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://techcrunch.com/feed/"],
    commercialLicensingNotes: "Established technology and enterprise industry publication.",
    trustTier: 2,
    maxContentAgeMs: 30 * 24 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Tier-2 technology news publisher."
  },
  {
    id: "src-wired",
    publisherName: "WIRED",
    canonicalDomain: "wired.com",
    approvedSubdomains: ["www"],
    category: "technology",
    secondaryCategories: ["science"],
    sourceType: "news_publisher",
    approvalStatus: "approved",
    geographicCoverage: ["US", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://www.wired.com/feed/rss"],
    commercialLicensingNotes: "Approved technology and science publication.",
    trustTier: 2,
    maxContentAgeMs: 30 * 24 * 3600 * 1000,
    maxCacheDurationMs: 10 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Approved Tier-2 technology magazine."
  },
  {
    id: "src-ieee-spectrum",
    publisherName: "IEEE Spectrum",
    canonicalDomain: "ieee.org",
    approvedSubdomains: ["spectrum"],
    category: "technology",
    secondaryCategories: ["science"],
    sourceType: "research_organization",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://spectrum.ieee.org/feeds/feed.rss"],
    commercialLicensingNotes: "IEEE flagship engineering and standards publication.",
    trustTier: 1,
    maxContentAgeMs: 90 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 engineering standards and research publication."
  },
  {
    id: "src-nasa",
    publisherName: "NASA Official",
    canonicalDomain: "nasa.gov",
    approvedSubdomains: ["www", "science"],
    category: "science",
    secondaryCategories: ["technology"],
    sourceType: "research_organization",
    approvalStatus: "approved",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["rss_atom"],
    feedUrls: ["https://www.nasa.gov/news-release/feed/"],
    commercialLicensingNotes: "US Government public domain scientific releases.",
    trustTier: 1,
    maxContentAgeMs: 180 * 24 * 3600 * 1000,
    maxCacheDurationMs: 15 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 primary scientific & aerospace agency."
  },
  {
    id: "src-japan-jnto",
    publisherName: "Japan National Tourism Organization (JNTO Official)",
    canonicalDomain: "japan.travel",
    approvedSubdomains: ["www"],
    category: "travel",
    sourceType: "official",
    approvalStatus: "approved",
    geographicCoverage: ["JP", "Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: ["approved_discovery"],
    commercialLicensingNotes: "Official Japanese government tourism authority.",
    trustTier: 1,
    maxContentAgeMs: 180 * 24 * 3600 * 1000,
    maxCacheDurationMs: 30 * 60 * 1000,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "healthy",
    recentFailureCount: 0,
    adminNotes: "Tier-1 official travel & public transport authority for Japan."
  },

  // ==========================================================================
  // EXPLICITLY REJECTED / PROHIBITED SOURCES (Maintained for Audit & Admin Visibility)
  // ==========================================================================
  {
    id: "src-rejected-wikipedia",
    publisherName: "Wikipedia (Crowd-Edited Encyclopedia)",
    canonicalDomain: "wikipedia.org",
    approvedSubdomains: ["en", "www"],
    category: "education",
    sourceType: "News_publisher" as any,
    approvalStatus: "rejected",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: [],
    commercialLicensingNotes: "Disabled per Core Principle #5 & Section 15: No crowd-edited Wikipedia content in factual pipeline.",
    trustTier: 3,
    maxContentAgeMs: 0,
    maxCacheDurationMs: 0,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Explicitly disabled for factual search results."
  },
  {
    id: "src-rejected-x-twitter",
    publisherName: "X (formerly Twitter)",
    canonicalDomain: "x.com",
    approvedSubdomains: ["www", "mobile"],
    category: "news",
    sourceType: "news_publisher",
    approvalStatus: "rejected",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: [],
    commercialLicensingNotes: "Prohibited social media platform per Section 4.",
    trustTier: 3,
    maxContentAgeMs: 0,
    maxCacheDurationMs: 0,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Blocked social media platform; never used as factual source."
  },
  {
    id: "src-rejected-facebook",
    publisherName: "Facebook",
    canonicalDomain: "facebook.com",
    approvedSubdomains: ["www", "m"],
    category: "news",
    sourceType: "news_publisher",
    approvalStatus: "rejected",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: [],
    commercialLicensingNotes: "Prohibited social media platform per Section 4.",
    trustTier: 3,
    maxContentAgeMs: 0,
    maxCacheDurationMs: 0,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Blocked social media platform."
  },
  {
    id: "src-rejected-instagram",
    publisherName: "Instagram",
    canonicalDomain: "instagram.com",
    approvedSubdomains: ["www"],
    category: "news",
    sourceType: "news_publisher",
    approvalStatus: "rejected",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: [],
    commercialLicensingNotes: "Prohibited social media platform per Section 4.",
    trustTier: 3,
    maxContentAgeMs: 0,
    maxCacheDurationMs: 0,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Blocked social media platform."
  },
  {
    id: "src-rejected-threads",
    publisherName: "Threads",
    canonicalDomain: "threads.net",
    approvedSubdomains: ["www"],
    category: "news",
    sourceType: "news_publisher",
    approvalStatus: "rejected",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: [],
    commercialLicensingNotes: "Prohibited social media platform per Section 4.",
    trustTier: 3,
    maxContentAgeMs: 0,
    maxCacheDurationMs: 0,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Blocked social media platform."
  },
  {
    id: "src-rejected-reddit",
    publisherName: "Reddit User Discussions",
    canonicalDomain: "reddit.com",
    approvedSubdomains: ["www", "old"],
    category: "news",
    sourceType: "news_publisher",
    approvalStatus: "rejected",
    geographicCoverage: ["Global"],
    supportedLanguages: ["en"],
    permittedIngestionMethods: [],
    commercialLicensingNotes: "User-generated discussion forum; excluded from factual pipeline per Section 4.",
    trustTier: 3,
    maxContentAgeMs: 0,
    maxCacheDurationMs: 0,
    lastSuccessfulRetrieval: null,
    lastValidationTime: INITIAL_VALIDATED_AT,
    integrationHealth: "disabled",
    recentFailureCount: 0,
    adminNotes: "Excluded UGC platform."
  }
];

export class SourceRegistryService {
  private sources: Map<string, SourceRegistryRecord> = new Map();
  private rejectedLogs: RejectedSourceLog[] = [];
  private auditTrail: RegistryAuditEntry[] = [];

  constructor(initialSources: SourceRegistryRecord[] = DEFAULT_SOURCE_REGISTRY) {
    for (const s of initialSources) {
      this.sources.set(s.id, { ...s, approvedSubdomains: [...s.approvedSubdomains] });
    }
  }

  public getAllSources(): SourceRegistryRecord[] {
    return Array.from(this.sources.values());
  }

  public getApprovedSources(category?: ContentCategory): SourceRegistryRecord[] {
    return this.getAllSources().filter((s) => {
      if (s.approvalStatus !== "approved" || s.integrationHealth === "disabled") {
        return false;
      }
      if (!category) return true;
      return s.category === category || (s.secondaryCategories || []).includes(category);
    });
  }

  public getSourceById(id: string): SourceRegistryRecord | undefined {
    return this.sources.get(id);
  }

  public recordRejection(log: RejectedSourceLog): void {
    this.rejectedLogs.unshift(log);
    if (this.rejectedLogs.length > 250) {
      this.rejectedLogs.pop();
    }
  }

  public getRejectedLogs(limit = 50): RejectedSourceLog[] {
    return this.rejectedLogs.slice(0, limit);
  }

  public getAuditTrail(limit = 50): RegistryAuditEntry[] {
    return this.auditTrail.slice(0, limit);
  }

  public updateSourceStatus(
    sourceId: string,
    newStatus: SourceApprovalStatus,
    adminNotes?: string,
    actor = "admin"
  ): { success: boolean; error?: string; record?: SourceRegistryRecord } {
    const record = this.sources.get(sourceId);
    if (!record) {
      return { success: false, error: `Source ID "${sourceId}" not found` };
    }

    const dom = record.canonicalDomain.toLowerCase();
    if (
      newStatus === "approved" &&
      (PROHIBITED_SOCIAL_DOMAINS.includes(dom) || DISABLED_ENCYCLOPEDIA_DOMAINS.includes(dom))
    ) {
      return {
        success: false,
        error: `Domain "${dom}" is on the mandatory policy denylist (Social Media / Wikipedia) and cannot be approved as a factual source.`
      };
    }

    const previousStatus = record.approvalStatus;
    record.approvalStatus = newStatus;
    record.lastValidationTime = new Date().toISOString();
    if (newStatus !== "approved") {
      record.integrationHealth = "disabled";
    } else if (record.integrationHealth === "disabled") {
      record.integrationHealth = "healthy";
    }
    if (adminNotes !== undefined) {
      record.adminNotes = adminNotes;
    }

    this.auditTrail.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor,
      action:
        newStatus === "approved"
          ? "APPROVE_SOURCE"
          : newStatus === "rejected"
          ? "REJECT_SOURCE"
          : newStatus === "suspended"
          ? "SUSPEND_SOURCE"
          : "DEPRECATE_SOURCE",
      sourceId,
      summary: `Changed status of ${record.publisherName} (${record.canonicalDomain}) from ${previousStatus} to ${newStatus}`
    });

    return { success: true, record };
  }

  public addSource(
    newRecord: Omit<SourceRegistryRecord, "lastSuccessfulRetrieval" | "lastValidationTime" | "recentFailureCount">,
    actor = "admin"
  ): { success: boolean; error?: string; record?: SourceRegistryRecord } {
    const dom = newRecord.canonicalDomain.trim().toLowerCase();
    if (isPrivateOrProhibitedHost(dom)) {
      return {
        success: false,
        error: `Invalid or prohibited canonical domain "${dom}"`
      };
    }

    if (
      newRecord.approvalStatus === "approved" &&
      (PROHIBITED_SOCIAL_DOMAINS.includes(dom) || DISABLED_ENCYCLOPEDIA_DOMAINS.includes(dom))
    ) {
      return {
        success: false,
        error: `Prohibited domain "${dom}" cannot be added with "approved" status`
      };
    }

    const fullRecord: SourceRegistryRecord = {
      ...newRecord,
      canonicalDomain: dom,
      lastSuccessfulRetrieval: null,
      lastValidationTime: new Date().toISOString(),
      recentFailureCount: 0
    };

    this.sources.set(fullRecord.id, fullRecord);
    this.auditTrail.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor,
      action: "ADD_SOURCE",
      sourceId: fullRecord.id,
      summary: `Added source ${fullRecord.publisherName} (${fullRecord.canonicalDomain}) with status ${fullRecord.approvalStatus}`
    });

    return { success: true, record: fullRecord };
  }

  public updateFreshnessRequirements(
    sourceId: string,
    maxContentAgeMs: number,
    maxCacheDurationMs: number,
    actor = "admin"
  ): { success: boolean; record?: SourceRegistryRecord } {
    const record = this.sources.get(sourceId);
    if (!record) return { success: false };
    record.maxContentAgeMs = Math.max(15000, maxContentAgeMs);
    record.maxCacheDurationMs = Math.max(5000, maxCacheDurationMs);
    record.lastValidationTime = new Date().toISOString();

    this.auditTrail.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor,
      action: "UPDATE_FRESHNESS_POLICY",
      sourceId,
      summary: `Updated ${record.publisherName} maxContentAge=${Math.round(record.maxContentAgeMs / 60000)}m, maxCache=${Math.round(record.maxCacheDurationMs / 1000)}s`
    });
    return { success: true, record };
  }

  public recordAdapterSuccess(sourceId: string): void {
    const record = this.sources.get(sourceId);
    if (!record) return;
    record.lastSuccessfulRetrieval = new Date().toISOString();
    record.recentFailureCount = 0;
    if (record.integrationHealth !== "disabled") {
      record.integrationHealth = "healthy";
    }
  }

  public recordAdapterFailure(sourceId: string, errorMessage: string): void {
    const record = this.sources.get(sourceId);
    if (!record) return;
    record.recentFailureCount += 1;
    record.lastErrorMessage = errorMessage;
    if (record.integrationHealth !== "disabled") {
      record.integrationHealth = record.recentFailureCount >= 3 ? "unhealthy" : "degraded";
    }
  }

  public setIntegrationHealth(
    sourceId: string,
    health: IntegrationHealthStatus,
    actor = "admin"
  ): { success: boolean; record?: SourceRegistryRecord } {
    const record = this.sources.get(sourceId);
    if (!record) return { success: false };
    record.integrationHealth = health;
    this.auditTrail.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      actor,
      action: "HEALTH_STATUS_CHANGE",
      sourceId,
      summary: `Set integration health of ${record.publisherName} to ${health}`
    });
    return { success: true, record };
  }
}

export const globalSourceRegistry = new SourceRegistryService();
