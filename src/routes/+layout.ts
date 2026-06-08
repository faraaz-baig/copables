// Prerender the whole site to static HTML by default — these are marketing
// pages with no request-time data, so they should be served straight from the
// CDN edge with zero compute. Routes that need live data (the Shopify-backed
// /shop/all, the dynamic blog slug) opt out with `prerender = false`.
export const prerender = true;
