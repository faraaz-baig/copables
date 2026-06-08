<script>
	let { active = '' } = $props();

	let protocolsOpen = $state(false);
	let menuOpen = $state(false);

	// Shop dropdown — colour-coded per condition (matches the protocol palette).
	const navProtocols = [
		{ title: 'Low Mood', sub: 'Depression & mood', href: '/shop/low-mood', ink: '#25548F', bg: '#DCE7F6' },
		{ title: 'IBS', sub: 'Irritable bowel', href: '/shop/ibs', ink: '#7E2230', bg: '#F0D9DD' },
		{ title: 'Anxiety', sub: 'State & test anxiety', href: '/shop/anxiety', ink: '#B23C29', bg: '#F6DDD5' },
		{ title: 'PMS', sub: 'Pre-menstrual symptoms', href: '/shop/pms', ink: '#AF3675', bg: '#F7DBE9' },
		{ title: 'Fatigue', sub: 'Chronic fatigue', href: '/shop/fatigue', ink: '#A86A09', bg: '#FAE6C6' }
	];

	const closeMenu = () => (menuOpen = false);
</script>

<header class="navbar">
	<div class="navbar__inner">
		<a class="nav__logo" href="/"><img src="/assets/wordmark.webp" alt="copables" /></a>

		<nav class="nav__links">
			<div
				class="nav__drop-wrap"
				onmouseenter={() => (protocolsOpen = true)}
				onmouseleave={() => (protocolsOpen = false)}
				onfocusin={() => (protocolsOpen = true)}
				onfocusout={() => (protocolsOpen = false)}
				role="presentation"
			>
				<button
					type="button"
					class="nav__link nav__drop-trigger"
					class:active={protocolsOpen}
					aria-haspopup="true"
					aria-expanded={protocolsOpen}
					onclick={() => (protocolsOpen = !protocolsOpen)}
				>
					Shop
					<svg width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true"><path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
				</button>
				{#if protocolsOpen}
					<div class="nav__drop">
						{#each navProtocols as p (p.title)}
							<a class="nav__drop-item" href={p.href} style="--dot:{p.ink}; --tint:{p.bg}">
								<span class="nav__drop-sw" aria-hidden="true"></span>
								<span class="nav__drop-txt"><span class="t">{p.title}</span><span class="s">{p.sub}</span></span>
								<span class="nav__drop-arr" aria-hidden="true">→</span>
							</a>
						{/each}
					</div>
				{/if}
			</div>
			<a class="nav__link" class:active={active === 'science'} href="/science">The Science</a>
			<a class="nav__link" class:active={active === 'blog'} href="/blog">Our Blog</a>
		</nav>

		<div class="nav__right">
			<button class="nav__burger" aria-label="Toggle menu" aria-expanded={menuOpen} onclick={() => (menuOpen = !menuOpen)}>
				<span></span><span></span><span></span>
			</button>
			<a class="nav__cta" href="/quiz/ibs">Start Free Assessment <span aria-hidden="true">→</span></a>
		</div>

		{#if menuOpen}
			<div class="nav__mobile" role="menu">
				<a href="/shop/all" onclick={closeMenu}>Shop</a>
				<a href="/science" onclick={closeMenu}>The Science</a>
				<a href="/blog" onclick={closeMenu}>Our Blog</a>
			</div>
		{/if}
	</div>
</header>

<style>
	/* full-width bar; content aligned to the page's max-width */
	.navbar {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 50;
		background: rgba(255, 246, 239, 0.9);
		-webkit-backdrop-filter: saturate(160%) blur(12px);
		backdrop-filter: saturate(160%) blur(12px);
		border-bottom: 1px solid rgba(20, 19, 15, 0.1);
		font-family: var(--ff);
	}
	.navbar__inner {
		position: relative;
		max-width: var(--maxw-home, 1180px);
		margin: 0 auto;
		padding: 15px 24px;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		gap: 20px;
	}

	.nav__logo { display: flex; align-items: center; justify-self: start; }
	.nav__logo img { height: 23px; width: auto; display: block; }

	/* ── links: plain text, centred in the bar ──────────────── */
	.nav__links { display: flex; align-items: center; gap: 32px; justify-self: center; }
	.nav__link {
		display: inline-flex;
		align-items: center;
		gap: 7px;
		font-family: var(--ff);
		font-size: 16px;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--ink);
		text-decoration: none;
		padding: 6px 2px;
		border: 0;
		background: transparent;
		cursor: pointer;
		white-space: nowrap;
		border-bottom: 2px solid transparent;
		transition: opacity 0.15s, border-color 0.15s;
	}
	.nav__link:hover { opacity: 0.6; }
	.nav__link.active { border-bottom-color: var(--ink); }

	.nav__drop-wrap { position: relative; }

	/* ── dropdown: brand framing + colour swatches ──────────── */
	.nav__drop {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 12px;
		min-width: 270px;
		background: rgba(255, 255, 255, 0.97);
		-webkit-backdrop-filter: blur(16px) saturate(1.4);
		backdrop-filter: blur(16px) saturate(1.4);
		border: var(--frame-bw, 2px) solid var(--frame-ink, #14130f);
		border-radius: var(--frame-radius, 18px);
		padding: 8px;
		box-shadow: var(--frame-shadow, 0 16px 40px rgba(20, 19, 15, 0.16));
	}
	/* invisible bridge so hover doesn't drop on the way down */
	.nav__drop::before { content: ''; position: absolute; top: -14px; left: 0; right: 0; height: 14px; }
	.nav__drop-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 12px; text-decoration: none; color: var(--ink); transition: background 0.15s; }
	.nav__drop-item:hover { background: var(--tint); }
	.nav__drop-sw { flex: none; width: 13px; height: 13px; border-radius: 4px; background: var(--dot); box-shadow: inset 0 0 0 1.5px rgba(255, 255, 255, 0.35), 0 0 0 1px rgba(20, 19, 15, 0.12); }
	.nav__drop-txt { display: flex; flex-direction: column; flex: 1; min-width: 0; }
	.nav__drop-txt .t { font-weight: 700; font-size: 14.5px; line-height: 1.15; }
	.nav__drop-item:hover .t { color: var(--dot); }
	.nav__drop-txt .s { font-size: 12px; font-weight: 400; color: var(--ink-soft); margin-top: 2px; }
	.nav__drop-arr { flex: none; font-size: 14px; font-weight: 800; color: var(--dot); opacity: 0; transform: translateX(-5px); transition: opacity 0.15s, transform 0.15s; }
	.nav__drop-item:hover .nav__drop-arr { opacity: 1; transform: none; }

	/* ── right cluster + CTA ────────────────────────────────── */
	.nav__right { justify-self: end; display: flex; align-items: center; gap: 10px; }
	.nav__cta {
		display: inline-flex; align-items: center; gap: 9px;
		padding: 13px 22px; border-radius: 999px;
		background: #f2901e; color: #fff;
		font-size: 15px; font-weight: 800; letter-spacing: -0.01em;
		text-decoration: none; white-space: nowrap; line-height: 1;
		box-shadow: 0 6px 0 #d9760a; transition: transform 0.14s ease, box-shadow 0.2s ease;
	}
	.nav__cta:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #d9760a; }
	.nav__cta:active { transform: translateY(2px); box-shadow: 0 3px 0 #d9760a; }

	/* hamburger (mobile) */
	.nav__burger { display: none; flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(20, 19, 15, 0.1); background: rgba(20, 19, 15, 0.04); cursor: pointer; align-items: center; justify-content: center; gap: 5px; flex-direction: column; }
	.nav__burger span { display: block; width: 19px; height: 2px; background: var(--ink); border-radius: 2px; }

	.nav__mobile {
		display: none; position: absolute; top: 100%; left: 24px; right: 24px; margin-top: 10px;
		background: rgba(255, 255, 255, 0.97); -webkit-backdrop-filter: blur(14px) saturate(1.3); backdrop-filter: blur(14px) saturate(1.3);
		border: var(--frame-bw, 2px) solid var(--frame-ink, #14130f); border-radius: var(--frame-radius, 16px); padding: 10px;
		box-shadow: var(--frame-shadow, 0 16px 40px rgba(20, 19, 15, 0.16));
	}
	.nav__mobile a { display: block; padding: 13px 16px; border-radius: 10px; font-size: 16px; font-weight: 700; color: var(--ink); text-decoration: none; }
	.nav__mobile a:hover { background: rgba(20, 19, 15, 0.05); }

	@media (max-width: 980px) {
		.nav__links { display: none; }
		.nav__burger { display: inline-flex; }
		.nav__mobile { display: block; }
	}
	@media (max-width: 540px) {
		.navbar__inner { padding: 12px 18px; }
		.nav__cta { padding: 11px 16px; font-size: 13.5px; }
	}
</style>
