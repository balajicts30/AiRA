// ============================================================================
// PHASE 7 & PHASE 8: PERSISTENT FEED CONTEXT & CONVERSATION STATE MANAGER
// Ensures the conversational AI and the social discovery feed share the same
// topic-resolution service, entity memory, and follow-up continuity.
// ============================================================================

import {
  ConversationSessionState,
  FeedContext,
  QueryInterpretation,
  StandardizedSearchResult,
  StructuredSportsEvent
} from "./types";

export class ConversationStateManager {
  private sessions: Map<string, ConversationSessionState> = new Map();

  public getSession(conversationId = "default-session"): ConversationSessionState | null {
    return this.sessions.get(conversationId) || null;
  }

  public clearSession(conversationId = "default-session"): void {
    this.sessions.delete(conversationId);
  }

  public clearAllSessions(): void {
    this.sessions.clear();
  }

  public updateSessionFromTurn(params: {
    conversationId?: string;
    interp: QueryInterpretation;
    verifiedResults: StandardizedSearchResult[];
    liveScoreEvents: StructuredSportsEvent[];
    activeMediaFilter?: string | null;
    timeframe?: string;
  }): ConversationSessionState {
    const {
      conversationId = "default-session",
      interp,
      verifiedResults,
      liveScoreEvents,
      activeMediaFilter = null,
      timeframe = "all"
    } = params;

    const existing = this.sessions.get(conversationId);
    const nowIso = new Date().toISOString();

    const isSwitch = interp.conversationReference.isContextSwitch || !existing;

    const previousUserQuestions = isSwitch
      ? [interp.originalQuery]
      : [...(existing?.previousUserQuestions || []), interp.originalQuery].slice(-12);

    const eventIds = liveScoreEvents.map((e) => e.id);
    const relevantEventIds =
      eventIds.length > 0
        ? eventIds
        : !isSwitch && existing
        ? existing.relevantEventIds
        : [];

    const newEvidence = verifiedResults.slice(0, 12).map((r) => ({
      id: r.id,
      title: r.title,
      sourceName: r.source_name,
      canonicalUrl: r.canonical_url,
      dataType: r.data_type
    }));

    const previouslyRetrievedEvidence = isSwitch
      ? newEvidence
      : Array.from(
          new Map(
            [...newEvidence, ...(existing?.previouslyRetrievedEvidence || [])].map((item) => [
              item.canonicalUrl,
              item
            ])
          ).values()
        ).slice(0, 24);

    const entityNames = interp.namedEntities.map((e) => e.canonicalName);

    const feedContext: FeedContext = {
      currentPrimaryTopic: interp.primarySubject,
      resolvedEntities: entityNames,
      currentSportBrandCompetition:
        interp.competitionOrEvent ||
        interp.brandsOrProducts[0] ||
        (interp.teamsOrCompetitors.length > 0 ? interp.teamsOrCompetitors.join(" vs ") : null),
      currentEventIds: relevantEventIds,
      activeFilters: {
        mediaFilter:
          activeMediaFilter ||
          (interp.requestedContentType === "photologs"
            ? "photologs"
            : interp.requestedContentType === "vlogs"
            ? "vlogs"
            : interp.requestedContentType === "articles"
            ? "articles"
            : null),
        timeframe
      },
      userPreferences:
        interp.requestedContentType !== "all" ? [interp.requestedContentType] : [],
      conversationSessionId: conversationId,
      latestResolvedIntent: interp.userIntent,
      updatedAt: nowIso
    };

    const nextState: ConversationSessionState = {
      conversationId,
      currentTopic: interp.primarySubject,
      primarySubject: interp.primarySubject,
      resolvedEntities: interp.namedEntities,
      sportOrIndustry: interp.sportOrIndustry,
      teamsOrCompetitors: interp.teamsOrCompetitors,
      brandsOrProducts: interp.brandsOrProducts,
      competitionOrEvent: interp.competitionOrEvent,
      previousUserQuestions,
      relevantEventIds,
      currentTimeRange: timeframe,
      activeSearchIntent: interp.userIntent,
      previouslyRetrievedEvidence,
      feedContext,
      userClarification: interp.clarificationQuestion || null,
      updatedAt: nowIso
    };

    this.sessions.set(conversationId, nextState);
    return nextState;
  }
}

export const globalConversationStateManager = new ConversationStateManager();
