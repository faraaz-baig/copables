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
		}
	}
};

export default config;
