import React, { useState, useEffect, useRef, useId, useMemo } from "react";
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  BookOpen,
  Camera,
  Video,
  Heart,
  Bookmark,
  Share2,
  Clock,
  ArrowUpRight,
  Play,
  RotateCcw,
  Check,
  Flame,
  Calendar,
  MapPin,
  Search,
  Layers,
  X,
  Volume2,
  MessageSquare,
  PlusCircle,
  SlidersHorizontal,
  Globe,
  ShieldCheck,
  Filter,
  RefreshCw,
  ExternalLink,
  KeyRound,
  Compass,
  Radio
} from "lucide-react";
import { globalSearchOrchestrator } from "./engine/searchOrchestrator";
import {
  ConversationSessionState,
  SocialDiscoveryFeed,
  TrustedSearchEngineResponse
} from "./engine/types";

const FALLBACK_STAGE_IMAGE =
  "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=900&auto=format&fit=crop&q=80";

// ============================================================================
// CLIENT-TO-BACKEND CURATED FEED FETCHER
// Uses the backend /api/trusted-search pipeline (with isomorphic fallback)
// while keeping source governance and conversation state synchronized.
// ============================================================================
async function fetchLiveCuratedFeed(
  userQuery: string,
  options: {
    timeframe?: "all" | "day" | "week" | "month" | "year";
    strictFilter?: boolean;
    geminiApiKey?: string;
    conversationContext?: string;
    conversationId?: string;
    conversationState?: ConversationSessionState | null;
    page?: number;
    pageSize?: number;
    bypassCache?: boolean;
  } = {}
): Promise<SocialDiscoveryFeed> {
  const {
    geminiApiKey = "",
    conversationId = "aira-web-session",
    conversationState = null,
    page = 1,
    pageSize = 12,
    bypassCache = false
  } = options;

  let responsePayload: TrustedSearchEngineResponse | null = null;

  try {
    const res = await fetch("/api/trusted-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: userQuery,
        bypassCache,
        geminiApiKey: geminiApiKey || undefined,
        conversationId,
        conversationState,
        page,
        pageSize
      })
    });
    if (res.ok) {
      responsePayload = await res.json();
    }
  } catch {
    // Fallback to in-process orchestrator if static preview environment
  }

  if (!responsePayload) {
    responsePayload = await globalSearchOrchestrator.executeSearch({
      query: userQuery,
      bypassCache,
      geminiApiKey: geminiApiKey || undefined,
      conversationId,
      conversationState,
      page,
      pageSize
    });
  }

  if (responsePayload.socialFeed) {
    return responsePayload.socialFeed;
  }

  // Fallback safety wrapper if socialFeed was omitted
  const fallbackExec = await globalSearchOrchestrator.executeSearch({
    query: userQuery,
    bypassCache: true,
    conversationId,
    conversationState,
    page,
    pageSize
  });
  return fallbackExec.socialFeed!;
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
  const [mobileActivePane, setMobileActivePane] = useState<"feed" | "chat">("feed");
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
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [visibleCountMultiplier, setVisibleCountMultiplier] = useState(1);
  const [hasNewLiveUpdateBanner, setHasNewLiveUpdateBanner] = useState(false);

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
      tag: "Live Sports • Match Scorecards, Photos & Highlights",
      icon: Flame
    },
    {
      label: "Show me travel photologs from Japan",
      tag: "Visual Stories • Kyoto, Tokyo & Shinkansen Vlogs",
      icon: Camera
    },
    {
      label: "Formula 1 race updates, paddock photos & highlights",
      tag: "Motorsport • Telemetry, Broadcasters & Team Blogs",
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
    setMobileActivePane("feed");
    setIsGenerating(true);
    setVisibleCountMultiplier(1);
    setHasNewLiveUpdateBanner(false);

    const turnId = `turn-${Date.now()}`;
    const tf = overrideTimeframe || activeTimeframe;

    try {
      const historyContext = turns
        .map((t) => `Balaji: ${t.userQuery} -> AiRA: ${t.feedData.topicTitle}`)
        .join(" | ");
      const priorConversationState: ConversationSessionState | null =
        turns.length > 0
          ? turns[turns.length - 1]?.feedData?.conversationState || null
          : null;

      const feedData = await fetchLiveCuratedFeed(queryText, {
        timeframe: tf,
        strictFilter: strictSignalOnly,
        geminiApiKey,
        conversationContext: historyContext,
        conversationId: "aira-web-session",
        conversationState: priorConversationState,
        page: 1,
        pageSize: 14
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
    } finally {
      setIsGenerating(false);
    }
  };

  const currentTurn = turns.find((t) => t.id === activeTurnId) || turns[turns.length - 1] || null;

  const handleRefreshLiveTurn = async (
    newTimeframe?: "all" | "day" | "week" | "month" | "year",
    silentBackground = false
  ) => {
    if (!currentTurn || isGenerating) return;
    const tf = newTimeframe || activeTimeframe;
    if (newTimeframe) setActiveTimeframe(newTimeframe);
    if (!silentBackground) setIsGenerating(true);

    try {
      const effectiveQuery =
        currentTurn.feedData?.searchTopic || currentTurn.userQuery;
      const refreshedData = await fetchLiveCuratedFeed(effectiveQuery, {
        timeframe: tf,
        strictFilter: strictSignalOnly,
        geminiApiKey,
        conversationId: "aira-web-session",
        conversationState: currentTurn.feedData?.conversationState || null,
        bypassCache: true,
        page: visibleCountMultiplier,
        pageSize: 14
      });

      setTurns((prev) =>
        prev.map((t) => (t.id === currentTurn.id ? { ...t, feedData: refreshedData } : t))
      );
      setHasNewLiveUpdateBanner(false);
      if (!silentBackground) {
        triggerToast("Refreshed live feed & updated active scorecards");
      }
    } finally {
      if (!silentBackground) setIsGenerating(false);
    }
  };

  const handleLoadMoreItems = async () => {
    const nextPage = visibleCountMultiplier + 1;
    setVisibleCountMultiplier(nextPage);
    if (!currentTurn) return;
    const effectiveQuery =
      currentTurn.feedData?.searchTopic || currentTurn.userQuery;
    const expandedData = await fetchLiveCuratedFeed(effectiveQuery, {
      timeframe: activeTimeframe,
      strictFilter: strictSignalOnly,
      geminiApiKey,
      conversationId: "aira-web-session",
      conversationState: currentTurn.feedData?.conversationState || null,
      page: nextPage,
      pageSize: 14
    });
    setTurns((prev) =>
      prev.map((t) => (t.id === currentTurn.id ? { ...t, feedData: expandedData } : t))
    );
    triggerToast("Loaded additional stories, photos & videos");
  };

  const handleShareItem = (title: string, url: string) => {
    if (navigator?.clipboard?.writeText && url) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
    triggerToast(`Copied link to "${title.slice(0, 32)}..."`);
  };

  const handleToggleVoice = () => {
    if (isVoiceSimulated) {
      setIsVoiceSimulated(false);
      return;
    }
    setIsVoiceSimulated(true);
    setInputQuery("");
    const sampleVoicePhrase = "Formula 1 live race updates, paddock photologs and highlights";
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

  // Compute filtered & sorted items for the active turn while preserving feed continuity
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

    const nowMs = Date.now();
    const maxAgeByTimeframeMs: Record<string, number> = {
      all: Number.POSITIVE_INFINITY,
      day: 24 * 3600 * 1000,
      week: 7 * 24 * 3600 * 1000,
      month: 30 * 24 * 3600 * 1000,
      year: 365 * 24 * 3600 * 1000
    };
    const maxAllowedAge = maxAgeByTimeframeMs[activeTimeframe] || Number.POSITIVE_INFINITY;

    const matchItem = (item: any, textFields: string[]) => {
      if (activeSourceFilter !== "all" && item.sourceName !== activeSourceFilter) return false;
      if ((item.signalScore || 90) < minScore) return false;
      if (item.timestampMs && nowMs - item.timestampMs > maxAllowedAge) return false;
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
          matchItem(a, [a.title, a.snippet, a.author, a.category, a.sourceName, ...(a.tags || [])])
        )
      ),
      photologs: sortItems(
        rawPhotos.filter((p: any) =>
          matchItem(p, [p.caption, p.photographer, p.location, p.cameraSpec, p.sourceName])
        )
      ),
      vlogs: sortItems(
        rawVlogs.filter((v: any) =>
          matchItem(v, [v.title, v.creator, v.highlightQuote, v.sourceName])
        )
      )
    };
  }, [
    currentTurn,
    activeSourceFilter,
    activeTimeframe,
    keywordFilter,
    strictSignalOnly,
    minSignalScore,
    activeSortBy
  ]);

  // Subtle background check for live sports or developing stories without disrupting scroll position
  useEffect(() => {
    if (viewMode !== "conversation" || !currentTurn?.feedData?.matchScorecard?.isLive) {
      return;
    }
    const timer = setInterval(() => {
      setHasNewLiveUpdateBanner(true);
    }, 45000);
    return () => clearInterval(timer);
  }, [viewMode, currentTurn]);

  useEffect(() => {
    if (chatEndRef.current && viewMode === "conversation") {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [turns.length, isGenerating, viewMode]);

  const handleResetToGreeting = () => {
    setViewMode("greeting");
    setInputQuery("");
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200 flex flex-col overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/4 w-[22rem] sm:w-[36rem] h-[22rem] sm:h-[36rem] bg-cyan-500/10 rounded-full blur-[110px] sm:blur-[130px]" />
        <div className="absolute top-1/3 -right-32 w-[20rem] sm:w-[32rem] h-[20rem] sm:h-[32rem] bg-purple-500/10 rounded-full blur-[120px] sm:blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-[18rem] sm:w-[28rem] h-[18rem] sm:h-[28rem] bg-emerald-500/8 rounded-full blur-[110px] sm:blur-[130px]" />
      </div>

      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[#0B0D11]/90 border-b border-white/[0.07] px-3.5 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2">
        <div className="flex items-center min-w-0">
          <button
            onClick={handleResetToGreeting}
            className="group flex items-center gap-2.5 sm:gap-3.5 text-left focus:outline-none min-w-0"
            title="Return to AiRA Greeting Screen"
          >
            <div className="px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500/[0.12] via-teal-500/[0.06] to-purple-500/[0.15] border border-cyan-400/25 shadow-lg shadow-cyan-500/10 group-hover:border-cyan-400/50 transition-all flex items-center justify-center shrink-0">
              <AiraNeonLogo className="h-7 sm:h-9 w-auto" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-display font-extrabold tracking-tight text-base sm:text-xl bg-gradient-to-r from-cyan-300 via-teal-200 to-purple-400 bg-clip-text text-transparent">
                  AiRA
                </span>
                <span className="sm:hidden text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/25 font-semibold inline-flex items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
                <span className="hidden sm:inline-flex text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-300 border border-emerald-400/25 font-medium items-center gap-1 shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Filtered Social
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block truncate">
                Conversational Live Web Blogs • Photologs • Vlogs
              </p>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {turns.length > 0 && (
            <button
              onClick={() =>
                setViewMode((prev) => (prev === "greeting" ? "conversation" : "greeting"))
              }
              className="h-9 text-xs px-2.5 sm:px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 flex items-center justify-center gap-1.5 transition"
              title={viewMode === "greeting" ? "Resume Feed" : "Greeting Screen"}
            >
              {viewMode === "greeting" ? (
                <>
                  <Layers className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden xs:inline sm:inline font-medium">
                    Feed ({turns.length})
                  </span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="hidden sm:inline">Greeting Screen</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setShowApiKeyModal(true)}
            className="h-9 px-2.5 sm:px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 flex items-center justify-center gap-1.5 text-xs transition"
            title="Configure Live AI & Filter Preferences"
          >
            <KeyRound className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="hidden md:inline">
              {geminiApiKey ? "Gemini Key Active" : "Live AI Settings"}
            </span>
          </button>

          <button
            onClick={() => setShowSavedDrawer(true)}
            className="relative h-9 px-2.5 sm:px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 flex items-center justify-center gap-1.5 text-xs transition"
            title="Saved Vault"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Vault</span>
            {bookmarkedItems.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                {bookmarkedItems.length}
              </span>
            )}
          </button>

          <div className="flex items-center gap-2 pl-1.5 sm:pl-2 border-l border-white/10">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-600 flex items-center justify-center text-slate-950 font-bold text-xs shadow-inner shrink-0">
              B
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-xs font-semibold text-slate-200">Balaji</p>
              <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Chennai, IN
              </p>
            </div>
          </div>
        </div>
      </header>

      {viewMode === "greeting" && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 max-w-4xl mx-auto w-full">
          <div className="mb-5 sm:mb-6 relative flex flex-col items-center">
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-teal-400/15 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <AiraNeonLogo className="h-14 sm:h-20 w-auto relative z-10" />
          </div>

          <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-cyan-400/25 text-[11px] sm:text-xs text-slate-300 mb-5 sm:mb-6 shadow-sm text-center max-w-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate sm:whitespace-normal">
              Welcome to <strong className="text-cyan-300 font-semibold">AiRA</strong> — Live web results, filtered for pure signal.
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center bg-gradient-to-r from-white via-cyan-100 to-purple-200/90 bg-clip-text text-transparent mb-3 sm:mb-4 leading-[1.14]">
            {getGreetingPhrase()}.
          </h1>

          <p className="text-slate-400 text-center text-sm sm:text-lg max-w-2xl mb-7 sm:mb-10 leading-relaxed px-1">
            Ask about any topic in the world—live sports, cities, science, cinema, or tech. AiRA fetches live blogs, photologs, and vlogs in real time and filters out the noise.
          </p>

          <div className="w-full max-w-2xl mb-8 sm:mb-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendQuery();
              }}
              className="relative group rounded-2xl bg-[#131720]/95 border border-white/[0.12] focus-within:border-amber-400/60 shadow-2xl shadow-black/60 p-1.5 sm:p-2 transition-all duration-300"
            >
              <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400/80 shrink-0" />
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder='Ask live: "Formula 1", "Smartphone", "Kyoto"...'
                  className="flex-1 min-w-0 bg-transparent text-slate-100 placeholder-slate-500 text-sm sm:text-lg focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  title="Simulate Voice Input"
                  className={`p-2 sm:p-2.5 rounded-xl shrink-0 transition ${
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
                  className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 disabled:opacity-40 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-1.5 shrink-0 shadow-md shadow-amber-500/10"
                >
                  <span className="hidden sm:inline">Explore Live</span>
                  <span className="sm:hidden">Explore</span>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-3 px-1">
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold">
                Try a live filtered stream or type any custom topic
              </span>
              <span className="text-[11px] sm:text-xs text-emerald-400/90 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 shrink-0" /> Multi-Source Live Web Fetch
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5">
              {greetingChips.map((chip, idx) => {
                const IconComponent = chip.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSendQuery(chip.label)}
                    className="group text-left p-4 rounded-2xl bg-[#12161F]/85 hover:bg-[#171C28] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-200 flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2.5 sm:mb-3">
                        <span className="p-2 rounded-xl bg-amber-400/10 text-amber-300 border border-amber-400/20">
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-amber-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="text-sm font-semibold text-slate-100 group-hover:text-white leading-snug mb-1.5">
                        “{chip.label}”
                      </p>
                    </div>
                    <span className="text-[11px] text-slate-400 mt-1.5 inline-block">
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
        <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-3.5 sm:px-6 lg:px-8 pt-3 pb-24 lg:py-6 grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* MOBILE STICKY PANE SWITCHER (Hidden on desktop lg+) */}
          <div className="lg:hidden sticky top-[55px] z-20 -mx-3.5 px-3.5 py-2 bg-[#0B0D11]/95 backdrop-blur-xl border-b border-white/[0.07] flex items-center justify-between gap-2">
            <div className="flex items-center bg-[#121620] p-1 rounded-xl border border-white/[0.08] flex-1">
              <button
                onClick={() => setMobileActivePane("feed")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  mobileActivePane === "feed"
                    ? "bg-amber-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Social Feed</span>
                {currentTurn && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      mobileActivePane === "feed"
                        ? "bg-slate-950/20 text-slate-950 font-bold"
                        : "bg-white/[0.07] text-slate-400"
                    }`}
                  >
                    {filteredFeed.articles.length +
                      filteredFeed.photologs.length +
                      filteredFeed.vlogs.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileActivePane("chat")}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                  mobileActivePane === "chat"
                    ? "bg-cyan-400 text-slate-950 shadow-sm"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>AiRA Curator</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    mobileActivePane === "chat"
                      ? "bg-slate-950/20 text-slate-950 font-bold"
                      : "bg-white/[0.07] text-slate-400"
                  }`}
                >
                  {turns.length}
                </span>
              </button>
            </div>

            <button
              onClick={handleResetToGreeting}
              className="h-9 px-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs text-slate-300 flex items-center gap-1 shrink-0"
              title="Start a New Topic"
            >
              <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden xs:inline">New</span>
            </button>
          </div>

          {/* LEFT COLUMN: CONVERSATION & PROMPT STREAM */}
          <section
            className={`${
              mobileActivePane === "chat" ? "flex" : "hidden lg:flex"
            } lg:col-span-4 lg:sticky lg:top-20 flex-col bg-[#11151E]/95 border border-white/[0.08] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl min-h-[70vh] lg:min-h-0 max-h-[80vh] lg:max-h-[85vh]`}
          >
            <div className="px-4 sm:px-5 py-3.5 sm:py-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h2 className="font-display text-sm font-bold text-white">AiRA Live Curator</h2>
                  <p className="text-[11px] text-slate-400">Real-time web search & noise filter</p>
                </div>
              </div>
              <button
                onClick={handleResetToGreeting}
                className="text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Topic</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-4 sm:space-y-5">
              <div className="flex items-start gap-2.5 sm:gap-3">
                <AiraAssistantBadge />
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-3.5 sm:px-4 py-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {getGreetingPhrase()}! I’m <span className="text-cyan-300 font-semibold">AiRA</span>. Ask me about any live topic, and I’ll curate real-time blogs, photologs, vlogs, and live event updates from trusted sources while filtering out noise.
                </div>
              </div>

              {turns.map((turn) => {
                const isSelected = currentTurn && currentTurn.id === turn.id;
                return (
                  <div key={turn.id} className="space-y-3">
                    <div className="flex justify-end">
                      <div className="max-w-[88%] bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 text-amber-100 rounded-2xl rounded-tr-sm px-3.5 sm:px-4 py-2.5 text-xs sm:text-sm">
                        <p>{turn.userQuery}</p>
                        <span className="block text-[10px] text-amber-300/60 mt-1 text-right">
                          {turn.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 sm:gap-3">
                      <AiraAssistantBadge />
                      <div
                        onClick={() => {
                          setActiveTurnId(turn.id);
                          setMobileActivePane("feed");
                        }}
                        className={`flex-1 min-w-0 rounded-2xl rounded-tl-sm p-3.5 sm:p-4 border transition cursor-pointer ${
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
                            <span className="truncate">
                              Filtered {turn.feedData.stats.filteredNoiseCount} noisy items •{" "}
                              {turn.feedData.stats.sources?.length || 4} live sources
                            </span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 pt-2 border-t border-white/[0.07]">
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
                      Curating live articles, photologs, and vlogs across trusted sources...
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {currentTurn && currentTurn.feedData?.followUpPrompts && !isGenerating && (
              <div className="px-3.5 py-2.5 bg-white/[0.02] border-t border-white/[0.06] overflow-x-auto no-scrollbar">
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
                className="flex-1 min-w-0 bg-white/[0.05] border border-white/[0.08] focus:border-amber-400/50 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-2.5 rounded-xl border shrink-0 transition ${
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
                className="p-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-semibold transition cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </section>

          {/* RIGHT COLUMN: LIVE FILTERED SOCIAL FEED */}
          <section
            className={`${
              mobileActivePane === "feed" ? "block" : "hidden lg:block"
            } lg:col-span-8 space-y-4 sm:space-y-6 pb-8 lg:pb-16 min-w-0`}
          >
            {currentTurn ? (
              <>
                {/* MOBILE COMPACT CURATOR SUMMARY BANNER (Shown on mobile feed view) */}
                <div className="lg:hidden rounded-2xl bg-gradient-to-br from-[#151C2C] via-[#121620] to-[#11151E] border border-cyan-400/25 p-3.5 shadow-lg space-y-2.5">
                  <div className="flex items-start gap-2.5">
                    <AiraAssistantBadge />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider">
                          AiRA Live Synthesis
                        </span>
                        <button
                          onClick={() => setMobileActivePane("chat")}
                          className="text-[11px] text-amber-300 hover:text-amber-200 font-medium flex items-center gap-1"
                        >
                          <span>Full Chat</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed line-clamp-3">
                        {currentTurn.feedData.assistantSummary}
                      </p>
                    </div>
                  </div>

                  {currentTurn.feedData.followUpPrompts?.length > 0 && (
                    <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                      {currentTurn.feedData.followUpPrompts.map((prompt: string, i: number) => (
                        <button
                          key={i}
                          onClick={() => handleSendQuery(prompt)}
                          className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08] active:bg-amber-400/20"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* SUBTLE NEW UPDATES INDICATOR (Preserves scroll position) */}
                {hasNewLiveUpdateBanner && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 sm:px-4 py-2.5 rounded-2xl bg-cyan-500/15 border border-cyan-400/35 text-xs text-cyan-200">
                    <div className="flex items-center gap-2">
                      <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse shrink-0" />
                      <span>New live updates and score refreshes are available.</span>
                    </div>
                    <button
                      onClick={() => handleRefreshLiveTurn(undefined, true)}
                      className="px-3 py-1 rounded-xl bg-cyan-400 text-slate-950 font-semibold hover:bg-cyan-300 transition shrink-0"
                    >
                      Update In-Place
                    </button>
                  </div>
                )}

                {/* FEED HEADER & INTERACTIVE FILTER CONTROLS */}
                <div className="bg-[#121620]/95 border border-white/[0.08] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl space-y-3.5 sm:space-y-4">
                  <div className="flex items-start justify-between gap-3 border-b border-white/[0.07] pb-3.5 sm:pb-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 text-[11px] sm:text-xs text-emerald-400 font-medium mb-1">
                        <Globe className="w-3.5 h-3.5 shrink-0" />
                        <span>LIVE WEB STREAM</span>
                        {currentTurn.feedData.stats?.fetchedAt && (
                          <span className="text-slate-400">
                            • {currentTurn.feedData.stats.fetchedAt}
                          </span>
                        )}
                      </div>
                      <h1 className="font-display text-xl sm:text-3xl font-bold text-white tracking-tight leading-snug break-words">
                        {currentTurn.feedData.topicTitle}
                      </h1>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                      <button
                        onClick={() => handleRefreshLiveTurn()}
                        disabled={isGenerating}
                        className="h-9 w-9 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition"
                        title="Refresh live results"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin text-amber-400" : ""}`} />
                      </button>
                      <button
                        onClick={() => setShowFilterPanel((prev) => !prev)}
                        className={`h-9 px-3 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition ${
                          showFilterPanel
                            ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-200"
                            : "bg-white/[0.05] border-white/[0.08] text-slate-300"
                        }`}
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                        <span>Filters</span>
                      </button>
                    </div>
                  </div>

                  {/* MEDIA TYPE TABS & KEYWORD SEARCH */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-1 bg-[#0B0D11] p-1 rounded-2xl border border-white/[0.07] overflow-x-auto no-scrollbar w-full sm:w-auto">
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
                          className={`shrink-0 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                            activeMediaFilter === tab.id
                              ? "bg-amber-400 text-slate-950 shadow-sm font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              activeMediaFilter === tab.id
                                ? "bg-slate-950/20 text-slate-950 font-bold"
                                : "bg-white/[0.07] text-slate-400"
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* WITHIN-RESULTS KEYWORD FILTER */}
                    <div className="relative w-full sm:flex-1 sm:min-w-[190px] sm:max-w-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={keywordFilter}
                        onChange={(e) => setKeywordFilter(e.target.value)}
                        placeholder="Filter by keyword or #tag..."
                        className="w-full bg-[#0B0D11] border border-white/[0.08] focus:border-cyan-400/50 rounded-xl pl-8 pr-7 py-2 sm:py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
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
                    <div className="pt-3 border-t border-white/[0.06] space-y-3 md:space-y-0 md:grid md:grid-cols-12 md:gap-3 items-center text-xs">
                      {/* Source Filter Pills */}
                      <div className="md:col-span-7 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 md:flex-wrap">
                        <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1 shrink-0">
                          <Filter className="w-3 h-3 text-cyan-400" /> Source:
                        </span>
                        <button
                          onClick={() => setActiveSourceFilter("all")}
                          className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${
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
                            className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] transition ${
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
                      <div className="md:col-span-5 grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-end gap-2">
                        <select
                          value={activeTimeframe}
                          onChange={(e) =>
                            setActiveTimeframe(
                              e.target.value as "all" | "day" | "week" | "month" | "year"
                            )
                          }
                          className="w-full sm:w-auto bg-[#0B0D11] border border-white/[0.1] rounded-xl px-2.5 py-2 sm:py-1.5 text-[11px] text-slate-200 focus:outline-none"
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
                          className="w-full sm:w-auto bg-[#0B0D11] border border-white/[0.1] rounded-xl px-2.5 py-2 sm:py-1.5 text-[11px] text-slate-200 focus:outline-none"
                          title="Sort Order"
                        >
                          <option value="signal">Sort: Highest Signal</option>
                          <option value="latest">Sort: Most Recent</option>
                          <option value="popular">Sort: Most Popular</option>
                        </select>

                        <button
                          onClick={() => setStrictSignalOnly((prev) => !prev)}
                          className={`col-span-2 sm:col-span-1 justify-center px-2.5 py-2 sm:py-1.5 rounded-xl border text-[11px] flex items-center gap-1 transition ${
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

                  {/* LIVE MATCH SCORECARD & EVENT PROGRESS CARD */}
                  {currentTurn.feedData.matchScorecard && (
                    <div className="mt-2 rounded-2xl bg-gradient-to-r from-emerald-950/60 via-[#151C28] to-indigo-950/60 border border-emerald-500/25 p-3.5 sm:p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-medium text-slate-200 flex items-center gap-1.5 min-w-0">
                          <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="truncate">{currentTurn.feedData.matchScorecard.event}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-[10px] sm:text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${
                              currentTurn.feedData.matchScorecard.isLive
                                ? "bg-rose-500/20 text-rose-300 border-rose-400/40 animate-pulse"
                                : currentTurn.feedData.matchScorecard.isStale
                                ? "bg-amber-500/15 text-amber-300 border-amber-400/30"
                                : "bg-emerald-400/15 text-emerald-300 border-emerald-400/30"
                            }`}
                          >
                            {currentTurn.feedData.matchScorecard.status}
                          </span>
                          {currentTurn.feedData.matchScorecard.sourceUrl && (
                            <a
                              href={currentTurn.feedData.matchScorecard.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                            >
                              <span>{currentTurn.feedData.matchScorecard.sourceName || "Scoreboard"}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 py-3 border-y border-white/[0.08]">
                        <div className="flex items-center justify-between sm:justify-start gap-3 bg-white/[0.03] sm:bg-transparent px-3 py-2 sm:p-0 rounded-xl">
                          <div className="flex items-center gap-2.5">
                            <span className="text-2xl sm:text-3xl">{currentTurn.feedData.matchScorecard.team1.flag}</span>
                            <p className="text-xs sm:text-sm text-slate-300 font-semibold">
                              {currentTurn.feedData.matchScorecard.team1.name}
                            </p>
                          </div>
                          <p className="text-base sm:text-2xl font-display font-bold text-white">
                            {currentTurn.feedData.matchScorecard.team1.score}{" "}
                            <span className="text-[11px] sm:text-xs font-sans font-normal text-slate-400">
                              ({currentTurn.feedData.matchScorecard.team1.overs})
                            </span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-3 bg-white/[0.03] sm:bg-transparent px-3 py-2 sm:p-0 rounded-xl sm:text-right">
                          <div className="flex items-center gap-2.5 sm:order-2">
                            <span className="text-2xl sm:text-3xl sm:order-2">{currentTurn.feedData.matchScorecard.team2.flag}</span>
                            <p className="text-xs sm:text-sm text-slate-300 font-semibold sm:order-1">
                              {currentTurn.feedData.matchScorecard.team2.name}
                            </p>
                          </div>
                          <p className="text-base sm:text-2xl font-display font-bold text-slate-200 sm:order-1">
                            {currentTurn.feedData.matchScorecard.team2.score}{" "}
                            <span className="text-[11px] sm:text-xs font-sans font-normal text-slate-400">
                              ({currentTurn.feedData.matchScorecard.team2.overs})
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 text-xs text-slate-300">
                        <span className="leading-snug">
                          <strong className="text-amber-300">Key Highlight:</strong>{" "}
                          {currentTurn.feedData.matchScorecard.playerOfMatch}
                        </span>
                        <span className="text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{currentTurn.feedData.matchScorecard.upcoming}</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* DEVELOPING STORY STREAM (When multiple approved publishers cover an evolving topic) */}
                  {currentTurn.feedData.developingStories?.length > 0 && (
                    <div className="mt-2 rounded-2xl bg-white/[0.02] border border-white/[0.07] p-3.5 sm:p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
                          <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider truncate">
                            {currentTurn.feedData.developingStories[0].storyTitle}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {currentTurn.feedData.developingStories[0].publisherCount} distinct publishers
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                        {currentTurn.feedData.developingStories[0].timeline.slice(0, 3).map((upd: any) => (
                          <a
                            key={upd.id}
                            href={upd.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 rounded-xl bg-[#0E121B] hover:bg-[#151B28] border border-white/[0.06] hover:border-cyan-400/30 transition flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                                <span className="font-semibold text-cyan-300 truncate">{upd.sourceName}</span>
                                <span className="shrink-0 ml-2">{upd.publishedAt}</span>
                              </div>
                              <p className="text-xs text-slate-200 font-medium line-clamp-2 leading-snug">
                                {upd.headline}
                              </p>
                            </div>
                          </a>
                        ))}
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
                          setActiveTimeframe("all");
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
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 shrink-0">
                            <Camera className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="font-display text-base sm:text-lg font-bold text-white">
                              Live Photologs & Visual Moments
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              High-resolution editorial frames & official visual galleries
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
                        {filteredFeed.photologs.map((photo: any, index: number) => {
                          const isLiked = !!likedIds[photo.id];
                          return (
                            <div
                              key={photo.id}
                              className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#141822] border border-white/[0.08] hover:border-amber-400/40 transition-all duration-300 flex flex-col ${
                                index === 0 ? "md:col-span-2" : "md:col-span-1"
                              }`}
                            >
                              <div
                                onClick={() => setSelectedPhoto(photo)}
                                className="relative h-56 sm:h-72 w-full overflow-hidden cursor-pointer"
                              >
                                <img
                                  src={photo.imageUrl}
                                  alt={photo.caption}
                                  loading="lazy"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).src = FALLBACK_STAGE_IMAGE;
                                  }}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D11] via-black/20 to-transparent" />

                                <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] sm:text-[11px] text-slate-200 border border-white/10 max-w-[48%]">
                                  <MapPin className="w-3 h-3 text-amber-400 shrink-0" />
                                  <span className="truncate">{photo.location}</span>
                                </div>

                                <div className="absolute top-3 right-3 flex items-center gap-1.5 max-w-[48%]">
                                  {photo.signalScore && (
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/85 text-slate-950 font-bold text-[10px] shrink-0">
                                      {photo.signalScore}%
                                    </span>
                                  )}
                                  <span className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] text-slate-200 border border-white/10 truncate">
                                    {photo.sourceName || photo.cameraSpec}
                                  </span>
                                </div>
                              </div>

                              <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between bg-[#121620]">
                                <p
                                  onClick={() => setSelectedPhoto(photo)}
                                  className="text-sm font-medium text-slate-100 leading-snug mb-3 cursor-pointer hover:text-amber-200 transition line-clamp-2"
                                >
                                  {photo.caption}
                                </p>

                                <div className="flex items-center justify-between pt-2.5 border-t border-white/[0.06] text-xs text-slate-400">
                                  <span className="font-medium text-amber-300/90 truncate max-w-[55%]">
                                    {photo.photographer}
                                  </span>

                                  <div className="flex items-center gap-3 shrink-0">
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
                                    {photo.sourceUrl && (
                                      <a
                                        href={photo.sourceUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-cyan-300 transition"
                                        title="Open Original Photo Source"
                                      >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                      </a>
                                    )}
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
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25 shrink-0">
                            <BookOpen className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="font-display text-base sm:text-lg font-bold text-white">
                              Filtered Blogs, Discussions & Deep-Dive Articles
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              High-signal stories, official announcements & independent reviews
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
                              className="group rounded-2xl sm:rounded-3xl bg-[#121620]/95 hover:bg-[#161B28] border border-white/[0.08] hover:border-amber-400/35 p-4 sm:p-6 transition-all duration-200 shadow-lg shadow-black/20"
                            >
                              <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                                {article.coverImage && (
                                  <div
                                    onClick={() => setSelectedArticle(article)}
                                    className="sm:w-48 sm:h-36 h-44 w-full rounded-xl sm:rounded-2xl overflow-hidden shrink-0 cursor-pointer border border-white/[0.07]"
                                  >
                                    <img
                                      src={article.coverImage}
                                      alt={article.title}
                                      loading="lazy"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src = FALLBACK_STAGE_IMAGE;
                                      }}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                  </div>
                                )}

                                <div className="flex-1 min-w-0">
                                  {/* Row 1: Author + Timestamp on left, Signal Score on right */}
                                  <div className="flex items-center justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2 min-w-0">
                                      <img
                                        src={article.authorAvatar}
                                        alt={article.author}
                                        className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-white/15 shrink-0"
                                      />
                                      <span className="text-xs font-semibold text-slate-200 truncate">
                                        {article.author}
                                      </span>
                                      <span className="text-slate-600 shrink-0">•</span>
                                      <span className="text-[11px] sm:text-xs text-slate-400 shrink-0">
                                        {article.publishedAt}
                                      </span>
                                    </div>

                                    {article.signalScore && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                                        {article.signalScore}% Signal
                                      </span>
                                    )}
                                  </div>

                                  {/* Row 2: Source, Category, Claim Distinction & Read Time */}
                                  <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                                    {article.sourceName && (
                                      <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/20 font-medium">
                                        {article.sourceName}
                                      </span>
                                    )}
                                    <span className="text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-300 border border-amber-400/20 font-medium">
                                      {article.category}
                                    </span>
                                    {article.claimDistinction === "official_announcement" && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-400/15 text-purple-200 border border-purple-400/30">
                                        Official Announcement
                                      </span>
                                    )}
                                    {article.claimDistinction === "independent_review" && (
                                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-400/15 text-teal-200 border border-teal-400/30">
                                        Independent Review
                                      </span>
                                    )}
                                    <span className="text-[11px] text-slate-400 flex items-center gap-1 ml-auto sm:ml-1">
                                      <Clock className="w-3 h-3" />
                                      {article.readTime}
                                    </span>
                                  </div>

                                  <h3
                                    onClick={() => setSelectedArticle(article)}
                                    className="font-display text-base sm:text-xl font-bold text-white group-hover:text-amber-300 transition cursor-pointer mb-2 leading-snug"
                                  >
                                    {article.title}
                                  </h3>

                                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3.5 line-clamp-3">
                                    {article.snippet}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-white/[0.06]">
                                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 sm:pb-0 sm:flex-wrap">
                                  {article.tags?.map((tag: string, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() => setKeywordFilter(tag.replace(/^#/, ""))}
                                      className="shrink-0 text-[11px] text-slate-400 hover:text-amber-300 bg-white/[0.04] hover:bg-amber-400/10 px-2.5 py-0.5 rounded-md transition"
                                      title="Filter feed by this tag"
                                    >
                                      {tag}
                                    </button>
                                  ))}
                                </div>

                                <div className="flex items-center justify-between sm:justify-end gap-3 pt-1 sm:pt-0 border-t sm:border-t-0 border-white/[0.04]">
                                  <div className="flex items-center gap-3.5">
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

                                    <button
                                      onClick={() => handleShareItem(article.title, article.sourceUrl)}
                                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
                                      title="Share Story Link"
                                    >
                                      <Share2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-2.5">
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
                                      className="text-xs font-semibold text-amber-300 hover:text-amber-200 flex items-center gap-1 pl-2 border-l border-white/10 cursor-pointer"
                                    >
                                      <span>Reader</span>
                                      <ArrowUpRight className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
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
                    <div className="space-y-3.5 sm:space-y-4">
                      <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2.5">
                          <span className="p-2 rounded-xl bg-rose-500/15 text-rose-300 border border-rose-500/25 shrink-0">
                            <Video className="w-4 h-4" />
                          </span>
                          <div>
                            <h2 className="font-display text-base sm:text-lg font-bold text-white">
                              Live Related Vlogs & Video Streams
                            </h2>
                            <p className="text-[11px] sm:text-xs text-slate-400">
                              Broadcaster highlights, interviews, reviews & video explainers playable inside AiRA
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
                        {filteredFeed.vlogs.map((vlog: any) => (
                          <div
                            key={vlog.id}
                            onClick={() => setSelectedVlog(vlog)}
                            className="group rounded-2xl sm:rounded-3xl overflow-hidden bg-[#121620] border border-white/[0.08] hover:border-rose-400/40 transition cursor-pointer flex flex-col justify-between shadow-xl shadow-black/10"
                          >
                            <div className="relative h-44 sm:h-48 overflow-hidden">
                              <img
                                src={vlog.thumbnailUrl}
                                alt={vlog.title}
                                loading="lazy"
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src = FALLBACK_STAGE_IMAGE;
                                }}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/25 transition flex items-center justify-center">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
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

                            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                              <div>
                                <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                                  <span className="font-semibold text-rose-300 truncate max-w-[65%]">
                                    {vlog.creator}
                                  </span>
                                  <span className="shrink-0">{vlog.views}</span>
                                </div>
                                <h3 className="font-display text-base font-bold text-white group-hover:text-rose-200 transition mb-2.5 leading-snug">
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

                {/* RELATED TOPICS & PROGRESSIVE DISCOVERY BAR */}
                <div className="rounded-2xl sm:rounded-3xl bg-[#121620]/95 border border-white/[0.08] p-4 sm:p-6 space-y-3.5 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3">
                    <div className="flex items-center gap-2">
                      <Compass className="w-4 h-4 text-cyan-400 shrink-0" />
                      <h3 className="font-display text-sm font-bold text-white">
                        Explore Related Topics & Sub-Streams
                      </h3>
                    </div>
                    <button
                      onClick={handleLoadMoreItems}
                      className="w-full sm:w-auto justify-center px-3.5 py-2 sm:py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-amber-300 transition flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Load More Stories & Media</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(currentTurn.feedData.relatedTopics || []).map((topic: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleSendQuery(topic)}
                        className="px-3 py-2 rounded-xl bg-[#0B0D11] hover:bg-amber-400/15 border border-white/[0.08] hover:border-amber-400/40 text-xs text-slate-200 hover:text-amber-200 transition flex items-center gap-1.5"
                      >
                        <span>{topic}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="rounded-2xl sm:rounded-3xl bg-[#121620] border border-white/[0.08] p-6 sm:p-8 space-y-6 animate-pulse">
                <div className="h-7 bg-white/10 rounded w-1/2" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-56 bg-white/5 rounded-2xl" />
                  <div className="h-56 bg-white/5 rounded-2xl" />
                </div>
                <div className="h-32 bg-white/5 rounded-2xl" />
              </div>
            )}
          </section>

          {/* MOBILE FIXED BOTTOM ASK BAR (Shown on mobile when browsing Social Feed) */}
          {mobileActivePane === "feed" && (
            <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0B0D11]/95 backdrop-blur-xl border-t border-white/[0.1] px-3.5 py-2.5 pb-safe shadow-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendQuery();
                }}
                className="flex items-center gap-2 max-w-xl mx-auto"
              >
                <input
                  type="text"
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder="Ask AiRA any live topic or follow-up..."
                  className="flex-1 min-w-0 bg-[#141926] border border-white/[0.12] focus:border-amber-400/60 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleToggleVoice}
                  className={`p-2.5 rounded-xl border shrink-0 transition ${
                    isVoiceSimulated
                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                      : "bg-[#141926] border-white/[0.1] text-slate-300"
                  }`}
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
                <button
                  type="submit"
                  disabled={!inputQuery.trim() || isGenerating}
                  className="p-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 disabled:opacity-40 text-slate-950 font-semibold shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </main>
      )}

      {/* ARTICLE MODAL */}
      {selectedArticle && (
        <div
          onClick={() => setSelectedArticle(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90dvh] sm:max-h-[85vh] overflow-y-auto p-5 sm:p-8 pb-safe shadow-2xl space-y-4 sm:space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3.5 sm:pb-4">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={selectedArticle.authorAvatar}
                  alt={selectedArticle.author}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">
                    {selectedArticle.author}
                  </p>
                  <p className="text-xs text-slate-400">
                    {selectedArticle.publishedAt} • {selectedArticle.readTime}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 shrink-0"
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

            <h2 className="font-display text-xl sm:text-3xl font-bold text-white leading-tight">
              {selectedArticle.title}
            </h2>

            {selectedArticle.coverImage && (
              <div className="rounded-2xl overflow-hidden max-h-56 sm:max-h-64 bg-black">
                <img
                  src={selectedArticle.coverImage}
                  alt={selectedArticle.title}
                  className="w-full h-56 sm:h-64 object-cover"
                />
              </div>
            )}

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedArticle.fullContent}
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedArticle.tags?.map((t: string, i: number) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white/5 text-slate-300"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {selectedArticle.sourceUrl && (
                  <a
                    href={selectedArticle.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial justify-center px-4 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-xs flex items-center gap-1.5 transition"
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
                  className="flex-1 sm:flex-initial justify-center px-4 py-2.5 sm:py-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs flex items-center gap-1.5 hover:bg-amber-300 transition"
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#121620] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-3xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl pb-safe"
          >
            <div className="relative max-h-[55vh] sm:max-h-[65vh] bg-black flex items-center justify-center">
              <img
                src={selectedPhoto.imageUrl}
                alt={selectedPhoto.caption}
                className="max-h-[55vh] sm:max-h-[65vh] w-auto object-contain"
              />
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-amber-300 mb-1">
                  <span className="font-semibold">{selectedPhoto.photographer}</span>
                  <span>•</span>
                  <span>{selectedPhoto.location}</span>
                  <span>•</span>
                  <span className="text-slate-400">{selectedPhoto.cameraSpec}</span>
                </div>
                <p className="text-sm sm:text-base text-white font-medium">{selectedPhoto.caption}</p>
                {selectedPhoto.contextualText && (
                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">
                    {selectedPhoto.contextualText}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {selectedPhoto.sourceUrl && (
                  <a
                    href={selectedPhoto.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-cyan-300 flex items-center gap-1.5"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => toggleBookmark(selectedPhoto, "photolog")}
                  className="flex-1 sm:flex-initial justify-center px-4 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white flex items-center gap-1.5"
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
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-2xl w-full max-h-[90dvh] overflow-y-auto shadow-2xl pb-safe"
          >
            <div className="relative h-60 sm:h-96 bg-black">
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
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-2xl mb-3 animate-pulse">
                      <Volume2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <span className="text-[11px] sm:text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 mb-2">
                      Playing Video Stream Preview • {selectedVlog.duration}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-200 max-w-md italic">
                      {selectedVlog.highlightQuote}
                    </p>
                  </div>
                </>
              )}
              <button
                onClick={() => setSelectedVlog(null)}
                className="absolute top-3.5 right-3.5 p-2 rounded-full bg-black/70 text-white hover:bg-black z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs text-rose-300 font-medium mb-1">
                  {selectedVlog.creator} • {selectedVlog.views}
                </p>
                <h3 className="font-display text-base sm:text-lg font-bold text-white">{selectedVlog.title}</h3>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                {selectedVlog.sourceUrl && (
                  <a
                    href={selectedVlog.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-initial justify-center px-3.5 py-2.5 sm:py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-cyan-300 flex items-center gap-1.5"
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
                  className="flex-1 sm:flex-initial justify-center px-4 py-2.5 sm:py-2 rounded-xl bg-amber-400 text-slate-950 font-semibold text-xs"
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
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 sm:p-6 pb-safe shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-white text-base">
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
                  Higher values strictly filter out low-signal or loosely matching items.
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
                  placeholder="AIzaSy... (Optional — Live curation works without key)"
                  className="w-full bg-[#0B0D11] border border-white/15 rounded-xl px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
                <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                  AiRA curates live blogs, editorial photologs, video vlogs, and live scorecards automatically from trusted broadcasters, publishers, and official channels. Adding a Gemini key enables AI-written conversational summaries.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  setShowApiKeyModal(false);
                  triggerToast("Saved Live Filter & AI preferences");
                }}
                className="w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs"
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
            className="w-full max-w-md bg-[#11151E] border-l border-white/10 h-full p-5 sm:p-6 pb-safe flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-400" />
                  <h3 className="font-display font-bold text-white">Balaji’s Saved Vault</h3>
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
        <div className="fixed bottom-20 lg:bottom-5 right-4 sm:right-5 z-50 px-4 py-2.5 rounded-2xl bg-amber-400 text-slate-950 font-semibold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
