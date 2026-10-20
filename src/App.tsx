import React, { useState, useEffect, useRef, useId, useMemo } from "react";
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
  Clock,
  ArrowUpRight,
  User,
  RotateCcw,
  Check,
  Flame,
  Calendar,
  MapPin,
  Search,
  Layers,
  X,
  MessageSquare,
  PlusCircle,
  SlidersHorizontal,
  Globe,
  ShieldCheck,
  ShieldAlert,
  Filter,
  RefreshCw,
  ExternalLink,
  FileCheck2,
  AlertTriangle,
  Database,
  CheckCircle2,
  XCircle,
  Ban,
  Link2
} from "lucide-react";
import { globalSearchOrchestrator } from "./engine/searchOrchestrator";
import { globalSourceRegistry } from "./engine/sourceRegistry";
import {
  ContentCategory,
  RegistryAuditEntry,
  RejectedSourceLog,
  SourceApprovalStatus,
  SourceRegistryRecord,
  StandardizedSearchResult,
  StructuredSportsEvent,
  TrustedSearchEngineResponse
} from "./engine/types";

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

        {/* === LETTER 4: 'A' === */}
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

function formatDisplayTimestamp(isoString: string | null): string {
  if (!isoString) return "Timestamp unverified";
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "Timestamp unverified";
    return d.toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return "Timestamp unverified";
  }
}

function getVerificationBadgeMeta(item: StandardizedSearchResult): {
  label: string;
  className: string;
} {
  if (item.verification_status === "primary_official") {
    return {
      label: `Tier 1 Primary Official (${item.source_name})`,
      className: "bg-emerald-500/15 text-emerald-300 border-emerald-400/35"
    };
  }
  if (item.verification_status === "corroborated") {
    return {
      label: `Corroborated (${item.corroboration_count} Independent Approved Sources)`,
      className: "bg-cyan-500/15 text-cyan-300 border-cyan-400/35"
    };
  }
  if (item.is_syndicated_wire) {
    return {
      label: `Syndicated Wire Report (${item.wire_agency || item.source_name})`,
      className: "bg-purple-500/15 text-purple-300 border-purple-400/35"
    };
  }
  return {
    label: `Single-Source Report (Approved Tier ${item.source_tier})`,
    className: "bg-amber-500/15 text-amber-300 border-amber-400/35"
  };
}

function getFreshnessBadgeMeta(status: StandardizedSearchResult["freshness_status"]): {
  label: string;
  className: string;
} {
  switch (status) {
    case "live":
      return {
        label: "Freshness: Live Window",
        className: "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
      };
    case "fresh":
      return {
        label: "Freshness: Verified Fresh",
        className: "bg-teal-500/15 text-teal-300 border-teal-400/30"
      };
    case "recent":
      return {
        label: "Freshness: Within Policy",
        className: "bg-sky-500/15 text-sky-300 border-sky-400/30"
      };
    case "historical_valid":
      return {
        label: "Archival / Historical Record",
        className: "bg-indigo-500/15 text-indigo-300 border-indigo-400/30"
      };
    case "stale":
      return {
        label: "Stale (Exceeded Policy)",
        className: "bg-rose-500/20 text-rose-300 border-rose-400/40"
      };
    default:
      return {
        label: "Freshness: Timestamp Unverified",
        className: "bg-slate-500/20 text-slate-300 border-slate-400/30"
      };
  }
}

interface ConversationTurn {
  id: string;
  userQuery: string;
  timestamp: string;
  engineResponse: TrustedSearchEngineResponse;
}

export default function App() {
  const [viewMode, setViewMode] = useState<"greeting" | "conversation">("greeting");
  const [inputQuery, setInputQuery] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isVoiceSimulated, setIsVoiceSimulated] = useState(false);

  // Interactive Filter Controls
  const [activeDataTypeFilter, setActiveDataTypeFilter] = useState<
    "all" | "article" | "primary" | "scores"
  >("all");
  const [activeTierFilter, setActiveTierFilter] = useState<"all" | 1 | 2>("all");
  const [activeSourceFilter, setActiveSourceFilter] = useState<string>("all");
  const [keywordFilter, setKeywordFilter] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(true);

  // Conversation State
  const [turns, setTurns] = useState<ConversationTurn[]>([]);
  const [activeTurnId, setActiveTurnId] = useState<string | null>(null);

  // User Interactions (Bookmarks, Modals, Admin Console)
  const [likedIds, setLikedIds] = useState<Record<string, boolean>>({});
  const [bookmarkedItems, setBookmarkedItems] = useState<StandardizedSearchResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<StandardizedSearchResult | null>(null);
  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [showRegistryModal, setShowRegistryModal] = useState(false);
  const [registryTab, setRegistryTab] = useState<"sources" | "rejected" | "audit">("sources");
  const [registryFilterCategory, setRegistryFilterCategory] = useState<string>("all");
  const [registrySources, setRegistrySources] = useState<SourceRegistryRecord[]>(() =>
    globalSourceRegistry.getAllSources()
  );
  const [rejectedLogs, setRejectedLogs] = useState<RejectedSourceLog[]>(() =>
    globalSourceRegistry.getRejectedLogs(50)
  );
  const [auditTrail, setAuditTrail] = useState<RegistryAuditEntry[]>(() =>
    globalSourceRegistry.getAuditTrail(50)
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Source Form State in Admin Modal
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceDomain, setNewSourceDomain] = useState("");
  const [newSourceCategory, setNewSourceCategory] = useState<ContentCategory>("news");

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const syncRegistryState = async () => {
    try {
      const resp = await fetch("/api/source-registry");
      if (resp.ok) {
        const data = await resp.json();
        if (Array.isArray(data.sources)) setRegistrySources(data.sources);
        if (Array.isArray(data.rejectedLogs)) setRejectedLogs(data.rejectedLogs);
        if (Array.isArray(data.auditTrail)) setAuditTrail(data.auditTrail);
        return;
      }
    } catch {
      // Fallback to in-process singleton if static hosting
    }
    setRegistrySources([...globalSourceRegistry.getAllSources()]);
    setRejectedLogs([...globalSourceRegistry.getRejectedLogs(50)]);
    setAuditTrail([...globalSourceRegistry.getAuditTrail(50)]);
  };

  const getGreetingPhrase = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Balaji";
    if (hour < 17) return "Good afternoon, Balaji";
    return "Good evening, Balaji";
  };

  const greetingChips = [
    {
      label: "Cricket & live sports scores from ICC, BCCI, ESPN & BBC Sport",
      tag: "Tier-1 Governing Bodies & Approved Broadcasters",
      icon: Flame
    },
    {
      label: "OpenAI, NVIDIA & Apple official engineering releases and tech news",
      tag: "Primary Vendor Docs, GitHub Releases & Ars Technica",
      icon: FileCheck2
    },
    {
      label: "Breaking global markets, ISRO science & Japan official travel bulletins",
      tag: "Reuters, BBC News, The Hindu, NASA & JNTO",
      icon: Globe
    }
  ];

  const executeTrustedQuery = async (
    queryText: string,
    bypassCache = false
  ): Promise<TrustedSearchEngineResponse> => {
    try {
      const resp = await fetch("/api/trusted-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: queryText, bypassCache })
      });
      if (resp.ok) {
        const data = (await resp.json()) as TrustedSearchEngineResponse;
        await syncRegistryState();
        return data;
      }
    } catch {
      // Fallback to direct engine execution if serverless endpoint is offline
    }
    const directResult = await globalSearchOrchestrator.executeSearch({
      query: queryText,
      bypassCache
    });
    await syncRegistryState();
    return directResult;
  };

  const handleSendQuery = async (customPrompt: string | null = null, bypassCache = false) => {
    const queryText = (customPrompt !== null ? customPrompt : inputQuery).trim();
    if (!queryText || isGenerating) return;

    setInputQuery("");
    setIsVoiceSimulated(false);
    setViewMode("conversation");
    setIsGenerating(true);

    const turnId = `turn-${Date.now()}`;

    try {
      const engineResponse = await executeTrustedQuery(queryText, bypassCache);

      const newTurn: ConversationTurn = {
        id: turnId,
        userQuery: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        engineResponse
      };

      setTurns((prev) => [...prev, newTurn]);
      setActiveTurnId(turnId);
      setActiveDataTypeFilter("all");
      setActiveSourceFilter("all");
      setKeywordFilter("");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRefreshTurn = async () => {
    if (!currentTurn || isGenerating) return;
    setIsGenerating(true);
    try {
      const refreshed = await executeTrustedQuery(currentTurn.userQuery, true);
      setTurns((prev) =>
        prev.map((t) =>
          t.id === currentTurn.id ? { ...t, engineResponse: refreshed } : t
        )
      );
      triggerToast("Re-verified live sources and refreshed timestamps");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAdminStatusChange = async (
    sourceId: string,
    newStatus: SourceApprovalStatus
  ) => {
    // Update both server endpoint and client singleton so state is consistent everywhere
    const localOut = globalSourceRegistry.updateSourceStatus(
      sourceId,
      newStatus,
      undefined,
      "admin_console"
    );
    globalSearchOrchestrator.invalidateCache();

    try {
      await fetch("/api/source-registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "updateStatus", sourceId, status: newStatus })
      });
    } catch {
      // Ignore network error if static
    }

    await syncRegistryState();
    if (!localOut.success) {
      triggerToast(localOut.error || "Cannot approve prohibited domain");
    } else {
      triggerToast(`Updated source ${sourceId} to "${newStatus.toUpperCase()}"`);
    }
  };

  const handleAdminAddSource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSourceName.trim() || !newSourceDomain.trim()) return;

    const newRec = {
      id: `src-custom-${Date.now()}`,
      publisherName: newSourceName.trim(),
      canonicalDomain: newSourceDomain.trim().toLowerCase(),
      approvedSubdomains: ["www"],
      category: newSourceCategory,
      sourceType: "news_publisher" as const,
      approvalStatus: "pending_review" as const,
      geographicCoverage: ["Global"],
      supportedLanguages: ["en"],
      permittedIngestionMethods: ["approved_discovery" as const],
      commercialLicensingNotes: "Added via Admin Console; pending editorial & technical validation.",
      trustTier: 3 as const,
      maxContentAgeMs: 24 * 3600 * 1000,
      maxCacheDurationMs: 5 * 60 * 1000,
      integrationHealth: "healthy" as const,
      adminNotes: "Submitted by administrator for domain verification."
    };

    const localOut = globalSourceRegistry.addSource(newRec, "admin_console");
    try {
      await fetch("/api/source-registry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "addSource", newSource: newRec })
      });
    } catch {
      // Ignore if static
    }

    await syncRegistryState();
    if (!localOut.success) {
      triggerToast(localOut.error || "Invalid domain");
    } else {
      setNewSourceName("");
      setNewSourceDomain("");
      triggerToast(`Added "${newRec.publisherName}" (${newRec.canonicalDomain}) as Pending Review`);
    }
  };

  const handleToggleVoice = () => {
    if (isVoiceSimulated) {
      setIsVoiceSimulated(false);
      return;
    }
    setIsVoiceSimulated(true);
    setInputQuery("");
    const sampleVoicePhrase = "Cricket & live sports scores from ICC, BCCI, ESPN & BBC Sport";
    let idx = 0;
    const interval = setInterval(() => {
      idx += 1;
      setInputQuery(sampleVoicePhrase.slice(0, idx));
      if (idx >= sampleVoicePhrase.length) {
        clearInterval(interval);
        setIsVoiceSimulated(false);
      }
    }, 30);
  };

  const toggleLike = (id: string) => {
    setLikedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleBookmark = (item: StandardizedSearchResult) => {
    setBookmarkedItems((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      if (exists) {
        triggerToast("Removed from your Verified Reading Vault");
        return prev.filter((b) => b.id !== item.id);
      } else {
        triggerToast(`Saved "${item.title.slice(0, 32)}..." to Vault`);
        return [...prev, item];
      }
    });
  };

  const isBookmarked = (id: string) => bookmarkedItems.some((b) => b.id === id);
  const currentTurn =
    turns.find((t) => t.id === activeTurnId) || turns[turns.length - 1] || null;

  const filteredView = useMemo(() => {
    if (!currentTurn?.engineResponse) {
      return {
        results: [] as StandardizedSearchResult[],
        liveScores: [] as StructuredSportsEvent[],
        availableSources: [] as string[]
      };
    }

    const rawResults = currentTurn.engineResponse.results || [];
    const rawScores = currentTurn.engineResponse.liveScoreEvents || [];

    const availableSources = Array.from(
      new Set(rawResults.map((r) => r.source_name))
    ).filter(Boolean);

    const kw = keywordFilter.trim().toLowerCase();

    const filteredResults = rawResults.filter((r) => {
      if (activeDataTypeFilter === "scores") return false;
      if (
        activeDataTypeFilter === "primary" &&
        r.verification_status !== "primary_official" &&
        r.source_tier !== 1
      ) {
        return false;
      }
      if (activeTierFilter !== "all" && r.source_tier !== activeTierFilter) {
        return false;
      }
      if (activeSourceFilter !== "all" && r.source_name !== activeSourceFilter) {
        return false;
      }
      if (kw) {
        const hay = `${r.title} ${r.summary} ${r.source_name} ${r.source_domain} ${(
          r.tags || []
        ).join(" ")}`.toLowerCase();
        if (!hay.includes(kw)) return false;
      }
      return true;
    });

    const filteredScores =
      activeDataTypeFilter === "all" || activeDataTypeFilter === "scores"
        ? rawScores
        : [];

    return {
      results: filteredResults,
      liveScores: filteredScores,
      availableSources
    };
  }, [
    currentTurn,
    activeDataTypeFilter,
    activeTierFilter,
    activeSourceFilter,
    keywordFilter
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

      {/* TOP NAVIGATION BAR */}
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
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  Source-Controlled Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Allowlisted Primary Sources • Verified Citations • Zero Social/Wiki Noise
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
            onClick={() => {
              syncRegistryState();
              setShowRegistryModal(true);
            }}
            className="px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 text-cyan-200 flex items-center gap-1.5 text-xs font-medium transition"
            title="Manage Approved Source Registry, Freshness Policies & Rejected Logs"
          >
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden md:inline">
              Source Registry ({registrySources.filter((s) => s.approvalStatus === "approved").length} Approved)
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

      {/* GREETING SCREEN */}
      {viewMode === "greeting" && (
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-12 max-w-4xl mx-auto w-full">
          <div className="mb-6 relative flex flex-col items-center">
            <div className="absolute -inset-8 bg-gradient-to-r from-cyan-500/20 via-teal-400/15 to-purple-500/20 rounded-full blur-2xl pointer-events-none" />
            <AiraNeonLogo className="h-16 sm:h-20 w-auto relative z-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-emerald-400/30 text-xs text-slate-200 mb-6 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              <strong className="text-emerald-300 font-semibold">Strict Allowlist Active:</strong> Official Governing Bodies, Reputable News & Primary Vendor Docs Only.
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-center bg-gradient-to-r from-white via-cyan-100 to-purple-200/90 bg-clip-text text-transparent mb-4">
            {getGreetingPhrase()}.
          </h1>

          <p className="text-slate-400 text-center text-base sm:text-lg max-w-2xl mb-10 leading-relaxed">
            Every result is verified against AiRA’s approved source registry with explicit publication timestamps, freshness checks, and traceable citations. Wikipedia and social media platforms (X, Instagram, Facebook, Threads, Reddit) are strictly blocked from factual search.
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
                  placeholder='Search verified sources: "India cricket", "OpenAI releases", "Formula 1", "Reuters markets"...'
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
                  <span>Verify & Search</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {isVoiceSimulated && (
                <div className="px-3 pb-1.5 pt-1 flex items-center gap-2 text-xs text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>Listening & transcribing your query...</span>
                </div>
              )}
            </form>
          </div>

          <div className="w-full max-w-3xl">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs uppercase tracking-wider text-slate-500 font-medium">
                Verified Category Streams
              </span>
              <span className="text-xs text-emerald-400/90 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 8-Stage Verification Pipeline
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

      {/* CONVERSATION & VERIFIED FEED VIEW */}
      {viewMode === "conversation" && (
        <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: EVIDENCE-GROUNDED CONVERSATION THREAD */}
          <section className="lg:col-span-4 lg:sticky lg:top-20 flex flex-col bg-[#11151E]/90 border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl max-h-[85vh]">
            <div className="px-5 py-4 border-b border-white/[0.07] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h2 className="text-sm font-semibold text-white">AiRA Evidence Verifier</h2>
                  <p className="text-[11px] text-slate-400">Strict allowlist & citation grounding</p>
                </div>
              </div>
              <button
                onClick={handleResetToGreeting}
                className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Query</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              <div className="flex items-start gap-3">
                <AiraAssistantBadge />
                <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl rounded-tl-sm px-4 py-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {getGreetingPhrase()}! I retrieve and verify records exclusively from approved broadcasters, news organizations, and primary technical sources. Every factual statement below is linked to its source citation.
                </div>
              </div>

              {turns.map((turn) => {
                const isSelected = currentTurn && currentTurn.id === turn.id;
                const resp = turn.engineResponse;
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
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-semibold">
                            Category: {resp.detectedCategory}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {resp.diagnostics.candidatesVerified} verified •{" "}
                            {resp.diagnostics.candidatesRejected} rejected
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-3">
                          {resp.groundedSynthesis.synthesizedSummary}
                        </p>

                        {resp.groundedSynthesis.uncertaintyNotice && (
                          <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-[11px] text-amber-200 flex items-start gap-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{resp.groundedSynthesis.uncertaintyNotice}</span>
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/[0.07]">
                          <span className="text-[11px] px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-300 font-medium flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" />
                            {resp.results.length} Verified Records
                          </span>
                          {resp.liveScoreEvents.length > 0 && (
                            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-amber-400/10 text-amber-300 font-medium flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {resp.liveScoreEvents.length} Scoreboard Events
                            </span>
                          )}
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
                      Running 8-stage source allowlist, freshness & citation verification pipeline...
                    </p>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

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
                placeholder="Query approved sources..."
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

          {/* RIGHT COLUMN: VERIFIED CITATION-BACKED RESULTS & STRUCTURED LIVE SCORES */}
          <section className="lg:col-span-8 space-y-6 pb-16">
            {currentTurn ? (
              <>
                {/* PIPELINE STATUS & FILTER HEADER */}
                <div className="bg-[#121620]/90 border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.07] pb-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-emerald-400 font-medium mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        <span>ALLOWLIST VERIFIED • WIKIPEDIA & SOCIAL MEDIA BLOCKED</span>
                        <span className="text-slate-500">
                          • Retrieved{" "}
                          {formatDisplayTimestamp(currentTurn.engineResponse.executedAt)}
                        </span>
                        {currentTurn.engineResponse.fromCache && (
                          <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-400/30 text-[10px]">
                            Cache: {currentTurn.engineResponse.cacheStatus}
                          </span>
                        )}
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                        {currentTurn.engineResponse.groundedSynthesis.headline}
                      </h1>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <button
                        onClick={handleRefreshTurn}
                        disabled={isGenerating}
                        className="px-3 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-slate-200 text-xs flex items-center gap-1.5 transition"
                        title="Bypass cache and re-verify live feeds"
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${
                            isGenerating ? "animate-spin text-amber-400" : ""
                          }`}
                        />
                        <span>Re-verify Live</span>
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

                  {/* EVIDENCE-GROUNDED CLAIMS & CITATION TRACEABILITY BOX */}
                  {currentTurn.engineResponse.groundedSynthesis.factualClaims.length > 0 && (
                    <div className="rounded-2xl bg-[#0D111A] border border-cyan-500/20 p-4 space-y-2.5">
                      <div className="flex items-center justify-between text-xs text-cyan-300 font-semibold">
                        <span className="flex items-center gap-1.5">
                          <FileCheck2 className="w-3.5 h-3.5" />
                          Evidence-Grounded Claims & Supporting Citations
                        </span>
                        <span className="text-[11px] text-slate-400 font-normal">
                          Zero unverified assumptions
                        </span>
                      </div>
                      <ul className="space-y-2 text-xs text-slate-300">
                        {currentTurn.engineResponse.groundedSynthesis.factualClaims.map(
                          (claim, idx) => (
                            <li
                              key={idx}
                              className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                            >
                              <span className="leading-relaxed">{claim.claimText}</span>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-400/30 font-mono">
                                  Ref: {claim.citationIds.join(", ")}
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                                  {Math.round(claim.confidence * 100)}% Conf
                                </span>
                              </div>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {/* FILTER BAR */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-1.5 bg-[#0B0D11] p-1.5 rounded-2xl border border-white/[0.07]">
                      {[
                        {
                          id: "all",
                          label: "All Verified",
                          count:
                            filteredView.results.length + filteredView.liveScores.length
                        },
                        {
                          id: "primary",
                          label: "Tier-1 Official / Primary",
                          count: currentTurn.engineResponse.results.filter(
                            (r) => r.source_tier === 1
                          ).length
                        },
                        {
                          id: "article",
                          label: "Editorial & Reports",
                          count: filteredView.results.length
                        },
                        {
                          id: "scores",
                          label: "Structured Scoreboards",
                          count: currentTurn.engineResponse.liveScoreEvents.length
                        }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveDataTypeFilter(tab.id as any)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center gap-1.5 ${
                            activeDataTypeFilter === tab.id
                              ? "bg-amber-400 text-slate-950 shadow-sm font-semibold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <span>{tab.label}</span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                              activeDataTypeFilter === tab.id
                                ? "bg-slate-950/20 text-slate-950"
                                : "bg-white/[0.07] text-slate-400"
                            }`}
                          >
                            {tab.count}
                          </span>
                        </button>
                      ))}
                    </div>

                    <div className="relative flex-1 min-w-[200px] max-w-xs">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={keywordFilter}
                        onChange={(e) => setKeywordFilter(e.target.value)}
                        placeholder="Filter verified results..."
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

                  {showFilterPanel && (
                    <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] text-slate-400 mr-1 flex items-center gap-1">
                          <Filter className="w-3 h-3 text-cyan-400" /> Approved Publisher:
                        </span>
                        <button
                          onClick={() => setActiveSourceFilter("all")}
                          className={`px-2.5 py-1 rounded-lg text-[11px] transition ${
                            activeSourceFilter === "all"
                              ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/40 font-medium"
                              : "bg-white/[0.04] text-slate-400 hover:text-slate-200"
                          }`}
                        >
                          All Approved ({filteredView.availableSources.length})
                        </button>
                        {filteredView.availableSources.map((src) => (
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

                      <div className="flex items-center gap-2">
                        <select
                          value={String(activeTierFilter)}
                          onChange={(e) =>
                            setActiveTierFilter(
                              e.target.value === "all"
                                ? "all"
                                : (Number(e.target.value) as 1 | 2)
                            )
                          }
                          className="bg-[#0B0D11] border border-white/[0.1] rounded-xl px-2.5 py-1.5 text-[11px] text-slate-200 focus:outline-none"
                        >
                          <option value="all">All Trust Tiers (Tier 1–3)</option>
                          <option value="1">Tier 1 Only (Primary / Governing)</option>
                          <option value="2">Tier 2 Only (Editorial Publishers)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* STRUCTURED SPORTS SCOREBOARDS (SECTION 3B & 12) */}
                {filteredView.liveScores.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                          <Flame className="w-4 h-4" />
                        </span>
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            Official Structured Sports Scoreboards
                          </h2>
                          <p className="text-xs text-slate-400">
                            Dedicated sports-data schema with explicit match state, timezone & provider timestamps
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredView.liveScores.map((ev) => (
                        <div
                          key={ev.id}
                          className="rounded-3xl bg-gradient-to-br from-emerald-950/50 via-[#131824] to-indigo-950/40 border border-emerald-500/25 p-5 shadow-lg space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-emerald-300">
                              {ev.competition}
                            </span>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                                ev.isLive
                                  ? "bg-rose-500/20 text-rose-300 border-rose-400/40 animate-pulse"
                                  : ev.isStale
                                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                                  : "bg-slate-500/20 text-slate-300 border-slate-400/30"
                              }`}
                            >
                              {ev.isLive
                                ? `LIVE • ${ev.statusDetail}`
                                : ev.isStale
                                ? `STALE • ${ev.statusDetail}`
                                : `${ev.eventStatus.toUpperCase()} • ${ev.statusDetail}`}
                            </span>
                          </div>

                          <div className="space-y-2 py-2 border-y border-white/[0.08]">
                            {ev.participants.map((part, pIdx) => (
                              <div
                                key={pIdx}
                                className="flex items-center justify-between text-sm"
                              >
                                <div className="flex items-center gap-2.5">
                                  {part.logoUrl && (
                                    <img
                                      src={part.logoUrl}
                                      alt={part.name}
                                      className="w-5 h-5 object-contain"
                                    />
                                  )}
                                  <span
                                    className={`font-medium ${
                                      part.isWinner ? "text-white font-bold" : "text-slate-200"
                                    }`}
                                  >
                                    {part.name}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-lg font-bold text-white">
                                    {part.score}
                                  </span>
                                  {part.detail && (
                                    <span className="text-[11px] text-slate-400 ml-1.5">
                                      ({part.detail})
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                            <span>
                              Provider:{" "}
                              <strong className="text-slate-200">{ev.providerName}</strong>
                            </span>
                            <span>
                              Verified: {formatDisplayTimestamp(ev.verifiedAt)} (
                              {ev.localTimeZone || "Local TZ"})
                            </span>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[11px] text-slate-400 truncate max-w-[220px]">
                              {ev.venue || "Official Competition Venue"}
                            </span>
                            <a
                              href={ev.canonicalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-cyan-300 hover:text-cyan-200 flex items-center gap-1 font-medium"
                            >
                              <span>Official Scoreboard</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TRANSPARENT NO-VERIFIED-RESULTS STATE (CORE PRINCIPLE #10) */}
                {filteredView.results.length === 0 &&
                  filteredView.liveScores.length === 0 && (
                    <div className="rounded-3xl bg-[#121620]/95 border border-amber-500/30 p-8 text-center space-y-4">
                      <ShieldAlert className="w-10 h-10 text-amber-400 mx-auto" />
                      <h3 className="text-lg font-semibold text-white">
                        No Verified Results Available from Approved Sources
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                        {currentTurn.engineResponse.groundedSynthesis.uncertaintyNotice ||
                          "Per AiRA's strict data-sourcing policy, unapproved websites, Wikipedia, and social media platforms (X, Facebook, Instagram, Threads, Reddit) are blocked. Rather than filling the gap with unverified or stale information, we report this limitation transparently."}
                      </p>
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          onClick={() => {
                            setActiveDataTypeFilter("all");
                            setActiveTierFilter("all");
                            setActiveSourceFilter("all");
                            setKeywordFilter("");
                          }}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-medium text-white"
                        >
                          Reset View Filters
                        </button>
                        <button
                          onClick={() => setShowRegistryModal(true)}
                          className="px-4 py-2 rounded-xl bg-cyan-400 text-slate-950 font-semibold text-xs"
                        >
                          Inspect Source Registry & Rejections
                        </button>
                      </div>
                    </div>
                  )}

                {/* VERIFIED FACTUAL RESULTS LIST (SECTION 12) */}
                {filteredView.results.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className="p-2 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/25">
                          <BookOpen className="w-4 h-4" />
                        </span>
                        <div>
                          <h2 className="text-lg font-semibold text-white">
                            Verified Source-Attributed Results ({filteredView.results.length})
                          </h2>
                          <p className="text-xs text-slate-400">
                            Ranked by Primary Authority (Tier 1 → Tier 2), Corroboration, and Verified Recency
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {filteredView.results.map((item) => {
                        const isLiked = !!likedIds[item.id];
                        const verBadge = getVerificationBadgeMeta(item);
                        const freshBadge = getFreshnessBadgeMeta(item.freshness_status);

                        return (
                          <article
                            key={item.id}
                            className="group rounded-3xl bg-[#121620]/90 hover:bg-[#161B28] border border-white/[0.08] hover:border-cyan-400/35 p-5 sm:p-6 transition-all duration-200 shadow-lg shadow-black/20"
                          >
                            {/* Top Attribution & Verification Badges */}
                            <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-bold text-white bg-white/[0.07] px-2.5 py-1 rounded-lg border border-white/10">
                                  {item.source_name}
                                </span>
                                <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/25">
                                  {item.source_domain}
                                </span>
                                <span
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${verBadge.className}`}
                                >
                                  {verBadge.label}
                                </span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`text-[11px] px-2.5 py-0.5 rounded-full border ${freshBadge.className}`}
                                >
                                  {freshBadge.label}
                                </span>
                                <span className="text-[11px] px-2 py-0.5 rounded bg-white/[0.05] text-slate-300 font-mono">
                                  Confidence: {Math.round(item.confidence * 100)}%
                                </span>
                              </div>
                            </div>

                            {/* Headline & Summary */}
                            <h3
                              onClick={() => setSelectedResult(item)}
                              className="text-lg sm:text-xl font-semibold text-white group-hover:text-amber-300 transition cursor-pointer mb-2"
                            >
                              {item.title}
                            </h3>

                            <p className="text-sm text-slate-300 leading-relaxed mb-4">
                              {item.summary}
                            </p>

                            {/* Timestamps Row (Published, Updated, Verified) */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 rounded-2xl bg-[#0B0D11]/90 border border-white/[0.05] text-[11px] text-slate-400 mb-4">
                              <div>
                                <span className="text-slate-500 block">Published (Source):</span>
                                <span className="text-slate-200 font-medium">
                                  {formatDisplayTimestamp(item.published_at)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Last Updated (Source):</span>
                                <span className="text-slate-200 font-medium">
                                  {formatDisplayTimestamp(item.updated_at || item.published_at)}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-500 block">Verified by AiRA (UTC→Local):</span>
                                <span className="text-emerald-300 font-medium">
                                  {formatDisplayTimestamp(item.verified_at)}
                                </span>
                              </div>
                            </div>

                            {/* Citations & Actions Footer */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/[0.06]">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {item.citations.map((cit) => (
                                  <a
                                    key={cit.citationId}
                                    href={cit.canonicalUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[11px] px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-400/25 flex items-center gap-1 transition"
                                    title={`Citation ${cit.citationId}: ${cit.title}`}
                                  >
                                    <Link2 className="w-3 h-3" />
                                    <span>
                                      [{cit.citationId}] {cit.sourceName} (Tier {cit.sourceTier})
                                    </span>
                                  </a>
                                ))}
                              </div>

                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleLike(item.id)}
                                  className={`text-xs flex items-center gap-1 transition ${
                                    isLiked
                                      ? "text-rose-400 font-semibold"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  <Heart
                                    className={`w-3.5 h-3.5 ${isLiked ? "fill-rose-400" : ""}`}
                                  />
                                  <span>{isLiked ? "Liked" : "Like"}</span>
                                </button>

                                <button
                                  onClick={() => toggleBookmark(item)}
                                  className={`text-xs flex items-center gap-1 transition ${
                                    isBookmarked(item.id)
                                      ? "text-amber-400 font-semibold"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  <Bookmark
                                    className={`w-3.5 h-3.5 ${
                                      isBookmarked(item.id) ? "fill-amber-400" : ""
                                    }`}
                                  />
                                  <span>{isBookmarked(item.id) ? "Saved" : "Save"}</span>
                                </button>

                                <a
                                  href={item.canonical_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium text-cyan-300 hover:text-cyan-200 flex items-center gap-1 pl-2 border-l border-white/10"
                                >
                                  <span>Original Source</span>
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>

                                <button
                                  onClick={() => setSelectedResult(item)}
                                  className="text-xs font-medium text-amber-300 hover:text-amber-200 flex items-center gap-1 pl-2 border-l border-white/10 cursor-pointer"
                                >
                                  <span>Inspect Evidence</span>
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
              </>
            ) : null}
          </section>
        </main>
      )}

      {/* EVIDENCE & CITATION INSPECTOR MODAL */}
      {selectedResult && (
        <div
          onClick={() => setSelectedResult(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#131824] border border-white/15 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-bold text-white">
                  {selectedResult.source_name} ({selectedResult.source_domain})
                </p>
                <p className="text-xs text-slate-400">
                  Trust Tier {selectedResult.source_tier} • Type: {selectedResult.source_type} • Provider:{" "}
                  {selectedResult.provider}
                </p>
              </div>
              <button
                onClick={() => setSelectedResult(null)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  getVerificationBadgeMeta(selectedResult).className
                }`}
              >
                {getVerificationBadgeMeta(selectedResult).label}
              </span>
              <span
                className={`text-xs px-3 py-1 rounded-full border ${
                  getFreshnessBadgeMeta(selectedResult.freshness_status).className
                }`}
              >
                {getFreshnessBadgeMeta(selectedResult.freshness_status).label}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-white leading-tight">
              {selectedResult.title}
            </h2>

            <p className="text-base text-slate-200 leading-relaxed whitespace-pre-line">
              {selectedResult.summary}
            </p>

            <div className="rounded-2xl bg-[#0B0D11] border border-white/10 p-4 space-y-2 text-xs">
              <p className="font-semibold text-cyan-300">
                Standardized Provenance & Citation Metadata
              </p>
              <p className="text-slate-300">
                <strong>Canonical URL:</strong>{" "}
                <a
                  href={selectedResult.canonical_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-300 underline break-all"
                >
                  {selectedResult.canonical_url}
                </a>
              </p>
              <p className="text-slate-300">
                <strong>Published At:</strong> {formatDisplayTimestamp(selectedResult.published_at)}
              </p>
              <p className="text-slate-300">
                <strong>Updated At:</strong> {formatDisplayTimestamp(selectedResult.updated_at)}
              </p>
              <p className="text-slate-300">
                <strong>Retrieved & Verified At:</strong>{" "}
                {formatDisplayTimestamp(selectedResult.verified_at)}
              </p>
              <p className="text-slate-300">
                <strong>Cache Expires At:</strong>{" "}
                {formatDisplayTimestamp(selectedResult.expires_at)}
              </p>
              <p className="text-slate-300">
                <strong>Independent Corroboration:</strong>{" "}
                {selectedResult.corroborated_by.join(", ")}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Metadata & summary excerpt only; full copyrighted text remains on publisher domain.
              </span>
              <a
                href={selectedResult.canonical_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold text-xs flex items-center gap-1.5"
              >
                <span>Read on {selectedResult.source_name}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ADMIN SOURCE REGISTRY & VERIFICATION CONSOLE MODAL (SECTION 5) */}
      {showRegistryModal && (
        <div
          onClick={() => setShowRegistryModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#11151E] border border-white/15 rounded-3xl max-w-5xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-[#0B0D11]">
              <div className="flex items-center gap-2.5">
                <Database className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-white text-base">
                    Central Source Registry & Verification Governance Console
                  </h3>
                  <p className="text-xs text-slate-400">
                    Manage approved domains, trust tiers, freshness policies, rejected URLs, and audit logs
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowRegistryModal(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="px-6 py-3 bg-[#0E121B] border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRegistryTab("sources")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    registryTab === "sources"
                      ? "bg-cyan-400 text-slate-950"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Source Registry ({registrySources.length})
                </button>
                <button
                  onClick={() => setRegistryTab("rejected")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    registryTab === "rejected"
                      ? "bg-rose-400 text-slate-950"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Rejected Source Logs ({rejectedLogs.length})
                </button>
                <button
                  onClick={() => setRegistryTab("audit")}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                    registryTab === "audit"
                      ? "bg-amber-400 text-slate-950"
                      : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  Admin Audit Trail ({auditTrail.length})
                </button>
              </div>

              {registryTab === "sources" && (
                <select
                  value={registryFilterCategory}
                  onChange={(e) => setRegistryFilterCategory(e.target.value)}
                  className="bg-[#0B0D11] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate-200"
                >
                  <option value="all">All Categories</option>
                  <option value="sports">Sports & Broadcasters</option>
                  <option value="live_scores">Live Scores APIs</option>
                  <option value="news">News & Journalism</option>
                  <option value="technology">Technology & Docs</option>
                  <option value="brands">Brands & Newsrooms</option>
                  <option value="science">Science & Research</option>
                  <option value="finance">Financial Markets</option>
                  <option value="travel">Official Travel</option>
                </select>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {registryTab === "sources" && (
                <>
                  {/* Add New Candidate Source Form */}
                  <form
                    onSubmit={handleAdminAddSource}
                    className="p-4 rounded-2xl bg-[#0B0D11] border border-white/10 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
                  >
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Publisher / Organization Name
                      </label>
                      <input
                        type="text"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        placeholder="e.g. IEEE Official"
                        className="w-full bg-[#131824] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Canonical Domain
                      </label>
                      <input
                        type="text"
                        value={newSourceDomain}
                        onChange={(e) => setNewSourceDomain(e.target.value)}
                        placeholder="e.g. ieee.org"
                        className="w-full bg-[#131824] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">
                        Category
                      </label>
                      <select
                        value={newSourceCategory}
                        onChange={(e) => setNewSourceCategory(e.target.value as ContentCategory)}
                        className="w-full bg-[#131824] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                      >
                        <option value="news">News & Journalism</option>
                        <option value="sports">Sports</option>
                        <option value="technology">Technology</option>
                        <option value="brands">Brands</option>
                        <option value="science">Science</option>
                        <option value="finance">Finance</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs"
                    >
                      + Register Candidate
                    </button>
                  </form>

                  {/* Sources Table */}
                  <div className="space-y-2.5">
                    {registrySources
                      .filter(
                        (s) =>
                          registryFilterCategory === "all" ||
                          s.category === registryFilterCategory
                      )
                      .map((src) => (
                        <div
                          key={src.id}
                          className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-semibold text-sm text-white">
                                {src.publisherName}
                              </span>
                              <span className="font-mono text-xs text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                                {src.canonicalDomain}
                              </span>
                              <span className="text-[10px] uppercase px-2 py-0.5 rounded bg-white/10 text-slate-300">
                                Tier {src.trustTier} • {src.category}
                              </span>
                              <span
                                className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                  src.approvalStatus === "approved"
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : src.approvalStatus === "pending_review"
                                    ? "bg-amber-500/20 text-amber-300"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {src.approvalStatus}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">
                              Subdomains: {src.approvedSubdomains.join(", ")} • Max Age:{" "}
                              {src.maxContentAgeMs > 0
                                ? `${Math.round(src.maxContentAgeMs / 3600000)}h`
                                : "Blocked"}{" "}
                              • Health: {src.integrationHealth}
                            </p>
                            <p className="text-[11px] text-slate-500">{src.adminNotes}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {src.approvalStatus !== "approved" && (
                              <button
                                onClick={() => handleAdminStatusChange(src.id, "approved")}
                                className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-400/30 text-xs flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}
                            {src.approvalStatus === "approved" && (
                              <button
                                onClick={() => handleAdminStatusChange(src.id, "suspended")}
                                className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/30 text-xs flex items-center gap-1"
                              >
                                <Ban className="w-3.5 h-3.5" />
                                <span>Suspend</span>
                              </button>
                            )}
                            {src.approvalStatus !== "rejected" && (
                              <button
                                onClick={() => handleAdminStatusChange(src.id, "rejected")}
                                className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-400/30 text-xs flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {registryTab === "rejected" && (
                <div className="space-y-2.5">
                  {rejectedLogs.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">
                      No rejected candidate URLs recorded in the current session yet.
                    </p>
                  ) : (
                    rejectedLogs.map((log, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/25 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 mr-2">
                            {log.reasonCode}
                          </span>
                          <span className="text-white font-medium break-all">{log.url}</span>
                          <p className="text-slate-400 mt-1">{log.detail}</p>
                        </div>
                        <span className="text-[11px] text-slate-500 shrink-0">
                          {formatDisplayTimestamp(log.timestamp)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {registryTab === "audit" && (
                <div className="space-y-2.5">
                  {auditTrail.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">
                      No administrative configuration changes logged in this session yet.
                    </p>
                  ) : (
                    auditTrail.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 mr-2">
                            {entry.action}
                          </span>
                          <span className="text-slate-200">{entry.summary}</span>
                        </div>
                        <span className="text-[11px] text-slate-500">
                          {formatDisplayTimestamp(entry.timestamp)}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
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
                  <h3 className="font-semibold text-white">Balaji’s Verified Vault</h3>
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
                    Your Verified Vault is empty
                  </p>
                  <p className="text-xs text-slate-500">
                    Bookmark any verified article or primary release to save its citation and link here.
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
                        <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-400/15 text-emerald-300">
                          {item.source_name} (Tier {item.source_tier})
                        </span>
                        <a
                          href={item.canonical_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-sm font-medium text-white hover:text-amber-300 mt-1.5"
                        >
                          {item.title}
                        </a>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Published: {formatDisplayTimestamp(item.published_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleBookmark(item)}
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
