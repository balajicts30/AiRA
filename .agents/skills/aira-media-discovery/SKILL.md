---
name: aira-media-discovery
description: >-
  Authentic Image and Video Discovery, Media-Specific Relevance Validation,
  and Responsive Card Assembly for AiRA.
---

# AiRA Media Discovery Skill

## 1. Purpose & Activation Conditions
Activates when discovering, validating, and presenting visual media (photologs, video previews, and editorial image galleries) within the social discovery feed.

## 2. Inputs & Outputs
* **Inputs:**
  * Raw media candidates from RSS enclosures, publisher video channels, or discovery metadata.
  * `interp`: `QueryInterpretation`.
* **Outputs:**
  * `SocialPhotologCard[]`: Photography cards with verified aspect ratio, photographer attribution, and camera specs.
  * `SocialVlogCard[]`: Video preview cards with duration, views count, and embed triggers.

## 3. Core Responsibilities
1. **Media Relevance Validation:** Verify that images and videos genuinely relate to the active topic, rejecting generic stock photos.
2. **Provenance & Attribution:** Extract author/photographer attribution, camera/editorial desk specs, and publisher watermarks.
3. **No Fabrication:** Never fabricate thumbnails, fake video duration strings, or broken embed links.
4. **Adaptive Assembly:** If suitable high-quality media is unavailable, gracefully omit media sections rather than showing unrelated visuals.

## 4. Operational Instructions
* Validate thumbnail URLs against approved secure image hosts.
* Format video durations (e.g. `09:45`) and view counts accurately.
* Support aspect ratio tags (`wide`, `square`, `tall`) for responsive masonry layout.

## 5. Constraints & Rejection Rules
* Rejects broken image links or images with dimension $< 200\text{px}$.
* Prohibits unpermitted scraping of third-party video platforms.

## 6. Implementation Guidance
* Implemented in [`src/engine/mediaResolver.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/mediaResolver.ts) and [`src/engine/adapters/index.ts`](file:///data/data/com.termux/files/home/AiRA/src/engine/adapters/index.ts).
* Key function: `resolveArticleOrPhotoMedia`.

## 7. Example Scenarios
* **Scenario A:** Query "Fiorano Ferrari F80 track test" -> Yields editorial photo cards with photographer attribution and track camera specs.
* **Scenario B:** Query "Quantum computing logic gates" with no verified video -> Video section is cleanly omitted rather than showing unrelated videos.

## 8. Validation Criteria
* Zero broken media thumbnails.
* 100% of rendered media items relate directly to active search entities.
