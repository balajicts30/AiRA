// ============================================================================
// TRUSTED SEARCH ORCHESTRATOR (QUERY -> ADAPTERS -> VERIFICATION -> CACHE)
// ============================================================================

import {
  ApprovedPublisherBaselineAdapter,
  ApprovedRssAtomAdapter,
  EspnLiveScoreAdapter,
  GitHubOfficialReleasesAdapter,
  RetrievalAdapter
} from "./adapters";
import { CategoryAwareCache, globalResilienceManager } from "./cacheAndRateLimit";
import { isHistoricalQueryIntent } from "./freshnessPolicy";
import { SourceRegistryService, globalSourceRegistry } from "./sourceRegistry";
import {
  CandidateItem,
  ContentCategory,
  GroundedSummaryOutput,
  StandardizedSearchResult,
  StructuredSportsEvent,
  TrustedSearchEngineResponse
} from "./types";
import { runVerificationPipeline } from "./verificationPipeline";

export function classifyQueryCategory(query: string): ContentCategory {
  const lower = query.toLowerCase();
  if (
    /\b(live score|scorecard|live match|who won|cricket|t20|ipl|bcci|icc|premier league|champions league|fifa|uefa|nba|nfl|formula 1|f1|grand prix|atp|wta|tennis|chepauk|bumrah|suryakumar)\b/.test(
      lower
    )
  ) {
    return "sports";
  }
  if (
    /\b(apple|iphone|macbook|nvidianews|press release|product spec|pricing|warranty|model|brand)\b/.test(
      lower
    )
  ) {
    return "brands";
  }
  if (
    /\b(tech|technology|software|hardware|ai|openai|gpt|llm|nvidia|gpu|microsoft|typescript|react|cloudflare|aws|cloud|github|release|changelog|security|vulnerability|sdk|api)\b/.test(
      lower
    )
  ) {
    return "technology";
  }
  if (/\b(nasa|space|artemis|science|physics|climate|astronomy|biology|research|lunar)\b/.test(lower)) {
    return "science";
  }
  if (/\b(market|stocks|economy|inflation|earnings|central bank|fed|bond|finance|cnbc|ft|bloomberg)\b/.test(lower)) {
    return "finance";
  }
  if (/\b(japan|kyoto|tokyo|kanazawa|travel|shinkansen|tourism|itinerary|rail|flight)\b/.test(lower)) {
    return "travel";
  }
  return "news";
}

export class TrustedSearchOrchestrator {
  private cache = new CategoryAwareCache<TrustedSearchEngineResponse>();
  private rssAdapter = new ApprovedRssAtomAdapter();
  private githubAdapter = new GitHubOfficialReleasesAdapter();
  private baselineAdapter = new ApprovedPublisherBaselineAdapter();
  private liveScoreAdapter = new EspnLiveScoreAdapter();
  private registry: SourceRegistryService;

  constructor(registry: SourceRegistryService = globalSourceRegistry) {
    this.registry = registry;
  }

  public invalidateCache(prefix?: string): void {
    this.cache.invalidate(prefix);
  }

  public async executeSearch(params: {
    query: string;
    categoryOverride?: ContentCategory;
    bypassCache?: boolean;
    additionalCandidates?: CandidateItem[];
    geminiApiKey?: string;
  }): Promise<TrustedSearchEngineResponse> {
    const {
      query,
      categoryOverride,
      bypassCache = false,
      additionalCandidates = [],
      geminiApiKey
    } = params;

    const cleanQuery = query.trim();
    const detectedCategory = categoryOverride || classifyQueryCategory(cleanQuery);
    const isHistorical = isHistoricalQueryIntent(cleanQuery);
    const cacheKey = `${detectedCategory}:${cleanQuery.toLowerCase()}`;

    if (!bypassCache) {
      const cached = this.cache.get(cacheKey);
      if (cached.status !== "miss" && cached.value) {
        return {
          ...cached.value,
          fromCache: true,
          cacheStatus: cached.status
        };
      }
    }

    return globalResilienceManager.coalesce(cacheKey, async () => {
      const executedAt = new Date().toISOString();
      const adapters: RetrievalAdapter[] = [
        this.rssAdapter,
        this.githubAdapter,
        this.baselineAdapter
      ];

      const providerDiagnostics: TrustedSearchEngineResponse["diagnostics"]["providersQueried"] = [];
      const rawCandidates: CandidateItem[] = [...additionalCandidates];
      let liveScoreEvents: StructuredSportsEvent[] = [];

      // 1. Run Sports Live Scoreboard Adapter if query is sports or live_scores
      if (detectedCategory === "sports" || detectedCategory === "live_scores") {
        const scoreStart = Date.now();
        const scoreOut = await this.liveScoreAdapter.retrieveLiveScores(cleanQuery, this.registry);
        liveScoreEvents = scoreOut.events;
        rawCandidates.push(...scoreOut.articles);
        providerDiagnostics.push({
          providerId: this.liveScoreAdapter.adapterId,
          status: scoreOut.status,
          latencyMs: Date.now() - scoreStart,
          itemsReturned: scoreOut.events.length + scoreOut.articles.length,
          errorDetail: scoreOut.errorDetail
        });
      }

      // 2. Run Content Retrieval Adapters concurrently
      const adapterOutputs = await Promise.all(
        adapters.map((ad) => ad.retrieve(cleanQuery, detectedCategory, this.registry))
      );

      for (const out of adapterOutputs) {
        rawCandidates.push(...out.candidates);
        providerDiagnostics.push({
          providerId: out.adapterId,
          status: out.status,
          latencyMs: out.latencyMs,
          itemsReturned: out.candidates.length,
          errorDetail: out.errorDetail
        });
      }

      // 3. Execute 8-Stage Verification Pipeline
      const pipelineOut = runVerificationPipeline({
        query: cleanQuery,
        targetCategory: detectedCategory,
        candidates: rawCandidates,
        registry: this.registry.getAllSources(),
        requireQueryMatch: true
      });

      // Record any rejections into the central SourceRegistryService telemetry
      for (const rej of pipelineOut.rejectedLogs) {
        this.registry.recordRejection(rej);
      }

      let groundedSynthesis: GroundedSummaryOutput = pipelineOut.groundedSynthesis;

      // 4. Optional Evidence-Grounded AI Synthesis (Strictly Isolated to Verified Results Only)
      if (geminiApiKey && pipelineOut.verifiedResults.length > 0) {
        const aiGrounded = await this.tryEvidenceGroundedGeminiSummary(
          cleanQuery,
          pipelineOut.verifiedResults,
          geminiApiKey
        );
        if (aiGrounded) {
          groundedSynthesis = aiGrounded;
        }
      }

      const response: TrustedSearchEngineResponse = {
        query: cleanQuery,
        detectedCategory,
        isHistoricalQuery: isHistorical,
        executedAt,
        fromCache: false,
        cacheStatus: "miss",
        groundedSynthesis,
        results: pipelineOut.verifiedResults,
        liveScoreEvents,
        diagnostics: {
          candidatesRetrieved: rawCandidates.length,
          candidatesVerified: pipelineOut.verifiedResults.length,
          candidatesRejected: pipelineOut.rejectedLogs.length,
          rejectedBreakdown: pipelineOut.rejectedLogs,
          providersQueried: providerDiagnostics
        }
      };

      // Cache only if we have verified results and no live active scores that require 30s TTL
      const hasActiveLiveScore = liveScoreEvents.some((ev) => ev.isLive);
      const cacheCategory: ContentCategory = hasActiveLiveScore ? "live_scores" : detectedCategory;
      this.cache.set(cacheKey, response, cacheCategory);

      return response;
    });
  }

  /**
   * Passes ONLY verified, sanitized evidence to Gemini with strict schema validation.
   * Rejects any AI output that cites non-existent citation IDs.
   */
  private async tryEvidenceGroundedGeminiSummary(
    query: string,
    verifiedResults: StandardizedSearchResult[],
    apiKey: string
  ): Promise<GroundedSummaryOutput | null> {
    try {
      const topEvidence = verifiedResults.slice(0, 5);
      const validCitationIds = new Set<string>(
        topEvidence.flatMap((r) => r.citations.map((c) => c.citationId))
      );

      const evidenceBlock = topEvidence
        .map((r) => {
          const citId = r.citations[0]?.citationId || r.id;
          return `CITATION_ID: ${citId} | SOURCE: ${r.source_name} (Tier ${r.source_tier}) | PUBLISHED: ${
            r.published_at || "Unverified"
          }\nTITLE: ${r.title}\nEVIDENCE: ${r.summary}`;
        })
        .join("\n\n");

      const systemPrompt = `You are a strict evidence-grounded factual synthesizer.
RULES:
1. Use ONLY the provided EVIDENCE blocks below. Never use external memory or invent facts, scores, dates, or quotes.
2. Every claim MUST reference at least one valid CITATION_ID from the provided evidence.
3. Distinguish confirmed facts, official announcements, and single-source attributed reports.`;

      const resp = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `Query: "${query}"\n\nApproved Evidence:\n${evidenceBlock}`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: "application/json",
              responseSchema: {
                type: "OBJECT",
                properties: {
                  headline: { type: "STRING" },
                  synthesizedSummary: { type: "STRING" },
                  factualClaims: {
                    type: "ARRAY",
                    items: {
                      type: "OBJECT",
                      properties: {
                        claimText: { type: "STRING" },
                        claimType: {
                          type: "STRING",
                          enum: [
                            "confirmed_fact",
                            "attributed_report",
                            "official_announcement",
                            "analysis"
                          ]
                        },
                        citationIds: {
                          type: "ARRAY",
                          items: { type: "STRING" }
                        },
                        confidence: { type: "NUMBER" }
                      },
                      required: ["claimText", "claimType", "citationIds", "confidence"]
                    }
                  },
                  discrepancies: {
                    type: "ARRAY",
                    items: { type: "STRING" }
                  },
                  uncertaintyNotice: { type: "STRING", nullable: true }
                },
                required: ["headline", "synthesizedSummary", "factualClaims", "discrepancies"]
              }
            }
          })
        }
      );

      if (!resp.ok) return null;
      const json = await resp.json();
      const rawText = json?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) return null;

      const parsed = JSON.parse(rawText);
      if (!Array.isArray(parsed.factualClaims) || parsed.factualClaims.length === 0) {
        return null;
      }

      // Verify every single citationId referenced by the AI exists in validCitationIds
      for (const claim of parsed.factualClaims) {
        if (
          !Array.isArray(claim.citationIds) ||
          claim.citationIds.length === 0 ||
          claim.citationIds.some((id: string) => !validCitationIds.has(id))
        ) {
          // Reject AI output if it hallucinates or omits a valid citation ID
          return null;
        }
      }

      return {
        headline: parsed.headline,
        synthesizedSummary: parsed.synthesizedSummary,
        factualClaims: parsed.factualClaims,
        discrepancies: parsed.discrepancies || [],
        uncertaintyNotice: parsed.uncertaintyNotice || null,
        isAiGenerated: true
      };
    } catch {
      return null;
    }
  }
}

export const globalSearchOrchestrator = new TrustedSearchOrchestrator();
