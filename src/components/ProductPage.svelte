<script lang="ts">
	import { track } from '$lib/analytics';
	import OlpChart from '$components/OlpChart.svelte';
	import { WHYWORKS, INSIDE, INCLUDED, EXPERT, SHARED_FAQS, CONDITIONS } from '$lib/products';
	import type { ProductCondition } from '$lib/products';

	interface Props {
		condition: ProductCondition;
		buyUrl?: string;
	}
	let { condition: c, buyUrl }: Props = $props();

	// "Buy now" goes to Shopify checkout. Placeholder per-product URL for now —
	// swap this for the real Shopify checkout / variant permalink later.
	let url = $derived(buyUrl ?? `https://copables.com/products/${c.handle}`);

	// ── offer ticker lines (condition-aware) ────────────────
	const TICKER = $derived([
		`<b>${c.offerMid}</b>`,
		`<b>${c.rating}</b> from ${c.reviewCount}`,
		`<b>Clinician-reviewed</b> protocol`,
		`<b>100% natural & vegan</b> gummies`,
		`<b>Honest open-label</b> placebo`,
		`<b>Free shipping</b> on every order`,
		`<b>90-day money-back</b> guarantee`
	]);

	// ── shared pricing tiers (same across protocols) ──────────
	const tiers = [
		{ qty: '1 Protocol', dur: '14 days · 30 gummies', once: 48, sub: 40.8, per: '$2.91 / day', tag: '' },
		{ qty: '2 Protocols', dur: '28 days · 60 gummies', once: 88, sub: 74.8, per: '$2.67 / day', tag: 'Most popular' },
		{ qty: '3 Protocols', dur: '42 days · 90 gummies', once: 120, sub: 102, per: '$2.43 / day', tag: 'Best value' }
	];
	const money = (n: number) => (n % 1 === 0 ? `$${n}` : `$${n.toFixed(2)}`);

	// ── interactive state ─────────────────────────────────────
	let mode = $state<'sub' | 'once'>('sub');
	let tierIdx = $state(1);
	let openTl = $state(0);
	let openFaq = $state(-1);
	let revFilter = $state('all');
	let revSearch = $state('');
	let mainIdx = $state(0);
	let showSticky = $state(false);

	let thumbs = $derived([c.bottle, '/assets/kit.webp', '/assets/lineup.webp']);
	let mainSrc = $derived(thumbs[mainIdx]);

	let curTier = $derived(tiers[tierIdx]);
	let curPrice = $derived(mode === 'sub' ? curTier.sub : curTier.once);

	let pairCards = $derived(c.pairs.map((h) => CONDITIONS[h]).filter(Boolean));
	let allFaqs = $derived([...c.faqs, ...SHARED_FAQS]);
	const ratingDist: [string, number][] = [['5 ★', 84], ['4 ★', 11], ['3 ★', 3], ['2 ★', 1], ['1 ★', 1]];
	const revChips: [string, string][] = [['all', 'All'], ['5', '★★★★★'], ['skeptic', 'Skeptics'], ['ritual', 'The ritual']];

	let filteredReviews = $derived(
		c.reviews.filter((r) => {
			const okF = revFilter === 'all' || r.tags.includes(revFilter);
			const q = revSearch.trim().toLowerCase();
			const okS = !q || `${r.title} ${r.body} ${r.name}`.toLowerCase().includes(q);
			return okF && okS;
		})
	);

	function galleryStep(dir: number) {
		const n = thumbs.length;
		mainIdx = (mainIdx + dir + n) % n;
	}

	function buy(label: string) {
		track('cta_click', { label, page: `product_${c.handle}`, mode, tier: curTier.qty });
	}

	// reveal-on-scroll + mobile sticky add bar
	$effect(() => {
		const io = new IntersectionObserver(
			(es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
			{ threshold: 0.1, rootMargin: '0px 0px -7% 0px' }
		);
		document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

		const hero = document.getElementById('buy');
		let stickyIO: IntersectionObserver | undefined;
		if (hero) {
			stickyIO = new IntersectionObserver(([e]) => (showSticky = !e.isIntersecting), { rootMargin: '-120px 0px 0px 0px' });
			stickyIO.observe(hero);
		}
		return () => {
			io.disconnect();
			stickyIO?.disconnect();
		};
	});

	// chalk illustrations for the "what's inside" grid, keyed by INSIDE[].ill
	const ILL: Record<string, string> = {
		check: '<circle cx="100" cy="100" r="62"/><path d="M70 100 l20 22 l44 -52"/>',
		wave: '<path d="M30 130 C 70 60, 110 60, 130 110 S 170 150, 180 90"/>',
		reset: '<path d="M150 60 A60 60 0 1 0 160 120"/><path d="M150 40 l4 26 l-26 -2"/>',
		axis: '<circle cx="100" cy="58" r="26"/><circle cx="100" cy="142" r="26"/><path d="M74 74 C 50 92, 50 116, 70 130"/><path d="M126 126 C 150 108, 150 84, 130 70"/>',
		cards: '<rect x="58" y="40" width="84" height="120" rx="12"/><path d="M78 78 h44 M78 104 h44 M78 130 h26"/>',
		app: '<circle cx="100" cy="100" r="20"/><circle cx="100" cy="100" r="44"/><circle cx="100" cy="100" r="68"/>'
	};
</script>

<svelte:head>
	<title>{c.metaTitle}</title>
	<meta name="description" content={c.metaDesc} />
	<meta property="og:title" content={c.metaTitle} />
	<meta property="og:description" content={c.metaDesc} />
	<meta property="og:type" content="product" />
	<meta property="og:url" content="https://copables.com/shop/{c.handle}" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta name="twitter:title" content={c.metaTitle} />
	<meta name="twitter:description" content={c.metaDesc} />
	<meta name="twitter:image" content="https://copables.com/assets/lineup.webp" />
	{@html `<script type="application/ld+json">{"@context":"https://schema.org","@type":"Product","name":"${c.title.replace(/"/g,'\\"')}","image":"https://copables.com/assets/lineup.webp","description":"${c.metaDesc.replace(/"/g,'\\"')}","brand":{"@type":"Brand","name":"Copables"},"offers":{"@type":"Offer","url":"https://copables.com/shop/${c.handle}","priceCurrency":"USD","price":"48.00","availability":"https://schema.org/PreOrder","itemCondition":"https://schema.org/NewCondition"},"aggregateRating":{"@type":"AggregateRating","ratingValue":"${c.rating}","reviewCount":"${c.reviewCount.replace(/,/g,'')}"}}</script>`}
</svelte:head>

<div class="pdp-root" style="--c:{c.accent}; --c-deep:{c.accentDeep}; --c-tint:{c.accentTint}">
	<!-- chalk roughen filter -->
	<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
		<filter id="chalk" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs></svg>

	<!-- offer ticker -->
	<div class="pdp-ticker">
		<div class="pdp-ticker__track">
			{#each TICKER as line, i (i)}
				<div class="pdp-ticker__item" style="--i:{i}">
					{@html line}
				</div>
			{/each}
		</div>
	</div>

	<main>
		<!-- ===================== HERO ===================== -->
		<section class="wrap" id="buy">
			<nav class="crumbs" aria-label="Breadcrumb">
				<a href="/">Home</a><span class="sep">/</span>
				<a href="/shop">Protocols</a><span class="sep">/</span>
				<span class="cur">{c.name} · OLP Treatment {c.no}</span>
			</nav>

			<div class="pdp">
				<!-- GALLERY -->
				<div class="gallery reveal">
					<div class="gallery__thumbs">
						{#each thumbs as t, i (t)}
							<button class="thumb" class:active={mainIdx === i} onclick={() => (mainIdx = i)}>
								<img src={t} alt="" loading="lazy" decoding="async" />
							</button>
						{/each}
					</div>
					<div class="gallery__main">
						<span class="gallery__badge">14-Day Protocol</span>
						<img src={mainSrc} alt="{c.title} — 30 gummies" />
						<div class="gallery__nav">
							<button class="gnav-btn" aria-label="Previous image" onclick={() => galleryStep(-1)}>‹</button>
							<button class="gnav-btn" aria-label="Next image" onclick={() => galleryStep(1)}>›</button>
						</div>
					</div>
				</div>

				<!-- BUY BOX -->
				<div class="buy reveal">
					<p class="buy__sub">{c.sub}</p>
					<h1 class="buy__name">{c.title}</h1>
					<div class="buy__rating">
						<span class="stars">★★★★★</span><span>{c.rating}</span>
						<a href="#reviews">{c.reviewCount}</a>
					</div>

					<ul class="buy__benefits">
						{#each c.benefits as b (b)}
							<li><span class="bic">✓</span> {b}</li>
						{/each}
					</ul>

					<div class="buy__divider"></div>

					<ul class="included">
						<li><span class="ck">✓</span> {INCLUDED[0]} <span class="pill">14-day supply</span></li>
						{#each INCLUDED.slice(1) as item (item)}
							<li><span class="ck">✓</span> {item}</li>
						{/each}
					</ul>

					<div class="atc">
						<a class="btn btn--ink atc-btn" href={url} onclick={() => buy('preorder')}>
							<span>Pre-order now</span>
							<span class="atc-price"><span>$48</span></span>
						</a>
						<p class="preorder-note">You won't be charged until your order ships. Cancel any time before dispatch.</p>
					</div>

					<div class="trust3">
						<div class="ti"><span class="g"><svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span><span>100% natural<br>&amp; vegan</span></div>
						<div class="ti"><span class="g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg></span><span>Honest, open<br>label</span></div>
						<div class="ti"><span class="g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="20" height="20"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span><span>Pause or cancel<br>any time</span></div>
					</div>

					<div class="ritualbar">
						<span class="rb-ic"><span class="rb-big">14</span><span class="rb-small">days</span></span>
						<p><b>The ritual is the medicine.</b> Two gummies and a two-minute app check-in a day retrain the {c.cat.toLowerCase()} conversation. Consistency is the whole game.</p>
					</div>


				</div>
			</div>
		</section>

		<!-- ===================== CLINICIAN STRIP ===================== -->
		<section class="clinstrip">
			<div class="wrap">
				<span class="badge-c"><span class="laurel">❦</span> Clinician-reviewed protocol</span>
				<p>Built on peer-reviewed open-label placebo research. <a href="#science">See the evidence →</a></p>
			</div>
		</section>

		<!-- ===================== WHY IT WORKS BETTER ===================== -->
		<section class="section band paper2">
			<div class="wrap">
				<p class="snum reveal"><span class="n">01</span> The protocol <span class="rule"></span></p>
				<h2 class="dhead dhead--lg reveal" style="max-width:18ch;margin-bottom:40px;">Why the 14-Day Protocol works better.</h2>
				<div class="whyworks reveal">
					<div class="whyworks__media"><img src="/assets/kit.webp" alt="The Copables kit — gummies, tracker and app" loading="lazy" decoding="async" /></div>
					<div class="fgrid">
						{#each WHYWORKS as f (f.h)}
							<div class="fcard"><span class="fic">{f.ic}</span><h3>{f.h}</h3><p>{f.p}</p></div>
						{/each}
						<div class="fquote">
							<span class="stars">★★★★★</span>
							<p>"{c.reviews[0].body.split('.')[0]}."</p>
							<span class="who">— {c.reviews[0].name}</span>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== VALUE TRUST STRIP ===================== -->
		<section class="vstrip">
			<div class="wrap">
					<span class="vitem"><span class="g"><svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></span> 100% natural &amp; vegan</span>
					<span class="vitem"><span class="g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="24" height="24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg></span> Honest open-label</span>
					<span class="vitem"><span class="g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polyline points="20 6 9 17 4 12"/></svg></span> Independently reviewed</span>
					<span class="vitem"><span class="g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg></span> Cancel any time</span>
					<span class="vitem"><span class="g"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg></span> 90-day guarantee</span>
			</div>
		</section>

		<!-- ===================== SCIENCE / CHARTS ===================== -->
		<section class="section band" id="science">
			<div class="wrap">
				<p class="snum reveal"><span class="n">02</span> The evidence <span class="rule"></span></p>
				<div class="sci reveal">
					<div class="sci__body">
						<h2 class="dhead dhead--lg" style="margin-bottom:22px;">{c.scienceHeadline}</h2>
						{#each c.scienceBody as p (p)}<p>{@html p}</p>{/each}
						<a class="link-arrow" href="#reviews">Read what {c.reviewCount.split(' ')[0]} members say <span aria-hidden="true">→</span></a>
					</div>
					<div class="sci__chart"><OlpChart /></div>
				</div>
			</div>
		</section>

		<!-- ===================== TIMELINE ===================== -->
		<section class="section band paper2">
			<div class="wrap">
				<p class="snum reveal"><span class="n">03</span> Over time <span class="rule"></span></p>
				<h2 class="dhead dhead--lg reveal" style="max-width:20ch;margin-bottom:40px;">How the protocol changes your weeks.</h2>
				<div class="transform reveal">
					<div class="tl">
						{#each c.timeline as phase, i (phase.title)}
							<div class="tlitem" class:open={openTl === i}>
								<button class="tlitem__head" onclick={() => (openTl = openTl === i ? -1 : i)}>
									<span class="tlitem__dot"></span>
									<span class="tlitem__title">{phase.title}</span>
									<span class="tlitem__pm">+</span>
								</button>
								<div class="tlitem__body" style:max-height={openTl === i ? '240px' : '0'}>
									<ul>{#each phase.bullets as b (b)}<li>{b}</li>{/each}</ul>
								</div>
							</div>
						{/each}
					</div>
					<div class="transform__media"><img src="/assets/lineup.webp" alt="The Copables protocol range" loading="lazy" decoding="async" /></div>
				</div>
			</div>
		</section>

		<!-- ===================== EXPERT BAND ===================== -->
		<section class="section expert">
			<div class="wrap">
				<div class="reveal">
					<p class="eyebrow-x">{EXPERT.eyebrow}</p>
					<h2>{EXPERT.h}</h2>
					<blockquote>{EXPERT.quote}</blockquote>
					<div class="ecred"><b>{EXPERT.name}</b><span>{EXPERT.role}</span></div>
				</div>
				<div class="expert__portrait reveal" aria-hidden="true"><span class="quotemark">❝</span></div>
			</div>
		</section>

		<!-- ===================== WHAT'S INSIDE ===================== -->
		<section class="section band">
			<div class="wrap">
				<p class="snum reveal"><span class="n">04</span> What's inside <span class="rule"></span></p>
				<div class="inside reveal">
					<div class="inside__intro">
						<h2 class="dhead dhead--lg" style="margin-bottom:20px;">Why our protocol works better.</h2>
						<p>We don't sell another supplement to swallow and forget. Every part of the box is built to trigger the brain's own pharmacy — honestly, and on a schedule.</p>
						<a class="btn btn--primary" href="#buy">Start your protocol <span class="arrow">→</span></a>
					</div>
					<div class="ingrid">
						{#each INSIDE as m (m.h)}
							<div class="incard">
								<div class="incard__art"><div class="ill-wrap">
									<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)" stroke="currentColor" stroke-width="9" fill="none" stroke-linecap="round">{@html ILL[m.ill]}</g></svg>
								</div></div>
								<div class="incard__b"><h3>{m.h}</h3><p>{m.p}</p></div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== PAIRS WELL WITH ===================== -->
		<section class="section band paper2">
			<div class="wrap">
				<p class="snum reveal"><span class="n">05</span> Pairs well with <span class="rule"></span></p>
				<h2 class="dhead dhead--lg reveal" style="margin-bottom:40px;">Build your stack.</h2>
				<div class="pairs reveal">
					{#each pairCards as p (p.handle)}
						<a class="pcard" href="/shop/{p.handle}">
							<div class="pcard__media"><span class="pcard__tag" style="background:{p.accent}">Available</span><img src={p.bottle} alt="{p.name} Protocol" loading="lazy" decoding="async" /></div>
							<div class="pcard__b">
								<p class="pcard__cat">{p.cat}</p>
								<h3>{p.name} Protocol</h3>
								<p>{p.pairBlurb}</p>
								<div class="pcard__foot"><span class="pcard__price">$40.80 <s>$48</s></span><span class="pcard__add">View</span></div>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</section>

		<!-- ===================== REVIEWS ===================== -->
		<section class="section band" id="reviews">
			<div class="wrap">
				<p class="snum reveal"><span class="n">06</span> Customer reviews <span class="rule"></span></p>
				<div class="rev-top reveal">
					<div class="rev-score">
						<div class="num">{c.rating.split(' ')[0]}<span>/5</span></div>
						<div class="stars">★★★★★</div>
						<div class="cnt">{c.reviewCount}</div>
					</div>
					<div class="rev-dist">
						{#each ratingDist as [lbl, pct] (lbl)}
							<div class="drow"><span>{lbl}</span><span class="dtrack"><span class="dfill" style="width:{pct}%"></span></span><span>{pct}%</span></div>
						{/each}
					</div>
				</div>

				<div class="rev-filters reveal">
					<div class="search"><input type="search" bind:value={revSearch} placeholder="Search reviews…" /></div>
					{#each revChips as [f, lbl] (f)}
						<button class="rev-chip" class:active={revFilter === f} onclick={() => (revFilter = f)}>{lbl}</button>
					{/each}
				</div>

				<div class="rev-list">
					{#each filteredReviews as r (r.name)}
						<div class="rev-item">
							<div class="rev-head">
								<span class="avatar" style="background:{r.color}">{r.initials}</span>
								<div><div class="who">{r.name}</div><span class="verified">✓ Verified member</span></div>
								<span class="date">{r.date}</span>
							</div>
							<div class="rev-stars">{'★'.repeat(r.stars)}{'☆'.repeat(5 - r.stars)}</div>
							<p class="rev-title">{r.title}</p>
							<p class="rev-body">{r.body}</p>
						</div>
					{:else}
						<p class="rev-empty">No reviews match that filter.</p>
					{/each}
				</div>
			</div>
		</section>

		<!-- ===================== FAQ ===================== -->
		<section class="section band paper2">
			<div class="wrap">
				<div class="prob-intro reveal" style="margin-bottom:34px;">
					<h2 class="dhead dhead--lg measure-h">Questions, answered.</h2>
					<p>{@html c.faqIntro}</p>
				</div>
				<div class="faq reveal">
					{#each allFaqs as f, i (f.q)}
						{#if i === 0 || f.cat !== allFaqs[i - 1].cat}
							<p class="faq-cat">{f.cat}</p>
						{/if}
						<div class="faq-item" class:open={openFaq === i}>
							<button class="faq-q" onclick={() => (openFaq = openFaq === i ? -1 : i)}>{f.q}<span class="pm">+</span></button>
							<div class="faq-a" style:max-height={openFaq === i ? '320px' : '0'}><div>{f.a}</div></div>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<!-- ===================== 90-DAY GUARANTEE ===================== -->
		<section class="section band guarantee">
			<div class="wrap reveal">
				<div class="guarantee__badge">
					<span class="guarantee__num">90</span>
					<span class="guarantee__lbl">DAY</span>
				</div>
				<p class="guarantee__eyebrow">OUR PROMISE TO YOU</p>
				<h2 class="dhead dhead--lg guarantee__head">Run the 14 days. If your {c.name.toLowerCase()} isn't calmer, it's free.</h2>
				<p class="guarantee__body">We've helped over {c.reviewCount.split(' ')[0].replace(/,/g, '')} people live easier with {c.name} — but we know it won't work for everyone. So every protocol is backed by a full <strong>90-day money-back guarantee.</strong></p>
				<blockquote class="guarantee__quote">"We built this for the people who've been told it's 'just in your head,' as if that makes it less real. It isn't. The {c.cat.toLowerCase()} link is real — and so is the relief."</blockquote>
				<div class="guarantee__cred">— Theo Marsh, Co-founder of Copables</div>

				<div class="guarantee__steps">
					<div class="gstep">
						<span class="gstep__num">1</span>
						<div class="gstep__b">
							<b>Finish the 14 days</b>
							<p>Complete the protocol, ritual and all.</p>
						</div>
					</div>
					<div class="gstep">
						<span class="gstep__num">2</span>
						<div class="gstep__b">
							<b>Email us once</b>
							<p>No forms, no return shipping, no hold music.</p>
						</div>
					</div>
					<div class="gstep">
						<span class="gstep__num">3</span>
						<div class="gstep__b">
							<b>Get a full refund</b>
							<p>Every cent back, any time within 90 days.</p>
						</div>
					</div>
				</div>

				<div class="guarantee__cta">
					<a class="btn btn--ink btn--lg" href={url} onclick={() => buy('guarantee_cta')}>Start your protocol <span class="arrow">→</span></a>
					<a class="hero-ghost" href="/quiz/{c.handle}">Not sure? Take the quiz <span aria-hidden="true">→</span></a>
				</div>
			</div>
		</section>
	</main>

	<!-- mobile sticky add bar -->
	<div class="pdp-sticky" class:show={showSticky}>
		<div class="ps-name">{c.name} Protocol<small>Pre-order · $48</small></div>
		<a class="btn btn--ink" href={url} onclick={() => buy('sticky_preorder')}>Pre-order</a>
	</div>
</div>

<style>
	/* ── root / base ──────────────────────────────────────── */
	.pdp-root { background: var(--paper); color: var(--ink); font-family: var(--ff); }
	.pdp-root :global(*) { box-sizing: border-box; }
	.wrap { width: 100%; max-width: var(--maxw-home, 1180px); margin: 0 auto; padding: 0 24px; }
	.section { padding: clamp(56px, 7vw, 96px) 0; }
	.band { border-top: var(--section-divider); }
	.band.paper2 { background: var(--paper-2); }

	:global(h1, h2, h3, h4) { margin: 0; }
	.dhead { font-weight: 800; letter-spacing: -0.03em; line-height: 1.02; }
	.dhead--lg { font-size: clamp(28px, 3.6vw, 46px); }
	.measure-h { max-width: 16ch; }

	.snum { display: flex; align-items: center; gap: 16px; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-soft); margin: 0 0 22px; }
	.snum .n { color: var(--c); }
	.snum .rule { flex: 1 1 auto; height: 1px; background: var(--line); }

	.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--ff); font-weight: 800; font-size: 16px; letter-spacing: -0.01em; padding: 15px 26px; border-radius: 999px; border: 0; cursor: pointer; text-decoration: none; line-height: 1; transition: transform 0.14s ease, box-shadow 0.2s ease; }
	.btn--primary { background: var(--c); color: #fff; box-shadow: 0 6px 0 var(--c-deep); }
	.btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--c-deep); }
	.btn--ink { background: var(--ink); color: var(--paper); box-shadow: 0 6px 0 #000; }
	.btn--ink:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #000; }
	.btn--ink:active, .btn--primary:active { transform: translateY(2px); box-shadow: 0 3px 0 var(--c-deep); }
	.btn--lg { font-size: 18px; padding: 19px 36px; }
	.arrow { font-size: 1.1em; line-height: 0; }
	.link-arrow { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; color: var(--ink); text-decoration: none; border-bottom: 2px solid var(--c); padding-bottom: 2px; }
	.link-arrow:hover { opacity: 0.75; }

	/* ── offer ticker ───────────────────────────────────── */
	.pdp-ticker { background: var(--ink); color: var(--paper); text-align: center; font-size: 13.5px; font-weight: 600; letter-spacing: -0.01em; height: 40px; overflow: hidden; position: relative; }
	.pdp-ticker__track { animation: ticker 24s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
	.pdp-ticker__item { height: 40px; display: flex; align-items: center; justify-content: center; gap: 6px; white-space: nowrap; padding: 0 16px; }
	.pdp-ticker__item :global(b) { color: var(--orange); font-weight: 800; }
	@keyframes ticker {
		0%, 11.5%   { transform: translateY(0); }
		14.3%, 25.8% { transform: translateY(-40px); }
		28.6%, 40.1% { transform: translateY(-80px); }
		42.9%, 54.4% { transform: translateY(-120px); }
		57.1%, 68.6% { transform: translateY(-160px); }
		71.4%, 82.9% { transform: translateY(-200px); }
		85.7%, 97.2% { transform: translateY(-240px); }
		100%         { transform: translateY(-280px); }
	}

	/* ── breadcrumb ───────────────────────────────────────── */
	.crumbs { font-size: 13px; font-weight: 700; color: var(--ink-soft); display: flex; gap: 8px; align-items: center; flex-wrap: wrap; padding: 22px 0 4px; }
	.crumbs a { text-decoration: none; opacity: 0.8; color: inherit; }
	.crumbs a:hover { opacity: 1; }
	.crumbs .sep { opacity: 0.4; }
	.crumbs .cur { color: var(--ink); }

	/* ── PDP hero layout ──────────────────────────────────── */
	.pdp { display: grid; grid-template-columns: 1fr; gap: 36px; padding: 14px 0 clamp(40px, 6vw, 72px); }
	@media (min-width: 940px) { .pdp { grid-template-columns: minmax(0, 1.04fr) minmax(0, 0.96fr); gap: 56px; align-items: start; } }

	.gallery { display: grid; grid-template-columns: 70px 1fr; gap: 14px; }
	.gallery__thumbs { display: flex; flex-direction: column; gap: 10px; }
	.thumb { width: 70px; height: 70px; border-radius: 14px; overflow: hidden; cursor: pointer; border: 2px solid var(--line); background: var(--paper-2); padding: 0; transition: border-color 0.15s, transform 0.1s; }
	.thumb img { width: 100%; height: 100%; object-fit: cover; }
	.thumb.active { border-color: var(--frame-ink); }
	.thumb:hover { border-color: var(--ink-soft); }
	.gallery__main { position: relative; border-radius: var(--frame-radius-lg); overflow: hidden; background: var(--paper-2); aspect-ratio: 1/1; box-shadow: var(--frame-shadow); border: var(--frame-bw) solid var(--frame-ink); }
	.gallery__main img { width: 100%; height: 100%; object-fit: cover; }
	.gallery__badge { position: absolute; top: 16px; left: 16px; z-index: 2; background: var(--c); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 7px 13px; border-radius: 999px; }
	.gallery__nav { position: absolute; bottom: 16px; right: 16px; display: flex; gap: 8px; z-index: 2; }
	.gnav-btn { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--frame-ink); background: rgba(255, 255, 255, 0.92); display: grid; place-items: center; cursor: pointer; font-size: 16px; color: var(--ink); transition: transform 0.1s; }
	.gnav-btn:hover { transform: translateY(-2px); }
	@media (max-width: 520px) { .gallery { grid-template-columns: 1fr; } .gallery__thumbs { flex-direction: row; order: 2; } .thumb { width: 58px; height: 58px; } }

	/* ── buy box ──────────────────────────────────────────── */
	.buy { display: flex; flex-direction: column; }
	.buy__name { font-size: clamp(34px, 4.4vw, 50px); font-weight: 800; letter-spacing: -0.035em; line-height: 0.98; }
	.buy__sub { font-size: 14px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--c); margin: 10px 0 0; }
	.buy__rating { display: flex; align-items: center; gap: 10px; margin: 16px 0 0; font-size: 14px; font-weight: 700; color: var(--ink-soft); }
	.buy__rating .stars { color: var(--orange); letter-spacing: 2px; font-size: 17px; }
	.buy__rating a { color: var(--ink-soft); }
	.buy__benefits { list-style: none; margin: 22px 0 0; padding: 0; display: grid; gap: 12px; }
	.buy__benefits li { display: flex; gap: 12px; align-items: flex-start; font-size: 16px; font-weight: 600; line-height: 1.35; }
	.buy__benefits .bic { flex: none; width: 26px; height: 26px; border-radius: 8px; background: var(--blue-tint); color: var(--blue-deep); display: grid; place-items: center; font-weight: 900; font-size: 14px; margin-top: 1px; }
	.buy__divider { height: 1px; background: var(--line); margin: 26px 0; }

	.included { list-style: none; margin: 20px 0 0; padding: 0; display: grid; gap: 10px; }
	.included li { display: flex; gap: 10px; align-items: center; font-size: 14.5px; font-weight: 600; color: var(--ink-2); }
	.included .ck { flex: none; width: 20px; height: 20px; border-radius: 50%; background: var(--green-ok); color: #fff; display: grid; place-items: center; font-size: 11px; font-weight: 900; }
	.included li .pill { margin-left: auto; font-size: 11px; font-weight: 800; color: var(--blue-deep); background: var(--blue-tint); padding: 3px 9px; border-radius: 999px; }

	.atc { margin-top: 20px; }
	.atc-btn { width: 100%; font-size: 18px; padding: 20px 28px; justify-content: space-between; }
	.atc-price { display: inline-flex; align-items: center; gap: 10px; }
	.preorder-note { margin-top: 10px; font-size: 12.5px; color: var(--ink-soft); font-weight: 600; text-align: center; }

	.trust3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 20px; text-align: center; }
	.trust3 .ti { display: flex; flex-direction: column; align-items: center; gap: 7px; padding: 4px; }
	.trust3 .ti .g { color: var(--ink); flex: none; width: 28px; height: 28px; display: grid; place-items: center; }
	.trust3 .ti .g svg { display: block; }
	.trust3 .ti span { font-size: 11.5px; font-weight: 700; color: var(--ink-soft); line-height: 1.25; }

	.ritualbar { display: flex; align-items: center; gap: 14px; margin-top: 20px; background: #fff; border: var(--frame-bw) solid var(--frame-ink); border-radius: 14px; padding: 14px 16px; box-shadow: var(--frame-shadow-sm); }
	.ritualbar .rb-ic { flex: none; width: 44px; height: 44px; border-radius: 11px; background: var(--ink); color: var(--paper); display: flex; flex-direction: column; align-items: center; justify-content: center; line-height: 1; }
	.rb-big { font-size: 15px; font-weight: 900; }
	.rb-small { font-size: 8px; font-weight: 800; letter-spacing: 0.04em; text-transform: uppercase; opacity: 0.9; margin-top: 1px; }
	.ritualbar p { margin: 0; font-size: 13.5px; color: var(--ink-soft); font-weight: 600; line-height: 1.4; }
	.ritualbar b { color: var(--ink); }

	.stackcard { margin-top: 22px; border: var(--frame-bw) solid var(--frame-ink); border-radius: 18px; padding: 16px; background: var(--paper-2); box-shadow: var(--frame-shadow-sm); }
	.stackcard__lbl { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft); margin: 0 0 12px; }
	.stackcard__row { display: flex; align-items: center; gap: 14px; }
	.stackcard__thumb { flex: none; width: 58px; height: 58px; border-radius: 12px; overflow: hidden; background: var(--card); border: 1px solid var(--line-2); }
	.stackcard__thumb img { width: 100%; height: 100%; object-fit: cover; }
	.stackcard__info { flex: 1 1 auto; min-width: 0; }
	.stackcard__info b { font-size: 15px; font-weight: 800; display: block; line-height: 1.1; }
	.stackcard__info small { font-size: 12.5px; color: var(--ink-soft); font-weight: 600; }
	.stackcard__price { font-weight: 800; font-size: 15px; }
	.stackcard__price s { font-weight: 700; font-size: 12.5px; color: var(--ink-soft); opacity: 0.7; display: block; }
	.stackcard__add { flex: none; border: 0; background: var(--ink); color: var(--paper); font-family: var(--ff); font-weight: 800; font-size: 13px; padding: 11px 16px; border-radius: 999px; cursor: pointer; white-space: nowrap; text-decoration: none; }
	.stackcard__add:hover { transform: translateY(-2px); }

	/* ── clinician strip ──────────────────────────────────── */
	.clinstrip { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); background: var(--paper-2); }
	.clinstrip .wrap { display: flex; align-items: center; gap: 18px; padding: 18px 24px; flex-wrap: wrap; justify-content: center; text-align: center; }
	.clinstrip .badge-c { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; font-size: 13px; letter-spacing: 0.04em; }
	.clinstrip .badge-c .laurel { color: var(--c); font-size: 18px; }
	.clinstrip p { margin: 0; font-size: 14px; color: var(--ink-soft); font-weight: 600; }
	.clinstrip a { font-weight: 800; color: var(--ink); }

	/* ── why it works ─────────────────────────────────────── */
	.whyworks { display: grid; grid-template-columns: 1fr; gap: 30px; }
	@media (min-width: 920px) { .whyworks { grid-template-columns: 0.82fr 1.18fr; gap: 40px; align-items: stretch; } }
	.whyworks__media { border-radius: var(--frame-radius-lg); overflow: hidden; box-shadow: var(--frame-shadow); border: var(--frame-bw) solid var(--frame-ink); aspect-ratio: 3/4.1; min-height: 100%; background: var(--paper-2); }
	.whyworks__media img { width: 100%; height: 100%; object-fit: cover; }
	.fgrid { display: grid; grid-template-columns: 1fr; gap: 14px; }
	@media (min-width: 560px) { .fgrid { grid-template-columns: repeat(3, 1fr); } }
	.fcard { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); padding: 22px 20px; box-shadow: var(--frame-shadow-sm); display: flex; flex-direction: column; }
	.fcard .fic { width: 40px; height: 40px; border-radius: 11px; display: grid; place-items: center; margin-bottom: 14px; color: #fff; font-size: 19px; }
	.fcard:nth-child(3n + 1) .fic { background: var(--blue); }
	.fcard:nth-child(3n + 2) .fic { background: var(--orange); }
	.fcard:nth-child(3n) .fic { background: var(--c); }
	.fcard h3 { font-size: 17px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 6px; }
	.fcard p { margin: 0; font-size: 13.5px; line-height: 1.45; color: var(--ink-soft); }
	.fquote { grid-column: 1 / -1; background: var(--ink); color: var(--paper); border-radius: var(--frame-radius); padding: 22px 26px; display: flex; gap: 16px; align-items: center; }
	.fquote p { margin: 0; font-size: 16px; font-weight: 700; font-style: italic; line-height: 1.4; }
	.fquote .who { font-size: 12.5px; color: rgba(251, 246, 234, 0.6); font-weight: 700; font-style: normal; white-space: nowrap; }
	.fquote .stars { color: var(--orange); letter-spacing: 2px; flex: none; }

	/* ── value strip ──────────────────────────────────────── */
	.vstrip { border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }
	.vstrip .wrap { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: clamp(20px, 5vw, 64px); padding: 22px 24px; }
	.vitem { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 800; color: var(--ink); }
	.vitem .g { color: var(--c); flex: none; width: 28px; height: 28px; display: grid; place-items: center; }
	.vitem .g svg { display: block; }

	/* ── science / charts (branded figure cards) ──────────── */
	.sci { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
	@media (min-width: 900px) { .sci { grid-template-columns: 1fr 1.05fr; gap: 60px; } }
	.sci__body p { color: var(--ink-soft); font-size: clamp(16px, 1.3vw, 18px); margin: 0 0 18px; max-width: 44ch; }
	.sci__body :global(em) { font-style: italic; }
	.sci__body :global(strong) { color: var(--ink); }
	.sci__chart { width: 100%; }

	/* ── timeline ─────────────────────────────────────────── */
	.transform { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
	@media (min-width: 900px) { .transform { grid-template-columns: 1fr 1fr; gap: 60px; } }
	.tl { display: grid; gap: 12px; }
	.tlitem { border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); background: var(--card); overflow: hidden; box-shadow: var(--frame-shadow-sm); }
	.tlitem__head { width: 100%; background: none; border: 0; cursor: pointer; font-family: var(--ff); display: flex; align-items: center; gap: 14px; padding: 18px 20px; text-align: left; color: var(--ink); }
	.tlitem__dot { flex: none; width: 12px; height: 12px; border-radius: 50%; background: var(--line); border: 2px solid var(--ink-soft); }
	.tlitem.open .tlitem__dot { background: var(--c); border-color: var(--c); }
	.tlitem__title { font-size: 18px; font-weight: 800; letter-spacing: -0.01em; flex: 1 1 auto; }
	.tlitem__pm { color: var(--ink-soft); font-size: 18px; font-weight: 800; transition: transform 0.25s; }
	.tlitem.open .tlitem__pm { transform: rotate(45deg); }
	.tlitem__body { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
	.tlitem__body ul { margin: 0; padding: 0 20px 20px 50px; list-style: none; display: grid; gap: 9px; }
	.tlitem__body li { font-size: 14.5px; color: var(--ink-soft); font-weight: 600; position: relative; padding-left: 18px; line-height: 1.4; }
	.tlitem__body li::before { content: "✓"; position: absolute; left: 0; color: var(--green-ok); font-weight: 900; }
	.transform__media { border-radius: var(--frame-radius-lg); overflow: hidden; aspect-ratio: 4/3.4; box-shadow: var(--frame-shadow); border: var(--frame-bw) solid var(--frame-ink); background: var(--paper-2); }
	.transform__media img { width: 100%; height: 100%; object-fit: cover; }

	/* ── expert band ──────────────────────────────────────── */
	.expert { background: var(--ink); color: var(--paper); position: relative; overflow: hidden; border-top: var(--section-divider); }
	.expert::before { content: ""; position: absolute; inset: 0; background: radial-gradient(120% 100% at 18% 0%, rgba(47, 149, 242, 0.14), transparent 60%); }
	.expert .wrap { position: relative; z-index: 2; display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
	@media (min-width: 880px) { .expert .wrap { grid-template-columns: 1.2fr 0.8fr; gap: 56px; } }
	.expert .eyebrow-x { font-size: 13px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--blue); margin: 0 0 20px; }
	.expert h2 { font-size: clamp(28px, 3.4vw, 42px); font-weight: 800; letter-spacing: -0.025em; line-height: 1.05; margin: 0 0 22px; }
	.expert blockquote { margin: 0; font-size: clamp(17px, 1.6vw, 20px); font-weight: 600; line-height: 1.5; color: rgba(251, 246, 234, 0.82); font-style: italic; }
	.expert .ecred { margin-top: 22px; }
	.expert .ecred b { font-weight: 800; color: var(--paper); }
	.expert .ecred span { display: block; font-size: 13.5px; color: rgba(251, 246, 234, 0.6); font-weight: 600; margin-top: 2px; }
	.expert__portrait { border-radius: var(--frame-radius-lg); overflow: hidden; aspect-ratio: 4/4.4; box-shadow: var(--frame-shadow); border: var(--frame-bw) solid var(--frame-ink); background: radial-gradient(120% 100% at 30% 0%, #322f28, #211f1a); display: grid; place-items: center; }
	.expert__portrait .quotemark { font-size: 120px; line-height: 1; color: var(--blue); opacity: 0.6; }

	/* ── what's inside ────────────────────────────────────── */
	.inside { display: grid; grid-template-columns: 1fr; gap: 34px; }
	@media (min-width: 900px) { .inside { grid-template-columns: 0.8fr 1.2fr; gap: 48px; align-items: start; } }
	.inside__intro p { color: var(--ink-soft); font-size: clamp(16px, 1.3vw, 18px); margin: 0 0 18px; max-width: 40ch; }
	.ingrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
	@media (min-width: 620px) { .ingrid { grid-template-columns: repeat(3, 1fr); } }
	.incard { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); overflow: hidden; box-shadow: var(--frame-shadow-sm); display: flex; flex-direction: column; }
	.incard__art { aspect-ratio: 5/3; position: relative; border-bottom: var(--frame-bw) solid var(--frame-ink); }
	.incard__art .ill-wrap { position: absolute; inset: 0; display: grid; place-items: center; }
	.incard__art .ill { width: 64px; height: 64px; }
	.incard__art { background: var(--c-tint); color: var(--c-deep); }
	.incard__b { padding: 14px 16px 16px; }
	.incard__b h3 { font-size: 15px; font-weight: 800; letter-spacing: -0.01em; margin: 0 0 4px; }
	.incard__b p { margin: 0; font-size: 12.5px; color: var(--ink-soft); line-height: 1.4; }

	/* ── pairs ────────────────────────────────────────────── */
	.pairs { display: grid; grid-template-columns: 1fr; gap: 18px; }
	@media (min-width: 760px) { .pairs { grid-template-columns: repeat(3, 1fr); } }
	.pcard { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); overflow: hidden; box-shadow: var(--frame-shadow-sm); display: flex; flex-direction: column; transition: transform 0.16s, box-shadow 0.2s; text-decoration: none; color: inherit; }
	.pcard:hover { transform: translateY(-4px); box-shadow: var(--frame-shadow-hover); }
	.pcard__media { aspect-ratio: 4/3; background: var(--paper-2); position: relative; border-bottom: var(--frame-bw) solid var(--frame-ink); }
	.pcard__media img { width: 100%; height: 100%; object-fit: cover; }
	.pcard__tag { position: absolute; top: 12px; left: 12px; font-size: 10px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; padding: 5px 10px; border-radius: 999px; }
	.pcard__b { padding: 18px 18px 20px; display: flex; flex-direction: column; flex: 1 1 auto; }
	.pcard__cat { font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); margin: 0 0 5px; }
	.pcard__b h3 { font-size: 20px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
	.pcard__b p { margin: 0 0 16px; font-size: 13.5px; color: var(--ink-soft); line-height: 1.45; }
	.pcard__foot { margin-top: auto; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
	.pcard__price { font-weight: 800; font-size: 17px; }
	.pcard__price s { font-weight: 700; font-size: 13px; color: var(--ink-soft); opacity: 0.7; }
	.pcard__add { background: var(--ink); color: var(--paper); font-weight: 800; font-size: 13.5px; padding: 11px 18px; border-radius: 999px; }

	/* ── reviews ──────────────────────────────────────────── */
	.rev-top { display: grid; grid-template-columns: 1fr; gap: 30px; align-items: center; margin-bottom: 34px; }
	@media (min-width: 760px) { .rev-top { grid-template-columns: auto 1fr; gap: 48px; } }
	.rev-score { text-align: center; }
	.rev-score .num { font-size: clamp(56px, 7vw, 84px); font-weight: 800; letter-spacing: -0.04em; line-height: 0.9; }
	.rev-score .num span { font-size: 0.42em; color: var(--ink-soft); font-weight: 700; }
	.rev-score .stars { color: var(--orange); letter-spacing: 3px; font-size: 22px; margin-top: 8px; }
	.rev-score .cnt { font-size: 13px; font-weight: 700; color: var(--ink-soft); margin-top: 6px; }
	.rev-dist { display: grid; gap: 7px; max-width: 460px; }
	.rev-dist .drow { display: grid; grid-template-columns: 42px 1fr 38px; align-items: center; gap: 12px; font-size: 12.5px; font-weight: 700; color: var(--ink-soft); }
	.rev-dist .dtrack { height: 9px; border-radius: 99px; background: var(--line); overflow: hidden; }
	.rev-dist .dfill { display: block; height: 100%; background: var(--orange); border-radius: 99px; }
	.rev-filters { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 16px 0; margin-bottom: 24px; }
	.rev-filters .search { flex: 1 1 220px; min-width: 180px; }
	.rev-filters input { width: 100%; font-family: var(--ff); font-size: 14px; font-weight: 600; border: 1.5px solid var(--line); border-radius: 999px; padding: 10px 16px; background: #fff; color: var(--ink); }
	.rev-chip { border: 1.5px solid var(--line); background: #fff; font-family: var(--ff); font-weight: 800; font-size: 13px; padding: 9px 15px; border-radius: 999px; cursor: pointer; color: var(--ink-soft); transition: 0.15s; }
	.rev-chip.active { background: var(--ink); color: var(--paper); border-color: var(--ink); }
	.rev-list { display: grid; gap: 0; }
	.rev-item { padding: 24px 0; border-top: 1px solid var(--line-2); }
	.rev-item:first-child { border-top: 0; }
	.rev-head { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
	.rev-head .avatar { flex: none; width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; font-size: 15px; }
	.rev-head .who { font-weight: 800; font-size: 15px; line-height: 1.1; }
	.rev-head .verified { font-size: 11px; color: var(--green-ok); font-weight: 700; }
	.rev-head .date { margin-left: auto; font-size: 12px; color: var(--ink-soft); font-weight: 600; }
	.rev-stars { color: var(--orange); letter-spacing: 2px; font-size: 14px; }
	.rev-title { font-weight: 800; font-size: 16px; margin: 6px 0 4px; letter-spacing: -0.01em; }
	.rev-body { font-size: 14.5px; color: var(--ink-2); line-height: 1.55; margin: 0; }
	.rev-empty { padding: 24px 0; color: var(--ink-soft); font-weight: 600; }

	/* ── FAQ ──────────────────────────────────────────────── */
	.prob-intro p { color: var(--ink-soft); font-size: 16px; line-height: 1.55; margin: 14px 0 0; max-width: 60ch; }
	.prob-intro :global(strong) { color: var(--ink); }
	.faq-cat { font-size: 12px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c); margin: 26px 0 10px; }
	.faq-item { border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); background: var(--card); margin-bottom: 10px; overflow: hidden; box-shadow: var(--frame-shadow-sm); }
	.faq-q { width: 100%; background: none; border: 0; cursor: pointer; font-family: var(--ff); display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 18px 20px; text-align: left; font-size: 16px; font-weight: 800; color: var(--ink); }
	.faq-q .pm { flex: none; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--frame-ink); display: grid; place-items: center; font-size: 17px; transition: transform 0.25s; }
	.faq-item.open .faq-q .pm { transform: rotate(45deg); }
	.faq-a { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
	.faq-a > div { padding: 0 20px 20px; font-size: 14.5px; line-height: 1.6; color: var(--ink-soft); }

	/* ── 90-day guarantee ─────────────────────────────────── */
	.guarantee { text-align: center; background: var(--paper-2); }
	.guarantee .wrap { display: flex; flex-direction: column; align-items: center; }
	.guarantee__badge {
		width: 90px; height: 90px; border-radius: 50%;
		border: 3px dashed var(--c);
		background: var(--c-tint);
		display: flex; flex-direction: column; align-items: center; justify-content: center;
		margin-bottom: 28px;
	}
	.guarantee__num { font-size: 36px; font-weight: 800; letter-spacing: -0.04em; line-height: 1; color: var(--c-deep); }
	.guarantee__lbl { font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--c-deep); margin-top: 2px; }
	.guarantee__eyebrow { font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--c); margin: 0 0 18px; }
	.guarantee__head { max-width: 22ch; margin-bottom: 20px; }
	.guarantee__body { font-size: clamp(16px, 1.4vw, 18px); color: var(--ink-soft); line-height: 1.6; margin: 0 0 32px; max-width: 54ch; font-weight: 600; }
	.guarantee__body strong { color: var(--ink); }
	.guarantee__quote { margin: 0 0 14px; font-size: clamp(17px, 1.5vw, 21px); font-weight: 700; font-style: italic; line-height: 1.45; color: var(--ink); max-width: 52ch; }
	.guarantee__cred { font-size: 14px; font-weight: 700; color: var(--ink-soft); margin-bottom: 40px; }
	.guarantee__steps { display: grid; grid-template-columns: 1fr; gap: 14px; width: 100%; max-width: 800px; margin-bottom: 36px; }
	@media (min-width: 680px) { .guarantee__steps { grid-template-columns: repeat(3, 1fr); } }
	.gstep { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); padding: 20px 22px; box-shadow: var(--frame-shadow-sm); display: flex; align-items: flex-start; gap: 14px; text-align: left; }
	.gstep__num { flex: none; width: 36px; height: 36px; border-radius: 50%; background: var(--c); color: #fff; display: grid; place-items: center; font-size: 15px; font-weight: 800; }
	.gstep__b b { font-size: 15px; font-weight: 800; display: block; margin-bottom: 4px; }
	.gstep__b p { margin: 0; font-size: 13.5px; color: var(--ink-soft); line-height: 1.45; font-weight: 600; }
	.guarantee__cta { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; justify-content: center; }
	.hero-ghost { font-weight: 800; color: var(--ink); text-decoration: none; border-bottom: 2px solid var(--c); padding-bottom: 2px; }
	.hero-ghost:hover { opacity: 0.7; }

	/* ── mobile sticky add bar ────────────────────────────── */
	.pdp-sticky { position: fixed; left: 0; right: 0; bottom: 0; z-index: 75; display: flex; align-items: center; gap: 12px; padding: 12px 16px calc(12px + env(safe-area-inset-bottom)); background: rgba(251, 246, 234, 0.95); backdrop-filter: blur(10px); border-top: 1px solid var(--line); transform: translateY(140%); transition: transform 0.3s ease; }
	.pdp-sticky.show { transform: none; }
	.pdp-sticky .ps-name { font-weight: 800; font-size: 14px; flex: 1 1 auto; line-height: 1.1; }
	.pdp-sticky .ps-name small { display: block; font-size: 12px; color: var(--ink-soft); font-weight: 700; }
	.pdp-sticky .btn { white-space: nowrap; padding: 14px 22px; }
	@media (min-width: 940px) { .pdp-sticky { display: none; } }

	/* ── reveal ───────────────────────────────────────────── */
	@media (prefers-reduced-motion: no-preference) {
		.reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
		:global(.reveal.in) { opacity: 1; transform: none; }
	}
</style>
