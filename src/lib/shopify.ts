const SHOPIFY_DOMAIN = import.meta.env.SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = import.meta.env.SHOPIFY_STOREFRONT_TOKEN;
const SHOPIFY_ENDPOINT = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

export interface ShopifyProduct {
	id: string;
	title: string;
	handle: string;
	onlineStoreUrl: string;
	priceRange: {
		minVariantPrice: { amount: string; currencyCode: string };
	};
	featuredImage?: { url: string; altText?: string };
}

export async function getProductsByCollection(collectionHandle: string): Promise<ShopifyProduct[]> {
	const res = await fetch(SHOPIFY_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN
		},
		body: JSON.stringify({
			query: `{
				collection(handle: "${collectionHandle}") {
					products(first: 20) {
						edges {
							node {
								id
								title
								handle
								onlineStoreUrl
								priceRange {
									minVariantPrice { amount currencyCode }
								}
								featuredImage { url altText }
							}
						}
					}
				}
			}`
		})
	});

	if (!res.ok) {
		throw new Error(`Shopify API error: ${res.status} ${res.statusText}`);
	}

	const json = (await res.json()) as {
		data?: {
			collection?: {
				products?: {
					edges?: { node: ShopifyProduct }[];
				};
			};
		};
	};
	return json?.data?.collection?.products?.edges?.map((e) => e.node) ?? [];
}
