<script>
	import Disclaimer from './Disclaimer.svelte';
</script>

<footer class="site-foot">
	<div class="site-foot__inner">
		<div class="site-foot__grid">
			<div class="site-foot__brand">
				<img src="/assets/wordmark.webp" alt="copables" />
				<p>Where belief meets behavior. 14 days to a brighter, healthier you.</p>
			</div>
			<div class="site-foot__col">
				<h4>Protocols</h4>
				<ul>
					<li><a href="/shop/low-mood">Low Mood</a></li>
					<li><a href="/shop/ibs">IBS</a></li>
					<li><a href="/shop/anxiety">Anxiety</a></li>
					<li><a href="/shop/pms">PMS</a></li>
					<li><a href="/shop/fatigue">Fatigue</a></li>
				</ul>
			</div>
			<div class="site-foot__col">
				<h4>Company</h4>
				<ul>
					<li><a href="/science">The Science</a></li>
					<li><a href="/blog">Our Blog</a></li>
					<li><a href="/">Home</a></li>
				</ul>
			</div>
			<div class="site-foot__col">
				<h4>Legal</h4>
				<ul>
					<li><a href="/terms">Terms</a></li>
					<li><a href="/privacy">Privacy</a></li>
					<li><a href="/cookies">Cookies</a></li>
				</ul>
			</div>
		</div>
		<div class="site-foot__disc">
			<Disclaimer />
		</div>
		<div class="site-foot__legal">
			<span>© 2026 Copables Ltd. All rights reserved.</span>
		</div>
	</div>
</footer>

<style>
	.site-foot {
		background: #000;
		color: rgba(255, 255, 255, 0.55);
		font-family: var(--ff, system-ui, sans-serif);
		padding: clamp(64px, 7vw, 96px) 0 clamp(28px, 3vw, 40px);
	}
	.site-foot__inner {
		width: 100%;
		max-width: 1160px;
		margin: 0 auto;
		padding: 0 24px;
	}
	.site-foot__grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1fr;
		gap: 40px 32px;
		padding-bottom: 48px;
		border-bottom: 1px solid rgba(255, 255, 255, 0.14);
	}
	@media (max-width: 820px) {
		.site-foot__grid {
			grid-template-columns: 1fr 1fr;
			gap: 36px 24px;
		}
	}
	@media (max-width: 480px) {
		.site-foot__grid {
			grid-template-columns: 1fr;
			gap: 28px;
		}
	}

	.site-foot__brand img {
		height: 26px;
		width: auto;
		filter: invert(1) brightness(1.7);
		display: block;
		margin-bottom: 16px;
	}
	.site-foot__brand p {
		font-size: 15px;
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.6);
		margin: 0;
		max-width: 28ch;
	}

	.site-foot__col h4 {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
		margin: 0 0 16px;
	}
	.site-foot__col ul {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.site-foot__col li + li { margin-top: 10px; }
	.site-foot__col a {
		font-size: 15px;
		font-weight: 500;
		color: #fff;
		text-decoration: none;
		transition: opacity 0.15s ease;
	}
	.site-foot__col a:hover { opacity: 0.7; }

	.site-foot__disc {
		margin-top: 28px;
		color: rgba(255, 255, 255, 0.45);
	}
	.site-foot__legal {
		margin-top: 28px;
		padding-top: 20px;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 12px;
		color: rgba(255, 255, 255, 0.4);
		letter-spacing: 0.04em;
	}
</style>
