<script lang="ts">
	import ProductPage from '$components/ProductPage.svelte';
	import { CONDITIONS } from '$lib/products';
</script>

<ProductPage condition={CONDITIONS.ibs} />
