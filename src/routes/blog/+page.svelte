<script>
	const posts = [
		{
			slug: 'can-honest-placebos-really-work',
			title: 'Can honest placebos really work?',
			cardTitle: 'Honest placebos',
			readTime: '5 min read',
			excerpt: 'Why taking a placebo you know is fake can still trigger real biological change and what that reveals about the brain–body connection.',
			bg: '#55A8FA', fg: '#0A2747'
		},
		{
			slug: 'why-do-honest-placebos-work',
			title: 'Inside the paradox: why belief without deception is reshaping healthcare.',
			cardTitle: 'Why do honest placebos work?',
			readTime: '5 min read',
			excerpt: "Inside the paradox: how transparency doesn't cancel the effect but strengthens it, and why belief without deception is reshaping healthcare.",
			bg: '#F0BE38', fg: '#4A2E00'
		},
		{
			slug: 'unstuck-your-brain',
			title: 'How to unstuck your brain from harmful, painful feedback loops',
			cardTitle: 'Stop negative feedback loops',
			readTime: '3 min read',
			excerpt: "Learn how CBT and placebo rituals interrupt the body's stress cycles and teach your nervous system to reset instead of react.",
			bg: '#F2B5D4', fg: '#5A1D3A'
		}
	];
</script>

<svelte:head>
	<title>Blog — Copables</title>
	<meta name="description" content="Learn more about placebos, Copables and modern health." />
</svelte:head>

<div class="blog">
	<!-- ── Hero ─────────────────────────────────────────────── -->
	<section class="blog-hero">
		<div class="blog-inner blog-hero__inner">
			<div class="blog-hero__kicker">Blog</div>
			<h1 class="blog-hero__h1">Learn More About Placebos,<br/>Copables and Modern Health</h1>
			<p class="blog-hero__sub">Honest, research-backed reads on why placebos work, how CBT rewires stress, and what modern neuroscience says about healing.</p>
		</div>
	</section>

	<!-- ── Post Grid ────────────────────────────────────────── -->
	<section class="blog-sec">
		<div class="blog-inner">
			<div class="blog-grid">
				{#each posts as p (p.slug)}
					<article class="blog-card" style="background: {p.bg}; color: {p.fg}">
						<div class="blog-card__top">
							<span class="blog-card__badge">{p.readTime}</span>
							<h2 class="blog-card__title">{p.cardTitle}</h2>
						</div>
						<div class="blog-card__body">
							<p class="blog-card__excerpt">{p.excerpt}</p>
							<a href="/blog/{p.slug}" class="blog-card__link">
								Read post <span class="arr">→</span>
							</a>
						</div>
					</article>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Footer ─────────────────────────────────────────────── -->
	<footer class="blog-foot">
		<div class="blog-inner">
			<div class="blog-foot__grid">
				<div>
					<img class="blog-foot__logo" src="/assets/wordmark.png" alt="copables" />
					<p class="blog-foot__blurb">Where belief meets behavior. 14 days to a brighter, healthier you. Mind over medicine.</p>
				</div>
				<div>
					<div class="blog-foot__h">Protocols</div>
					<div class="blog-foot__link"><a href="/shop/low-mood">Low Mood</a></div>
					<div class="blog-foot__link"><a href="/shop/ibs">IBS</a></div>
					<div class="blog-foot__link"><a href="/shop/anxiety">Anxiety</a></div>
					<div class="blog-foot__link"><a href="/shop/pms">PMS</a></div>
					<div class="blog-foot__link"><a href="/shop/fatigue">Fatigue</a></div>
				</div>
				<div>
					<div class="blog-foot__h">Company</div>
					<div class="blog-foot__link"><a href="/science">The Science</a></div>
					<div class="blog-foot__link"><a href="/blog">Our Blog</a></div>
					<div class="blog-foot__link"><a href="/">Home</a></div>
				</div>
				<div>
					<div class="blog-foot__h">Legal</div>
					<div class="blog-foot__link"><a href="https://www.copables.com/terms" target="_blank" rel="noopener noreferrer">Terms</a></div>
					<div class="blog-foot__link"><a href="https://www.copables.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a></div>
					<div class="blog-foot__link"><a href="https://www.copables.com/eula" target="_blank" rel="noopener noreferrer">Cookies</a></div>
				</div>
			</div>
			<div class="blog-foot__bottom">
				<span>© 2026 Copables Ltd. All rights reserved.</span>
				<span>Mind over medicine.</span>
			</div>
		</div>
	</footer>
</div>

<style>
	.blog { background: #FFFDF7; color: #000; font-family: var(--ff); }
	.blog :global(*) { box-sizing: border-box; }
	.blog-inner { max-width: 1160px; margin: 0 auto; }

	/* ── Hero ─────────────────────────────────────────────── */
	.blog-hero {
		border-bottom: 3px solid #000;
		padding: 120px 48px;
	}
	.blog-hero__kicker {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #DE541E;
		margin-bottom: 24px;
	}
	.blog-hero__h1 {
		font-size: clamp(42px, 5.5vw, 72px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.02;
		margin: 0;
		max-width: 900px;
	}
	.blog-hero__sub {
		font-size: 19px;
		font-weight: 300;
		line-height: 1.55;
		color: #1B1C1C;
		max-width: 560px;
		margin-top: 24px;
	}

	/* ── Post Grid ────────────────────────────────────────── */
	.blog-sec {
		border-bottom: 3px solid #000;
		padding: 120px 48px;
	}
	.blog-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 18px;
	}
	.blog-card {
		border: 2px solid #000;
		border-radius: 14px;
		padding: 32px 28px 28px;
		display: flex;
		flex-direction: column;
		gap: 28px;
		box-shadow: 8px 8px 0 0 rgba(0,0,0,0.14);
		min-height: 420px;
	}
	.blog-card__top {
		display: flex;
		flex-direction: column;
		gap: 18px;
		flex: 1;
	}
	.blog-card__badge {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		background: rgba(255,255,255,0.25);
		padding: 8px 14px;
		border-radius: 999px;
		align-self: flex-start;
		border: 1.5px solid currentColor;
	}
	.blog-card__title {
		font-size: clamp(28px, 3vw, 40px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.08;
		margin: 0;
	}
	.blog-card__excerpt {
		font-size: 16px;
		font-weight: 300;
		line-height: 1.55;
		margin: 0;
		opacity: 0.92;
	}
	.blog-card__link {
		font-size: 14px;
		font-weight: 700;
		color: inherit;
		text-decoration: none;
		border-bottom: 1.5px solid currentColor;
		padding-bottom: 2px;
		align-self: flex-start;
		display: inline-flex;
		align-items: center;
		gap: 8px;
	}
	.blog-card__link:hover { opacity: 0.75; }
	.blog-card__link .arr { font-size: 15px; transition: transform 0.15s; }
	.blog-card__link:hover .arr { transform: translateX(3px); }

	/* ── Footer ─────────────────────────────────────────────── */
	.blog-foot {
		padding: 80px 48px 40px;
		background: #000;
		color: #fff;
	}
	.blog-foot__grid {
		display: grid;
		grid-template-columns: 1.4fr 1fr 1fr 1fr;
		gap: 48px;
		padding-bottom: 48px;
		border-bottom: 1px solid rgba(255,255,255,0.2);
	}
	.blog-foot__logo {
		height: 26px;
		width: auto;
		filter: invert(1) brightness(1.7);
	}
	.blog-foot__blurb {
		margin-top: 20px;
		font-size: 16px;
		line-height: 1.5;
		font-weight: 300;
		max-width: 320px;
		color: rgba(255,255,255,0.72);
	}
	.blog-foot__h {
		font-size: 11px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		font-weight: 700;
		color: rgba(255,255,255,0.5);
		margin-bottom: 16px;
	}
	.blog-foot__link {
		margin-top: 10px;
	}
	.blog-foot__link a {
		font-size: 15px;
		font-weight: 500;
		color: #fff;
		text-decoration: none;
	}
	.blog-foot__link a:hover { opacity: 0.78; }
	.blog-foot__bottom {
		padding-top: 28px;
		display: flex;
		justify-content: space-between;
		gap: 16px;
		font-size: 12px;
		color: rgba(255,255,255,0.5);
		letter-spacing: 0.04em;
	}

	/* ── Responsive ───────────────────────────────────────── */
	@media (max-width: 1024px) {
		.blog-hero { padding: 96px 40px; }
		.blog-sec { padding: 96px 40px; }
		.blog-foot { padding: 72px 40px 36px; }
		.blog-grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (max-width: 900px) {
		.blog-hero { padding: 80px 32px; }
		.blog-sec { padding: 80px 32px; }
		.blog-foot { padding: 64px 32px 32px; }
		.blog-grid { grid-template-columns: 1fr; }
		.blog-foot__grid { grid-template-columns: 1fr 1fr; gap: 32px; }
		.blog-foot__bottom { flex-direction: column; gap: 8px; }
	}
	@media (max-width: 540px) {
		.blog-hero { padding: 64px 20px; }
		.blog-sec { padding: 64px 20px; }
		.blog-foot { padding: 48px 20px 28px; }
		.blog-hero__h1 { font-size: clamp(36px, 9vw, 48px); }
		.blog-card { min-height: auto; padding: 28px 22px; }
		.blog-foot__grid { grid-template-columns: 1fr; }
	}
</style>
