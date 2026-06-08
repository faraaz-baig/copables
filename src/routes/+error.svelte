<script>
	import { page } from '$app/stores';
	import Disclaimer from '$components/Disclaimer.svelte';

	const is404 = $derived($page.status === 404);
</script>

<!-- chalk roughen filter -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"
	><defs
		><filter id="chalk" x="-20%" y="-20%" width="140%" height="140%"
			><feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" /><feDisplacementMap
				in="SourceGraphic"
				in2="n"
				scale="3.4"
				xChannelSelector="R"
				yChannelSelector="G"
			/></filter
		></defs
	></svg
>

<section class="err-hero" data-screen-label="Error">
	<div class="wrap">
		{#if is404}
			<!-- chalk illustration: detective pill bottle on the case -->
			<div class="err-art" aria-hidden="true">
				<svg viewBox="0 0 260 190" fill="none" xmlns="http://www.w3.org/2000/svg"
					><g filter="url(#chalk)" stroke="var(--ink)" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"
						><!-- detective hat -->
						<path d="M65 46 L145 46 L135 26 L75 26 Z" />
						<rect x="85" y="16" width="40" height="10" rx="3" />

						<!-- pill bottle body -->
						<rect x="70" y="52" width="70" height="90" rx="24" />

						<!-- label -->
						<line x1="70" y1="95" x2="140" y2="95" />

						<!-- eyes looking up-right -->
						<circle cx="95" cy="78" r="4" fill="var(--ink)" stroke="none" />
						<circle cx="117" cy="78" r="4" fill="var(--ink)" stroke="none" />

						<!-- raised eyebrows -->
						<path d="M90 68 Q95 64 100 68" />
						<path d="M112 68 Q117 64 122 68" />

						<!-- surprised O mouth -->
						<circle cx="106" cy="96" r="4.5" />

						<!-- left arm -->
						<path d="M70 82 Q52 92 48 110" />
						<!-- left hand -->
						<circle cx="46" cy="114" r="5" />

						<!-- right arm holding magnifying glass -->
						<path d="M140 82 Q158 100 168 120" />
						<!-- right hand -->
						<circle cx="170" cy="124" r="5" />

						<!-- magnifying glass -->
						<circle cx="190" cy="96" r="28" />
						<line x1="210" y1="116" x2="226" y2="132" />
						<!-- "404" inside the magnifying glass -->
						<path d="M178 88 L178 104 M178 88 L186 88 M178 96 L184 96 M186 88 L186 104" />
						<ellipse cx="192" cy="96" rx="4" ry="8" />
						<path d="M200 88 L200 104 M200 88 L206 88 M200 96 L206 96 M206 88 L206 104" />

						<!-- feet -->
						<ellipse cx="88" cy="148" rx="10" ry="6" />
						<ellipse cx="122" cy="148" rx="10" ry="6" />

						<!-- escaped pills -->
						<ellipse cx="36" cy="154" rx="10" ry="6" transform="rotate(-20 36 154)" />
						<ellipse cx="64" cy="166" rx="8" ry="5" transform="rotate(15 64 166)" />
						<ellipse cx="182" cy="158" rx="9" ry="5" transform="rotate(30 182 158)" />

						<!-- speech bubble "404" -->
						<path d="M150 40 C 180 30 200 50 190 70 C 185 78 170 80 160 75 L 152 82 L 154 72 C 145 68 140 55 150 40 Z" />
						<text x="158" y="62" font-family="var(--ff, sans-serif)" font-size="13" font-weight="700" fill="var(--ink)" stroke="none">404</text>

						<!-- motion / confusion lines -->
						<path d="M28 120 C 30 118 32 120 30 122" />
						<path d="M230 60 C 232 58 234 60 232 62" />
						<path d="M14 100 L18 96 M14 96 L18 100" />
						<path d="M242 108 L246 104 M242 104 L246 108" />
						<path d="M52 40 C 55 37 58 40 55 43" />
						<path d="M200 148 C 203 145 206 148 203 151" />
					></g
				></svg
			>
		</div>

			<h1 class="err-h1">
				We couldn't <span class="squig"
					>find<svg viewBox="0 0 200 12" preserveAspectRatio="none"
				><path
								d="M2 7 C 40 3, 80 11, 120 6 S 180 2, 198 7"
								filter="url(#chalk)"
							/></svg
					></span
				>
				this page.
			</h1>
			<p class="err-lead">
				Then again, we couldn't find the active ingredient either. Don't worry — it still works.
			</p>
		{:else}
			<h1 class="err-h1">Something went wrong.</h1>
			<p class="err-lead">{$page.error?.message || 'An unexpected error occurred.'}</p>
		{/if}

		<div class="err-actions">
			<a class="btn btn--primary btn--lg" href="/">Back to Home</a>
			<a class="btn btn--ghost btn--lg" href="/quiz/ibs">Take Free Assessment</a>
		</div>
	</div>
</section>

<footer class="home-foot" data-screen-label="Footer">
	<div class="wrap">
		<div class="home-foot__grid">
			<div class="home-foot__brand">
				<img src="/assets/wordmark.webp" alt="copables" />
				<p>Where belief meets behavior. 14 days to a brighter, healthier you.</p>
				<div class="socials">
					<span aria-label="Instagram">IG</span><span aria-label="X">X</span><span aria-label="TikTok">TT</span>
				</div>
			</div>
			<div class="fcol">
				<h4>Protocols</h4>
				<ul>
					<li><a href="/shop/low-mood">Low Mood</a></li>
					<li><a href="/shop/ibs">IBS</a></li>
					<li><a href="/shop/anxiety">Anxiety</a></li>
					<li><a href="/shop/pms">PMS</a></li>
					<li><a href="/shop/fatigue">Fatigue</a></li>
				</ul>
			</div>
			<div class="fcol">
				<h4>Company</h4>
				<ul>
					<li><a href="/science">The Science</a></li>
					<li><a href="/blog">Our Blog</a></li>
					<li><a href="/">Home</a></li>
				</ul>
			</div>
			<div class="fcol">
				<h4>Legal</h4>
				<ul>
					<li><a href="/terms">Terms</a></li>
					<li><a href="/privacy">Privacy</a></li>
					<li><a href="/cookies">Cookies</a></li>
				</ul>
			</div>
		</div>
		<div class="home-foot__disc"><Disclaimer /></div>
		<div class="home-foot__legal">
			<p>© 2026 Copables Ltd. All rights reserved.</p>
		</div>
	</div>
</footer>

<style>
	/* ── Layout ─────────────────────────────────────────── */
	.wrap {
		width: 100%;
		max-width: var(--maxw-home, 1160px);
		margin: 0 auto;
		padding: 0 24px;
	}

	/* ── Error hero ─────────────────────────────────────── */
	.err-hero {
		min-height: 70vh;
		display: grid;
		place-items: center;
		text-align: center;
		padding: clamp(64px, 10vh, 120px) 0 clamp(48px, 6vh, 80px);
	}
	.err-hero .wrap {
		max-width: 720px;
	}

	/* chalk doodle illustration */
	.err-art {
		width: clamp(160px, 26vw, 240px);
		height: auto;
		margin: 0 auto 28px;
		opacity: 0.9;
	}
	.err-art svg {
		width: 100%;
		height: auto;
		display: block;
		overflow: visible;
	}

	.err-h1 {
		font-size: clamp(32px, 5vw, 56px);
		font-weight: 800;
		letter-spacing: -0.035em;
		line-height: 1.05;
		margin: 0 auto 22px;
		max-width: 18ch;
	}
	.err-h1 .squig {
		position: relative;
		display: inline;
	}
	.err-h1 .squig svg {
		position: absolute;
		left: -6%;
		bottom: 2%;
		width: 112%;
		height: 0.38em;
		overflow: visible;
	}
	.err-h1 .squig path {
		fill: none;
		stroke: var(--orange);
		stroke-width: 4;
		stroke-linecap: round;
	}

	.err-lead {
		font-size: clamp(17px, 1.6vw, 20px);
		color: var(--ink-soft);
		max-width: 48ch;
		margin: 0 auto 36px;
		line-height: 1.55;
	}

	.err-actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 14px;
	}

	/* ── Buttons (scoped copy of global btn styles) ─────── */
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-weight: 700;
		font-size: 16px;
		letter-spacing: -0.01em;
		text-decoration: none;
		border-radius: 999px;
		padding: 14px 28px;
		border: none;
		cursor: pointer;
		transition: transform 0.12s ease, box-shadow 0.2s ease, background 0.2s ease;
		will-change: transform;
	}
	.btn:active { transform: translateY(2px); }

	.btn--primary {
		background: var(--accent);
		color: #fff;
		box-shadow: 0 6px 0 var(--accent-deep);
	}
	.btn--primary:hover {
		background: var(--accent-deep);
		box-shadow: 0 8px 0 var(--accent-deep);
		transform: translateY(-2px);
	}

	.btn--ghost {
		background: transparent;
		color: var(--ink);
		box-shadow: inset 0 0 0 2px var(--ink);
	}
	.btn--ghost:hover {
		background: var(--ink);
		color: var(--paper);
		transform: translateY(-2px);
	}

	.btn--lg { padding: 18px 32px; font-size: 17px; }

	/* ── Footer (matches homepage exactly) ───────────────── */
	.home-foot {
		background: var(--ink);
		color: rgba(251, 246, 234, 0.6);
		padding: clamp(56px, 8vw, 88px) 0 34px;
	}
	.home-foot__grid {
		display: grid;
		grid-template-columns: 1.5fr 1fr 1fr 1fr;
		gap: 40px 28px;
		padding-bottom: 48px;
		border-bottom: 1px solid rgba(251, 246, 234, 0.16);
	}
	@media (max-width: 820px) {
		.home-foot__grid { grid-template-columns: 1fr 1fr; gap: 36px 24px; }
	}
	.home-foot__brand img {
		height: 24px;
		filter: invert(1) brightness(1.7);
		margin-bottom: 16px;
	}
	.home-foot__brand p {
		font-size: 14px;
		color: rgba(251, 246, 234, 0.55);
		max-width: 30ch;
		margin: 0 0 18px;
		line-height: 1.5;
	}
	.home-foot__brand .socials {
		display: flex;
		gap: 10px;
	}
	.home-foot__brand .socials > * {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		display: grid;
		place-items: center;
		border: 1px solid rgba(251, 246, 234, 0.2);
		color: rgba(251, 246, 234, 0.7);
		text-decoration: none;
		font-weight: 800;
		font-size: 13px;
		transition: 0.15s;
		cursor: default;
	}
	.home-foot__brand .socials > *:hover {
		background: rgba(251, 246, 234, 0.1);
		color: #fff;
	}
	.fcol h4 {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(251, 246, 234, 0.45);
		margin: 0 0 16px;
	}
	.fcol ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 11px;
	}
	.fcol a {
		text-decoration: none;
		font-size: 14.5px;
		font-weight: 600;
		color: rgba(251, 246, 234, 0.78);
	}
	.fcol a:hover { color: #fff; }
	.home-foot__disc {
		margin-top: 36px;
		color: rgba(251, 246, 234, 0.5);
	}
	.home-foot__legal {
		padding-top: 28px;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 14px;
		font-size: 12px;
		line-height: 1.55;
		letter-spacing: 0.04em;
		color: rgba(251, 246, 234, 0.5);
	}
	.home-foot__legal p { margin: 0; max-width: 80ch; }
</style>
