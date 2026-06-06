<script lang="ts">
	import ProductCard from '$components/ProductCard.svelte';

	let { data } = $props();
</script>

<h1>Anxiety Support</h1>

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
