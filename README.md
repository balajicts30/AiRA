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
