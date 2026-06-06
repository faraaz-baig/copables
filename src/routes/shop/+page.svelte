<h1>Shop</h1>
<ul class="shop-links">
	<li><a href="/shop/all">All Products</a></li>
	<li><a href="/shop/ibs">IBS</a></li>
	<li><a href="/shop/anxiety">Anxiety</a></li>
	<li><a href="/shop/pms">PMS</a></li>
	<li><a href="/shop/fatigue">Fatigue</a></li>
	<li><a href="/shop/low-mood">Low Mood</a></li>
</ul>

<style>
	:scope {
		max-width: 1160px;
		margin: 0 auto;
	}
	h1 {
		font-size: clamp(2rem, 5vw, 3.5rem);
		letter-spacing: -0.02em;
	}
	.shop-links {
		list-style: none;
		padding: 0;
		margin-top: 2rem;
	}
	.shop-links li {
		margin-bottom: 0.75rem;
	}
	.shop-links a {
		display: block;
		padding: 1rem 1.25rem;
		border-radius: 12px;
		text-decoration: none;
		color: #111;
		font-weight: 500;
		font-size: 1.1rem;
		border: 1.5px solid rgba(20,19,15,.12);
		transition: all 0.2s;
	}
	.shop-links a:hover {
		background: rgba(20,19,15,.04);
		box-shadow: 0 4px 16px rgba(0,0,0,0.06);
	}
	@media (max-width: 540px) {
		.shop-links a { padding: 0.875rem 1rem; }
	}
</style>
