<script lang="ts">
	import type { ShopifyProduct } from '$lib/shopify';

	interface Props {
		product: ShopifyProduct;
	}

	let { product }: Props = $props();

	let price = $derived(product.priceRange?.minVariantPrice?.amount ?? '');
	let currency = $derived(product.priceRange?.minVariantPrice?.currencyCode ?? '');
</script>

<a href={product.onlineStoreUrl} class="product-card" target="_blank" rel="noopener noreferrer">
	{#if product.featuredImage}
		<img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} loading="lazy" />
	{/if}
	<h3>{product.title}</h3>
	{#if price}
		<p class="price">{currency} {price}</p>
	{/if}
</a>

<style>
	.product-card {
		display: block;
		text-decoration: none;
		color: inherit;
		border: 1px solid #eee;
		border-radius: 8px;
		overflow: hidden;
		transition: box-shadow 0.2s;
	}
	.product-card:hover {
		box-shadow: 0 4px 12px rgba(0,0,0,0.08);
	}
	.product-card img {
		width: 100%;
		height: 200px;
		object-fit: cover;
		display: block;
	}
	.product-card h3 {
		margin: 0.75rem 1rem 0.25rem;
		font-size: 1rem;
	}
	.product-card .price {
		margin: 0 1rem 1rem;
		color: #555;
		font-weight: 500;
	}
</style>
