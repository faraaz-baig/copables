# Ecom Store (Health/Wellness)

**Stack:** SvelteKit + Shopify Storefront API  
**Hosting:** Cloudflare Pages

## MCP Servers

You have access to three MCP servers. Use them instead of guessing.
- **Svelte MCP**: for anything Svelte 5 or SvelteKit. Try your own knowledge plus the `svelte-autofixer` tool first, then call `get-documentation` for sections you're unsure about (it's token-intensive, so be selective). Always run the autofixer on `.svelte`, `.svelte.ts`, and `.svelte.js` code you generate before finalizing.
- **Shopify Dev MCP**: validate every Storefront API GraphQL query against the live schema before writing the fetch code.
- **Context7**: for any other library you're unsure about, append "use context7".
Never guess at field names, runes syntax, or API shapes.

## Debugging Rule — No Raw-Dogging It

**Whenever something is not working as expected, consult the relevant docs before attempting a fix.**

- Something broken in a `.svelte` file, a Svelte 5 rune, CSS scoping, SSR/hydration, or SvelteKit routing → call `mcp__svelte__get-documentation` or `mcp__svelte__svelte-autofixer` first. Do not guess at how Svelte handles it.
- Something broken in a Shopify Storefront API query, a GraphQL field, or a checkout/cart flow → validate against the Shopify Dev MCP schema before changing anything.
- Something broken in any other library (Cloudflare, analytics, etc.) → use Context7.

This rule exists because past bugs — including Svelte tree-shaking dynamically-added CSS classes and CSS variable cascade failures during SSR — were caused by assuming behaviour rather than checking the docs. The cost of a doc lookup is always lower than the cost of a subtle bug that takes hours to trace.

## Architecture

SvelteKit owns pages, routing, and SSR. Shopify owns products, cart, checkout, orders, payments. SvelteKit never handles money or cart state.

- Product data fetched server-side from Shopify Storefront API in `+page.server.ts` load functions.
- User clicks product → redirected to Shopify product URL.
- Shopify handles everything from that point.

## Key Directories

- `src/routes/` — SvelteKit pages
- `src/lib/` — shared code (shopify, analytics, experiments, scoring, stores)
- `src/components/` — Svelte components

## Environment Variables

```
SHOPIFY_DOMAIN=yourstore.myshopify.com
SHOPIFY_STOREFRONT_TOKEN=your-public-storefront-token
```

Never expose `SHOPIFY_STOREFRONT_TOKEN` to the browser. Always call Shopify from `+page.server.ts` load functions.

## Hidden Routes

`/prelander/` and `/quiz/` are excluded from `robots.txt` and sitemap. No nav links. Traffic arrives via paid ads and email only.

## Analytics

Single `track()` wrapper in `src/lib/analytics.ts` fires to PostHog and GTM. Attach A/B test variant to every track call.

## A/B Testing

`getVariant()` in `src/lib/experiments.ts` assigns variant client-side, stores in localStorage, consistent per user.
