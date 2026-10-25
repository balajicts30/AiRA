---
name: aira-source-intelligence
description: >-
  Dynamic Source Governance, Publisher Tiering, Mandatory Social Media Denylist Enforcement,
  and Provenance Tracking for AiRA.
---

# AiRA Source Intelligence Skill

## 1. Purpose & Activation Conditions
Activates during candidate URL validation and domain governance. It maintains the balance between open-world universal discovery and strict information safety, ensuring zero prohibited social media or spoofed domains enter the curated pipeline.

## 2. Inputs & Outputs
* **Inputs:**
  * `rawUrl`: Candidate URL and optional redirect chain.
  * `registry`: `SourceRegistryService` or `SourceRegistryRecord[]`.
  * `options`: Dynamic discovery permission flags.
* **Outputs:**
  * URL inspection result: `allowed: boolean`, `matchedSource`, `canonicalUrl`, and rejection audit log if blocked.

## 3. Core Responsibilities
1. **Mandatory Social Media Denylist:** Block Facebook, Instagram, X/Twitter, Threads, Reddit, TikTok, LinkedIn, Pinterest, Mastodon, and Bluesky from factual discovery.
2. **SSRF & Private Host Defense:** Reject internal IPs (127.0.0.1, 10.x, 192.168.x, 169.254.169.254) and invalid hostnames.
3. **Spoof & Lookalike Defense:** Detect and block typosquatted or deceptive lookalike domains mimicking approved brands.
4. **Dynamic Source Admission:** Dynamically inspect and admit authentic open-world domains (`.edu`, `.gov`, `.org`, verified publishers) with appropriate trust tier assignment.

## 4. Operational Instructions
* Strip tracking parameters (`utm_source`, `fbclid`, `gclid`) during canonicalization.
* Log all rejected items to `SourceRegistryService` telemetry for auditability.
* Distinguish between search snippet metadata and independently verified article content.

## 5. Constraints & Rejection Rules
* Wikipedia and fandom wikis are disabled for the factual curated pipeline.
* Unresolved URL shorteners are blocked until destination is resolved.

## 6. Implementation Guidance
* Implemented in [`src/engine/urlSecurity.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/urlSecurity.ts) and [`src/engine/sourceRegistry.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/sourceRegistry.ts).
* Core functions: [`verifyUrlAgainstRegistry`](file:///data/data/com.termux/files/home/AiRA/src/engine/urlSecurity.ts#L370-L460), [`resolveOrRegisterDomain`](file:///data/data/com.termux/files/home/AiRA/src/engine/sourceRegistry.ts#L1760-L1840).

## 7. Example Scenarios
* **Scenario A:** URL `https://x.com/user/breaking_rumor` -> Rejected (`PROHIBITED_SOCIAL_MEDIA`).
* **Scenario B:** URL `https://quantum-journal.org/papers/q-2026-01` -> Admitted as dynamically verified science publisher (`Tier 2`).

## 8. Validation Criteria
* 100% block rate on prohibited social media.
* Passes Suite 1 and Suite 16 in [`trustedEngine.test.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/__tests__/trustedEngine.test.ts).
