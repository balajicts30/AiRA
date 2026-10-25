---
name: aira-live-event-intelligence
description: >-
  Specialist Data Provider Routing, Live Event & Sports Scorecard Resolution,
  and Anti-Contamination Isolation for AiRA.
---

# AiRA Live Event Intelligence Skill

## 1. Purpose & Activation Conditions
Activates when a query involves live sports, match scorecards, tournaments, or real-time event schedules. It manages structured specialist APIs (e.g. ESPN) and enforces strict anti-contamination guards.

## 2. Inputs & Outputs
* **Inputs:**
  * `interp`: `QueryInterpretation` with detected sports or event domain.
  * `rawProviderEvents`: Events retrieved from structured scoreboard providers.
* **Outputs:**
  * `StructuredSportsEvent[]`: Validated sports events with participant scores, status, and venue.
  * `SocialMatchScorecard | null`: Contextualized live widget for the active matchup.

## 3. Core Responsibilities
1. **Specialist Provider Routing:** Route to structured sports APIs only when the query belongs to an active sports domain.
2. **Matchup Verification:** Check participant teams, competition, venue, date, and local timezone.
3. **Anti-Contamination Isolation:** Guarantee that live scores never leak into non-sports queries (e.g. searching "Ferrari" or "Tesla" must never display football or cricket scorecards).
4. **Data Integrity:** Never invent scores, event states, timings, or winner flags.

## 4. Operational Instructions
* Validate every live scoreboard item against `doesEventMatchQueryEntities`.
* Mark events as stale if provider update timestamp exceeds max freshness window ($> 15\text{ mins}$).
* For non-live queries (e.g. upcoming fixture), show schedule information instead of stale scorecards.

## 5. Constraints & Rejection Rules
* Rejects live scores for non-sports queries unconditionally.
* Rejects scorecards lacking participant scores or competition metadata.

## 6. Implementation Guidance
* Implemented in [`src/engine/sportsEventResolver.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/sportsEventResolver.ts) and [`src/engine/adapters/index.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/adapters/index.ts).
* Core functions: [`resolveContextualSportsEvents`](file:///data/data/com.termux/files/home/AiRA/src/engine/sportsEventResolver.ts), [`doesEventMatchQueryEntities`](file:///data/data/com.termux/files/home/AiRA/src/engine/sportsEventResolver.ts#L30-L100).

## 7. Example Scenarios
* **Scenario A:** Query "SA vs AUS cricket live score" -> Resolves South Africa vs Australia match status, current score, overs, and venue.
* **Scenario B:** Query "Tesla flying car" -> Specialist sports provider is bypassed completely; scorecard is null.

## 8. Validation Criteria
* Passes Suite 4 & Suite 5 in [`trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).
