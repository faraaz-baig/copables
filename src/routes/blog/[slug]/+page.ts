// Dynamic slug route — resolved per request, so don't prerender it. (Pages
// linked here are still discovered/crawled from the prerendered blog index.)
export const prerender = false;

export const load = ({ params }) => ({ slug: params.slug });
