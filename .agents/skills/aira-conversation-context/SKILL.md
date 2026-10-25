---
name: aira-conversation-context
description: >-
  Multi-Turn Conversational Memory, Follow-Up Intent Resolution, Topic Continuity,
  and Context Isolation for AiRA.
---

# AiRA Conversation Context Skill

## 1. Purpose & Activation Conditions
Activates across successive conversational query turns in an active search session. It ensures that the conversational AI assistant and the social discovery feed share synchronized topic context, entities, and constraints.

## 2. Inputs & Outputs
* **Inputs:**
  * `rawQuery`: Follow-up or new query text.
  * `activeSessionState`: Stored `ConversationSessionState`.
* **Outputs:**
  * `ConversationReferenceResolution`: Whether the turn is a follow-up or explicit topic switch.
  * Updated `ConversationSessionState` and synchronized `FeedContext`.

## 3. Core Responsibilities
1. **Follow-Up Resolution:** Detect follow-up queries ("What's the score now?", "Show photos too", "Tell me more about this", "Compare these options").
2. **Entity & Constraint Inheritance:** Carry forward active entities, event IDs, and media filters across follow-ups without re-prompting.
3. **Context Switching & Isolation:** When the user explicitly changes topics (e.g. from cricket to Ferrari), reset topic state and prevent stale content leakage.
4. **Shared Retrieval Context:** Ensure the conversational assistant grounded synthesis and the feed cards use the exact same verified source material.

## 4. Operational Instructions
* Distinguish pronouns ("its", "their", "this") as explicit follow-up indicators.
* Bypass stale cache when time-sensitive follow-up queries (e.g. "What's the score now?") are asked.
* Update conversation session turn history after every verified search.

## 5. Constraints & Rejection Rules
* Rejects context bleeding between unrelated topics.
* Never retain previous search results when a new primary entity is introduced.

## 6. Implementation Guidance
* Implemented in [`src/engine/conversationState.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/conversationState.ts) and [`src/engine/queryUnderstanding.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/queryUnderstanding.ts#L450-L578).
* Class: [`ConversationStateManager`](file:///data/data/com.termux/files/home/AiRA/src/engine/conversationState.ts#L15-L50).

## 7. Example Scenarios
* **Scenario A:** Turn 1: "Ferrari F80" -> Turn 2: "What are its latest updates?" -> Resolves "its" to Ferrari F80, preserving active automotive context.
* **Scenario B:** Turn 1: "SA vs AUS cricket" -> Turn 2: "Switch to SpaceX Starship" -> Context switch triggered; cricket entities flushed; SpaceX context initialized.

## 8. Validation Criteria
* Passes Suite 8 & Suite 10 (Multi-turn Context Retention) in [`trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).
