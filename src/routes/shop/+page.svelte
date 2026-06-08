<script lang="ts">
	import { CONDITIONS } from '$lib/products';

	// Build card data from the canonical CONDITIONS map so every card
	// stays in sync with the individual product pages.
	const all = CONDITIONS['low-mood'];   // N°1
	const ibs = CONDITIONS.ibs;             // N°2
	const anxiety = CONDITIONS.anxiety;     // N°3
	const pms = CONDITIONS.pms;             // N°4
	const fatigue = CONDITIONS.fatigue;     // N°5

	const protocols = [
		{ ...all,    handle: 'low-mood', slug: '/shop/low-mood', bottle: '/assets/bottle.png', desc: 'Rebuild the “things can get better” expectation that low mood erodes. Most members feel small lifts stack up across the first two weeks.' },
		{ ...ibs,    handle: 'ibs',      slug: '/shop/ibs',      bottle: '/assets/bottle.png', desc: 'Calms the gut–brain conversation that drives cramping, bloating and urgency. Most members feel the loop loosen inside the first two weeks.' },
		{ ...anxiety, handle: 'anxiety',  slug: '/shop/anxiety',  bottle: '/assets/bottle.png', desc: 'Settles the body’s alarm so the racing-thoughts loop has less to feed on. Most members feel their baseline drop inside the first two weeks.' },
		{ ...pms,    handle: 'pms',      slug: '/shop/pms',      bottle: '/assets/bottle.png', desc: 'Eases the mood, cramping and irritability that crest in the luteal phase. Run it across the back half of your cycle, when symptoms peak.' },
		{ ...fatigue, handle: 'fatigue',  slug: '/shop/fatigue',  bottle: '/assets/bottle.png', desc: 'A nervous-system reset for the energy regulation fatigue throws off. Most members feel steadier energy build across the first two weeks.' }
	];

</script>

<svelte:head>
	<title>copables — Shop Protocols</title>
	<meta name="description" content="Browse the Copables 14-day protocols: IBS, Anxiety, PMS, Fatigue and Low Mood. Open-label placebo treatments backed by research." />
</svelte:head>

<div class="shop-root">
	<div class="wrap">
		<h1 class="shop-head">Choose your protocol</h1>
		<p class="shop-sub">Five evidence-based, 14-day open-label placebo programmes — each built on published research and backed by a 90-day guarantee.</p>

		<div class="grid">
			<!-- Individual protocol cards -->
			{#each protocols as p (p.handle)}
				<a class="pcard" href={p.slug} style="--c:{p.accent}; --c-deep:{p.accentDeep}; --c-tint:{p.accentTint}">
					<div class="pcard__media">
						<span class="pcard__badge">{p.no}</span>
						<img src={p.bottle} alt="{p.title} — 30 gummies" loading="lazy" decoding="async" />
					</div>
					<div class="pcard__body">
						<span class="pcard__cat">{p.cat}</span>
						<h2>{p.title}</h2>
						<p>{p.desc}</p>
					<div class="pcard__foot">
						<div class="pcard__rating">
							<div class="pcard__rating__top">
								<span class="stars">★★★★★</span>
								<span class="rating">{p.rating}</span>
							</div>
							<span class="reviews">{p.reviewCount}</span>
						</div>
						<span class="pcard__arrow" aria-hidden="true">→</span>
					</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</div>

<style>
	.shop-root {
		background: var(--paper);
		color: var(--ink);
		font-family: var(--ff);
		padding: clamp(48px, 7vw, 96px) 0;
		min-height: 100vh;
	}
	.wrap {
		width: 100%;
		max-width: var(--maxw-home, 1180px);
		margin: 0 auto;
		padding: 0 24px;
	}

	.shop-head {
		font-size: clamp(2.2rem, 5.5vw, 3.8rem);
		font-weight: 800;
		letter-spacing: -0.035em;
		line-height: 1.0;
		margin: 0;
	}
	.shop-sub {
		font-size: clamp(15px, 1.4vw, 18px);
		color: var(--ink-soft);
		max-width: 60ch;
		margin: 14px 0 0;
		line-height: 1.5;
		font-weight: 600;
	}

	/* ── Grid ─────────────────────────────────────────────── */
	.grid {
		display: grid;
		gap: 22px;
		margin-top: 40px;
	}
	@media (min-width: 680px) {
		.grid { grid-template-columns: repeat(2, 1fr); }
	}
	@media (min-width: 1020px) {
		.grid { grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 48px; }
	}

	/* ── Card base ────────────────────────────────────────── */
	.pcard {
		display: flex;
		flex-direction: column;
		background: var(--card);
		border: var(--frame-bw) solid var(--frame-ink);
		border-radius: var(--frame-radius-lg);
		overflow: hidden;
		box-shadow: var(--frame-shadow);
		text-decoration: none;
		color: inherit;
		transition: transform 0.16s ease, box-shadow 0.2s ease;
	}
	.pcard:hover {
		transform: translateY(-5px);
		box-shadow: var(--frame-shadow-hover);
	}

	/* ── Protocol cards ───────────────────────────────────── */
	.pcard__media {
		position: relative;
		aspect-ratio: 16/11;
		background: var(--c-tint);
		overflow: hidden;
		border-bottom: var(--frame-bw) solid var(--frame-ink);
	}
	.pcard__media img {
		width: 100%;
		height: 100%;
		object-fit: contain;
		padding: 18px 28px 28px;
		display: block;
	}
	.pcard__badge {
		position: absolute;
		top: 14px;
		left: 14px;
		z-index: 2;
		background: var(--c);
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		padding: 6px 12px;
		border-radius: 999px;
	}
	.pcard__body {
		padding: 20px 22px 22px;
		display: flex;
		flex-direction: column;
		flex: 1 1 auto;
	}
	.pcard__cat {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--c-deep);
		margin-bottom: 6px;
	}
	.pcard__body h2 {
		font-size: 22px;
		font-weight: 800;
		letter-spacing: -0.025em;
		line-height: 1.05;
		margin: 0 0 10px;
	}
	.pcard__body p {
		font-size: 14px;
		color: var(--ink-soft);
		line-height: 1.5;
		margin: 0 0 0;
		font-weight: 600;
	}
	.pcard__foot {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-top: auto;
		border-top: 1px solid var(--line-2);
		padding-top: 14px;
	}
	.pcard__rating {
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.pcard__rating__top {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.pcard__arrow {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--ink);
		color: var(--paper);
		display: grid;
		place-items: center;
		font-size: 16px;
		font-weight: 800;
		flex: none;
		transition: transform 0.15s ease, background 0.15s ease;
	}
	.pcard:hover .pcard__arrow {
		transform: translateX(3px);
		background: var(--c);
	}

	/* ── Shared micro-elements ──────────────────────────────── */
	.stars {
		color: var(--orange);
		letter-spacing: 2px;
		font-size: 15px;
	}
	.rating {
		font-size: 13px;
		font-weight: 800;
		color: var(--ink);
	}
	.reviews {
		font-size: 12px;
		font-weight: 700;
		color: var(--ink-soft);
	}
</style>
