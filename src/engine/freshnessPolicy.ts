// ============================================================================
// REAL-TIME & CATEGORY-SPECIFIC FRESHNESS POLICIES (SECTION 8)
// ============================================================================

import { ContentCategory, FreshnessStatus, SportEventStatus } from "./types";

export interface CategoryFreshnessPolicy {
  category: ContentCategory;
  liveTargetMs: number; // e.g., 45s for live scores
  freshTargetMs: number; // Preferred "fresh" window
  maxEligibleAgeMs: number; // Maximum age before considered stale for current queries
  cacheTtlMs: number; // Default cache TTL
  allowStaleWhileRevalidate: boolean;
  description: string;
}

export const DEFAULT_CATEGORY_FRESHNESS_POLICIES: Record<ContentCategory, CategoryFreshnessPolicy> = {
  live_scores: {
    category: "live_scores",
    liveTargetMs: 45 * 1000, // 45 seconds
    freshTargetMs: 60 * 1000, // 60 seconds
    maxEligibleAgeMs: 5 * 60 * 1000, // 5 minutes max before marked stale
    cacheTtlMs: 30 * 1000, // 30s cache TTL
    allowStaleWhileRevalidate: false, // Never imply an old score is current
    description: "Refresh every 15-60 seconds during active matches"
  },
  news: {
    category: "news",
    liveTargetMs: 15 * 60 * 1000, // 15 minutes for breaking news
    freshTargetMs: 60 * 60 * 1000, // 60 minutes
    maxEligibleAgeMs: 24 * 60 * 60 * 1000, // 24 hours for regular current news
    cacheTtlMs: 3 * 60 * 1000, // 3 minutes cache
    allowStaleWhileRevalidate: true,
    description: "Prefer items published within 15-60m for breaking news, 24h for current news"
  },
  sports: {
    category: "sports",
    liveTargetMs: 30 * 60 * 1000,
    freshTargetMs: 6 * 60 * 60 * 1000, // 6 hours
    maxEligibleAgeMs: 72 * 60 * 60 * 1000, // 72 hours for match reports/previews/fixtures
    cacheTtlMs: 3 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Match reports, fixtures, and confirmed team news within 72 hours"
  },
  technology: {
    category: "technology",
    liveTargetMs: 24 * 60 * 60 * 1000,
    freshTargetMs: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEligibleAgeMs: 90 * 24 * 60 * 60 * 1000, // 90 days for releases & engineering docs
    cacheTtlMs: 15 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Prefer recent announcements and release notes; retain active documentation"
  },
  brands: {
    category: "brands",
    liveTargetMs: 24 * 60 * 60 * 1000,
    freshTargetMs: 14 * 24 * 60 * 60 * 1000, // 14 days
    maxEligibleAgeMs: 180 * 24 * 60 * 60 * 1000, // 180 days for official specs & corporate newsrooms
    cacheTtlMs: 30 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Prefer latest official product documentation and corporate press releases"
  },
  science: {
    category: "science",
    liveTargetMs: 7 * 24 * 60 * 60 * 1000,
    freshTargetMs: 30 * 24 * 60 * 60 * 1000,
    maxEligibleAgeMs: 365 * 24 * 60 * 60 * 1000,
    cacheTtlMs: 30 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Peer-reviewed and institutional research updates"
  },
  government: {
    category: "government",
    liveTargetMs: 6 * 60 * 60 * 1000,
    freshTargetMs: 7 * 24 * 60 * 60 * 1000,
    maxEligibleAgeMs: 180 * 24 * 60 * 60 * 1000,
    cacheTtlMs: 15 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Official public advisories, policy announcements, and registries"
  },
  education: {
    category: "education",
    liveTargetMs: 30 * 24 * 60 * 60 * 1000,
    freshTargetMs: 180 * 24 * 60 * 60 * 1000,
    maxEligibleAgeMs: 730 * 24 * 60 * 60 * 1000,
    cacheTtlMs: 60 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Evergreen educational and reference material from maintained institutions"
  },
  entertainment: {
    category: "entertainment",
    liveTargetMs: 6 * 60 * 60 * 1000,
    freshTargetMs: 48 * 60 * 60 * 1000,
    maxEligibleAgeMs: 30 * 24 * 60 * 60 * 1000,
    cacheTtlMs: 10 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Verified film, television, and cultural releases"
  },
  gaming: {
    category: "gaming",
    liveTargetMs: 12 * 60 * 60 * 1000,
    freshTargetMs: 7 * 24 * 60 * 60 * 1000,
    maxEligibleAgeMs: 60 * 24 * 60 * 60 * 1000,
    cacheTtlMs: 10 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Official patch notes, studio announcements, and gaming reviews"
  },
  weather: {
    category: "weather",
    liveTargetMs: 10 * 60 * 1000,
    freshTargetMs: 30 * 60 * 1000,
    maxEligibleAgeMs: 3 * 60 * 60 * 1000,
    cacheTtlMs: 5 * 60 * 1000,
    allowStaleWhileRevalidate: false,
    description: "Meteorological advisories and environmental monitoring"
  },
  finance: {
    category: "finance",
    liveTargetMs: 5 * 60 * 1000,
    freshTargetMs: 60 * 60 * 1000,
    maxEligibleAgeMs: 24 * 60 * 60 * 1000,
    cacheTtlMs: 2 * 60 * 1000,
    allowStaleWhileRevalidate: false,
    description: "Financial news, earnings filings, and market developments"
  },
  travel: {
    category: "travel",
    liveTargetMs: 24 * 60 * 60 * 1000,
    freshTargetMs: 14 * 24 * 60 * 60 * 1000,
    maxEligibleAgeMs: 180 * 24 * 60 * 60 * 1000,
    cacheTtlMs: 30 * 60 * 1000,
    allowStaleWhileRevalidate: true,
    description: "Official transport advisories and destination publications"
  }
};

export function isHistoricalQueryIntent(query: string): boolean {
  const lower = query.toLowerCase();
  if (
    /\b(history|historical|archive|origins?|retrospective|in (19\d\d|200\d|201\d|202[0-4])|classic|decade|century|timeline)\b/.test(
      lower
    )
  ) {
    return true;
  }
  return false;
}

export function isBreakingNewsIntent(query: string): boolean {
  const lower = query.toLowerCase();
  return /\b(breaking|right now|just in|live update|happening now|urgent|today'?s?|this hour)\b/.test(
    lower
  );
}

export function parseValidIsoTimestamp(rawDate?: string | number | Date | null): string | null {
  if (!rawDate) return null;
  try {
    const d = new Date(rawDate);
    if (isNaN(d.getTime())) return null;
    // Reject future dates more than 24h ahead (malformed clock) or dates before 1971
    if (d.getTime() > Date.now() + 24 * 3600 * 1000 || d.getTime() < 31536000000) {
      return null;
    }
    return d.toISOString();
  } catch {
    return null;
  }
}

/**
 * Evaluates content freshness strictly from publisher's `publishedAt` / `updatedAt`
 * (NEVER from `retrievedAt`).
 */
export function evaluateContentFreshness(params: {
  publishedAt: string | null;
  updatedAt?: string | null;
  category: ContentCategory;
  sourceMaxAgeMs?: number;
  isHistoricalQuery?: boolean;
  isBreakingQuery?: boolean;
  nowMs?: number;
}): {
  freshnessStatus: FreshnessStatus;
  isEligible: boolean;
  ageMs: number | null;
  reason: string;
} {
  const {
    publishedAt,
    updatedAt,
    category,
    sourceMaxAgeMs,
    isHistoricalQuery = false,
    isBreakingQuery = false,
    nowMs = Date.now()
  } = params;

  const validPub = parseValidIsoTimestamp(publishedAt);
  const validUpd = parseValidIsoTimestamp(updatedAt);
  const effectiveIso = validUpd || validPub;

  if (!effectiveIso) {
    return {
      freshnessStatus: "unverified",
      isEligible: !isBreakingQuery, // Breaking news requires verified publication timestamp
      ageMs: null,
      reason: "Publication or update timestamp is missing or ambiguous; marked unverified"
    };
  }

  const effectiveTimeMs = new Date(effectiveIso).getTime();
  const ageMs = Math.max(0, nowMs - effectiveTimeMs);
  const policy = DEFAULT_CATEGORY_FRESHNESS_POLICIES[category] || DEFAULT_CATEGORY_FRESHNESS_POLICIES.news;

  // If historical query intent, preserve older approved material
  if (isHistoricalQuery) {
    return {
      freshnessStatus: ageMs <= policy.freshTargetMs ? "fresh" : "historical_valid",
      isEligible: true,
      ageMs,
      reason: "Historical query intent preserves verified archival material"
    };
  }

  // Breaking news enforces a stricter 60-minute window (or up to 6h for developing stories)
  const effectiveMaxAgeMs = isBreakingQuery
    ? Math.min(6 * 60 * 60 * 1000, policy.maxEligibleAgeMs)
    : sourceMaxAgeMs
    ? Math.min(sourceMaxAgeMs, policy.maxEligibleAgeMs)
    : policy.maxEligibleAgeMs;

  if (ageMs <= policy.liveTargetMs) {
    return {
      freshnessStatus: "live",
      isEligible: true,
      ageMs,
      reason: `Published/updated ${Math.round(ageMs / 60000)}m ago (within live window)`
    };
  }

  if (ageMs <= policy.freshTargetMs) {
    return {
      freshnessStatus: "fresh",
      isEligible: true,
      ageMs,
      reason: `Published/updated ${Math.round(ageMs / 60000)}m ago (within fresh target)`
    };
  }

  if (ageMs <= effectiveMaxAgeMs) {
    return {
      freshnessStatus: "recent",
      isEligible: true,
      ageMs,
      reason: `Published/updated ${Math.round(ageMs / 3600000)}h ago (within category policy)`
    };
  }

  return {
    freshnessStatus: "stale",
    isEligible: false,
    ageMs,
    reason: `Content age (${Math.round(ageMs / 3600000)}h) exceeds allowed ${category} freshness limit (${Math.round(
      effectiveMaxAgeMs / 3600000
    )}h)`
  };
}

/**
 * Evaluates live sports score freshness so completed or stale cached matches
 * are NEVER labeled as live.
 */
export function evaluateSportsScoreFreshness(params: {
  eventStatus: SportEventStatus;
  providerUpdatedAt: string | null;
  retrievedAt: string;
  nowMs?: number;
}): {
  isLive: boolean;
  isStale: boolean;
  freshnessLabel: string;
} {
  const { eventStatus, providerUpdatedAt, retrievedAt, nowMs = Date.now() } = params;
  const activeStatuses: SportEventStatus[] = ["live", "halftime"];
  const isStatusActive = activeStatuses.includes(eventStatus);

  const refTimestamp = parseValidIsoTimestamp(providerUpdatedAt) || parseValidIsoTimestamp(retrievedAt);
  const ageMs = refTimestamp ? Math.max(0, nowMs - new Date(refTimestamp).getTime()) : Infinity;

  // Live scores exceed freshness if older than 120 seconds without verification
  const LIVE_SCORE_STALE_THRESHOLD_MS = 120 * 1000;

  if (!isStatusActive) {
    return {
      isLive: false,
      isStale: false,
      freshnessLabel:
        eventStatus === "completed"
          ? "Final Official Result"
          : eventStatus === "scheduled"
          ? "Scheduled Fixture"
          : `Status: ${eventStatus.toUpperCase()}`
    };
  }

  if (ageMs > LIVE_SCORE_STALE_THRESHOLD_MS) {
    return {
      isLive: false,
      isStale: true,
      freshnessLabel: `Stale Score (Last verified ${Math.round(ageMs / 1000)}s ago)`
    };
  }

  return {
    isLive: true,
    isStale: false,
    freshnessLabel: `Live Verified (${Math.max(1, Math.round(ageMs / 1000))}s ago)`
  };
}
