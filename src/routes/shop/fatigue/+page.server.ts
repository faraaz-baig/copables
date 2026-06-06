import { getProductsByCollection } from '$lib/shopify';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await getProductsByCollection('fatigue');
	return { products };
};
