<script>
	let { active = '' } = $props();

	let protocolsOpen = $state(false);

	const navProtocols = [
		{ title: 'View All Protocols', sub: 'All five conditions', href: '/shop/all' },
		{ title: 'Low Mood', sub: 'Depression & mood', href: '/shop/low-mood' },
		{ title: 'IBS', sub: 'Irritable bowel', href: '/shop/ibs' },
		{ title: 'Anxiety', sub: 'State & test anxiety', href: '/shop/anxiety' },
		{ title: 'PMS', sub: 'Pre-menstrual symptoms', href: '/shop/pms' },
		{ title: 'Fatigue', sub: 'Chronic fatigue', href: '/shop/fatigue' }
	];
</script>

<header class="nav">
	<a class="nav__logo" href="/"><img src="/assets/wordmark.png" alt="copables" /></a>
	<nav class="nav__links">
		<div
			class="nav__drop-wrap"
			onmouseenter={() => (protocolsOpen = true)}
			onmouseleave={() => (protocolsOpen = false)}
			onfocusin={() => (protocolsOpen = true)}
			onfocusout={() => (protocolsOpen = false)}
			role="presentation"
		>
			<a class="nav__drop-trigger" href="/shop/all">
				Shop
				<svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
					<path d="M2 3.5L5 6.5L8 3.5" stroke="#000" stroke-width="1.5" stroke-linecap="round"/>
				</svg>
			</a>
			{#if protocolsOpen}
				<div class="nav__drop">
					{#each navProtocols as p (p.title)}
						<a href={p.href}>
							<div class="t">{p.title}</div>
							<div class="s">{p.sub}</div>
						</a>
					{/each}
				</div>
			{/if}
		</div>
		<a class:active={active === 'science'} href="/science">The Science</a>
		<a class:active={active === 'blog'} href="/blog">Our Blog</a>
	</nav>
	<div class="nav__cta">
		<a href="/quiz/ibs">Start Free Assessment →</a>
	</div>
</header>

<style>
	.nav {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 40;
		padding: 20px 64px;
		background: rgba(255, 246, 239, 0.88);
		-webkit-backdrop-filter: saturate(160%) blur(12px);
		backdrop-filter: saturate(160%) blur(12px);
		border-bottom: 1px solid rgba(0, 0, 0, 0.12);
		display: flex;
		align-items: center;
		gap: 56px;
		font-family: var(--ff);
	}
	.nav__logo {
		display: flex;
		align-items: center;
	}
	.nav__logo img {
		height: 22px;
		width: auto;
		display: block;
	}
	.nav__links {
		display: flex;
		gap: 48px;
		font-size: 14px;
		font-weight: 600;
		letter-spacing: -0.005em;
		margin-left: 48px;
		align-items: center;
	}
	.nav__links a {
		color: #000;
		text-decoration: none;
		border-bottom: 2px solid transparent;
		padding-bottom: 2px;
	}
	.nav__links a:hover {
		opacity: 0.78;
	}
	.nav__links a.active {
		border-bottom-color: #000;
	}
	.nav__drop-wrap {
		position: relative;
	}
	.nav__drop-trigger {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.nav__drop {
		position: absolute;
		top: 100%;
		left: -16px;
		margin-top: 8px;
		min-width: 240px;
		background: #FFF6EF;
		border: 1.5px solid #000;
		border-radius: 10px;
		padding: 8px;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
	}
	.nav__drop a {
		display: block;
		padding: 10px 12px;
		border-radius: 6px;
		text-decoration: none;
		color: #000;
		border-bottom: none;
	}
	.nav__drop a:hover {
		background: rgba(0, 0, 0, 0.05);
		opacity: 1;
	}
	.nav__drop .t {
		font-weight: 700;
		font-size: 14px;
	}
	.nav__drop .s {
		font-size: 12px;
		font-weight: 300;
		opacity: 0.7;
		margin-top: 2px;
	}
	.nav__cta {
		margin-left: auto;
	}
	.nav__cta a {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 11px 20px;
		border-radius: 999px;
		background: #F2901E;
		color: #14130F;
		font-size: 14px;
		font-weight: 800;
		letter-spacing: -0.01em;
		text-decoration: none;
		white-space: nowrap;
		line-height: 1;
		box-shadow: 0 6px 0 #D9760A;
		transition: transform .14s ease, box-shadow .2s ease;
	}
	.nav__cta a:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 0 #D9760A;
	}
	.nav__cta a:active {
		transform: translateY(2px);
		box-shadow: 0 3px 0 #D9760A;
	}

	@media (max-width: 1024px) {
		.nav {
			padding: 16px 40px;
		}
	}
	@media (max-width: 900px) {
		.nav {
			padding: 14px 32px;
			gap: 16px;
		}
		.nav__links {
			display: none;
		}
	}
	@media (max-width: 540px) {
		.nav {
			padding: 12px 20px;
		}
	}
</style>
