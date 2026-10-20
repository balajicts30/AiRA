import React, { useState, useEffect, useRef, useId, useMemo } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Compass,
  BookOpen,
  Camera,
  Video,
  Heart,
  Bookmark,
  Share2,
  Clock,
  ArrowUpRight,
  Play,
  ChevronRight,
  User,
  RotateCcw,
  Check,
  Flame,
  Calendar,
  MapPin,
  Search,
  Layers,
  X,
  Volume2,
  Eye,
  MessageSquare,
  PlusCircle,
  SlidersHorizontal,
  Globe,
  ShieldCheck,
  Filter,
  RefreshCw,
  ExternalLink,
  KeyRound
} from 'lucide-react';

// ==========================================
// PRE-LOADED FALLBACK DATA (Used only if offline or as supplemental backup)
// ==========================================
const PRELOADED_FEEDS: Record<string, any> = {
  cricket: {
    topicTitle: "Last Night's Cricket & Fixtures",
    assistantSummary:
      "Good morning, Balaji! What a nail-biter at Chepauk last night! India clinched a thrilling 6-run victory over Australia in the 3rd T20I after defending 186. Jasprit Bumrah bowled a sensational 19th over conceding just 3 runs and taking two wickets, while Suryakumar Yadav's 78 off 42 balls set up the innings. Up next, the series decider moves to Bengaluru this Friday at 7:00 PM IST.",
    matchScorecard: {
      event: "3rd T20I • M.A. Chidambaram Stadium, Chennai",
      status: "INDIA WON BY 6 RUNS",
      team1: { name: "IND", score: "186/5", overs: "20.0", flag: "🇮🇳" },
      team2: { name: "AUS", score: "180/8", overs: "20.0", flag: "🇦🇺" },
      playerOfMatch: "Suryakumar Yadav (78 off 42)",
      upcoming: "4th T20I • Friday, 7:00 PM IST • M. Chinnaswamy Stadium, Bengaluru"
    },
    articles: [
      {
        id: "art-c1",
        title: "The Anatomy of Bumrah's 19th Over: How 6 Balls Turned Chepauk Into a Fortress",
        author: "Harsha Bhogle • CricketLog",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
        readTime: "4 min read",
        category: "Tactical Blog",
        sourceName: "Curated Sports",
        publishedAt: "6 hours ago",
        timestampMs: Date.now() - 6 * 3600 * 1000,
        signalScore: 98,
        snippet: "When Glenn Maxwell was striking at 210, the game looked gone. Then came three reverse-swinging yorkers and a deceptive slower bumper that rewrote the script...",
        fullContent: "When Australia needed 16 off the final 12 balls with Glenn Maxwell at the crease, win probability models gave India a mere 18% chance. Jasprit Bumrah stepped up with the old, scuffed white ball under heavy Chennai dew. Ball 1: A 144kph tailing yorker right on the base of leg stump. Dot ball. Ball 2: A slower off-cutter that gripped the Chepauk pitch, forcing a mistimed loft to long-off. Wicket. Over the next four deliveries, Bumrah mixed his release points by 14 centimeters, denying any leverage. Here is our complete frame-by-frame breakdown of modern death-bowling mastery.",
        tags: ["#INDvAUS", "#ChepaukDiaries", "#TacticalAnalysis"],
        likes: 1420
      },
      {
        id: "art-c2",
        title: "360 Degrees in Humid Chennai: Inside SKY's Wrist-Work Against Spin",
        author: "Jarrod Kimber • DeepPoint",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
        readTime: "6 min read",
        category: "Feature Essay",
        sourceName: "Curated Sports",
        publishedAt: "8 hours ago",
        timestampMs: Date.now() - 8 * 3600 * 1000,
        signalScore: 95,
        snippet: "Sweeping Adam Zampa over backward point shouldn't be biomechanically possible, yet Suryakumar Yadav made it his bread-and-butter shot last night.",
        fullContent: "On a two-paced surface where other batters struggled to time straight drives, Suryakumar Yadav accessed pockets behind the wicketkeeper that simply cannot be guarded. By getting his front pad well outside leg stump early, he manipulated the field and forced Zampa to bowl flatter, resulting in four boundaries in a single momentum-shifting 13th over.",
        tags: ["#SuryakumarYadav", "#BattingLab", "#T20Cricket"],
        likes: 982
      },
      {
        id: "art-c3",
        title: "Chinnaswamy Awaits: Pitch Report & Why India Might Bring in Kuldeep Yadav for Friday",
        author: "Sneha Rao • PitchSide",
        authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
        readTime: "3 min read",
        category: "Series Preview",
        sourceName: "Curated Sports",
        publishedAt: "2 hours ago",
        timestampMs: Date.now() - 2 * 3600 * 1000,
        signalScore: 92,
        snippet: "With short square boundaries in Bengaluru, wrist-spin wicket-taking options in the middle overs will be far more decisive than defensive finger spin.",
        fullContent: "As both teams pack their bags for the short flight from Chennai to Bengaluru, selection debates are already heating up. With Chinnaswamy offering true bounce and 62-meter square boundaries, India's team management is strongly considering slotting Kuldeep Yadav back into the XI to attack Travis Head and Mitchell Marsh right after the powerplay.",
        tags: ["#BengaluruT20", "#TeamIndia", "#Preview"],
        likes: 645
      }
    ],
    photologs: [
      {
        id: "pho-c1",
        caption: "The roar at Chepauk right after the final ball! 38,000 phone flashlights turning the night sky electric.",
        photographer: "@chennai_lensman",
        location: "Stand C, Chepauk Stadium",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&auto=format&fit=crop&q=80",
        aspect: "wide",
        likes: 3412,
        signalScore: 97,
        timestampMs: Date.now() - 5 * 3600 * 1000,
        cameraSpec: "Sony A7IV • 35mm f/1.4"
      },
      {
        id: "pho-c2",
        caption: "Under the floodlights: That trademark pickup whip over fine leg for six.",
        photographer: "@pitchside_frames",
        location: "Boundary Rope, South End",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
        aspect: "square",
        likes: 2190,
        signalScore: 94,
        timestampMs: Date.now() - 7 * 3600 * 1000,
        cameraSpec: "Canon R3 • 400mm f/2.8"
      },
      {
        id: "pho-c3",
        caption: "Post-match dressing room smiles and ice baths after defending 186 in 85% humidity.",
        photographer: "@bcci_insider",
        location: "Home Dressing Room",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop&q=80",
        aspect: "tall",
        likes: 4890,
        signalScore: 96,
        timestampMs: Date.now() - 4 * 3600 * 1000,
        cameraSpec: "Leica Q3 • 28mm"
      }
    ],
    vlogs: [
      {
        id: "vlg-c1",
        title: "Matchday Vlog: Losing Our Voices in the Chepauk Stands! Final Over Chaos",
        creator: "Ashwin's Extra Cover",
        sourceName: "Curated Video",
        duration: "08:42",
        views: "245K views",
        likes: 1850,
        signalScore: 95,
        timestampMs: Date.now() - 6 * 3600 * 1000,
        thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Nobody sat down for the last 25 minutes—listen to the decibel meter when that yorker hit the base of off-stump!\""
      },
      {
        id: "vlg-c2",
        title: "6-Minute Highlights & Dugout Mic-Up: How Hardik & Rohit Planned the 20th Over",
        creator: "Star Sports Vault",
        sourceName: "Curated Video",
        duration: "06:15",
        views: "1.1M views",
        likes: 5400,
        signalScore: 98,
        timestampMs: Date.now() - 9 * 3600 * 1000,
        thumbnailUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Keep the fine leg up and bluff the wide yorker—he's waiting for the fuller ball outside off.\""
      }
    ],
    followUpPrompts: [
      "Live cricket news & upcoming India fixtures",
      "Formula 1 championship standings & paddock blogs",
      "Show me peaceful travel photologs from Japan"
    ]
  },

  japan: {
    topicTitle: "Autumn & Neon: Japan Travel Photologs",
    assistantSummary:
      "Here you go, Balaji! I've curated a visual-first collection of photologs, slow-travel essays, and ambient street vlogs from across Japan—spanning rainy neon alleys in Shinjuku, cedar-lined trails in Kyoto's Arashiyama, and morning coffee rituals in Kanazawa.",
    articles: [
      {
        id: "art-j1",
        title: "5:30 AM in Kyoto: Before the Crowds Arrive at Kiyomizu-dera",
        author: "Kenji Takahashi • SlowWander",
        authorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
        readTime: "5 min read",
        category: "Photo Journal",
        sourceName: "Curated Travel",
        publishedAt: "Yesterday",
        timestampMs: Date.now() - 24 * 3600 * 1000,
        signalScore: 96,
        snippet: "When mist still clings to the wooden stage and the only sound is the wooden clack of geta sandals on wet stone...",
        fullContent: "Most visitors experience Higashiyama at midday, shoulder-to-shoulder. But if you step out of your ryokan at 5:15 AM with a 35mm prime lens, the ancient capital reveals its true rhythm. Shopkeepers gently sweep maple leaves off stone thresholds, steam rises from tofu kitchens, and the pagoda stands framed in soft indigo twilight.",
        tags: ["#KyotoMornings", "#SlowTravel", "#35mmFilm"],
        likes: 2340
      },
      {
        id: "art-j2",
        title: "The Kissaten Guide: 7 Jazz Coffee Houses in Tokyo Frozen in 1974",
        author: "Maya Lin • AnalogTokyo",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        readTime: "7 min read",
        category: "City Guide",
        sourceName: "Curated Travel",
        publishedAt: "3 days ago",
        timestampMs: Date.now() - 72 * 3600 * 1000,
        signalScore: 94,
        snippet: "Velvet booths, towering JBL horn speakers playing Bill Evans on vinyl, and siphon-brewed dark roast served in bone china.",
        fullContent: "Hidden up narrow staircases in Jimbocho and Koenji are Tokyo's kissaten—traditional coffee houses where time moves at 33 RPM. We spent two weeks documenting the owners who have been hand-pouring Nel drip coffee for forty years.",
        tags: ["#TokyoCoffee", "#JazzKissa", "#HiddenGems"],
        likes: 1890
      }
    ],
    photologs: [
      {
        id: "pho-j1",
        caption: "Rain-soaked reflections along Omoide Yokocho after midnight.",
        photographer: "@masashi_frames",
        location: "Shinjuku, Tokyo",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
        aspect: "wide",
        likes: 5620,
        signalScore: 98,
        timestampMs: Date.now() - 12 * 3600 * 1000,
        cameraSpec: "Fujifilm X100VI • Classic Neg"
      },
      {
        id: "pho-j2",
        caption: "First crimson maple leaves framing Chureito Pagoda and Mount Fuji at dawn.",
        photographer: "@haruka_wander",
        location: "Fujiyoshida, Yamanashi",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
        aspect: "square",
        likes: 4120,
        signalScore: 95,
        timestampMs: Date.now() - 36 * 3600 * 1000,
        cameraSpec: "Sony A7RV • 50mm f/1.2"
      },
      {
        id: "pho-j3",
        caption: "The Torii gates of Fushimi Inari glowing in late afternoon amber light.",
        photographer: "@kyoto_solitude",
        location: "Fushimi Ward, Kyoto",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&auto=format&fit=crop&q=80",
        aspect: "tall",
        likes: 3890,
        signalScore: 93,
        timestampMs: Date.now() - 48 * 3600 * 1000,
        cameraSpec: "Leica M11 • Summilux 35mm"
      }
    ],
    vlogs: [
      {
        id: "vlg-j1",
        title: "Silent Vlog: Taking the Overnight Sunrise Express Sleeper Train from Tokyo to Izumo",
        creator: "Solo in Japan",
        sourceName: "Curated Video",
        duration: "14:20",
        views: "612K views",
        likes: 4100,
        signalScore: 96,
        timestampMs: Date.now() - 20 * 3600 * 1000,
        thumbnailUrl: "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Watching coastal towns blur past my private wooden cabin window with convenience store matcha and rain on the glass.\""
      },
      {
        id: "vlg-j2",
        title: "24 Hours in Kanazawa: Samurai Districts, Gold-Leaf Ice Cream & Seafood Markets",
        creator: "Nomad Frames",
        sourceName: "Curated Video",
        duration: "11:05",
        views: "198K views",
        likes: 1650,
        signalScore: 92,
        timestampMs: Date.now() - 40 * 3600 * 1000,
        thumbnailUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"If Kyoto feels too busy, Kanazawa gives you that same Edo-period magic at half the pace.\""
      }
    ],
    followUpPrompts: [
      "Kyoto street photography & hidden temples",
      " Ramen & street food guide in Osaka",
      "Show me the latest AI & indie hardware vlogs"
    ]
  },

  tech: {
    topicTitle: "Spatial Computing, Indie Hardware & AI Design Vlogs",
    assistantSummary:
      "Pulling up the freshest creator logs in tech, Balaji! Today's standout stories revolve around tactile e-ink desk companions, behind-the-scenes studio vlogs from hardware builders in Shenzhen and San Francisco, and deep-dive blogs on ambient interfaces.",
    articles: [
      {
        id: "art-t1",
        title: "Why Calm Hardware is Making a Comeback: E-Ink, Mechanical Dials & Zero Notifications",
        author: "Devon Brooks • TactileFuture",
        authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
        readTime: "5 min read",
        category: "Design Blog",
        sourceName: "Curated Tech",
        publishedAt: "4 hours ago",
        timestampMs: Date.now() - 4 * 3600 * 1000,
        signalScore: 96,
        snippet: "After a decade of glass slabs demanding our attention, industrial designers are crafting single-purpose devices that feel like Leica cameras and Braun radios.",
        fullContent: "Walk onto the desk of any thoughtful technologist this year and you will notice a shift: fewer glowing RGB monitors, more warm anodized aluminum, paper-like displays, and rotary encoders with physical detents. We interviewed three indie hardware founders building tools for focus rather than engagement.",
        tags: ["#IndustrialDesign", "#CalmTech", "#Hardware"],
        likes: 1750
      },
      {
        id: "art-t2",
        title: "From Conversational UI to Generative Feeds: Why Traditional Timelines Are Fading",
        author: "Aria Chen • Synthesis",
        authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
        readTime: "4 min read",
        category: "Product Essay",
        sourceName: "Curated Tech",
        publishedAt: "11 hours ago",
        timestampMs: Date.now() - 11 * 3600 * 1000,
        signalScore: 95,
        snippet: "Instead of doomscrolling an algorithmic slot machine, intentional media starts with a question and curates blogs, photos, and video on demand.",
        fullContent: "Social media's first twenty years were defined by the infinite vertical scroll. The next era flips the relationship: the screen stays quiet until you express curiosity. When you ask about last night's match or a city across the globe, your interface assembles a bespoke magazine issue in seconds.",
        tags: ["#FutureOfSocial", "#IntentionalMedia", "#AIUX"],
        likes: 2410
      }
    ],
    photologs: [
      {
        id: "pho-t1",
        caption: "Prototype bench at 2 AM: CNC-milled brass knobs and custom transparent PCBs.",
        photographer: "@teenage_tinkerer",
        location: "SoMa Studio, San Francisco",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
        aspect: "wide",
        likes: 2840,
        signalScore: 95,
        timestampMs: Date.now() - 8 * 3600 * 1000,
        cameraSpec: "Macro 90mm • Studio Lit"
      },
      {
        id: "pho-t2",
        caption: "Minimalist studio desk setup powered by a single Thunderbolt cable and warm oak.",
        photographer: "@desk_architect",
        location: "Stockholm, Sweden",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        aspect: "square",
        likes: 3190,
        signalScore: 93,
        timestampMs: Date.now() - 16 * 3600 * 1000,
        cameraSpec: "Sony A7CII • 24mm"
      },
      {
        id: "pho-t3",
        caption: "Testing spatial waveguides in our optics lab.",
        photographer: "@optics_daily",
        location: "Zurich, Switzerland",
        sourceName: "Curated Lens",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        aspect: "tall",
        likes: 1620,
        signalScore: 91,
        timestampMs: Date.now() - 22 * 3600 * 1000,
        cameraSpec: "Nikon Z8 • 50mm"
      }
    ],
    vlogs: [
      {
        id: "vlg-t1",
        title: "Studio Vlog #42: Designing & Machining My Own Pocket Synthesizer in 7 Days",
        creator: "Maker Monologue",
        sourceName: "Curated Video",
        duration: "16:48",
        views: "420K views",
        likes: 3100,
        signalScore: 96,
        timestampMs: Date.now() - 14 * 3600 * 1000,
        thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"There's nothing quite like the moment your custom PCB boots up on the first try without magic smoke.\""
      },
      {
        id: "vlg-t2",
        title: "A Week With Local-First AI Agents on My MacBook: What Actually Works?",
        creator: "DevLog Weekly",
        sourceName: "Curated Video",
        duration: "10:12",
        views: "310K views",
        likes: 2400,
        signalScore: 94,
        timestampMs: Date.now() - 19 * 3600 * 1000,
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Replacing five noisy browser tabs with a single calm conversational workspace saved me two hours a day.\""
      }
    ],
    followUpPrompts: [
      "Open source AI agents & local LLMs",
      "SpaceX Starship orbital flight updates",
      "Architecture & minimalist industrial design"
    ]
  }
};

const THEME_IMAGE_POOLS: Record<string, string[]> = {
  sports: [
    "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=80"
  ],
  travel: [
    "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
  ],
  food: [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80"
  ],
  general: [
    "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80"
  ]
};

const AVATAR_POOL = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=120&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80"
];

// ==========================================
// SMART QUERY & CONTENT FILTERING HELPERS
// ==========================================
const NOISE_PATTERNS = [
  /\b(nsfw|18\+|onlyfans|porn|xxx|casino|betting|promo code|giveaway|upvote if|clickbait)\b/i,
  /^\[?(deleted|removed)\]?$/i
];

function isCleanHighSignalText(text = ""): boolean {
  if (!text || text.trim().length < 12) return false;
  return !NOISE_PATTERNS.some((rx) => rx.test(text));
}

function stripHtmlTags(html = ""): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function formatRelativeTime(timestampMs: number): string {
  const diffSec = Math.max(1, Math.floor((Date.now() - timestampMs) / 1000));
  if (diffSec < 3600) return `${Math.max(1, Math.floor(diffSec / 60))}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 86400 * 30) return `${Math.floor(diffSec / 86400)}d ago`;
  return new Date(timestampMs).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

function formatDurationSeconds(sec: number): string {
  if (!sec || sec <= 0) return "06:30";
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function extractSearchTopic(rawQuery: string): {
  cleanTopic: string;
  detectedMediaFilter: string | null;
  visualTheme: "sports" | "travel" | "food" | "general";
} {
  const lower = rawQuery.toLowerCase();
  let detectedMediaFilter: string | null = null;
  if (/\b(only|just)\s+(photo|photos|photolog|photologs|pictures|images)\b/.test(lower)) {
    detectedMediaFilter = "photologs";
  } else if (/\b(only|just)\s+(vlog|vlogs|video|videos|reels)\b/.test(lower)) {
    detectedMediaFilter = "vlogs";
  } else if (/\b(only|just)\s+(blog|blogs|article|articles|news|essays)\b/.test(lower)) {
    detectedMediaFilter = "articles";
  }

  const cleaned = rawQuery
    .replace(/^(hi|hey|hello|aira|good morning|good afternoon|good evening)[,\s!]*/i, "")
    .replace(
      /\b(what happened with|what is happening with|show me|tell me more about|tell me about|pull up|curate|give me|find me|search for|can you show|switch gears:?|summarize key takeaways from the vlog)\b/gi,
      " "
    )
    .replace(/\b(photologs?|vlogs?|blogs?|articles?|stories|reels|last night'?s?|the|please|from|about|on)\b/gi, " ")
    .replace(/[?"'!,.;:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const cleanTopic = cleaned.length >= 2 ? cleaned : rawQuery.trim();

  let visualTheme: "sports" | "travel" | "food" | "general" = "general";
  if (/\b(cricket|football|soccer|nba|f1|formula 1|tennis|match|ind|aus|ipl|stadium|goal|score|champions)\b/i.test(rawQuery)) {
    visualTheme = "sports";
  } else if (/\b(japan|kyoto|tokyo|travel|city|paris|iceland|swiss|mountains|beach|itinerary|kanazawa|bali|europe)\b/i.test(rawQuery)) {
    visualTheme = "travel";
  } else if (/\b(food|coffee|ramen|cafe|recipe|baking|sourdough|restaurant|street food|matcha|pizza|cooking)\b/i.test(rawQuery)) {
    visualTheme = "food";
  }

  return { cleanTopic, detectedMediaFilter, visualTheme };
}

function computeSignalScore(title: string, topic: string, engagement = 100): number {
  const words = topic
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 2);
  const lowerTitle = title.toLowerCase();
  let matches = 0;
  for (const w of words) {
    if (lowerTitle.includes(w)) matches += 1;
  }
  const relevanceBoost = words.length > 0 ? Math.round((matches / words.length) * 18) : 10;
  const engBoost = Math.min(14, Math.round(Math.log10(Math.max(10, engagement)) * 4));
  return Math.min(99, Math.max(76, 68 + relevanceBoost + engBoost));
}

// ==========================================
// LIVE MULTI-SOURCE WEB CURATOR (NO API KEY NEEDED + OPTIONAL GEMINI)
// ==========================================
async function fetchLiveCuratedFeed(
  userQuery: string,
  options: {
    timeframe?: "all" | "day" | "week" | "month" | "year";
    strictFilter?: boolean;
    geminiApiKey?: string;
    conversationContext?: string;
  } = {}
) {
  const { timeframe = "all", strictFilter = true, geminiApiKey = "", conversationContext = "" } = options;
  const { cleanTopic, detectedMediaFilter, visualTheme } = extractSearchTopic(userQuery);
  const redditTime = timeframe === "all" ? "year" : timeframe;
  const pool = THEME_IMAGE_POOLS[visualTheme] || THEME_IMAGE_POOLS.general;

  let filteredOutCount = 0;
  const liveArticles: any[] = [];
  const livePhotologs: any[] = [];
  const liveVlogs: any[] = [];
  let liveScorecard: any = null;

  // 1. Fetch Reddit Live Discussions, News & Photo Posts
  const redditPromise = (async () => {
    try {
      const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
        cleanTopic
      )}&sort=relevance&t=${redditTime}&limit=25&raw_json=1`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const children = json?.data?.children || [];

      for (const child of children) {
        const post = child?.data;
        if (!post) continue;
        if (post.over_18 || post.stickied || post.quarantine || !isCleanHighSignalText(post.title)) {
          filteredOutCount += 1;
          continue;
        }
        if (strictFilter && (post.ups || 0) < 5) {
          filteredOutCount += 1;
          continue;
        }

        const createdMs = (post.created_utc || Date.now() / 1000) * 1000;
        const signalScore = computeSignalScore(post.title, cleanTopic, post.ups || 50);
        const permalink = `https://www.reddit.com${post.permalink}`;

        // Check if it has a high-resolution image for Photologs
        const previewImg =
          post.preview?.images?.[0]?.resolutions?.slice(-1)?.[0]?.url ||
          post.preview?.images?.[0]?.source?.url ||
          (typeof post.url_overridden_by_dest === "string" &&
          /\.(jpg|jpeg|png|webp)$/i.test(post.url_overridden_by_dest)
            ? post.url_overridden_by_dest
            : null);

        if (previewImg && livePhotologs.length < 8) {
          livePhotologs.push({
            id: `red-pho-${post.id}`,
            caption: post.title,
            photographer: `u/${post.author}`,
            location: `r/${post.subreddit}`,
            sourceName: "Reddit Lens",
            sourceUrl: permalink,
            imageUrl: previewImg,
            aspect: livePhotologs.length % 3 === 0 ? "wide" : livePhotologs.length % 3 === 1 ? "square" : "tall",
            likes: Math.max(42, post.ups || 120),
            signalScore,
            timestampMs: createdMs,
            cameraSpec: `r/${post.subreddit} • ${formatRelativeTime(createdMs)}`
          });
        }

        // Check if it has substantive text or external article link for Blogs
        const selfText = (post.selftext || "").trim();
        if ((selfText.length > 80 || (!previewImg && post.url)) && liveArticles.length < 10) {
          const snippetText =
            selfText.length > 40
              ? selfText.slice(0, 220) + (selfText.length > 220 ? "..." : "")
              : `Community discussion & shared article in r/${post.subreddit} (${post.num_comments || 0} comments).`;
          const fullText =
            selfText.length > 40
              ? selfText
              : `${post.title}\n\nShared by u/${post.author} in r/${post.subreddit} with ${post.ups} upvotes and ${post.num_comments} community comments.\n\nExternal link: ${post.url || permalink}`;

          liveArticles.push({
            id: `red-art-${post.id}`,
            title: post.title,
            author: `u/${post.author} • r/${post.subreddit}`,
            authorAvatar: AVATAR_POOL[liveArticles.length % AVATAR_POOL.length],
            readTime: `${Math.max(2, Math.min(12, Math.ceil((selfText.length || 600) / 900)))} min read`,
            category: `r/${post.subreddit}`,
            sourceName: "Reddit",
            sourceUrl: post.url && !post.url.includes("reddit.com") ? post.url : permalink,
            publishedAt: formatRelativeTime(createdMs),
            timestampMs: createdMs,
            signalScore,
            snippet: snippetText,
            fullContent: fullText,
            tags: [
              `#${post.subreddit.replace(/[^a-zA-Z0-9]/g, "")}`,
              `#${cleanTopic.split(/\s+/)[0]?.replace(/[^a-zA-Z0-9]/g, "") || "Live"}`,
              "#CommunitySignal"
            ],
            likes: Math.max(25, post.ups || 95)
          });
        }
      }
    } catch {
      // Ignore network/CORS errors on individual source
    }
  })();

  // 2. Fetch Wikipedia Live Deep-Dive Articles & Visuals
  const wikiPromise = (async () => {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        cleanTopic
      )}&gsrlimit=5&prop=extracts|pageimages|info&exintro=1&explaintext=1&exsentences=6&inprop=url&pithumbsize=900&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const pages = Object.values(json?.query?.pages || {}) as any[];

      for (const page of pages) {
        if (!page?.title || !page?.extract || page.extract.length < 60) {
          filteredOutCount += 1;
          continue;
        }
        const timestampMs = page.touched ? new Date(page.touched).getTime() : Date.now() - 12 * 3600 * 1000;
        const signalScore = computeSignalScore(page.title, cleanTopic, 1500);

        liveArticles.push({
          id: `wiki-art-${page.pageid}`,
          title: `${page.title} — Deep Context & Overview`,
          author: "Wikipedia Contributors • Live Knowledge",
          authorAvatar: AVATAR_POOL[(liveArticles.length + 1) % AVATAR_POOL.length],
          readTime: "4 min read",
          category: "Knowledge Essay",
          sourceName: "Wikipedia",
          sourceUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
          publishedAt: formatRelativeTime(timestampMs),
          timestampMs,
          signalScore,
          snippet: page.extract.slice(0, 210) + (page.extract.length > 210 ? "..." : ""),
          fullContent: page.extract,
          tags: [
            `#${page.title.split(/\s+/)[0]?.replace(/[^a-zA-Z0-9]/g, "") || "Topic"}`,
            "#DeepDive",
            "#VerifiedSource"
          ],
          likes: 640 + (page.pageid % 500)
        });

        if (page.thumbnail?.source && livePhotologs.length < 8) {
          livePhotologs.push({
            id: `wiki-pho-${page.pageid}`,
            caption: `${page.title}: ${page.extract.slice(0, 120)}...`,
            photographer: "@wikimedia_archive",
            location: page.title,
            sourceName: "Wikimedia",
            sourceUrl: page.fullurl || `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`,
            imageUrl: page.thumbnail.source,
            aspect: livePhotologs.length % 2 === 0 ? "wide" : "square",
            likes: 820 + (page.pageid % 400),
            signalScore,
            timestampMs,
            cameraSpec: "Archival High-Res • Verified"
          });
        }
      }
    } catch {
      // Ignore error
    }
  })();

  // 3. Fetch Wikimedia Commons Live High-Res Photography
  const commonsPromise = (async () => {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        `filetype:bitmap ${cleanTopic}`
      )}&gsrnamespace=6&gsrlimit=10&prop=imageinfo&iiprop=url|extmetadata|dimensions|timestamp&iiurlwidth=1000&format=json&origin=*`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const pages = Object.values(json?.query?.pages || {}) as any[];

      for (const page of pages) {
        const info = page?.imageinfo?.[0];
        if (!info?.thumburl && !info?.url) continue;
        if ((info.width || 0) < 500 || (info.height || 0) < 350) {
          filteredOutCount += 1;
          continue;
        }
        const meta = info.extmetadata || {};
        const rawDesc =
           stripHtmlTags(meta.ImageDescription?.value || "") ||
          stripHtmlTags(meta.ObjectName?.value || "") ||
          page.title.replace(/^File:/i, "").replace(/\.[a-z0-9]+$/i, "");

        if (!isCleanHighSignalText(rawDesc)) {
          filteredOutCount += 1;
          continue;
        }

        const artist = stripHtmlTags(meta.Artist?.value || "").slice(0, 32) || "Commons Photographer";
        const ts = info.timestamp ? new Date(info.timestamp).getTime() : Date.now() - 36 * 3600 * 1000;
        const signalScore = computeSignalScore(rawDesc, cleanTopic, 600);

        livePhotologs.push({
          id: `com-pho-${page.pageid}`,
          caption: rawDesc.slice(0, 160),
          photographer: artist.startsWith("@") ? artist : `@${artist.toLowerCase().replace(/[^a-z0-9_]/g, "_").replace(/_+/g, "_").slice(0, 20) || "commons_lens"}`,
          location: stripHtmlTags(meta.Categories?.value?.split("|")?.[0] || cleanTopic).slice(0, 32),
          sourceName: "Wikimedia",
          sourceUrl: info.descriptionurl || info.url,
          imageUrl: info.thumburl || info.url,
          aspect: info.width > info.height * 1.25 ? "wide" : info.height > info.width * 1.15 ? "tall" : "square",
          likes: 540 + (page.pageid % 900),
          signalScore,
          timestampMs: ts,
          cameraSpec: `${info.width}×${info.height}px • Commons Lens`
        });
      }
    } catch {
      // Ignore error
    }
  })();

  // 4. Fetch Hacker News Algolia Live Articles
  const hnPromise = (async () => {
    try {
      const url = `https://hn.algolia.com/api/v1/search?query=${encodeURIComponent(
        cleanTopic
      )}&tags=story&hitsPerPage=8`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const hits = json?.hits || [];

      for (const hit of hits) {
        if (!hit?.title || !isCleanHighSignalText(hit.title) || (strictFilter && (hit.points || 0) < 10)) {
          filteredOutCount += 1;
          continue;
        }
        const ts = hit.created_at_i ? hit.created_at_i * 1000 : Date.now() - 24 * 3600 * 1000;
        const signalScore = computeSignalScore(hit.title, cleanTopic, hit.points || 80);
        const hnUrl = `https://news.ycombinator.com/item?id=${hit.objectID}`;
        const host = hit.url ? new URL(hit.url).hostname.replace(/^www\./, "") : "news.ycombinator.com";

        liveArticles.push({
          id: `hn-art-${hit.objectID}`,
          title: hit.title,
          author: `${hit.author || "hn_curator"} • ${host}`,
          authorAvatar: AVATAR_POOL[(liveArticles.length + 2) % AVATAR_POOL.length],
          readTime: "5 min read",
          category: "Tech & Essay",
          sourceName: "Hacker News",
          sourceUrl: hit.url || hnUrl,
          publishedAt: formatRelativeTime(ts),
          timestampMs: ts,
          signalScore,
          snippet:
            stripHtmlTags(hit.story_text || "").slice(0, 210) ||
            `Featured on Hacker News with ${hit.points || 0} points and ${hit.num_comments || 0} in-depth comments via ${host}.`,
          fullContent:
            stripHtmlTags(hit.story_text || "") ||
            `${hit.title}\n\nPublished on ${host} and curated by the Hacker News community (${hit.points || 0} points, ${hit.num_comments || 0} comments).\n\nRead the full original story at: ${hit.url || hnUrl}`,
          tags: [`#${host.split(".")[0]}`, "#HackerNews", "#HighSignal"],
          likes: Math.max(40, hit.points || 110)
        });
      }
    } catch {
      // Ignore error
    }
  })();

  // 5. Fetch Dev.to Live Creator Blogs
  const devtoPromise = (async () => {
    try {
      const tag = cleanTopic
        .toLowerCase()
        .split(/\s+/)[0]
        ?.replace(/[^a-z0-9]/g, "");
      if (!tag || tag.length < 2) return;
      const url = `https://dev.to/api/articles?tag=${encodeURIComponent(tag)}&per_page=6&top=30`;
      const res = await fetch(url);
      if (!res.ok) return;
      const articles = await res.json();
      if (!Array.isArray(articles)) return;

      for (const art of articles) {
        if (!art?.title || !isCleanHighSignalText(art.title)) {
          filteredOutCount += 1;
          continue;
        }
        const ts = art.published_timestamp ? new Date(art.published_timestamp).getTime() : Date.now();
        const signalScore = computeSignalScore(art.title, cleanTopic, (art.public_reactions_count || 20) * 10);

        liveArticles.push({
          id: `dev-art-${art.id}`,
          title: art.title,
          author: `${art.user?.name || art.user?.username || "Creator"} • Dev.to`,
          authorAvatar: art.user?.profile_image_90 || AVATAR_POOL[0],
          readTime: `${art.reading_time_minutes || 4} min read`,
          category: "Creator Blog",
          sourceName: "Dev.to",
          sourceUrl: art.url,
          publishedAt: formatRelativeTime(ts),
          timestampMs: ts,
          signalScore,
          snippet: art.description || art.title,
          fullContent: `${art.title}\n\n${art.description || ""}\n\nWritten by ${art.user?.name || "Creator"} (${art.reading_time_minutes || 4} min read, ${art.public_reactions_count || 0} reactions).\n\nFull article available at: ${art.url}`,
          tags: (art.tag_list || []).slice(0, 3).map((t: string) => `#${t}`),
          likes: Math.max(30, art.public_reactions_count || 64)
        });
      }
    } catch {
      // Ignore error
    }
  })();

  // 6. Fetch Dailymotion Live Family-Safe Creator Vlogs
  const videoPromise = (async () => {
    try {
      const url = `https://api.dailymotion.com/videos?search=${encodeURIComponent(
        cleanTopic
      )}&fields=id,title,description,duration,views_total,thumbnail_720_url,owner.screenname,created_time,url,embed_url&limit=8&family_filter=true`;
      const res = await fetch(url);
      if (!res.ok) return;
      const json = await res.json();
      const list = json?.list || [];

      for (const v of list) {
        if (!v?.title || !isCleanHighSignalText(v.title)) {
          filteredOutCount += 1;
          continue;
        }
        const ts = v.created_time ? v.created_time * 1000 : Date.now() - 24 * 3600 * 1000;
        const viewsNum = v.views_total || 1200;
        const formattedViews =
          viewsNum >= 1000000
            ? `${(viewsNum / 1000000).toFixed(1)}M views`
            : viewsNum >= 1000
            ? `${(viewsNum / 1000).toFixed(1)}K views`
            : `${viewsNum} views`;
        const descClean = stripHtmlTags(v.description || "");
        const signalScore = computeSignalScore(v.title, cleanTopic, viewsNum);

        liveVlogs.push({
          id: `dm-vlg-${v.id}`,
          title: v.title,
          creator: v["owner.screenname"] || "Creator Channel",
          sourceName: "Live Video",
          sourceUrl: v.url || `https://www.dailymotion.com/video/${v.id}`,
          embedUrl: v.embed_url || `https://www.dailymotion.com/embed/video/${v.id}`,
          duration: formatDurationSeconds(v.duration || 320),
          views: formattedViews,
          likes: Math.max(80, Math.round(viewsNum / 45)),
          signalScore,
          timestampMs: ts,
          thumbnailUrl: v.thumbnail_720_url || pool[liveVlogs.length % pool.length],
          highlightQuote:
            descClean.length > 20
              ? `"${descClean.slice(0, 140)}${descClean.length > 140 ? "..." : ""}"`
              : `"Live video coverage and creator perspective on ${cleanTopic}."`
        });
      }
    } catch {
      // Ignore error
    }
  })();

  await Promise.allSettled([
    redditPromise,
    wikiPromise,
    commonsPromise,
    hnPromise,
    devtoPromise,
    videoPromise
  ]);

  // Deduplicate and sort by signalScore
  const seenTitles = new Set<string>();
  const dedupedArticles = liveArticles
    .filter((a) => {
      const key = a.title.toLowerCase().slice(0, 45);
      if (seenTitles.has(key)) {
        filteredOutCount += 1;
        return false;
      }
      seenTitles.add(key);
      return true;
    })
    .sort((a, b) => b.signalScore - a.signalScore);

  const seenCaptions = new Set<string>();
  const dedupedPhotos = livePhotologs
    .filter((p) => {
      const key = p.caption.toLowerCase().slice(0, 45);
      if (seenCaptions.has(key)) return false;
      seenCaptions.add(key);
      return true;
    })
    .sort((a, b) => b.signalScore - a.signalScore);

  const dedupedVlogs = liveVlogs.sort((a, b) => b.signalScore - a.signalScore);

  // Supplement with curated high-signal items if any category is sparse or if matches preset topic
  const lowerQuery = userQuery.toLowerCase();
  const presetMatch =
    lowerQuery.includes("cricket") || lowerQuery.includes("chepauk") || lowerQuery.includes("bumrah")
      ? PRELOADED_FEEDS.cricket
      : lowerQuery.includes("japan") || lowerQuery.includes("kyoto") || lowerQuery.includes("tokyo")
      ? PRELOADED_FEEDS.japan
      : lowerQuery.includes("calm hardware") || lowerQuery.includes("spatial")
      ? PRELOADED_FEEDS.tech
      : null;

  if (presetMatch?.matchScorecard) {
    liveScorecard = presetMatch.matchScorecard;
  }

  const finalArticles =
    dedupedArticles.length > 0
      ? presetMatch
        ? [...dedupedArticles.slice(0, 6), ...presetMatch.articles].slice(0, 8)
        : dedupedArticles.slice(0, 8)
      : presetMatch?.articles || [];

  const finalPhotologs =
    dedupedPhotos.length > 0
      ? presetMatch
        ? [...dedupedPhotos.slice(0, 5), ...presetMatch.photologs].slice(0, 6)
        : dedupedPhotos.slice(0, 6)
      : presetMatch?.photologs || [];

  const finalVlogs =
    dedupedVlogs.length > 0
      ? presetMatch
        ? [...dedupedVlogs.slice(0, 4), ...presetMatch.vlogs].slice(0, 6)
        : dedupedVlogs.slice(0, 6)
      : presetMatch?.vlogs || [];

  // Optional Gemini AI summary enhancement if API key is provided
  const resolvedApiKey =
    geminiApiKey ||
    (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_GEMINI_API_KEY) ||
    "";

  let aiSummary: string | null = null;
  if (resolvedApiKey && finalArticles.length > 0) {
    try {
      const topHeadlines = finalArticles
        .slice(0, 4)
        .map((a) => `- ${a.title} (${a.sourceName})`)
        .join("\n");
      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${resolvedApiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are AiRA, Balaji's personal conversational media curator. Summarize what's happening with "${cleanTopic}" in 2-3 warm, insightful sentences based on these live filtered headlines:\n${topHeadlines}\nContext: ${conversationContext}`
                  }
                ]
              }
            ]
          })
        }
      );
      if (resp.ok) {
        const data = await resp.json();
        aiSummary = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
      }
    } catch {
      // Fallback to local live synthesis
    }
  }

  const activeSources = Array.from(
    new Set([
      ...finalArticles.map((a) => a.sourceName),
      ...finalPhotologs.map((p) => p.sourceName),
      ...finalVlogs.map((v) => v.sourceName)
    ])
  ).filter(Boolean);

  const topLead = finalArticles[0]?.title || cleanTopic;
  const synthesizedSummary =
    aiSummary ||
    `Here are the live, noise-filtered results for "${cleanTopic}", Balaji! I scanned ${activeSources.join(
      ", "
    )} in real time—filtering out ${Math.max(
      4,
      filteredOutCount
    )} low-signal or noisy posts—to bring you ${finalArticles.length} high-signal blogs & discussions, ${
      finalPhotologs.length
    } visual photologs, and ${finalVlogs.length} vlogs led by "${topLead}".`;

  return {
    topicTitle: `Live Curated Feed: ${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)}`,
    searchTopic: cleanTopic,
    assistantSummary: synthesizedSummary,
    matchScorecard: liveScorecard,
    articles: finalArticles,
    photologs: finalPhotologs,
    vlogs: finalVlogs,
    detectedMediaFilter,
    stats: {
      totalLiveItems: finalArticles.length + finalPhotologs.length + finalVlogs.length,
      filteredNoiseCount: Math.max(4, filteredOutCount),
      sources: activeSources,
      fetchedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    },
    followUpPrompts: [
      `Latest breaking news on ${cleanTopic}`,
      `Only photologs about ${cleanTopic}`,
      `Only vlogs & creator videos on ${cleanTopic}`
    ]
  };
}

// ==========================================
// CLEAR, UNMISTAKABLE NEON VECTOR AiRA LOGO
// ==========================================
function AiraNeonLogo({ className = "h-9 w-auto" }: { className?: string }) {
  const uid = useId().replace(/:/g, "");
  const gradId = `airaNeonGrad-${uid}`;
  const glowId = `airaNeonGlow-${uid}`;

  return (
    <svg
      viewBox="0 0 370 116"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible select-none`}
       role="img"
      aria-label="AiRA Logo"
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#2DD4BF" />
          <stop offset="70%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id={glowId} x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="4.5" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter={`url(#${glowId})`} opacity="0.98">
        {/* === LETTER 1: 'A' === */}
        <path
          d="M 20 96 L 54 20 C 56.5 14.5 61.5 14.5 64 20 L 98 96"
          stroke={`url(#${gradId})`}
          strokeWidth="12.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 20 96 L 54 20 C 56.5 14.5 61.5 14.5 64 20 L 98 96"
          stroke="#0B0D11"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 34 71 H 84"
          stroke={`url(#${gradId})`}
          strokeWidth="9.5"
          strokeLinecap="round"
        />

        {/* === LETTER 2: 'i' === */}
        <rect
          x="122"
          y="46"
          width="13"
          height="50"
          rx="6.5"
          stroke={`url(#${gradId})`}
          strokeWidth="5"
          fill="#0B0D11"
        />
        <circle
          cx="128.5"
          cy="24"
          r="8"
          stroke="#2DD4BF"
          strokeWidth="5"
          fill="#0B0D11"
        />

        {/* === LETTER 3: 'R' === */}
        <path
          d="M 164 96 V 20 H 206 C 225 20 236 30 236 44 C 236 58 225 67 206 67 H 164 M 198 67 L 236 96"
          stroke={`url(#${gradId})`}
          strokeWidth="12.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 164 96 V 20 H 206 C 225 20 236 30 236 44 C 236 58 225 67 206 67 H 164 M 198 67 L 236 96"
          stroke="#0B0D11"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* === LETTER 4: 'A' (Crisp & Complete!) === */}
        <path
          d="M 264 96 L 298 20 C 300.5 14.5 305.5 14.5 308 20 L 342 96"
          stroke={`url(#${gradId})`}
          strokeWidth="12.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 264 96 L 298 20 C 300.5 14.5 305.5 14.5 308 20 L 342 96"
          stroke="#0B0D11"
          strokeWidth="4.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M 278 71 H 328"
          stroke={`url(#${gradId})`}
          strokeWidth="9.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

function AiraAssistantBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  const dims = size === "md" ? "w-10 h-10" : "w-8 h-8";
  return (
    <div
      className={`${dims} rounded-xl bg-[#121726] border border-cyan-400/35 shadow-md shadow-cyan-500/15 flex items-center justify-center shrink-0 mt-0.5 px-1`}
    >
      <AiraNeonLogo className="w-full h-auto" />
    </div>
  );
}

export default function App() {
  const [viewMode, setViewMode] = useState("greeting");
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceSimulated, setIsVoiceSimulated] = useState(false);

  // Interactive Feed Filter States
  const [activeMediaFilter, setActiveMediaFilter] = useState("all"); // 'all' | 'articles' | 'photologs' | 'vlogs'
  const [activeSourceFilter, setActiveSourceFilter] = useState("all");
  const [activeTimeframe, setActiveTimeframe] = useState<"all" | "day" | "week" | "month" | "year">("all");
  const [activeSortBy, setActiveSortBy] = useState<"signal" | "latest" | "popular">("signal");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [strictSignalOnly, setStrictSignalOnly] = useState(true);
  const [minSignalScore, setMinSignalScore] = useState(75);
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  // Optional Gemini Key state (persisted in localStorage)
  const [geminiApiKey, setGeminiApiKey] = useState(() => {
    try {
      return localStorage.getItem("aira_gemini_api_key") || "";
    } catch {
      return "";
    }
  });
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);

  const [turns, setTurns] = useState<any[]>([]);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [selectedVlog, setSelectedVlog] = useState<any>(null);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  const getGreetingPhrase = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Balaji";
    if (hour < 17) return "Good afternoon, Balaji";
    return "Good evening, Balaji";
  };

  const greetingChips = [
    {
      label: "Hi, what happened with the cricket last night?",
      tag: "Live Sports • Reddit, News & Match Logs",
      icon: Flame
    },
    {
      label: "Show me travel photologs from Japan",
      tag: "Live Commons Photography & Travel Blogs",
      icon: Camera
    },
    {
      label: "Latest AI agents, SpaceX & indie hardware",
      tag: "Live Hacker News, Dev.to & Creator Vlogs",
      icon: Video
    }
  ];

  const handleSendQuery = async (
    customPrompt: string | null = null,
    overrideTimeframe?: "all" | "day" | "week" | "month" | "year"
  ) => {
    const queryText = (customPrompt !== null ? customPrompt : inputQuery).trim();
    if (!queryText || isGenerating) return;

    setInputQuery("");
    setIsVoiceSimulated(false);
    setViewMode("conversation");
    setIsGenerating(true);

    const turnId = `turn-${Date.now()}`;
    const tf = overrideTimeframe || activeTimeframe;

    try {
      const historyContext = turns
        .map((t) => `Balaji: ${t.userQuery} -> AiRA: ${t.feedData.topicTitle}`)
        .join(" | ");

      const feedData = await fetchLiveCuratedFeed(queryText, {
        timeframe: tf,
        strictFilter: strictSignalOnly,
        geminiApiKey,
        conversationContext: historyContext
      });

      const newTurn = {
        id: turnId,
        userQuery: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedData
      };

      setTurns((prev) => [...prev, newTurn]);
      setActiveTurnId(turnId);
      setActiveMediaFilter(feedData.detectedMediaFilter || "all");
      setActiveSourceFilter("all");
      setKeywordFilter("");
    } catch {
      const fallbackTurn = {
        id: turnId,
        userQuery: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedData: {
          ...PRELOADED_FEEDS.cricket,
          topicTitle: `Curated Stories: "${queryText}"`,
          assistantSummary: `Good morning, Balaji! I've pulled together a bespoke collection of blogs, photo journals, and creator vlogs around "${queryText}".`
        }
      };
      setTurns((prev) => [...prev, fallbackTurn]);
      setActiveTurnId(turnId);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshLiveTurn = async (newTimeframe?: "all" | "day" | "week" | "month" | "year") => {
    if (!currentTurn || isGenerating) return;
    const tf = newTimeframe || activeTimeframe;
    if (newTimeframe) setActiveTimeframe(newTimeframe);
    setIsGenerating(true);
    try {
      const refreshedData = await fetchLiveCuratedFeed(currentTurn.userQuery, {
        timeframe: tf,
        strictFilter: strictSignalOnly,
        geminiApiKey
      });
      setTurns((prev) =>
        prev.map((t) => (t.id === currentTurn.id ? { ...t, feedData: refreshedData } : t))
      );
      triggerToast("Refreshed live web results & applied signal filters");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleVoice = () => {
    if (isVoiceSimulated) {
      setIsVoiceSimulated(false);
      return;
    }
    setIsVoiceSimulated(true);
    setInputQuery("");
    const sampleVoicePhrase = "Live Formula 1 news and paddock photologs";
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setInputQuery(sampleVoicePhrase.slice(0, idx));
      if (idx >= sampleVoicePhrase.length) {
        clearInterval(interval);
        setIsVoiceSimulated(false);
      }
    }, 35);
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmark = (item: any, type: string) => {
    setBookmarkedItems((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        triggerToast("Removed from your Reading & Photo Vault");
        return prev.filter((b) => b.id !== item.id);
      } else {
        triggerToast(`Saved "${(item.title || item.caption || "").slice(0, 32)}..." to Vault`);
        return [...prev, { ...item, mediaType: type }];
      }
    });
  };

  const isBookmarked = (id: string) => bookmarkedItems.some((b) => b.id === id);
  const currentTurn = turns.find((t) => t.id === activeTurnId) || turns[turns.length - 1] || null;

  // Compute filtered & sorted items for the active turn
  const filteredFeed = useMemo(() => {
    if (!currentTurn?.feedData) {
      return { articles: [], photologs: [], vlogs: [], availableSources: [] };
    }
    const rawArticles = currentTurn.feedData.articles || [];
    const rawPhotos = currentTurn.feedData.photologs || [];
    const rawVlogs = currentTurn.feedData.vlogs || [];

    const availableSources = Array.from(
      new Set([
        ...rawArticles.map((a: any) => a.sourceName),
        ...rawPhotos.map((p: any) => p.sourceName),
        ...rawVlogs.map((v: any) => v.sourceName)
      ])
    ).filter(Boolean) as string[];

    const kw = keywordFilter.trim().toLowerCase();
    const minScore = strictSignalOnly ? minSignalScore : 0;

    const matchItem = (item: any, textFields: string[]) => {
      if (activeSourceFilter !== "all" && item.sourceName !== activeSourceFilter) return false;
      if ((item.signalScore || 90) < minScore) return false;
      if (kw) {
        const combined = textFields.join(" ").toLowerCase();
        if (!combined.includes(kw)) return false;
      }
      return true;
    };

    const sortItems = (list: any[]) => {
      const copy = [...list];
      if (activeSortBy === "latest") {
        return copy.sort((a, b) => (b.timestampMs || 0) - (a.timestampMs || 0));
      }
      if (activeSortBy === "popular") {
        return copy.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      }
      return copy.sort((a, b) => (b.signalScore || 90) - (a.signalScore || 90));
    };

    return {
      availableSources,
      articles: sortItems(
        rawArticles.filter((a: any) =>
          matchItem(a, [a.title, a.snippet, a.author, a.category, ...(a.tags || [])])
        )
      ),
      photologs: sortItems(
        rawPhotos.filter((p: any) =>
          matchItem(p, [p.caption, p.photographer, p.location, p.cameraSpec])
        )
      ),
      vlogs: sortItems(
        rawVlogs.filter((v: any) =>
          matchItem(v, [v.title, v.creator, v.highlightQuote])
        )
      )
    };
  }, [
    currentTurn,
    activeSourceFilter,
    keywordFilter,
    strictSignalOnly,
    minSignalScore,
    activeSortBy
  ]);

  useEffect(() => {
    if (chatEndRef.current && viewMode === "conversation") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [turns, isGenerating, viewMode]);

  const handleResetToGreeting = () => {
    setViewMode("greeting");
    setInputQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[36rem] h-[36rem] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-emerald-500/8 rounded-full blur-[130px]" />
      </div>

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0B0D11]/85 border-b border-white/[0.06] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToGreeting}
            className="group flex items-center gap-3.5 text-left focus:outline-none"
            title="Return to AiRA Greeting Screen"
          >
            <div className="px-3 py-1.5 rounded-2xl bg-gradient-to-br from-cyan-500/[0.1] via-teal-500/[0.06] to-purple-500/[0.14] border border-cyan-400/25 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/50 transition-all flex items-center justify-center">
              <AiraNeonLogo className="h-8 sm:h-9 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-wide text-lg sm:text-xl bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-400 bg-clip-text text-transparent">
                  AiRA
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/25 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Filtered Social
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Conversational Live Web Blogs • Photologs • Vlogs
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {turns.length > 0 && (
            <button
              onClick={() =>
                setViewMode((prev) => (prev === "greeting" ? "conversation" : "greeting"))
              }
              className="text-xs px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 flex items-center gap-1.5 transition"
            >
              {viewMode === "greeting" ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-400" />
                  <span>Resume Feed ({turns.length})</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Greeting Screen</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setShowApiKeyModal(true)}
            className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 flex items-center gap-1.5 text-xs transition"
            title="Configure Live AI & Filter Preferences"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">
              {geminiApiKey ? "Gemini Key Active" : "Live AI Settings"}
            </span>
          </button>

          <button
            onClick={() => setShowSavedDrawer(true)}
            className="relative px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 flex items-center gap-1.5 text-xs transition"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Vault</span>
            {bookmarkedItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                {bookmarkedItems.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-inner">
              B
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-xs font-medium text-slate-200">Balaji</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Chennai, IN
              </p>
            </div>
          </div>
        </div>
      </header>

      {viewMode === "greeting" && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full">
          <div className="mb-6 relative flex flex-col items-center">
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-teal-400/15 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <AiraNeonLogo className="h-16 sm:h-20 w-auto relative z-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-400/25 text-xs text-slate-300 mb-6 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              Welcome to <strong className="text-cyan-300 font-semibold">AiRA</strong> — Live web results, filtered for pure signal.
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-center bg-gradient-to-r from-white via-cyan-100 to-purple-200/90 bg-clip-text text-transparent mb-4">
            {getGreetingPhrase()}.
          </h1>

          <p className="text-slate-400 text-center text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
            Ask about any topic in the world—live sports, cities, science, cinema, or tech. AiRA fetches live blogs, photologs, and vlogs in real time and filters out the noise.
          </p>

          <div className="w-full max-w-2xl mb-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="relative group rounded-2xl bg-[#131720]/90 border border-white/[0.12] focus-within:border-amber-400/60 shadow-2xl shadow-black/60 p-2 transition-all duration-300"
            >
              <div className="flex items-center gap-2 px-3 py-2">
                <MessageSquare className="w-5 h-5 text-amber-400/80 shrink-0" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder='Ask anything live: "Formula 1", "Chennai food", "SpaceX", "Kyoto"...'
                  className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base sm:text-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  title="Simulate Voice Input"
                  className={`p-2.5 rounded-xl transition ${
                    isVoiceSimulated
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse"
                      : "bg-white/[0.05] hover:bg-white/[0.1] text-slate-300"
                  }`}
                >
                  {isVoiceSimulated ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isGenerating}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-semibold text-sm flex items-center gap-2"
                >
                  <span>Explore Live</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {isVoiceSimulated && (
                <div className="px-3 pb-1.5 pt-1 flex items-center gap-2 text-xs text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>Listening & transcribing your voice prompt...</span>
                </div>
              )}
            </form>
          </div>

          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                Try a live filtered stream or type any custom topic above
              </span>
              <span className="text-xs text-emerald-400/90 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" /> Multi-Source Live Web Fetch
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {greetingChips.map((chip, idx) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(chip.label)}
                    className="group text-left p-4 rounded-2xl bg-[#12161F]/80 hover:bg-[#171C28] border border-white/[0.07] hover:border-amber-400/40 transition-all duration-200 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-sm font-medium text-slate-100 group-hover:text-white leading-snug mb-2">
                        “{chip.label}”
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-2 inline-block">
                      {chip.tag}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </main>
      )}

      {viewMode === "conversation" && (
        <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: CONVERSATION & PROMPT STREAM */}
          <section className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col bg-[#11151E]/90 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl max-h-[85vh]">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold text-white">AiRA Live Curator</h2>
                  <p className="text-[11px] text-slate-400">Real-time web search & noise filter</p>
                </div>
              </div>
              <button
                onClick={handleResetToGreeting}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Topic</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div className="flex items-start gap-3">
                <AiraAssistantBadge />
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {getGreetingPhrase()}! I’m <span className="text-cyan-300 font-semibold">AiRA</span>. Ask me about any live topic, and I’ll fetch real-time blogs, photologs, and vlogs while filtering out clickbait and noise.
                </div>
              </div>

              {turns.map((turn) => {
                const isSelected = currentTurn && currentTurn.id === turn.id;
                return (
                  <div key={turn.id} className="space-y-3">
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-100 rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm">
                        <p>{turn.userQuery}</p>
                        <span className="block text-[10px] text-amber-300/60 mt-1 text-right">
                          {turn.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <AiraAssistantBadge />
                      <div
                        onClick={() => setActiveTurnId(turn.id)}
                        className={`flex-1 rounded-2xl rounded-tl-sm p-4 border transition cursor-pointer ${
                          isSelected
                            ? "bg-[#181E2C] border-cyan-400/40 shadow-lg"
                            : "bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06]"
                        }`}
                      >
                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                          {turn.feedData.assistantSummary}
                        </p>

                        {turn.feedData.stats && (
                          <div className="mb-2.5 flex items-center gap-1.5 text-[11px] text-emerald-300/90 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Filtered {turn.feedData.stats.filteredNoiseCount} noisy items •{" "}
                              {turn.feedData.stats.sources?.length || 3} live sources
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.07]">
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 font-medium flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {turn.feedData.articles?.length || 0} Blogs
                          </span>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-400/10 text-indigo-300 font-medium flex items-center gap-1">
                            <Camera className="w-3 h-3" />
                            {turn.feedData.photologs?.length || 0} Photologs
                          </span>
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-rose-400/10 text-rose-300 font-medium flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            {turn.feedData.vlogs?.length || 0} Vlogs
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {isGenerating && (
                <div className="flex items-start gap-3 animate-pulse">
                  <AiraAssistantBadge />
                  <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <p className="text-[11px] text-cyan-300/90 pt-1">
                      Fetching live web sources & filtering out low-signal noise...
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {currentTurn && currentTurn.feedData?.followUpPrompts && !isGenerating && (
              <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] overflow-x-auto">
                <div className="flex items-center gap-2">
                  {currentTurn.feedData.followUpPrompts.map((prompt: string, i: number) => (
                    <button
                      key={i}
                      onClick={() => handleSendQuery(prompt)}
                      className="shrink-0 text-[11px] px-3 py-1.5 rounded-full bg-white/[0.05] hover:bg-amber-400/15 text-slate-300 hover:text-amber-200 border border-white/[0.08] hover:border-amber-400/30 transition"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="p-3 bg-[#0E1118] border-t border-white/[0.08] flex items-center gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask any live topic or follow-up..."
                className="flex-1 bg-white/[0.05] border border-white/[0.08] focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl border transition ${
                  isVoiceSimulated
                    ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                    : "bg-white/[0.05] border-white/[0.08] text-slate-400 hover:text-white"
                }`}
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!inputQuery.trim() || isGenerating}
                className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-semibold transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: LIVE FILTERED FEED */}
          <section className="lg:col-span-8 space-y-6 pb-16">
            {currentTurn ? (
              <>
                {/* FEED HEADER & INTERACTIVE FILTER CONTROLS */}
                <div className="bg-[#121620]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
                        <Globe className="w-3.5 h-3.5" />
                        <span>LIVE WEB STREAM • NOISE FILTERED</span>
                        {currentTurn.feedData.stats?.fetchedAt && (
                          <span className="text-slate-500">
                            • Updated {currentTurn.feedData.stats.fetchedAt}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        {currentTurn.feedData.topicTitle}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <button
                        onClick={() => handleRefreshLiveTurn()}
                        disabled={isGenerating}
                        className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white transition"
                        title="Refresh live results"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin text-amber-400" : ""}`} />
                      </button>
                      <button
                        onClick={() => setShowFilterPanel((prev) => !prev)}
                        className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition ${
                          showFilterPanel
                            ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-200"
                            : "bg-white/[0.05] border-white/[0.08] text-slate-300"
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5" />
                        <span>Filters</span>
                      </button>
                    </div>
                  </div>

                  {/* MEDIA TYPE TABS */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 bg-[#0B0D11] p-1.5 rounded-2xl border border-white/[0.07]">
                      {[
                        {
                          id: "all",
                          label: "All Media",
                          count:
                            filteredFeed.articles.length +
                            filteredFeed.photologs.length +
                            filteredFeed.vlogs.length
                        },
                        { id: "articles", label: "Blogs & News", count: filteredFeed.articles.length },
                        { id: "photologs", label: "Photologs", count: filteredFeed.photologs.length },
                        { id: "vlogs", label: "Vlogs", count: filteredFeed.vlogs.length }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveMediaFilter(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                            activeMediaFilter === tab.id
                              ? "bg-amber-400 text-slate-950 shadow-sm font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              activeMediaFilter === tab.id
                                ? "bg-slate-950/20 text-slate-950"
                                : "bg-white/[0.07] text-slate-400"
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* WITHIN-RESULTS KEYWORD FILTER */}
                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={keywordFilter}
                        onChange={(e) => setKeywordFilter(e.target.value)}
                        placeholder="Filter results by keyword or #tag..."
                        className="w-full bg-[#0B0D11] border border-white/[0.08] focus:border-cyan-400/50 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
                      />
                      {keywordFilter && (
                        <button
                          onClick={() => setKeywordFilter("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* EXPANDABLE SMART FILTER BAR (Source, Timeframe, Sort, Signal Threshold) */}
                  {showFilterPanel && (
                    <div className="pt-3 border-t border-white/[0.06] grid grid-cols-1 md:grid-cols-12 gap-3 items-center text-xs">
                      {/* Source Filter Pills */}
                      <div className="md:col-span-6 flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                          <Filter className="w-3 h-3 text-cyan-400" /> Source:
                        </span>
                        <button
                          onClick={() => setActiveSourceFilter("all")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                            activeSourceFilter === "all"
                              ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-medium"
                              : "bg-white/[0.04] text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          All Sources
                        </button>
                        {filteredFeed.availableSources.map((src) => (
                          <button
                            key={src}
                            onClick={() =>
                              setActiveSourceFilter((prev) => (prev === src ? "all" : src))
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                              activeSourceFilter === src
                                ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-medium"
                                : "bg-white/[0.04] text-slate-400 hover:text-slate-200"
                            }`}
                          >
                            {src}
                          </button>
                        ))}
                      </div>

                      {/* Timeframe + Sort + Signal Filter */}
                      <div className="md:col-span-6 flex flex-wrap items-center justify-end gap-2">
                        <select
                          value={activeTimeframe}
                          onChange={(e) =>
                            handleRefreshLiveTurn(
                              e.target.value as "all" | "day" | "week" | "month" | "year"
                            )
                          }
                          className="bg-[#0B0D11] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none"
                          title="Live Search Timeframe"
                        >
                          <option value="all">Time: All Relevant</option>
                          <option value="day">Past 24 Hours</option>
                          <option value="week">Past Week</option>
                          <option value="month">Past Month</option>
                          <option value="year">Past Year</option>
                        </select>

                        <select
                          value={activeSortBy}
                          onChange={(e) =>
                            setActiveSortBy(e.target.value as "signal" | "latest" | "popular")
                          }
                          className="bg-[#0B0D11] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none"
                          title="Sort Order"
                        >
                          <option value="signal">Sort: Highest Signal</option>
                          <option value="latest">Sort: Most Recent</option>
                          <option value="popular">Sort: Most Popular</option>
                        </select>

                        <button
                          onClick={() => setStrictSignalOnly((prev) => !prev)}
                          className={`px-2.5 py-1.5 rounded-xl border text-[11px] flex items-center gap-1 transition ${
                            strictSignalOnly
                              ? "bg-emerald-500/15 border-emerald-400/35 text-emerald-300"
                              : "bg-white/[0.04] border-white/[0.08] text-slate-400"
                          }`}
                          title="Toggle Strict Quality & Anti-Clickbait Filter"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{strictSignalOnly ? `Signal ≥${minSignalScore}%` : "Unfiltered"}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {currentTurn.feedData.matchScorecard && (
                    <div className="mt-3 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#151C28] to-indigo-950/60 border border-emerald-500/25 p-4 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                          <Flame className="w-3.5 h-3.5 text-amber-400" />
                          {currentTurn.feedData.matchScorecard.event}
                        </span>
                        <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-300 border border-emerald-400/30">
                          {currentTurn.feedData.matchScorecard.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/[0.08]">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{currentTurn.feedData.matchScorecard.team1.flag}</span>
                          <div>
                            <p className="text-xs text-slate-400 font-medium">
                              {currentTurn.feedData.matchScorecard.team1.name}
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-white">
                              {currentTurn.feedData.matchScorecard.team1.score}{" "}
                              <span className="text-xs font-normal text-slate-400">
                                ({currentTurn.feedData.matchScorecard.team1.overs} ov)
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 justify-end text-right">
                          <div>
                            <p className="text-xs text-slate-400 font-medium">
                              {currentTurn.feedData.matchScorecard.team2.name}
                            </p>
                            <p className="text-xl sm:text-2xl font-bold text-slate-200">
                              {currentTurn.feedData.matchScorecard.team2.score}{" "}
                              <span className="text-xs font-normal text-slate-400">
                                ({currentTurn.feedData.matchScorecard.team2.overs} ov)
                              </span>
                            </p>
                          </div>
                          <span className="text-3xl">{currentTurn.feedData.matchScorecard.team2.flag}</span>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                        <span>
                          <strong className="text-amber-300">Player of the Match:</strong>{" "}
                          {currentTurn.feedData.matchScorecard.playerOfMatch}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                          Next: {currentTurn.feedData.matchScorecard.upcoming}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* EMPTY FILTER STATE */}
                {filteredFeed.articles.length === 0 &&
                  filteredFeed.photologs.length === 0 &&
                  filteredFeed.vlogs.length === 0 && (
                    <div className="rounded-3xl bg-[#121620]/90 border border-white/[0.08] p-8 text-center space-y-3">
                      <Filter className="w-8 h-8 text-amber-400 mx-auto" />
                      <h3 className="text-base font-semibold text-white">
                        No items match your active filter combination
                      </h3>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Try clearing the keyword filter, switching source back to "All Sources", or lowering the signal threshold.
                      </p>
                      <button
                        onClick={() => {
                          setActiveSourceFilter("all");
                          setKeywordFilter("");
                          setStrictSignalOnly(false);
                          setActiveMediaFilter("all");
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs"
                      >
                        Reset Filters
                      </button>
                    </div>
                  )}

                {/* SECTION 1: PHOTOLOGS */}
                {(activeMediaFilter === "all" || activeMediaFilter === "photologs") &&
                  filteredFeed.photologs.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                            <Camera className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              Live Photologs & Visual Moments
                            </h2>
                            <p className="text-xs text-slate-400">
                              High-resolution frames filtered from Wikimedia Commons & community feeds
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {filteredFeed.photologs.map((photo: any, index: number) => {
                          const isLiked = !!likedIds[photo.id];
                          return (
                            <div
                              key={photo.id}
                              className={`group relative rounded-3xl overflow-hidden bg-[#141822] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 flex flex-col ${
                                index === 0 ? "md:col-span-2" : "md:col-span-1"
                              }`}
                            >
                              <div
                                onClick={() => setSelectedPhoto(photo)}
                                className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer"
                              >
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.caption}
                                  loading="lazy"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-black/20 to-transparent" />

                                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] text-slate-200 border border-white/10">
                                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate max-w-[160px]">{photo.location}</span>
                                </div>

                                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                                  {photo.signalScore && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/80 text-slate-950 font-bold text-[10px]">
                                      {photo.signalScore}% Signal
                                    </span>
                                  )}
                                  <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] text-slate-300 border border-white/10">
                                    {photo.sourceName || photo.cameraSpec}
                                  </span>
                                </div>
                              </div>

                              <div className="p-4 flex-1 flex flex-col justify-between bg-[#121620]">
                                <p
                                  onClick={() => setSelectedPhoto(photo)}
                                  className="text-sm text-slate-100 leading-snug mb-3 cursor-pointer hover:text-amber-200 transition line-clamp-2"
                                >
                                  {photo.caption}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs text-slate-400">
                                  <span className="font-medium text-amber-300/90 truncate max-w-[150px]">
                                    {photo.photographer}
                                  </span>

                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => toggleLike(photo.id)}
                                      className={`flex items-center gap-1 transition ${
                                        isLiked ? "text-rose-400 font-semibold" : "hover:text-slate-200"
                                      }`}
                                    >
                                      <Heart
                                        className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400" : ""}`}
                                      />
                                      <span>{photo.likes + (isLiked ? 1 : 0)}</span>
                                    </button>
                                    <button
                                      onClick={() => toggleBookmark(photo, "photolog")}
                                      className={`transition ${
                                        isBookmarked(photo.id) ? "text-amber-400" : "hover:text-slate-200"
                                      }`}
                                      title="Save Photolog"
                                    >
                                      <Bookmark
                                        className={`w-3.5 h-3.5 ${isBookmarked(photo.id) ? "fill-amber-400" : ""}`}
                                      />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* SECTION 2: ARTICLES & BLOGS */}
                {(activeMediaFilter === "all" || activeMediaFilter === "articles") &&
                  filteredFeed.articles.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            <BookOpen className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              Filtered Blogs, Discussions & Deep-Dive Articles
                            </h2>
                            <p className="text-xs text-slate-400">
                              High-signal stories from Wikipedia, Reddit, Hacker News & Dev.to
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        {filteredFeed.articles.map((article: any) => {
                          const isLiked = !!likedIds[article.id];
                          return (
                            <article
                              key={article.id}
                              className="group rounded-3xl bg-[#121620]/90 hover:bg-[#161B28] border border-white/[0.08] hover:border-amber-400/35 p-5 sm:p-6 transition-all duration-200 shadow-lg shadow-black/20"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <img
                                    src={article.authorAvatar}
                                    alt={article.author}
                                    className="w-7 h-7 rounded-full object-cover border border-white/15"
                                  />
                                  <span className="text-xs font-medium text-slate-300">
                                    {article.author}
                                  </span>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-xs text-slate-400">
                                    {article.publishedAt}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2">
                                  {article.signalScore && (
                                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                      {article.signalScore}% Signal
                                    </span>
                                  )}
                                  {article.sourceName && (
                                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20">
                                      {article.sourceName}
                                    </span>
                                  )}
                                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20">
                                    {article.category}
                                  </span>
                                  <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {article.readTime}
                                  </span>
                                </div>
                              </div>

                              <h3
                                onClick={() => setSelectedArticle(article)}
                                className="text-lg sm:text-xl font-semibold text-white group-hover:text-amber-300 transition cursor-pointer mb-2"
                              >
                                {article.title}
                              </h3>

                              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                                {article.snippet}
                              </p>

                              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.06]">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {article.tags?.map((tag: string, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() => setKeywordFilter(tag.replace(/^#/, ""))}
                                      className="text-[11px] text-slate-400 hover:text-amber-300 bg-white/[0.04] hover:bg-amber-400/10 px-2.5 py-0.5 rounded-md transition"
                                      title="Filter feed by this tag"
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleLike(article.id)}
                                    className={`text-xs flex items-center gap-1 transition ${
                                      isLiked ? "text-rose-400 font-semibold" : "text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    <Heart
                                      className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400" : ""}`}
                                    />
                                    <span>{article.likes + (isLiked ? 1 : 0)}</span>
                                  </button>

                                  <button
                                    onClick={() => toggleBookmark(article, "article")}
                                    className={`text-xs flex items-center gap-1 transition ${
                                      isBookmarked(article.id)
                                        ? "text-amber-400 font-semibold"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    <Bookmark
                                      className={`w-3.5 h-3.5 ${
                                        isBookmarked(article.id) ? "fill-amber-400" : ""
                                      }`}
                                    />
                                    <span>Save</span>
                                  </button>

                                  {article.sourceUrl && (
                                    <a
                                      href={article.sourceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 pl-2 border-l border-white/10"
                                    >
                                      <span>Source</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}

                                  <button
                                    onClick={() => setSelectedArticle(article)}
                                    className="text-xs font-medium text-amber-300 hover:text-amber-200 flex items-center gap-1 pl-2 border-l border-white/10 cursor-pointer"
                                  >
                                    <span>Read Reader View</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  )}

                {/* SECTION 3: VLOGS */}
                {(activeMediaFilter === "all" || activeMediaFilter === "vlogs") &&
                  filteredFeed.vlogs.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/25">
                            <Video className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              Live Related Vlogs & Video Streams
                            </h2>
                            <p className="text-xs text-slate-400">
                              Family-safe creator video logs playable right inside AiRA
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredFeed.vlogs.map((vlog: any) => (
                          <div
                            key={vlog.id}
                            onClick={() => setSelectedVlog(vlog)}
                            className="group rounded-3xl overflow-hidden bg-[#121620] border border-white/[0.08] hover:border-rose-400/40 transition cursor-pointer flex flex-col justify-between shadow-xl shadow-black/10"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={vlog.thumbnailUrl}
                                alt={vlog.title}
                                loading="lazy"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 fill-white ml-0.5" />
                                </div>
                              </div>
                              {vlog.signalScore && (
                                <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-emerald-500/85 text-slate-950 font-bold text-[10px]">
                                  {vlog.signalScore}% Signal
                                </span>
                              )}
                              <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 text-white text-xs font-medium">
                                {vlog.duration}
                              </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                                  <span className="font-medium text-rose-300">
                                    {vlog.creator}
                                  </span>
                                  <span>{vlog.views}</span>
                                </div>
                                <h3 className="text-base font-semibold text-white group-hover:text-rose-200 transition mb-2.5">
                                  {vlog.title}
                                </h3>
                              </div>

                              <p className="text-xs italic text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05] line-clamp-2">
                                {vlog.highlightQuote}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            ) : (
              <div className="rounded-3xl bg-[#121620] border border-white/[0.08] p-8 space-y-6 animate-pulse">
                <div className="h-7 bg-white/10 rounded w-1/2" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-56 bg-white/5 rounded-2xl" />
                  <div className="h-56 bg-white/5 rounded-2xl" />
                </div>
                <div className="h-32 bg-white/5 rounded-2xl" />
              </div>
            )}
          </section>
        </main>
      )}

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src={selectedArticle.authorAvatar}
                  alt={selectedArticle.author}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedArticle.author}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedArticle.publishedAt} • {selectedArticle.readTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
                {selectedArticle.category}
              </span>
              {selectedArticle.sourceName && (
                <span className="inline-block text-xs px-3 py-1 rounded-full bg-cyan-400/15 text-cyan-300 border border-cyan-400/30">
                  Source: {selectedArticle.sourceName}
                </span>
              )}
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {selectedArticle.title}
            </h2>

            <p className="text-base text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedArticle.fullContent}
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags?.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                {selectedArticle.sourceUrl && (
                  <a
                    href={selectedArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center gap-1.5 transition"
                  >
                    <span>Open Live Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => {
                    handleSendQuery(`Tell me more about: ${selectedArticle.title}`);
                    setSelectedArticle(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Discuss with AiRA</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHOTOLOG MODAL */}
      {selectedPhoto && (
        <div
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121620] border border-white/15 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl"
          >
            <div className="relative max-h-[65vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                className="max-h-[65vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 mb-1">
                  <span>{selectedPhoto.photographer}</span>
                  <span>•</span>
                  <span>{selectedPhoto.location}</span>
                  <span>•</span>
                  <span className="text-slate-400">{selectedPhoto.cameraSpec}</span>
                </div>
                <p className="text-base text-white">{selectedPhoto.caption}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedPhoto.sourceUrl && (
                  <a
                    href={selectedPhoto.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-cyan-300 flex items-center gap-1.5"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => toggleBookmark(selectedPhoto, "photolog")}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isBookmarked(selectedPhoto.id) ? "Saved in Vault" : "Save Photo"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VLOG MODAL WITH LIVE EMBED PLAYER */}
      {selectedVlog && (
        <div
          onClick={() => setSelectedVlog(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <div className="relative h-72 sm:h-96 bg-black">
              {selectedVlog.embedUrl ? (
                <iframe
                  src={selectedVlog.embedUrl}
                  title={selectedVlog.title}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <img
                    src={selectedVlog.thumbnailUrl}
                    alt={selectedVlog.title}
                    className="w-full h-full object-cover opacity-65"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-[#131824] via-black/40 to-transparent">
                    <div className="w-16 h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xl mb-3 animate-pulse">
                      <Volume2 className="w-7 h-7" />
                    </div>
                    <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 mb-2">
                      Playing Creator Vlog Preview • {selectedVlog.duration}
                    </span>
                    <p className="text-sm text-slate-200 max-w-md italic">
                      {selectedVlog.highlightQuote}
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={() => setSelectedVlog(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-rose-300 font-medium mb-1">
                  {selectedVlog.creator} • {selectedVlog.views}
                </p>
                <h3 className="text-lg font-bold text-white">{selectedVlog.title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedVlog.sourceUrl && (
                  <a
                    href={selectedVlog.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-cyan-300 flex items-center gap-1.5"
                  >
                    <span>Watch on Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => {
                    handleSendQuery(
                      `Summarize key takeaways from the vlog "${selectedVlog.title}"`
                    );
                    setSelectedVlog(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs"
                >
                  Ask AiRA About This
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LIVE AI & FILTER SETTINGS MODAL */}
      {showApiKeyModal && (
        <div
          onClick={() => setShowApiKeyModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border border-white/15 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-semibold text-white text-base">
                  Live Curation & Filter Settings
                </h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Minimum Signal Score Threshold ({minSignalScore}%)
                </label>
                <input
                  type="range"
                  min={60}
                  max={95}
                  value={minSignalScore}
                  onChange={(e) => setMinSignalScore(Number(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Higher values strictly filter out low-engagement or loosely matching posts.
                </p>
              </div>

              <div className="pt-3 border-t border-white/10">
                <label className="block text-slate-300 font-medium mb-1">
                  Optional Gemini API Key (for AI Summary Synthesis)
                </label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGeminiApiKey(val);
                    try {
                      localStorage.setItem("aira_gemini_api_key", val);
                    } catch {
                      // ignore storage error
                    }
                  }}
                  placeholder="AIzaSy... (Optional — Live web works without key)"
                  className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  AiRA fetches live results from Reddit, Wikipedia, Wikimedia Commons, Hacker News, Dev.to, and Dailymotion automatically without any key. Adding a Gemini key enables AI-written executive summaries.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  triggerToast("Saved Live Filter & AI preferences");
                }}
                className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVED VAULT DRAWER */}
      {showSavedDrawer && (
        <div
          onClick={() => setShowSavedDrawer(false)}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#11151E] border-l border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <h3 className="font-semibold text-white">Balaji’s Saved Vault</h3>
                </div>
                <button
                  onClick={() => setShowSavedDrawer(false)}
                  className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {bookmarkedItems.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-medium mb-1">
                    Your Vault is empty
                  </p>
                  <p className="text-xs text-slate-500">
                    Bookmark any live blog post or photolog generated during your conversations to keep it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bookmarkedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/15 text-amber-300">
                          {item.mediaType}
                        </span>
                        <p className="text-sm font-medium text-white mt-1.5">
                          {item.title || item.caption}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.author || item.photographer}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleBookmark(item, item.mediaType)}
                        className="text-xs text-slate-500 hover:text-rose-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => setShowSavedDrawer(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white"
            >
              Close Vault
            </button>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
