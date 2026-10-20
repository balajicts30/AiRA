import React, { useState, useEffect, useRef } from 'react';
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
  SlidersHorizontal
} from 'lucide-react';

// ==========================================
// PRE-LOADED RICH DEMO DATA (Cricket, Japan, Tech)
// ==========================================
const PRELOADED_FEEDS = {
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
        publishedAt: "6 hours ago",
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
        publishedAt: "8 hours ago",
        snippet: "Sweeping Adam Zampa over backward point shouldn't be biomechanically possible, yet Suryakumar Yadav made it his bread-and-butter shot last night.",
        fullContent: "On a two-paced surface where other batters struggled to time straight drives, Suryakumar Yadav accessed pockets behind the wicketkeeper that simply cannot be guarded. Bygetting his front pad well outside leg stump early, he manipulated the field and forced Zampa to bowl flatter, resulting in four boundaries in a single momentum-shifting 13th over.",
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
        publishedAt: "2 hours ago",
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
        imageUrl: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=900&auto=format&fit=crop&q=80",
        aspect: "wide",
        likes: 3412,
        cameraSpec: "Sony A7IV • 35mm f/1.4"
      },
      {
        id: "pho-c2",
        caption: "Under the floodlights: That trademark pickup whip over fine leg for six.",
        photographer: "@pitchside_frames",
        location: "Boundary Rope, South End",
        imageUrl: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800&auto=format&fit=crop&q=80",
        aspect: "square",
        likes: 2190,
        cameraSpec: "Canon R3 • 400mm f/2.8"
      },
      {
        id: "pho-c3",
        caption: "Post-match dressing room smiles and ice baths after defending 186 in 85% humidity.",
        photographer: "@bcci_insider",
        location: "Home Dressing Room",
        imageUrl: "https://images.unsplash.com/photo-1624526267942-ab0ff8a3e972?w=800&auto=format&fit=crop&q=80",
        aspect: "tall",
        likes: 4890,
        cameraSpec: "Leica Q3 • 28mm"
      }
    ],
    vlogs: [
      {
        id: "vlg-c1",
        title: "Matchday Vlog: Losing Our Voices in the Chepauk Stands! Final Over Chaos",
        creator: "Ashwin's Extra Cover",
        duration: "08:42",
        views: "245K views",
        thumbnailUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Nobody sat down for the last 25 minutes—listen to the decibel meter when that yorker hit the base of off-stump!\""
      },
      {
        id: "vlg-c2",
        title: "6-Minute Highlights & Dugout Mic-Up: How Hardik & Rohit Planned the 20th Over",
        creator: "Star Sports Vault",
        duration: "06:15",
        views: "1.1M views",
        thumbnailUrl: "https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Keep the fine leg up and bluff the wide yorker—he's waiting for the fuller ball outside off.\""
      }
    ],
    followUpPrompts: [
      "Show me SKY's wagon wheel & stats from last night",
      "What is the weather forecast for Friday's match in Bengaluru?",
      "Switch gears: Show me peaceful travel photologs from Japan"
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
        publishedAt: "Yesterday",
        snippet: "When mist still clings to the wooden stage and the only sound is the wooden clack of geta sandals on wet stone...",
        fullContent: "Most visitors experience Higashiyama at midday, shoulder-to-shoulder. But if you step out of your ryokan at 5:15 AM with a 35mm prime lens, the ancient capital reveals its true rhythm. Shopkeepers gently sweep maple leaves off stone thresholds, steam rises from tofu kitchens, and the pagoda stands framed in soft indigo twilight.",
        tags: ["#KyotoMornings", "#SlowTravel", "#35mmFilm"],
        likes: 2340
      },
      {
        id: "art-j2",
        title: "TheKissaten Guide: 7 Jazz Coffee Houses in Tokyo Frozen in 1974",
        author: "Maya Lin • AnalogTokyo",
        authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80",
        readTime: "7 min read",
        category: "City Guide",
        publishedAt: "3 days ago",
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
        imageUrl: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=900&auto=format&fit=crop&q=80",
        aspect: "wide",
        likes: 5620,
        cameraSpec: "Fujifilm X100VI • Classic Neg"
      },
      {
        id: "pho-j2",
        caption: "First crimson maple leaves framing Chureito Pagoda and Mount Fuji at dawn.",
        photographer: "@haruka_wander",
        location: "Fujiyoshida, Yamanashi",
        imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
        aspect: "square",
        likes: 4120,
        cameraSpec: "Sony A7RV • 50mm f/1.2"
      },
      {
        id: "pho-j3",
        caption: "The Torii gates of Fushimi Inari glowing in late afternoon amber light.",
        photographer: "@kyoto_solitude",
        location: "Fushimi Ward, Kyoto",
        imageUrl: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?w=800&auto=format&fit=crop&q=80",
        aspect: "tall",
        likes: 3890,
        cameraSpec: "Leica M11 • Summilux 35mm"
      }
    ],
    vlogs: [
      {
        id: "vlg-j1",
        title: "Silent Vlog: Taking the Overnight Sunrise Express Sleeper Train from Tokyo to Izumo",
        creator: "Solo in Japan",
        duration: "14:20",
        views: "612K views",
        thumbnailUrl: "https://images.unsplash.com/photo-1528164344705-475426879c0d?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Watching coastal towns blur past my private wooden cabin window with convenience store matcha and rain on the glass.\""
      },
      {
        id: "vlg-j2",
        title: "24 Hours in Kanazawa: Samurai Districts, Gold-Leaf Ice Cream & Seafood Markets",
        creator: "Nomad Frames",
        duration: "11:05",
        views: "198K views",
        thumbnailUrl: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"If Kyoto feels too busy, Kanazawa gives you that same Edo-period magic at half the pace.\""
      }
    ],
    followUpPrompts: [
      "Build a 7-day photography itinerary for Kyoto & Kanazawa",
      "What camera gear do street photologgers use in Tokyo?",
      "Show me the latest indie hardware & tech vlogs"
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
        publishedAt: "4 hours ago",
        snippet: "After a decade of glass slabs demanding our attention, industrial designers are crafting single-purpose devices that feel like Leica cameras and Braun radios.",
        fullContent: "Walk onto the desk of any thoughtful technologist this year and you will notice a shift: fewer glowing RGB monitors, more warm anodized aluminum, paper-like displays, and rotary encoders with physical detents. We interviewed three indie hardware founders building tools for focus rather than engagement.",
        tags: ["#IndustrialDesign", "#CalmTech", "#Hardware"],
        likes: 1750
      },
      {
        id: "art-t2",
        title: "FromConversational UI to Generative Feeds: Why Traditional Timelines Are Fading",
        author: "Aria Chen • Synthesis",
        authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80",
        readTime: "4 min read",
        category: "Product Essay",
        publishedAt: "11 hours ago",
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
        imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&auto=format&fit=crop&q=80",
        aspect: "wide",
        likes: 2840,
        cameraSpec: "Macro 90mm • Studio Lit"
      },
      {
        id: "pho-t2",
        caption: "Minimalist studio desk setup powered by a single Thunderbolt cable and warm oak.",
        photographer: "@desk_architect",
        location: "Stockholm, Sweden",
        imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80",
        aspect: "square",
        likes: 3190,
        cameraSpec: "Sony A7CII • 24mm"
      },
      {
        id: "pho-t3",
        caption: "Testing spatial waveguides in our optics lab.",
        photographer: "@optics_daily",
        location: "Zurich, Switzerland",
        imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        aspect: "tall",
        likes: 1620,
        cameraSpec: "Nikon Z8 • 50mm"
      }
    ],
    vlogs: [
      {
        id: "vlg-t1",
        title: "Studio Vlog #42: Designing & Machining My Own Pocket Synthesizer in 7 Days",
        creator: "Maker Monologue",
        duration: "16:48",
        views: "420K views",
        thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"There's nothing quite like the moment your custom PCB boots up on the first try without magic smoke.\""
      },
      {
        id: "vlg-t2",
        title: "A Week With Local-First AI Agents on My MacBook: What Actually Works?",
        creator: "DevLog Weekly",
        duration: "10:12",
        views: "310K views",
        thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
        highlightQuote: "\"Replacing five noisy browser tabs with a single calm conversational workspace saved me two hours a day.\""
      }
    ],
    followUpPrompts: [
      "What happened with the cricket match last night?",
      "Show me indie café photologs from Melbourne",
      "Curate a weekend reading list on architecture & design"
    ]
  }
};

// Curated fallback unsplash images by theme keywords so AI-generated feeds always have crisp visuals
const THEME_IMAGE_POOLS = {
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
// GEMINI API HELPER WITH EXPONENTIAL BACKOFF
// ==========================================
async function generateConversationalFeedWithGemini(userQuery, conversationContext) {
  const apiKey = "";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

  const systemInstruction = `You are AiRA, a warm, intelligent, personal conversational media curator for Balaji.
Unlike traditional social media that bombards users with noisy feeds, you wait for Balaji to ask a question or share an interest, and then you reply with:
1. A warm, insightful, specific conversational summary addressing Balaji directly (2-4 sentences).
2. A rich curated set of 3 blog/article posts, 3 photolog moments, and 2 creator vlogs about the exact topic Balaji asked about.
3. If the query is about a sport, match, or event with scores, include an optional matchScorecard object; otherwise omit matchScorecard.
4. Pick visualTheme as one of: "sports", "travel", "food", "general".`;

  const payload = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Previous conversation context: ${conversationContext || "Start of session"}\n\nBalaji's new prompt: "${userQuery}"\n\nGenerate the structured conversational response and bespoke social media feed (blogs, photologs, vlogs).`
          }
        ]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemInstruction }]
    },
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          topicTitle: { type: "STRING" },
          assistantSummary: { type: "STRING" },
          visualTheme: {
            type: "STRING",
            enum: ["sports", "travel", "food", "general"]
          },
          articles: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                author: { type: "STRING" },
                readTime: { type: "STRING" },
                category: { type: "STRING" },
                publishedAt: { type: "STRING" },
                snippet: { type: "STRING" },
                fullContent: { type: "STRING" },
                tags: {
                  type: "ARRAY",
                  items: { type: "STRING" }
                }
              },
              required: ["title", "author", "readTime", "category", "publishedAt", "snippet", "fullContent", "tags"]
            }
          },
          photologs: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                caption: { type: "STRING" },
                photographer: { type: "STRING" },
                location: { type: "STRING" },
                cameraSpec: { type: "STRING" }
              },
              required: ["caption", "photographer", "location", "cameraSpec"]
            }
          },
          vlogs: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                title: { type: "STRING" },
                creator: { type: "STRING" },
                duration: { type: "STRING" },
                views: { type: "STRING" },
                highlightQuote: { type: "STRING" }
              },
              required: ["title", "creator", "duration", "views", "highlightQuote"]
            }
          },
          followUpPrompts: {
            type: "ARRAY",
            items: { type: "STRING" }
          }
        },
        required: [
          "topicTitle",
          "assistantSummary",
          "visualTheme",
          "articles",
          "photologs",
          "vlogs",
          "followUpPrompts"
        ]
      }
    }
  };

  const delays = [1000, 2000, 4000];
  let lastError = null;

  for (let attempt = 0; attempt <= delays.length; attempt++) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const result = await response.json();
      const rawJson = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawJson) throw new Error("Empty model response");

      const parsed = JSON.parse(rawJson);
      const pool = THEME_IMAGE_POOLS[parsed.visualTheme] || THEME_IMAGE_POOLS.general;

      return {
        topicTitle: parsed.topicTitle,
        assistantSummary: parsed.assistantSummary,
        articles: (parsed.articles || []).map((art, idx) => ({
          ...art,
          id: `ai-art-${Date.now()}-${idx}`,
          authorAvatar: AVATAR_POOL[idx % AVATAR_POOL.length],
          likes: 340 + idx * 215
        })),
        photologs: (parsed.photologs || []).map((pho, idx) => ({
          ...pho,
          id: `ai-pho-${Date.now()}-${idx}`,
          imageUrl: pool[idx % pool.length],
          aspect: idx === 0 ? "wide" : idx === 1 ? "square" : "tall",
          likes: 1120 + idx * 430
        })),
        vlogs: (parsed.vlogs || []).map((vlg, idx) => ({
          ...vlg,
          id: `ai-vlg-${Date.now()}-${idx}`,
          thumbnailUrl: pool[(idx + 2) % pool.length]
        })),
        followUpPrompts: parsed.followUpPrompts || [
          "Tell me more about the top story here",
          "Show me what happened with the cricket last night",
          "Show me travel photologs from Japan"
        ]
      };
    } catch (err) {
      lastError = err;
      if (attempt < delays.length) {
        await new Promise((res) => setTimeout(res, delays[attempt]));
      }
    }
  }

  throw lastError;
}

// ==========================================
// CUSTOM NEON VECTOR AiRA LOGO COMPONENTS
// ==========================================
function AiraNeonLogo({ className = "h-9 w-auto" }) {
  return (
    <svg
      viewBox="0 0 340 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} overflow-visible select-none`}
      aria-label="AiRA Neon Logo"
    >
      <defs>
        <linearGradient id="airaNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#2DD4BF" />
          <stop offset="68%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#A855F7" />
        </linearGradient>
        <filter id="airaNeonGlow" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="5" result="blur1" />
          <feGaussianBlur stdDeviation="11" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient Neon Backglow */}
      <g filter="url(#airaNeonGlow)" opacity="0.95">
        {/* Continuous double-ribbon path forming A - i - R - A */}
        <path
          d="M 22 98 L 58 24 C 62 16 70 16 74 24 L 108 92 C 115 104 138 104 146 90 L 146 26 L 188 26 C 208 26 216 38 216 50 C 216 63 206 72 188 72 L 164 72 L 196 96 C 206 104 222 104 230 90 L 264 24 C 268 16 276 16 280 24 L 316 98"
          stroke="url(#airaNeonGrad)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Inner dark core for the hollow neon tube effect */}
        <path
          d="M 22 98 L 58 24 C 62 16 70 16 74 24 L 108 92 C 115 104 138 104 146 90 L 146 26 L 188 26 C 208 26 216 38 216 50 C 216 63 206 72 188 72 L 164 72 L 196 96 C 206 104 222 104 230 90 L 264 24 C 268 16 276 16 280 24 L 316 98"
          stroke="#0B0D11"
          strokeWidth="4.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Crossbars for first A and second A */}
        <path
          d="M 42 74 H 90"
          stroke="url(#airaNeonGrad)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M 248 74 H 296"
          stroke="url(#airaNeonGrad)"
          strokeWidth="9"
          strokeLinecap="round"
        />

        {/* 'i' Stem & Glowing Dot */}
        <rect
          x="120"
          y="46"
          width="12"
          height="42"
          rx="6"
          stroke="url(#airaNeonGrad)"
          strokeWidth="4.5"
          fill="#0B0D11"
        />
        <circle
          cx="126"
          cy="26"
          r="7.5"
          stroke="#2DD4BF"
          strokeWidth="4.5"
          fill="#0B0D11"
        />
      </g>
    </svg>
  );
}

function AiraAssistantBadge({ size = "sm" }) {
  const dims = size === "md" ? "w-9 h-9" : "w-7 h-7";
  return (
    <div
      className={`${dims} rounded-xl bg-[#121726] border border-cyan-400/35 shadow-md shadow-cyan-500/15 flex items-center justify-center shrink-0 mt-0.5`}
    >
      <AiraNeonLogo className="w-6 h-auto" />
    </div>
  );
}

// ==========================================
// MAIN APP COMPONENT
// ==========================================
export default function App() {
  // Navigation & view state: starts in 'greeting' mode with NO feed shown by default
  const [viewMode, setViewMode] = useState("greeting"); // 'greeting' | 'conversation'
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceSimulated, setIsVoiceSimulated] = useState(false);
  const [activeMediaFilter, setActiveMediaFilter] = useState("all"); // 'all' | 'articles' | 'photologs' | 'vlogs'

  // Conversation Thread: array of turns { id, userQuery, timestamp, feedData }
  const [turns, setTurns] = useState([]);
  const [activeTurnId, setActiveTurnId] = useState(null);

  // Interactive User States (Likes, Bookmarks, Modals, Create Post)
  const [likedIds, setLikedIds] = useState({});
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [selectedVlog, setSelectedVlog] = useState(null);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const chatEndRef = useRef(null);

  // Show temporary toast notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  };

  // Determine greeting based on time of day
  const getGreetingPhrase = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Balaji";
    if (hour < 17) return "Good afternoon, Balaji";
    return "Good evening, Balaji";
  };

  // Quick suggestion chips on the Greeting Screen
  const greetingChips = [
    {
      label: "Hi, what happened with the cricket last night?",
      tag: "Live Sports & Match Photolog",
      icon: Flame,
      presetKey: "cricket"
    },
    {
      label: "Show me travel photologs from Japan",
      tag: "Visual Stories & Slow Blogs",
      icon: Camera,
      presetKey: "japan"
    },
    {
      label: "Latest tech vlogs & calm hardware blogs",
      tag: "Creator Vlogs & Essays",
      icon: Video,
      presetKey: "tech"
    }
  ];

  // Match query to instant rich demo or live Gemini AI generation
  const handleSendQuery = async (customPrompt = null) => {
    const queryText = (customPrompt !== null ? customPrompt : inputQuery).trim();
    if (!queryText || isGenerating) return;

    setInputQuery("");
    setIsVoiceSimulated(false);
    setViewMode("conversation");
    setIsGenerating(true);

    const lower = queryText.toLowerCase();
    const turnId = `turn-${Date.now()}`;

    try {
      let feedData = null;

      // Check if it matches our flagship preloaded cricket, japan, or tech experiences
      if (
        lower.includes("cricket") ||
        lower.includes("match") ||
        lower.includes("last night") ||
        lower.includes("chepauk") ||
        lower.includes("sky") ||
        lower.includes("bumrah")
      ) {
        await new Promise((r) => setTimeout(r, 650));
        feedData = PRELOADED_FEEDS.cricket;
      } else if (
        lower.includes("japan") ||
        lower.includes("kyoto") ||
        lower.includes("tokyo") ||
        lower.includes("kanazawa")
      ) {
        await new Promise((r) => setTimeout(r, 650));
        feedData = PRELOADED_FEEDS.japan;
      } else if (
        lower.includes("tech") ||
        lower.includes("hardware") ||
        lower.includes("indie") ||
        lower.includes("spatial")
      ) {
        await new Promise((r) => setTimeout(r, 650));
        feedData = PRELOADED_FEEDS.tech;
      } else {
        // Call Gemini API for any custom topic Balaji asks about
        const historyContext = turns
          .map((t) => `Balaji: ${t.userQuery} -> AiRA: ${t.feedData.topicTitle}`)
          .join(" | ");
        feedData = await generateConversationalFeedWithGemini(queryText, historyContext);
      }

      const newTurn = {
        id: turnId,
        userQuery: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedData
      };

      setTurns((prev) => [...prev, newTurn]);
      setActiveTurnId(turnId);
      setActiveMediaFilter("all");
    } catch (error) {
      // Graceful fallback so the UI never breaks even if offline
      const fallbackTurn = {
        id: turnId,
        userQuery: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        feedData: {
          ...PRELOADED_FEEDS.cricket,
          topicTitle: `Curated Stories: "${queryText}"`,
          assistantSummary: `Good morning, Balaji! I've pulled together a bespoke collection of blogs, photo journals, and creator vlogs around "${queryText}", along with last night's top highlights.`
        }
      };
      setTurns((prev) => [...prev, fallbackTurn]);
      setActiveTurnId(turnId);
    } finally {
      setIsGenerating(false);
    }
  };

  // Simulate Voice Dictation Input
  const handleToggleVoice = () => {
    if (isVoiceSimulated) {
      setIsVoiceSimulated(false);
      return;
    }
    setIsVoiceSimulated(true);
    setInputQuery("");
    const sampleVoicePhrase = "Hi, what happened with the cricket last night?";
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setInputQuery(sampleVoicePhrase.slice(0, idx));
      if (idx >= sampleVoicePhrase.length) {
        clearInterval(interval);
        setIsVoiceSimulated(false);
      }
    }, 38);
  };

  const toggleLike = (id) => {
    setLikedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmark = (item, type) => {
    setBookmarkedItems((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        triggerToast("Removed from your Reading & Photo Vault");
        return prev.filter((b) => b.id !== item.id);
      } else {
        triggerToast(`Saved "${item.title || item.caption.slice(0, 32)}..." to Vault`);
        return [...prev, { ...item, mediaType: type }];
      }
    });
  };

  const isBookmarked = (id) => bookmarkedItems.some((b) => b.id === id);

  // Get currently displayed turn's media feed
  const currentTurn = turns.find((t) => t.id === activeTurnId) || turns[turns.length - 1] || null;

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
      {/* Subtle Ambient Background Glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[36rem] h-[36rem] bg-cyan-500/10 rounded-full blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-[32rem] h-[32rem] bg-purple-500/10 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[28rem] h-[28rem] bg-emerald-500/8 rounded-full blur-[130px]" />
      </div>

      {/* Top Minimal Navigation Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0B0D11]/80 border-b border-white/[0.06] px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetToGreeting}
            className="group flex items-center gap-3 text-left focus:outline-none"
            title="Return to AiRA Greeting Screen"
          >
            <div className="px-2.5 py-1.5 rounded-2xl bg-gradient-to-br from-cyan-500/[0.08] via-teal-500/[0.05] to-purple-500/[0.12] border border-cyan-400/20 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/40 group-hover:scale-[1.02] transition-all flex items-center justify-center">
              <AiraNeonLogo className="h-7 sm:h-8 w-auto" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-lg bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-400 bg-clip-text text-transparent">
                  AiRA
                </span>
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25 font-medium">
                  Zero-Feed Social
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Conversational Blog • Photolog • Vlog Stream
              </p>
            </div>
          </button>
        </div>

        {/* Right Actions: Mode Switcher, Saved Vault, Balaji Profile */}
        <div className="flex items-center gap-2.5 sm:gap-3">
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

      {/* ==========================================
          VIEW 1: CLEAN GREETING SCREEN (NO DEFAULT FEED)
         ========================================== */}
      {viewMode === "greeting" && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full">
          {/* Blended Neon AiRA Hero Emblem */}
          <div className="mb-5 relative flex flex-col items-center">
            <div className="absolute -inset-6 bg-gradient-to-r from-cyan-500/20 via-teal-400/15 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <AiraNeonLogo className="h-14 sm:h-16 w-auto relative z-10" />
          </div>

          {/* Calm Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-400/20 text-xs text-slate-300 mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Welcome to <strong className="text-cyan-300 font-semibold">AiRA</strong> — Your feed awakens only when we talk.</span>
          </div>

          {/* Personalized Greeting Title */}
          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-center bg-gradient-to-r from-white via-cyan-100 to-purple-200/90 bg-clip-text text-transparent mb-4">
            Good morning, Balaji.
          </h1>

          <p className="text-slate-400 text-center text-base sm:text-lg max-w-xl mb-10 leading-relaxed">
            What would you like to explore today? Ask about last night’s match, a city you’re dreaming of, or a topic to populate blogs, photologs, and vlogs.
          </p>

          {/* Main Conversational Input Box */}
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
                  placeholder='Try "Hi, what happened with the cricket last night?"'
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
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-semibold text-sm flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition cursor-pointer"
                >
                  <span>Ask</span>
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

          {/* Quick Suggestion Chips */}
          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                Start a conversation to generate your feed
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-400/70" /> Powered by Gemini AI
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              {greetingChips.map((chip, idx) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(chip.label)}
                    className="group text-left p-4 rounded-2xl bg-[#12161F]/80 hover:bg-[#171C28] border border-white/[0.07] hover:border-amber-400/40 transition-all duration-200 flex flex-col justify-between h-full shadow-lg"
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

      {/* ==========================================
          VIEW 2: CONVERSATIONAL MEDIA DISCOVERY WORKSPACE
         ========================================== */}
      {viewMode === "conversation" && (
        <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN (LG: 4 COLS): Conversational Assistant Stream */}
          <section className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col bg-[#11151E]/90 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl max-h-[84vh]">
            {/* Assistant Header */}
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold text-white">AiRA Assistant</h2>
                  <p className="text-[11px] text-slate-400">
                    Populating feeds from your chat
                  </p>
                </div>
              </div>
              <button
                onClick={handleResetToGreeting}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Fresh Canvas</span>
              </button>
            </div>

            {/* Chat Turns History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              {/* Initial Greeting Bubble inside thread */}
              <div className="flex items-start gap-3">
                <AiraAssistantBadge />
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {getGreetingPhrase()}! I’m <span className="text-cyan-300 font-medium">AiRA</span>. Ask me about any event, match, or interest, and I’ll curate the articles, photologs, and vlogs right beside our chat.
                </div>
              </div>

              {turns.map((turn) => {
                const isSelected = currentTurn && currentTurn.id === turn.id;
                return (
                  <div key={turn.id} className="space-y-3">
                    {/* User Message Bubble */}
                    <div className="flex justify-end">
                      <div className="max-w-[85%] bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-100 rounded-2xl rounded-tr-sm px-4 py-2.5 text-xs sm:text-sm">
                        <p>{turn.userQuery}</p>
                        <span className="block text-[10px] text-amber-300/60 mt-1 text-right">
                          {turn.timestamp}
                        </span>
                      </div>
                    </div>

                    {/* Assistant Summary Bubble + Feed Switcher Pill */}
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

                        {/* Summary counts badge */}
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

              {/* Loading Indicator during AI generation */}
              {isGenerating && (
                <div className="flex items-start gap-3 animate-pulse">
                  <AiraAssistantBadge />
                  <div className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-2xl p-4 space-y-2.5">
                    <div className="h-3 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-full" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                    <p className="text-[11px] text-cyan-300/90 pt-1">
                      AiRA is curating blogs, photologs & vlogs for your conversation...
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Suggested Follow-up Chips inside Chat */}
            {currentTurn && currentTurn.feedData?.followUpPrompts && !isGenerating && (
              <div className="px-4 py-2.5 bg-white/[0.02] border-t border-white/[0.06] overflow-x-auto">
                <div className="flex items-center gap-2">
                  {currentTurn.feedData.followUpPrompts.map((prompt, i) => (
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

            {/* Chat Input Footer */}
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
                placeholder="Ask a follow-up or new topic..."
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

          {/* RIGHT COLUMN (LG: 8 COLS): Dynamically Populated Rich Media Canvas */}
          <section className="lg:col-span-8 space-y-8 pb-16">
            {currentTurn ? (
              <>
                {/* Dynamic Feed Header Bar & Media Type Filter */}
                <div className="bg-[#121620]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-5">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-amber-400 font-medium mb-1">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>POPULATED FROM YOUR CONVERSATION</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        {currentTurn.feedData.topicTitle}
                      </h1>
                    </div>

                    {/* Filter Tabs: All / Articles / Photologs / Vlogs */}
                    <div className="flex items-center gap-1.5 bg-[#0B0D11] p-1.5 rounded-2xl border border-white/[0.07] self-start">
                      {[
                        { id: "all", label: "All Media" },
                        { id: "articles", label: "Blogs" },
                        { id: "photologs", label: "Photologs" },
                        { id: "vlogs", label: "Vlogs" }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveMediaFilter(tab.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                            activeMediaFilter === tab.id
                              ? "bg-amber-400 text-slate-950 shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Optional Match Scorecard Banner (if Cricket/Sports query) */}
                  {currentTurn.feedData.matchScorecard && (
                    <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#151C28] to-indigo-950/60 border border-emerald-500/25 p-4 sm:p-5">
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

                {/* ==========================================
                    SECTION 1: PHOTOLOGS / VISUAL HIGHLIGHTS
                   ========================================== */}
                {(activeMediaFilter === "all" || activeMediaFilter === "photologs") &&
                  currentTurn.feedData.photologs?.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                            <Camera className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              Photologs & Visual Moments
                            </h2>
                            <p className="text-xs text-slate-400">
                              High-resolution frames captured from the scene
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {currentTurn.feedData.photologs.map((photo, index) => {
                          const isLiked = !!likedIds[photo.id];
                          return (
                            <div
                              key={photo.id}
                              className={`group relative rounded-3xl overflow-hidden bg-[#141822] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 flex flex-col justify-between ${
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
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-black/20 to-transparent" />

                                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-slate-200 border border-white/10">
                                  <MapPin className="w-3 h-3 text-amber-400" />
                                  <span>{photo.location}</span>
                                </div>

                                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] text-slate-300 border border-white/10">
                                  {photo.cameraSpec}
                                </div>
                              </div>

                              <div className="p-4 flex-1 flex flex-col justify-between bg-[#121620]">
                                <p
                                  onClick={() => setSelectedPhoto(photo)}
                                  className="text-sm text-slate-100 leading-snug mb-3 cursor-pointer hover:text-amber-200 transition"
                                >
                                  {photo.caption}
                                </p>

                                <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs text-slate-400">
                                  <span className="font-medium text-amber-300/90">
                                    {photo.photographer}
                                  </span>

                                  <div className="flex items-center gap-3">
                                    <button
                                      onClick={() => toggleLike(photo.id)}
                                      className={`flex items-center gap-1 transition ${
                                        isLiked
                                          ? "text-rose-400 font-semibold"
                                          : "hover:text-slate-200"
                                      }`}
                                    >
                                      <Heart
                                        className={`w-3.5 h-3.5 ${
                                          isLiked ? "fill-rose-400" : ""
                                        }`}
                                      />
                                      <span>{photo.likes + (isLiked ? 1 : 0)}</span>
                                    </button>
                                    <button
                                      onClick={() => toggleBookmark(photo, "photolog")}
                                      className={`transition ${
                                        isBookmarked(photo.id)
                                          ? "text-amber-400"
                                          : "hover:text-slate-200"
                                      }`}
                                      title="Save Photolog"
                                    >
                                      <Bookmark
                                        className={`w-3.5 h-3.5 ${
                                          isBookmarked(photo.id) ? "fill-amber-400" : ""
                                        }`}
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

                {/* ==========================================
                    SECTION 2: ARTICLES & IN-DEPTH BLOG POSTS
                   ========================================== */}
                {(activeMediaFilter === "all" || activeMediaFilter === "articles") &&
                  currentTurn.feedData.articles?.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25">
                            <BookOpen className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              Curated Blogs & Deep-Dive Articles
                            </h2>
                            <p className="text-xs text-slate-400">
                              Longform analysis and stories matched to your query
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3.5">
                        {currentTurn.feedData.articles.map((article) => {
                          const isLiked = !!likedIds[article.id];
                          return (
                            <article
                              key={article.id}
                              className="group rounded-3xl bg-[#121620]/90 hover:bg-[#161B28] border border-white/[0.08] hover:border-amber-400/35 p-5 sm:p-6 transition-all duration-200 shadow-lg"
                            >
                              <div className="flex items-center justify-between gap-2 mb-3">
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
                                  {article.tags?.map((tag, idx) => (
                                    <span
                                      key={idx}
                                      className="text-[11px] text-slate-400 bg-white/[0.04] px-2.5 py-0.5 rounded-md"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <div className="flex items-center gap-3">
                                  <button
                                    onClick={() => toggleLike(article.id)}
                                    className={`text-xs flex items-center gap-1 transition ${
                                      isLiked
                                        ? "text-rose-400 font-semibold"
                                        : "text-slate-400 hover:text-white"
                                    }`}
                                  >
                                    <Heart
                                      className={`w-3.5 h-3.5 ${
                                        isLiked ? "fill-rose-400" : ""
                                      }`}
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

                                  <button
                                    onClick={() => setSelectedArticle(article)}
                                    className="text-xs font-medium text-amber-300 hover:text-amber-200 flex items-center gap-1 pl-2 border-l border-white/10 cursor-pointer"
                                  >
                                    <span>Read Full Post</span>
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

                {/* ==========================================
                    SECTION 3: VLOGS & CREATOR VIDEO STORIES
                   ========================================== */}
                {(activeMediaFilter === "all" || activeMediaFilter === "vlogs") &&
                  currentTurn.feedData.vlogs?.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                          <span className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/25">
                            <Video className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="text-lg font-semibold text-white">
                              Related Vlogs & Creator Reels
                            </h2>
                            <p className="text-xs text-slate-400">
                              First-person video logs and dugout highlights
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentTurn.feedData.vlogs.map((vlog) => (
                          <div
                            key={vlog.id}
                            onClick={() => setSelectedVlog(vlog)}
                            className="group rounded-3xl overflow-hidden bg-[#121620] border border-white/[0.08] hover:border-rose-400/40 transition cursor-pointer flex flex-col justify-between shadow-lg"
                          >
                            <div className="relative h-48 overflow-hidden">
                              <img
                                src={vlog.thumbnailUrl}
                                alt={vlog.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                                  <Play className="w-5 h-5 fill-white ml-0.5" />
                                </div>
                              </div>
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

                              <p className="text-xs italic text-slate-300 bg-white/[0.03] p-3 rounded-xl border border-white/[0.05]">
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
              /* Skeleton placeholder while first turn loads */
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

      {/* ==========================================
          MODAL 1: ARTICLE / BLOG READER MODAL
         ========================================== */}
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

            <span className="inline-block text-xs px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 border border-amber-400/30">
              {selectedArticle.category}
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
              {selectedArticle.title}
            </h2>

            <p className="text-base text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedArticle.fullContent}
            </p>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {selectedArticle.tags?.map((t, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
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
      )}

      {/* ==========================================
          MODAL 2: PHOTOLOG LIGHTBOX INSPECTOR
         ========================================== */}
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
                <div className="flex items-center gap-2 text-xs text-amber-300 mb-1">
                  <span>{selectedPhoto.photographer}</span>
                  <span>•</span>
                  <span>{selectedPhoto.location}</span>
                  <span>•</span>
                  <span className="text-slate-400">{selectedPhoto.cameraSpec}</span>
                </div>
                <p className="text-base text-white">{selectedPhoto.caption}</p>
              </div>
              <button
                onClick={() => toggleBookmark(selectedPhoto, "photolog")}
                className="shrink-0 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBookmarked(selectedPhoto.id) ? "Saved in Vault" : "Save Photo"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL 3: VLOG INTERACTIVE PLAYER PREVIEW
         ========================================== */}
      {selectedVlog && (
        <div
          onClick={() => setSelectedVlog(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border border-white/15 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl"
          >
            <div className="relative h-72 sm:h-80 bg-black">
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
              <button
                onClick={() => setSelectedVlog(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-rose-300 font-medium mb-1">
                  {selectedVlog.creator} • {selectedVlog.views}
                </p>
                <h3 className="text-lg font-bold text-white">{selectedVlog.title}</h3>
              </div>
              <button
                onClick={() => {
                  handleSendQuery(`Summarize key takeaways from the vlog "${selectedVlog.title}"`);
                  setSelectedVlog(null);
                }}
                className="shrink-0 px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs"
              >
                Ask AiRA About This Vlog
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          DRAWER: SAVED VAULT (BOOKMARKED ITEMS)
         ========================================== */}
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
                    Bookmark any blog post or photolog generated during your conversations to keep it here.
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

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}