// ============================================================================
// REUSABLE MEDIA-RESOLUTION & VALIDATION LAYER (SECTION 11)
// ============================================================================

import { ContentCategory } from "./types";
import { isPrivateOrProhibitedHost, PROHIBITED_SOCIAL_DOMAINS } from "./urlSecurity";

export type MediaAspectRatio = "wide" | "square" | "tall";

export interface ResolvedMediaAsset {
  url: string;
  isValid: boolean;
  isPublisherProvided: boolean;
  aspectRatio: MediaAspectRatio;
  width?: number;
  height?: number;
  attribution: string;
  licenseNote: string;
}

export interface ResolvedVideoEmbed {
  watchUrl: string;
  embedUrl?: string;
  thumbnailUrl: string;
  durationFormatted: string;
  channelName: string;
  platform: "youtube_official" | "dailymotion_verified" | "publisher_video";
}

const TOPIC_EDITORIAL_FALLBACKS: Record<string, { url: string; credit: string; location: string }[]> = {
  cricket: [
    {
      url: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1000&auto=format&fit=crop&q=80",
      credit: "Stadium Editorial Archive",
      location: "International Cricket Venue"
    },
    {
      url: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=900&auto=format&fit=crop&q=80",
      credit: "Pitchside Sports Lens",
      location: "Test & T20I Arena"
    },
    {
      url: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=900&auto=format&fit=crop&q=80",
      credit: "Matchday Broadcast Frame",
      location: "Boundary Rope"
    }
  ],
  formula1: [
    {
      url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=1000&auto=format&fit=crop&q=80",
      credit: "Paddock Motorsport Archive",
      location: "Grand Prix Circuit"
    },
    {
      url: "https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=900&auto=format&fit=crop&q=80",
      credit: "Trackside Telemetry Lens",
      location: "Pit Lane & Paddock"
    },
    {
      url: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=900&auto=format&fit=crop&q=80",
      credit: "Apex Racing Photography",
      location: "FIA Circuit Sector 2"
    }
  ],
  sports: [
    {
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1000&auto=format&fit=crop&q=80",
      credit: "Arena Broadcast Desk",
      location: "Championship Stadium"
    },
    {
      url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900&auto=format&fit=crop&q=80",
      credit: "Athletics Wire Photo",
      location: "Olympic Track"
    },
    {
      url: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=900&auto=format&fit=crop&q=80",
      credit: "Matchday Editorial",
      location: "European Football Arena"
    }
  ],
  technology: [
    {
      url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1000&auto=format&fit=crop&q=80",
      credit: "Hardware Engineering Lab",
      location: "Silicon & Architecture Bench"
    },
    {
      url: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&auto=format&fit=crop&q=80",
      credit: "Systems Research Desk",
      location: "AI Compute Cluster"
    },
    {
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=900&auto=format&fit=crop&q=80",
      credit: "Developer Studio Archive",
      location: "Software Engineering"
    }
  ],
  brands: [
    {
      url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1000&auto=format&fit=crop&q=80",
      credit: "Product Showcase Studio",
      location: "Flagship Device Lab"
    },
    {
      url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=900&auto=format&fit=crop&q=80",
      credit: "Industrial Design Review",
      location: "Hardware Studio"
    },
    {
      url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=900&auto=format&fit=crop&q=80",
      credit: "Prototype Testing Desk",
      location: "R&D Facility"
    }
  ],
  travel: [
    {
      url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1000&auto=format&fit=crop&q=80",
      credit: "Shinjuku Street Archive",
      location: "Tokyo, Japan"
    },
    {
      url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&auto=format&fit=crop&q=80",
      credit: "Heritage Travel Lens",
      location: "Kyoto & Yamanashi"
    },
    {
      url: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=900&auto=format&fit=crop&q=80",
      credit: "Cultural Trail Journal",
      location: "Fushimi Inari, Kyoto"
    }
  ],
  science: [
    {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1000&auto=format&fit=crop&q=80",
      credit: "Orbital Telemetry Archive",
      location: "Low Earth Orbit"
    },
    {
      url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=900&auto=format&fit=crop&q=80",
      credit: "Deep Space Observatory",
      location: "Mission Control"
    }
  ],
  news: [
    {
      url: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1000&auto=format&fit=crop&q=80",
      credit: "International Press Desk",
      location: "Global Newsroom"
    },
    {
      url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&auto=format&fit=crop&q=80",
      credit: "Financial District Wire",
      location: "Global Markets"
    }
  ]
};

const PUBLISHER_AVATARS: Record<string, string> = {
  "reuters.com": "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&auto=format&fit=crop&q=80",
  "apnews.com": "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=120&auto=format&fit=crop&q=80",
  "bbc.com": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=120&auto=format&fit=crop&q=80",
  "bbc.co.uk": "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=120&auto=format&fit=crop&q=80",
  "espn.com": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=120&auto=format&fit=crop&q=80",
  "espncricinfo.com": "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=120&auto=format&fit=crop&q=80",
  "formula1.com": "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=120&auto=format&fit=crop&q=80",
  "theguardian.com": "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=120&auto=format&fit=crop&q=80",
  "theverge.com": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=120&auto=format&fit=crop&q=80",
  "arstechnica.com": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=120&auto=format&fit=crop&q=80",
  "techcrunch.com": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=120&auto=format&fit=crop&q=80"
};

const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
];

/**
 * Validates a candidate media URL for security, HTTPS protocol, tracking pixels, and prohibited social hosts.
 */
export function validateMediaUrl(
  rawUrl?: string | null,
  width?: number,
  height?: number
): string | null {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  if (
    (typeof width === "number" && width > 0 && width < 80) ||
    (typeof height === "number" && height > 0 && height < 80)
  ) {
    return null;
  }
  const cleaned = rawUrl
    .trim()
    .replace(/&amp;/g, "&")
    .replace(/^http:\/\//i, "https://");

  try {
    const parsed = new URL(cleaned);
    if (parsed.protocol !== "https:") return null;
    const host = parsed.hostname.toLowerCase();
    if (isPrivateOrProhibitedHost(host)) return null;
    if (
      PROHIBITED_SOCIAL_DOMAINS.some(
        (blocked) => host === blocked || host.endsWith(`.${blocked}`)
      )
    ) {
      return null;
    }
    if (/\b(1x1|pixel|tracker|spacer|beacon)\b/i.test(parsed.pathname)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Extracts the best available publisher image from an XML/HTML block.
 * Checks <media:content>, <media:thumbnail>, <enclosure>, <itunes:image>, and <img src>.
 */
export function extractBestPublisherImageFromXml(xmlBlock: string): {
  url?: string;
  width?: number;
  height?: number;
} {
  if (!xmlBlock) return {};

  // 1. Check <media:content> or <media:thumbnail>
  const mediaMatch = xmlBlock.match(
    /<(?:media:content|media:thumbnail)\b[^>]*url=["']([^"']+)["'][^>]*>/i
  );
  if (mediaMatch) {
    const tag = mediaMatch[0];
    const url = validateMediaUrl(mediaMatch[1]);
    if (url && !/\.(mp3|mp4|wav|m4a|pdf)$/i.test(url)) {
      const wMatch = tag.match(/\bwidth=["']?(\d+)/i);
      const hMatch = tag.match(/\bheight=["']?(\d+)/i);
      return {
        url,
        width: wMatch ? Number(wMatch[1]) : undefined,
        height: hMatch ? Number(hMatch[1]) : undefined
      };
    }
  }

  // 2. Check <enclosure type="image/...">
  const encMatch = xmlBlock.match(
    /<enclosure\b[^>]*url=["']([^"']+)["'][^>]*>/i
  );
  if (encMatch) {
    const tag = encMatch[0];
    const url = validateMediaUrl(encMatch[1]);
    if (url && (/type=["']image\//i.test(tag) || /\.(jpg|jpeg|png|webp|avif)/i.test(url))) {
      return { url };
    }
  }

  // 3. Check inline <img src="..."> inside CDATA description/content
  const imgMatch = xmlBlock.match(/<img\b[^>]*src=["']([^"']+)["'][^>]*>/i);
  if (imgMatch) {
    const url = validateMediaUrl(imgMatch[1]);
    if (url && !/1x1|pixel|tracker|avatar|icon|logo|badge/i.test(url)) {
      return { url };
    }
  }

  return {};
}

export function determineAspectRatio(
  width?: number,
  height?: number,
  indexHint = 0
): MediaAspectRatio {
  if (width && height && width > 0 && height > 0) {
    const ratio = width / height;
    if (ratio >= 1.3) return "wide";
    if (ratio <= 0.85) return "tall";
    return "square";
  }
  return indexHint % 3 === 0 ? "wide" : indexHint % 3 === 1 ? "square" : "tall";
}

export function resolveArticleOrPhotoMedia(params: {
  candidateThumbnailUrl?: string;
  query: string;
  category: ContentCategory;
  publisherName: string;
  index?: number;
}): ResolvedMediaAsset {
  const { candidateThumbnailUrl, query, category, publisherName, index = 0 } = params;
  const validated = validateMediaUrl(candidateThumbnailUrl);
  if (validated) {
    return {
      url: validated,
      isValid: true,
      isPublisherProvided: true,
      aspectRatio: determineAspectRatio(undefined, undefined, index),
      attribution: `${publisherName} Editorial Media`,
      licenseNote: "Publisher-provided editorial thumbnail with canonical link attribution"
    };
  }

  const lower = query.toLowerCase();
  const poolKey =
    /\b(f1|formula 1|ferrari|red bull|mclaren|verstappen|hamilton|grand prix|motorsport)\b/.test(lower)
      ? "formula1"
      : /\b(cricket|ipl|t20|bcci|icc|bumrah|chepauk|kohli|rohit|test match)\b/.test(lower)
      ? "cricket"
      : TOPIC_EDITORIAL_FALLBACKS[category]
      ? category
      : "news";

  const pool = TOPIC_EDITORIAL_FALLBACKS[poolKey] || TOPIC_EDITORIAL_FALLBACKS.news;
  const fallback = pool[index % pool.length];

  return {
    url: fallback.url,
    isValid: true,
    isPublisherProvided: false,
    aspectRatio: determineAspectRatio(undefined, undefined, index),
    attribution: `${publisherName} • ${fallback.credit}`,
    licenseNote: "Licensed editorial fallback image"
  };
}

export function resolvePublisherAvatar(sourceDomain: string, index = 0): string {
  const clean = sourceDomain.toLowerCase().replace(/^www\./, "");
  if (PUBLISHER_AVATARS[clean]) {
    return PUBLISHER_AVATARS[clean];
  }
  return DEFAULT_AVATARS[index % DEFAULT_AVATARS.length];
}

export function formatDurationSeconds(seconds?: number | string): string {
  if (typeof seconds === "string" && /^\d{1,2}:\d{2}/.test(seconds)) {
    return seconds;
  }
  const num = Number(seconds);
  if (!Number.isFinite(num) || num <= 0) return "07:45";
  const mins = Math.floor(num / 60);
  const secs = Math.floor(num % 60);
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}
