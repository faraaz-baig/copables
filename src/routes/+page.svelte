<script lang="ts">
	import { track } from '$lib/analytics';

	function trackShop() {
		track('page_view', { page: '/shop' });
	}
</script>

<h1>Feel better, naturally.</h1>
<p>Science-backed supplements for everyday wellness.</p>

<div class="categories">
	<a href="/shop/ibs" onclick={trackShop}>IBS Relief</a>
	<a href="/shop/anxiety" onclick={trackShop}>Anxiety Support</a>
	<a href="/shop/pms" onclick={trackShop}>PMS Support</a>
	<a href="/shop/fatigue" onclick={trackShop}>Energy & Fatigue</a>
	<a href="/shop/low-mood" onclick={trackShop}>Low Mood</a>
</div>

<style>
	:scope {
		max-width: 1160px;
		margin: 0 auto;
	}
	h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		margin-bottom: 0.5rem;
		letter-spacing: -0.02em;
	}
	p {
		font-size: clamp(1rem, 2vw, 1.25rem);
		color: #544F43;
		line-height: 1.5;
	}
	.categories {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
		gap: 1.25rem;
		margin-top: 2.5rem;
	}
	.categories a {
		display: block;
		padding: 2.5rem 2rem;
		border: 1.5px solid rgba(20,19,15,.12);
		border-radius: 16px;
		text-align: center;
		text-decoration: none;
		color: #111;
		font-weight: 600;
		font-size: 1.1rem;
		transition: box-shadow 0.2s, transform 0.15s;
	}
	.categories a:hover {
		box-shadow: 0 8px 24px rgba(0,0,0,0.08);
		transform: translateY(-2px);
	}
	@media (max-width: 540px) {
		.categories a { padding: 2rem 1.5rem; }
	}
</style>
