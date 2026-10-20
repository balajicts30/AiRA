# AiRA — Production Hosting & CI/CD Pipeline Plan

This document outlines the complete architectural roadmap for taking **AiRA** live from our local collaborative development environment into a robust, lightning-fast production environment with an automated Continuous Integration / Continuous Deployment (CI/CD) pipeline.

---

## 1. Hosting Architecture & Platform Selection

Because AiRA is built as a highly responsive single-page React application powered by client-side state and live Gemini API calls, we can choose from several zero-config, globally distributed edge hosting providers:

### Recommended: Vercel or Netlify
* **Why:** Instant Git integration, automatic HTTPS, global CDN edge caching, and seamless environment variable management for API keys.
* **Build Command:** `npm run build`
* **Output Directory:** `dist` (or `build` depending on Vite/Create React App setup)

---

## 2. Production Environment Variables

To keep API keys secure and dynamic in production, configure the following environment variable on your hosting provider (Vercel/Netlify dashboard):

```env
VITE_GEMINI_API_KEY=your_production_gemini_api_key_here
```

In `App.jsx`, update the API fetch call to reference `import.meta.env.VITE_GEMINI_API_KEY` rather than a hardcoded string so keys are never exposed in public repositories.

---

## 3. Automated CI/CD Pipeline (GitHub Actions)

We can set up an automated workflow (`.github/workflows/deploy.yml`) that runs every time code is pushed or merged into the `main` branch. It will run code linting, automated builds, and deploy directly to production.

```yaml
name: AiRA CI/CD Production Pipeline

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'npm'

      - name: Install Dependencies
        run: npm ci

      - name: Run Linter / Type Check
        run: npm run lint --if-present

      - name: Build Production Bundle
        run: npm run build
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.VITE_GEMINI_API_KEY }}

  deploy-production:
    needs: build-and-test
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Deploy to Vercel Production
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 4. Step-by-Step Go-Live Checklist

1. **Initialize Git Repository:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial production-ready release of AiRA"
   ```
2. **Push to GitHub:** Create a new repository on GitHub and link your local project:
   ```bash
   git remote add origin https://github.com/your-username/aira-social.git
   git branch -M main
   git push -u origin main
   ```
3. **Connect to Vercel/Netlify:**
   * Import your GitHub repository in the Vercel dashboard.
   * Add your `VITE_GEMINI_API_KEY` in the Environment Variables settings.
   * Click **Deploy**.
4. **Custom Domain (Optional):** Attach your custom domain (e.g., `aira.social`) in the hosting provider DNS settings.


---

## 5. Trusted Live Data Sourcing & Content Curation Engine

AiRA uses a **source-controlled, server-side 8-stage verification architecture** (`src/engine/*` & `api/*`) that enforces strict domain allowlisting, timestamp freshness policies, structured live sports score validation, wire-syndication detection, and evidence-grounded summarization.

### Key Architectural Modules
- **`src/engine/types.ts`** — Standardized data schemas (`StandardizedSearchResult`, `StructuredSportsEvent`, `SourceRegistryRecord`, `CitationReference`, `RejectedSourceLog`).
- **`src/engine/sourceRegistry.ts`** — Centralized `SourceRegistryService` governing approved (`approved`), candidate (`pending_review`), `suspended`, `rejected`, and `deprecated` sources, plus immutable audit logging and rejection telemetry.
- **`src/engine/urlSecurity.ts`** — URL normalization, tracking-parameter stripping (`utm_*`, `fbclid`, etc.), SSRF private/loopback IP blocking, social media denylist (`facebook.com`, `instagram.com`, `x.com`, `twitter.com`, `threads.net`, `reddit.com`, etc.), Wikipedia/Wikimedia denylist (`wikipedia.org`, `wikimedia.org`, `wikidata.org`), URL shortener blocking, redirect chain validation, and brand-lookalike spoof detection.
- **`src/engine/freshnessPolicy.ts`** — Category-specific freshness thresholds (`live_scores: 2 min`, `breaking_news: 6 hours`, `sports: 24 hours`, `news: 48 hours`, `technology: 30 days`, `brands: 90 days`), historical query intent detection, and strict separation of `retrieved_at` vs `published_at`.
- **`src/engine/verificationPipeline.ts`** — 8-stage verification pipeline, prompt-injection sanitizer, wire-syndication vs. independent multi-source corroboration detector, trust-tier ranking calculator, and evidence-grounded synthesizer.
- **`src/engine/adapters/index.ts`** — Modular source-specific adapters (`ApprovedRssAtomAdapter`, `GitHubOfficialReleasesAdapter`, `EspnLiveScoreAdapter`, `ApprovedPublisherBaselineAdapter`).
- **`src/engine/cacheAndRateLimit.ts`** — Category-aware cache (never extends TTL on read; disables stale-while-revalidate for live scores), token-bucket rate limiter, circuit breaker, and concurrent request coalescing.
- **`api/trusted-search.ts` & `api/source-registry.ts`** — Vercel Serverless API endpoints (mirrored in `vite.config.ts` local dev middleware).

### How to Add, Approve, Disable, and Troubleshoot Sources
1. **Via the Admin UI Console**:
   - Click the **Source Registry** button in the top navigation bar of AiRA.
   - Inspect all registered sources, trust tiers (`tier_1_official` to `tier_4_secondary`), categories, and approval statuses.
   - Use **Approve**, **Suspend**, or **Reject** on any source to immediately update its runtime eligibility and record an immutable entry in the **Audit Log** tab.
   - Use the **Add Candidate Source** form to submit a new source into `pending_review` status for administrative evaluation before enabling it in production.
   - Inspect the **Blocked / Rejected Log** tab to troubleshoot why any URL or domain was rejected (e.g., `PROHIBITED_SOCIAL_MEDIA_SOURCE`, `WIKIPEDIA_SOURCE_DISABLED`, `STALE_CONTENT_EXCEEDS_CATEGORY_THRESHOLD`, `UNAPPROVED_DOMAIN`, `LOOKALIKE_SPOOF_DOMAIN`).
2. **Via the API (`/api/source-registry`)**:
   - `GET /api/source-registry` — Returns all registry records, recent rejection telemetry, and the admin audit trail.
   - `POST /api/source-registry` — Supports `update_status` (`approved`, `suspended`, `rejected`, `pending_review`, `deprecated`) and `add_candidate`.
3. **Via Code (`src/engine/sourceRegistry.ts`)**:
   - Add permanent baseline entries to `DEFAULT_SOURCE_REGISTRY` with explicit `allowed_domains`, `allowed_subdomains`, `blocked_subdomains`, `blocked_path_patterns`, `trust_tier`, `freshness_ttl_seconds`, and `rate_limit_rpm`.
   - Note: Prohibited social media domains and Wikipedia domains are enforced by hard guardrails in `urlSecurity.ts` and `SourceRegistryService.updateSourceStatus()` and cannot be approved.

### Running Automated Verification Tests
```bash
npm test
npm run build
```
