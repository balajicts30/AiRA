---
name: aira-search-quality-assurance
description: >-
  Search Regression Testing, Relevance Quality Benchmarking, Duplicate Detection,
  and Verification Metrics for AiRA.
---

# AiRA Search Quality Assurance Skill

## 1. Purpose & Activation Conditions
Activates during testing, build validation, and quality auditing. It runs automated end-to-end regression benchmarks across diverse open-world queries, evaluating precision, freshness, and security boundaries.

## 2. Inputs & Outputs
* **Inputs:**
  * Test query scenarios (familiar, unfamiliar, historical, breaking, multi-entity, empty-state).
  * Application source and test runner harness.
* **Outputs:**
  * `TestCaseResult[]`: Structured pass/fail results per suite.
  * Quality metrics report (Precision@5, Precision@10, duplicate rate, source diversity, latency).

## 3. Core Responsibilities
1. **Search Regression Benchmarking:** Validate precision across sports, tech, science, politics, food, travel, and historical topics.
2. **Relevance & Rejection Audit:** Verify that hard rejection rules drop off-topic items and prompt-injection attacks.
3. **Empty-State Validation:** Ensure nonexistent or unverifiable queries return clean empty states with zero fabricated filler.
4. **Telemetry & Reporting:** Output repeatable audit reports to [`docs/SEARCH_TEST_RESULTS.md`](file:///data/data/com.termux/files/home/AiRA/docs/SEARCH_TEST_RESULTS.md).

## 4. Operational Instructions
* Never use hardcoded demonstration responses as proof of working search.
* Verify that test runs execute deterministically without external network flakiness.
* Enforce that 100% of security and denylist tests pass before deployment.

## 5. Constraints & Rejection Rules
* Rejects any PR or change that degrades Precision@5 below $85\%$.
* Fails if any prohibited social media link appears in verified results.

## 6. Implementation Guidance
* Implemented in [`scripts/run-tests.mjs`](file:///data/data/com.termux/files/home/AiRA/scripts/run-tests.mjs) and [`src/engine/__tests__/trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).
* Function: `runAllEngineTests`.

## 7. Example Scenarios
* **Scenario A:** Automated suite execution across 16 test suites covering 35+ validation scenarios.
* **Scenario B:** Detection of regression where an unapproved domain bypasses security checks.

## 8. Validation Criteria
* 100% pass rate across all engine test suites.
* Produces verified metrics for [`docs/SEARCH_TEST_RESULTS.md`](file:///data/data/com.termux/files/home/AiRA/docs/SEARCH_TEST_RESULTS.md).
