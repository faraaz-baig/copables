import adapter from '@sveltejs/adapter-cloudflare';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter(),
		alias: {
			$components: resolve('./src/components')
		},
		// Inline small per-page stylesheets into the HTML <head> to drop a
		// render-blocking request; larger CSS stays external + cacheable.
		inlineStyleThreshold: 1024,
		prerender: {
			// Prerender every real (non-dynamic) route, but don't crawl <a> links:
			// some funnel routes (per-condition quizzes like /quiz/anxiety) aren't
			// built yet, and following those dead links would fail the build.
			crawl: false
		}
	}
};

export default config;
