import { getProductsByCollection } from '$lib/shopify';
import type { PageServerLoad } from './$types';

// Pulls live inventory from Shopify at request time — keep it server-rendered.
export const prerender = false;

export const load: PageServerLoad = async () => {
	const products = await getProductsByCollection('all');
	return { products };
};
