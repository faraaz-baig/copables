<script lang="ts">
	import ProductCard from '$components/ProductCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>All Products — Copables Open-Label Placebo Protocols</title>
	<meta name="description" content="Browse all Copables protocols and products. Evidence-based 14-day programmes for IBS, anxiety, low mood, PMS and fatigue." />
	<meta property="og:title" content="All Products — Copables" />
	<meta property="og:description" content="Browse all Copables protocols and products." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta name="twitter:title" content="All Products — Copables" />
	<meta name="twitter:description" content="Browse all Copables protocols and products." />
	<meta name="twitter:image" content="https://copables.com/assets/lineup.webp" />
</svelte:head>

<h1>All Products</h1>

<div class="product-grid">
	{#each data.products as product}
		<ProductCard {product} />
	{/each}
</div>

<style>
	:scope {
		max-width: 1160px;
		margin: 0 auto;
	}
	.product-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
		gap: 1.75rem;
		margin-top: 2rem;
	}
	@media (max-width: 540px) {
		.product-grid {
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			gap: 1rem;
		}
	}
</style>
