# Copables

**Open-label placebo protocols for IBS, Anxiety, PMS, Fatigue and Low Mood.**

A SvelteKit e-commerce frontend hosted on Cloudflare Pages. Product data is served from Shopify via the Storefront API. The site is currently in **pre-order mode** — users can reserve a protocol but are not charged until it ships.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | SvelteKit 2 + Svelte 5 (runes mode) |
| Language | TypeScript |
| Styling | Scoped CSS + global design tokens |
| Hosting | Cloudflare Pages |
| Adapter | `@sveltejs/adapter-cloudflare` |
| E-commerce | Shopify Storefront API |
| Analytics | PostHog + Google Tag Manager (via dataLayer) |
| A/B Testing | Client-side localStorage-based split |
| Fonts | Sawton Circular (self-hosted) |

---

## Project Structure

```
copables/
├── src/
│   ├── app.css                 # Global tokens, resets, font declarations
│   ├── app.html                # HTML shell
│   ├── app.d.ts                # Global types
│   │
│   ├── components/             # Reusable Svelte components
│   │   ├── ProductPage.svelte  # Main PDP component (shared across protocols)
│   │   ├── OlpChart.svelte     # Interactive SVG growth chart
│   │   ├── FigureCard.svelte   # Branded chart wrapper
│   │   ├── NavBar.svelte       # Site navigation
│   │   ├── Footer.svelte       # Site footer
│   │   ├── Disclaimer.svelte   # Medical disclaimer
│   │   ├── QuizFlow.svelte     # Quiz engine
│   │   └── ...
│   │
│   ├── lib/                    # Shared logic (no components)
│   │   ├── products.ts         # Canonical product data (CONDITIONS map)
│   │   ├── shopify.ts          # Storefront API client
│   │   ├── analytics.ts        # track() wrapper (PostHog + GTM)
│   │   ├── experiments.ts      # A/B variant assignment
│   │   ├── scoring.ts          # Quiz recommendation logic
│   │   └── stores/
│   │       └── quiz.ts         # Quiz reactive state store
│   │
│   └── routes/                 # SvelteKit file-system routing
│       ├── +page.svelte        # Homepage
│       ├── +layout.svelte      # Root layout (nav + footer + analytics)
│       │
│       ├── shop/
│       │   ├── +page.svelte    # Protocol listing (5 cards + All Products)
│       │   ├── all/
│       │   │   ├── +page.server.ts   # Fetches from Shopify Storefront API
│       │   │   └── +page.svelte    # Product grid
│       │   ├── ibs/
│       │   │   └── +page.svelte    # IBS PDP (uses <ProductPage>)
│       │   ├── anxiety/
│       │   │   └── +page.svelte    # Anxiety PDP
│       │   ├── pms/
│       │   ├── fatigue/
│       │   └── low-mood/
│       │
│       ├── prelander/
│       │   └── ibs/
│       │       └── +page.svelte    # Long-form landing page (paid traffic)
│       │
│       ├── quiz/
│       │   └── ibs/
│       │       └── +page.svelte    # 47-screen symptom quiz
│       │
│       ├── blog/
│       │   ├── +page.svelte
│       │   └── [slug]/
│       │       └── +page.svelte
│       │
│       ├── science/
│       │   └── +page.svelte
│       │
│       ├── terms/
│       ├── privacy/
│       ├── cookies/
│       └── +error.svelte
│
├── static/                     # Static assets served at root
│   ├── assets/
│   │   ├── bottle.png            # Shared bottle image (used on /shop)
│   │   ├── bottle-*.webp         # Per-protocol bottles
│   │   ├── face.webp             # Brand face logo
│   │   ├── kit.webp
│   │   ├── lineup.webp
│   │   └── science/              # University logos + mechanism illustrations
│   ├── fonts/
│   │   └── sawtoncircular/       # woff2 + ttf
│   └── robots.txt              # Disallows /prelander/ and /quiz/
│
├── wrangler.jsonc              # Cloudflare Pages / Workers config
├── svelte.config.js            # SvelteKit config (alias: $components)
├── vite.config.ts              # Vite build config
├── tsconfig.json               # TypeScript paths & target
├── package.json
└── .env                          # Secrets (NEVER COMMIT)
```

---

## Architecture Principles

1. **SvelteKit owns pages, routing, and SSR.** Shopify owns products, cart, checkout, orders, and payments. SvelteKit never handles money or cart state.
2. **Product data is dual-sourced.** Static content (titles, benefits, reviews, FAQs) lives in `src/lib/products.ts`. Live Shopify data (price, inventory, collections) is fetched server-side in `+page.server.ts` load functions.
3. **Pre-order mode.** The buy box shows a single "Pre-order now" button at $48. Subscriptions, tier selection, and flavour pickers are hidden but the code remains — swap back when going live.
4. **Hidden routes.** `/prelander/` and `/quiz/` are excluded from `robots.txt`. No nav links. Traffic arrives via paid ads and email only.
5. **Analytics on every action.** The `track()` wrapper fires to PostHog and pushes to GTM's `dataLayer`. Every CTA click, quiz step, and page view is instrumented.
6. **A/B testing is client-side.** `getVariant()` assigns a variant per experiment key, stores it in `localStorage`, and is consistent per user.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+
- A Cloudflare account (for Pages deployment)
- A Shopify store with Storefront API access (for `/shop/all`)

### Install

```bash
git clone <repo-url>
cd copables
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```bash
# .env — NEVER commit this file
SHOPIFY_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-public-storefront-token
```

> **Security rule:** `SHOPIFY_STOREFRONT_TOKEN` is only used in `+page.server.ts` load functions. It never reaches the browser.

### Local Development

```bash
# Start the dev server
npm run dev

# Or open automatically
npm run dev -- --open
```

The dev server runs on `http://localhost:5173` by default.

### Type Checking

```bash
npm run check          # One-shot type check
npm run check:watch    # Watch mode
```

### Build Preview

```bash
npm run build          # Production build
npm run preview        # Preview the production build locally
```

The build outputs to `.svelte-kit/cloudflare/` (configured by `wrangler.jsonc`).

---

## Build & Deploy

### Manual Deploy

```bash
npm run build
npx wrangler pages deploy .svelte-kit/cloudflare
```

### CI/CD Pipeline (GitHub Actions → Cloudflare Pages)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run check

      - name: Build
        run: npm run build
        env:
          SHOPIFY_DOMAIN: ${{ secrets.SHOPIFY_DOMAIN }}
          SHOPIFY_STOREFRONT_TOKEN: ${{ secrets.SHOPIFY_STOREFRONT_TOKEN }}

      - name: Deploy to Cloudflare Pages
        uses: cloudflare/pages-action@v1
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          projectName: copables
          directory: .svelte-kit/cloudflare
          gitHubToken: ${{ secrets.GITHUB_TOKEN }}
```

#### Required GitHub Secrets

| Secret | How to get it |
|--------|---------------|
| `SHOPIFY_DOMAIN` | Your `.myshopify.com` domain |
| `SHOPIFY_STOREFRONT_TOKEN` | Shopify Admin → Apps → Storefront API |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → Use "Custom token" template with `Cloudflare Pages:Edit` permission |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard → Overview → Account ID (right sidebar) |

---

## Data Layer

### Current State: Static + Shopify Hybrid

**Product content** (titles, descriptions, benefits, reviews, FAQs, timeline) is stored in the canonical `CONDITIONS` map inside `src/lib/products.ts`. This is intentional — it keeps copy in version control, enables instant deploys, and avoids a CMS dependency for launch.

**Live Shopify data** (price, availability, collections) is fetched server-side in `src/routes/shop/all/+page.server.ts` via the Storefront API. The PDPs do not yet pull live data; they use the static `CONDITIONS` map.

### Future Database Options

| Use Case | Recommended |
|----------|-------------|
| Quiz results & user sessions | Cloudflare D1 (SQLite, serverless, free tier generous) |
| A/B test assignment persistence | Cloudflare KV (fast edge reads) |
| Contact form submissions | Cloudflare D1 or email-to-webhook |
| Product content CMS | Keep in git (simple) or migrate to Sanity/Contentful later |
| Order state | Shopify (source of truth) |

### Shopify Storefront API

The client lives in `src/lib/shopify.ts`. It exposes:

```ts
getProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]>
```

Example usage in a server load function:

```ts
import { getProductsByCollection } from '$lib/shopify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  const products = await getProductsByCollection('all');
  return { products };
};
```

---

## Key Features

### Pre-Order Mode

The product page (`ProductPage.svelte`) is currently simplified for pre-orders:
- Single "Pre-order now" button at $48
- No tier selection, no subscription toggle, no flavour picker
- Note: "You won't be charged until your order ships"
- Sticky mobile bar also shows "Pre-order"

To restore full purchase mode, re-instate the markup removed from the buy box (see git history or the commented-out sections in earlier commits).

### Interactive OLP Chart

`OlpChart.svelte` renders an SVG line chart showing OLP publication growth (3 → 272 in 14 years). Features:
- **Line draw animation** on mount (stroke-dasharray trick)
- **Hover tooltips** on every data point
- **Axis label dimming** when a point is hovered
- **Endpoint callout** with "272 PUBS · 2024"

### Animated Offer Ticker

The black strip at the top of every PDP (`pdp-ticker`) cycles through 7 trust lines on a 24-second CSS animation loop. Content is condition-aware (rating, review count, offer text come from the `CONDITIONS` map).

### A/B Testing

```ts
import { getVariant } from '$lib/experiments';

const variant = getVariant('hero_headline'); // 'A' | 'B'
```

- Assigns 50/50 split
- Persists in `localStorage` per experiment key
- Attach variant to every `track()` call for analysis

### Quiz Flow

`quiz/ibs/+page.svelte` contains a 47-screen symptom assessment. Screens are defined as a static array of screen objects (single, multi, slider, scale, info types). Results are scored in `src/lib/scoring.ts` and can route to a recommended protocol.

### Analytics Events

Every significant action fires `track(eventName, properties)`:

| Event | When |
|-------|------|
| `page_view` | Every route change |
| `cta_click` | Any button/link CTA |
| `prelander_quiz_start` | User clicks first quiz option on prelander |
| `quiz_start` | GTM dataLayer push on quiz initiation |

---

## Design Tokens

Global CSS variables live in `src/app.css`:

```css
:root {
  --paper:    #FBF6EA;
  --paper-2:  #F3E9D4;
  --card:     #FFFFFF;
  --ink:      #14130F;
  --ink-soft: #544F43;
  --line:     rgba(20,19,15,.12);

  --blue:        #2F95F2;
  --blue-deep:   #1A6FC4;
  --orange:      #F2901E;
  --green-ok:    #2E9E6B;
  --wine:        #8A2433;

  --frame-bw:    2px;
  --frame-ink:   #14130F;
  --frame-radius: 20px;
  --frame-shadow: 8px 8px 0 0 rgba(20,19,15,.14);
}
```

The site uses a **brand frame system**: thick black borders (`2px solid #14130F`) + hard offset shadows. This is applied via utility classes `.brand-frame` and `.brand-img` in `app.css`.

---

## Hidden Routes

| Route | Purpose | Visibility |
|-------|---------|------------|
| `/prelander/ibs` | Paid traffic landing page | No nav, noindex |
| `/quiz/ibs` | Full symptom quiz | No nav, noindex |
| `/shop/all` | All products from Shopify | Nav linked |

`robots.txt` blocks `/prelander/` and `/quiz/`.

---

## Troubleshooting

### Build fails with "Cannot find module"

Run `npm run prepare` to sync SvelteKit aliases and types.

### Shopify data not loading

Check that `.env` contains valid credentials and that the Storefront API token has `unauthenticated_read_product_listings` permission.

### Fonts not loading

Sawton Circular is self-hosted in `static/fonts/`. If you see system fonts instead, verify the `@font-face` declarations in `src/app.css` and ensure the woff2 files are present in the build output.

### Wrangler deploy fails

Ensure you're logged in:

```bash
npx wrangler login
npx wrangler whoami
```

### Pre-lander footer looks wrong

The prelander page strips layout padding via `:global(main:has(.prelander-page)) { padding: 0; }`. If the layout changes, this selector may need updating.

---

## Contributing

1. **Branch from `main`** — use descriptive branch names (`fix/ticker-animation`, `feat/quiz-scoring`)
2. **Run checks before pushing** — `npm run check` must pass
3. **Never commit `.env`** — it is gitignored for a reason
4. **Use the MCP servers** when unsure — Svelte MCP for runes/components, Shopify Dev MCP for GraphQL queries, Context7 for other libraries
5. **Debug by docs first** — the cost of a doc lookup is always lower than a subtle bug that takes hours to trace

---

## License

© 2026 Copables Ltd. All rights reserved.
