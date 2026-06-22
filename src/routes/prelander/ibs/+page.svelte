<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	/* ── CTA analytics ─────────────────────────────────── */
	/** Fire-and-forget click tracking for funnel attribution. Link navigates via href. */
	function ctaClick(label: string) {
		track('prelander_cta_click', { label, source: 'prelander/ibs' });
	}

	/* ── Intersection observers (reveal, count-up) ──── */
	onMount(() => {
		// reveal
		const revealIO = new IntersectionObserver((entries) => {
			entries.forEach(en => {
				if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
		document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

		// count-up
		function animateCount(el: Element) {
			const target = parseFloat(el.getAttribute('data-count') || '0');
			const suffix = el.getAttribute('data-suffix') || '';
			const dur = 1100; let start: number | null = null;
			(function tick(ts: number) {
				if (!start) start = ts;
				const p = Math.min((ts - start) / dur, 1);
				const ease = 1 - Math.pow(1 - p, 3);
				const val = Math.round(target * ease);
				el.textContent = (target >= 1000 ? val.toLocaleString() : val) + suffix;
				if (p < 1) requestAnimationFrame(tick);
			})(0);
		}
		const countIO = new IntersectionObserver((entries) => {
			entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); countIO.unobserve(en.target); } });
		}, { threshold: 0.6 });
		document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

		// timeline line: connect center of first marker to center of last marker
		function setTimelineLine() {
			const timeline = document.querySelector('.steps-timeline') as HTMLElement | null;
			if (!timeline) return;
			const markers = timeline.querySelectorAll('.step__marker');
			if (markers.length < 2) return;
			const tRect = timeline.getBoundingClientRect();
			const first = markers[0].getBoundingClientRect();
			const last = markers[markers.length - 1].getBoundingClientRect();
			const top = first.top + first.height / 2 - tRect.top;
			const bottom = tRect.bottom - (last.top + last.height / 2);
			timeline.style.setProperty('--line-top', `${top}px`);
			timeline.style.setProperty('--line-bottom', `${bottom}px`);
		}
		setTimelineLine();
		window.addEventListener('resize', setTimelineLine);

		return () => { revealIO.disconnect(); countIO.disconnect(); window.removeEventListener('resize', setTimelineLine); };
	});

	/* ── Citations ────────────────────────────────────── */
	const KAPTCHUK_2010 = 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591';
	const LEMBO_2021 = 'https://journals.lww.com/pain/abstract/2021/09000/open_label_placebo_vs_double_blind_placebo_for.13.aspx';

	/* ── Kit photo carousel ──────────────────────────── */
	const kitSlides = [
		{ src: '/assets/kit.webp', alt: 'The complete Copables 14-day IBS protocol kit laid out', cap: 'Everything in your 14-day box.', badge: '14-DAY PROTOCOL', badgeClass: 'kit-badge--wine' },
		{ src: '/assets/ibs-bottle.webp', alt: 'The OLP gummies jar, 30 open-label placebo gummies', cap: 'The OLP gummies, 30 per jar.', badge: '2 A DAY', badgeClass: 'kit-badge--blue' },
		{ src: '/assets/ritual-cards.webp', alt: 'Daily CBT cards fanned out with a pen', cap: 'Daily CBT cards, one per day.', badge: 'WRITE BY HAND', badgeClass: 'kit-badge--orange' },
	];
	let kitIndex = $state(0);
	let kitPaused = $state(false);

	function kitGo(i: number) {
		kitIndex = ((i % kitSlides.length) + kitSlides.length) % kitSlides.length;
	}
	function kitNext() { kitGo(kitIndex + 1); }
	function kitPrev() { kitGo(kitIndex - 1); }

	$effect(() => {
		if (kitPaused) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const t = setInterval(() => { kitIndex = (kitIndex + 1) % kitSlides.length; }, 5000);
		return () => clearInterval(t);
	});
</script>

<svelte:head>
	<title>IBS Protocol: 14-Day Honest Placebo for Gut Relief | Copables</title>
	<meta name="description" content="An honest placebo, built around your IBS. A 14-day at-home protocol pairing open-label placebos with daily CBT. Take the free 4-minute assessment." />
	<meta property="og:title" content="An honest placebo, built around your IBS" />
	<meta property="og:description" content="A 14-day at-home protocol that pairs open-label placebos with daily CBT to calm an overactive gut-brain connection. Take the free 4-minute assessment." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta name="twitter:title" content="An honest placebo, built around your IBS" />
	<meta name="twitter:description" content="A 14-day at-home protocol pairing open-label placebos with daily CBT. Take the free 4-minute assessment." />
	<meta name="twitter:image" content="https://copables.com/assets/lineup.webp" />
</svelte:head>

<div class="prelander-page">

<!-- chalk roughen filter (document-wide) -->
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
	<filter id="chalk" x="-20%" y="-20%" width="140%" height="140%">
		<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
		<feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
	</filter>
</defs></svg>

<!-- ── ANNOUNCEMENT BAR (rotating ticker) ───────────── -->
<div class="offer" role="region" aria-label="Announcements">
	<div class="offer__viewport">
		<div class="offer__track">
			<span class="offer__item"><b>Free shipping</b> on every order</span>
			<span class="offer__item"><b>Money-back guarantee</b> if it doesn't work</span>
			<span class="offer__item"><b>14-day protocol</b> built around your IBS</span>
			<span class="offer__item"><b>Backed by Harvard</b> research</span>
			<span class="offer__item" aria-hidden="true"><b>Free shipping</b> on every order</span>
		</div>
	</div>
</div>

<!-- ── NAVBAR ───────────────────────────────────────── -->
<header class="header">
	<div class="wrap header__row">
		<a class="brand" href="#top" aria-label="copables home">
			<span class="wordmark">copables</span>
			<span class="tag">IBS</span>
		</a>
		<div class="header__right">
			<a class="btn btn--primary" href="/quiz/ibs" onclick={() => ctaClick('nav')}>Take the assessment</a>
		</div>
	</div>
</header>

<main id="top">

<!-- ── HERO ─────────────────────────────────────────── -->
<section class="hero">
	<div class="wrap">
		<div class="hero-grid">
			<div class="reveal">
				<p class="eyebrow">The 4-minute IBS assessment</p>
				<h1 class="h1">An <span class="ital u-accent">honest</span> placebo, built around your IBS.</h1>
				<p class="lead" style="margin-top:22px">A 14-day at-home protocol that pairs open-label placebos with daily CBT to calm an overactive gut-brain connection. No medications, no restrictive diets, no doctor's office.</p>
				<ul class="hero-checks">
					<li><span class="ck">✓</span> Built on two decades of research from Harvard Medical School</li>
					<li><span class="ck">✓</span> A 14-day protocol: a physical kit plus a guided app</li>
					<li><span class="ck">✓</span> Around fifteen minutes a day</li>
				</ul>
				<a class="btn btn--primary btn--lg" href="/quiz/ibs" onclick={() => ctaClick('hero')}>Take the free assessment <span class="arrow">→</span></a>
				<p class="cta-note">Takes 4 minutes&nbsp;·&nbsp;100% free&nbsp;·&nbsp;Science-backed</p>
			</div>

			<div class="hero-visual reveal">
				<div class="hero-frame brand-img">
					<img src="/assets/kit.webp" alt="The Copables 14-day IBS protocol kit: gummies, daily cards, tracker, pen, and guided app" loading="eager" />
				</div>
				<div class="hero-stamp"><small>In the box</small>14-day IBS protocol · 30 gummies</div>
			</div>
		</div>
	</div>
</section>

<!-- ── TRUST STRIP ──────────────────────────────────── -->
<section class="trust">
	<div class="wrap">
		<p class="lbl">Designed using research from the world's leading institutions</p>
		<div class="logos">
			<img src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" loading="lazy" />
			<img src="/assets/science/logo-columbia.webp" alt="Columbia University" loading="lazy" />
			<img src="/assets/science/logo-danafarber.webp" alt="Dana-Farber Cancer Institute" loading="lazy" />
			<img src="/assets/science/logo-maryland.webp" alt="University of Maryland" loading="lazy" />
			<img src="/assets/science/logo-mdanderson.webp" alt="MD Anderson Cancer Center" loading="lazy" />
		</div>
		<p class="trust-line">Built on <span data-count="272">272</span> published open-label placebo studies.</p>
	</div>
</section>

<!-- ── ROOT CAUSE ───────────────────────────────────── -->
<section class="section">
	<div class="wrap">
		<div class="split">
			<div class="reveal">
				<p class="eyebrow">The root cause</p>
				<h2 class="h2">Your gut isn't broken. It's <span class="ital u-accent">misunderstood</span>.</h2>
				<p class="lead" style="margin-top:20px">IBS is a problem of gut-brain communication, not a defect in your gut. When that connection gets noisy, normal signals get amplified into pain and urgency. Copables is designed to help quiet that channel.</p>
			</div>
			<div class="gutbrain reveal">
				<div class="loop">
					<div class="loop-title">The gut-brain loop</div>
					<div class="arc"></div>
					<div class="node node--gut"><span><small>Gut</small>sends an<br>ordinary signal</span></div>
					<div class="node node--brain"><span><small>Brain</small>amplifies<br>the signal</span></div>
					<div class="node node--pain"><span><small>Felt as</small>pain &amp;<br>urgency</span></div>
					<div class="node node--anx"><span><small>Anxiety</small>feeds back<br>to the gut</span></div>
					<div class="arrow a1">↑</div>
					<div class="arrow a2">→</div>
					<div class="arrow a3">↓</div>
					<div class="arrow a4">←</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── HARVARD TRIAL STAT ───────────────────────────── -->
<section class="section alt">
	<div class="wrap">
		<div class="center measure mx-auto reveal" style="margin-bottom:40px">
			<p class="eyebrow" style="justify-content:center">Tried everything?</p>
			<h2 class="h2">In a landmark 2010 Harvard trial, 70% more IBS patients reported relief from an <span class="ital u-accent">honest</span> placebo.</h2>
			<p class="lead" style="margin-top:22px">It wasn't a one-off. In 2021 the same Harvard lab ran the trial again with 262 patients, more than triple the original, and the result held. This time they also compared the honest placebo to a concealed one, the kind you don't know you're taking. The two worked equally well. Knowing it was a placebo didn't weaken the effect.</p>
		</div>

		<div class="stat-callout reveal">
			<div class="stat-pill"><span class="yr">2010</span><span class="num" data-count="80">80</span><span class="unt">patients</span></div>
			<span class="stat-arrow">→</span>
			<div class="stat-pill"><span class="yr">2021</span><span class="num" data-count="262">262</span><span class="unt">patients</span></div>
		</div>

		<div class="cite-grid">
			<article class="cite-card reveal">
				<p class="cite-text">Kaptchuk T.J. et al (2010). "Placebos without Deception: A Randomized Controlled Trial in Irritable Bowel Syndrome." <em>PLoS ONE</em> 5(12):e15591.</p>
				<a class="cite-link" href={KAPTCHUK_2010} target="_blank" rel="noopener noreferrer">View study →</a>
			</article>
			<article class="cite-card reveal">
				<p class="cite-text">Lembo A. et al (2021). "Open-label placebo vs double-blind placebo for irritable bowel syndrome: a randomized clinical trial." <em>PAIN</em> 162(9):2428-2435.</p>
				<a class="cite-link" href={LEMBO_2021} target="_blank" rel="noopener noreferrer">View study →</a>
			</article>
		</div>
	</div>
</section>

<!-- ── WHAT'S IN THE KIT ────────────────────────────── -->
<section class="section">
	<div class="wrap">
		<div class="center measure mx-auto reveal" style="margin-bottom:44px">
			<p class="eyebrow">What's in the box</p>
			<h2 class="h2">It's not just a <span class="squig">pill<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M3 8 C 40 2, 70 12, 100 6 S 165 2, 197 7" filter="url(#chalk)" /></svg></span>.</h2>
			<p class="lead" style="margin-top:18px">On its own, a placebo is just a capsule. What makes Copables work is the system around it. Here's everything in the box.</p>
		</div>

		<div class="kit-cols">
			<div class="kit-cols__photo reveal">
				<div class="kit-carousel" role="region" aria-label="Kit photos"
					onmouseenter={() => kitPaused = true}
					onmouseleave={() => kitPaused = false}
					onfocusin={() => kitPaused = true}
					onfocusout={() => kitPaused = false}
				>
					<div class="kit-stage">
						<div class="kit-carousel__viewport brand-img kit-full__img">
							{#each kitSlides as slide, i}
								<figure class="kit-slide" class:active={i === kitIndex}>
									<img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} aria-hidden={i !== kitIndex} />
									<span class="kit-badge {slide.badgeClass}">{slide.badge}</span>
								</figure>
							{/each}
						</div>
						<button class="kit-arrow kit-arrow--prev" onclick={kitPrev} aria-label="Previous photo">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6"/></svg>
						</button>
						<button class="kit-arrow kit-arrow--next" onclick={kitNext} aria-label="Next photo">
							<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>
						</button>
					</div>
					<p class="kit-full__cap">{kitSlides[kitIndex].cap}</p>
					<div class="kit-dots" role="tablist" aria-label="Kit photos">
						{#each kitSlides as slide, i}
							<button class="kit-dot" class:active={i === kitIndex}
								onclick={() => kitGo(i)}
								aria-label={`Photo ${i + 1} of ${kitSlides.length}`}
								aria-selected={i === kitIndex}
								role="tab"
							></button>
						{/each}
					</div>
				</div>
			</div>

			<div class="kit-cols__list reveal">
				<p class="eyebrow">What's inside</p>

				<div class="kit-row">
					<span class="kit-row__icon tint-blue">
						<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 9h10v3H19z"/><path d="M20 12v2M28 12v2"/><path d="M17 14h14a3 3 0 0 1 3 3v19a3 3 0 0 1-3 3H17a3 3 0 0 1-3-3V17a3 3 0 0 1 3-3z"/><path d="M15 25h18M15 30h18"/></svg>
					</span>
					<div>
						<h3>The OLP gummies</h3>
						<p>30 open-label placebo gummies. Two a day, before breakfast. You know they're placebos. That's the point.</p>
					</div>
				</div>

				<div class="kit-row">
					<span class="kit-row__icon tint-orange">
						<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="14" y="15" width="20" height="24" rx="2.5" transform="rotate(-7 24 27)"/><rect x="14" y="13" width="20" height="24" rx="2.5" transform="rotate(5 24 25)"/><path d="M18 20h12M18 24h12M18 28h8" transform="rotate(5 24 25)"/></svg>
					</span>
					<div>
						<h3>Daily CBT cards</h3>
						<p>Fourteen daily cards, each a short science-backed exercise to retrain how your brain reads gut signals.</p>
					</div>
				</div>

				<div class="kit-row">
					<span class="kit-row__icon tint-blue">
						<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 36L34 18"/><path d="M16 36l-2 5 5-2z"/><path d="M34 18l4-4"/></svg>
					</span>
					<div>
						<h3>The pen</h3>
						<p>Because doing the exercise by hand is part of how the protocol works. Physical, not just tapping a screen.</p>
					</div>
				</div>

				<div class="kit-row">
					<span class="kit-row__icon tint-orange">
						<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="10" y="13" width="28" height="26" rx="2.5"/><path d="M10 19h28"/><path d="M17 10v4M24 10v4M31 10v4"/><path d="M16 24l2 2 3-4M24 24l2 2 3-4M32 24l2 2 3-4M16 32l2 2 3-4M24 32l2 2 3-4"/></svg>
					</span>
					<div>
						<h3>The accountability tracker</h3>
						<p>A 14-day tracker. Mark off each day. The streak does more work than you'd expect.</p>
					</div>
				</div>

				<div class="kit-row">
					<span class="kit-row__icon tint-blue">
						<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="8" width="16" height="32" rx="3"/><path d="M21 12h6"/><path d="M19 17h10M19 21h10M19 25h7"/><circle cx="29" cy="31" r="3"/><path d="M21 36h6"/></svg>
					</span>
					<div>
						<h3>The Copables app</h3>
						<p>Walks you through each day's CBT lesson, and scans your card to give you feedback on the exercise.</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── TESTIMONIALS ─────────────────────────────────── -->
<section class="section section--tight">
	<div class="wrap">
		<div class="bigquote reveal measure mx-auto">
			<span class="qmark">"</span>
			<h2>"If you are struggling with IBS, please do this for yourself and try it. This protocol gave me a life changing breakthrough far beyond what I initially signed up for."</h2>
			<div class="stars">★★★★★</div>
			<p class="rating-line">Shawn T. · Feb 2026</p>
		</div>
	</div>
</section>

<section class="section--tight" style="padding-top:0">
	<div class="wrap">
		<div class="t-grid">
			<article class="t-card reveal">
				<div class="t-head"><span class="avatar" style="background:#2F95F2">VE</span><div><div class="who">Veronica E.</div><div class="where">United States</div></div></div>
				<p class="body">"I really enjoyed the streak, the ritual, being led through the guided OLP, learning about the process, and getting to have candy every day."</p>
				<div class="t-foot"><span class="stars">★★★★★</span><span class="date">Feb 2026</span></div>
			</article>
			<article class="t-card reveal">
				<div class="t-head"><span class="avatar" style="background:#F2901E">DR</span><div><div class="who">Devin R.</div><div class="where">United Kingdom</div></div></div>
				<p class="body">"The ritual is the part that got me. Two gummies, the app check-in, the tracker. It gave my brain something to do other than panic about my stomach. Symptoms followed."</p>
				<div class="t-foot"><span class="stars">★★★★★</span><span class="date">Jan 2026</span></div>
			</article>
			<article class="t-card reveal">
				<div class="t-head"><span class="avatar" style="background:#8A2433">SL</span><div><div class="who">Sofia L.</div><div class="where">Canada</div></div></div>
				<p class="body">"What sold me is that they tell you straight up it's a placebo. No mystic claims, just the science. Skeptic to believer in about ten days. Re-ordered already."</p>
				<div class="t-foot"><span class="stars">★★★★★</span><span class="date">Jan 2026</span></div>
			</article>
		</div>
		<p class="tiny center" style="margin-top:22px"><span class="verified">✓ Verified users</span>&nbsp;·&nbsp;reviews collected via user interviews</p>
	</div>
</section>

<!-- ── COPABLES ISN'T RIGHT FOR EVERYONE (redesigned) ── -->
<section class="section">
	<div class="wrap fit-wrap">
		<!-- A. Intro -->
		<div class="center reveal" style="margin-bottom:48px">
			<p class="eyebrow" style="justify-content:center">An honest fit check</p>
			<h2 class="h2">Copables isn't right for everyone.</h2>
			<p class="lead" style="margin-top:18px; max-width:46ch; margin-left:auto; margin-right:auto">It isn't a cure, and it won't work for everyone. But it might be a <span class="fit__under">fit</span> if you see yourself here.</p>
		</div>

		<!-- B. Qualification grid (2x2, airy, on paper) -->
		<div class="qual-grid reveal">
			<div class="qual-item"><span class="ck">✓</span><span>Your gut has quietly shrunk where you'll go and what you'll eat</span></div>
			<div class="qual-item"><span class="ck">✓</span><span>You suspect stress makes your symptoms worse</span></div>
			<div class="qual-item"><span class="ck">✓</span><span>You trust research over wellness hype</span></div>
			<div class="qual-item"><span class="ck">✓</span><span>You've had IBS for years, or were recently diagnosed</span></div>
		</div>

		<!-- C. Guarantee panel (focal blue-tint) -->
		<div class="guarantee-panel reveal">
			<div class="gp__top">
				<p class="eyebrow gp__eyebrow">Our promise to you</p>
				<span class="trust-chip"><span class="ic">✓</span> Money-back guarantee</span>
			</div>
			<p class="gp__body">We think open-label placebos are one of the most underused tools in medicine, so here's the deal. Take the assessment. If it says you're a good fit, complete the 14 days. If you don't feel better, we'll refund your protocol.</p>
			<div class="gp__steps">
				<div class="gstep"><span class="rn">01</span><div><strong>Complete the protocol.</strong> Finish all 14 days.</div></div>
				<div class="gstep"><span class="rn">02</span><div><strong>Wait one week.</strong> Let any effects settle.</div></div>
				<div class="gstep"><span class="rn">03</span><div><strong>Get a full refund.</strong> If you're not satisfied.</div></div>
			</div>
			<a class="btn btn--green btn--lg" href="/quiz/ibs" onclick={() => ctaClick('fit')}>See if it fits <span class="arrow">→</span></a>
		</div>
	</div>
</section>

<!-- ── FOUR STEPS (Nerva-style timeline) ───────────── -->
<section class="section" id="stepsSection">
	<hr class="band-rule" />
	<div class="wrap">
		<div class="steps-layout">
			<div class="steps-intro reveal">
				<p class="eyebrow">How it works</p>
				<h2 class="h2">Four steps to feeling better.</h2>
				<a class="btn btn--primary btn--lg" href="/quiz/ibs" onclick={() => ctaClick('steps')}>Start the assessment <span class="arrow">→</span></a>
			</div>
			<div class="steps-timeline">
				<div class="step reveal">
					<div class="step__marker"><span class="n">1</span></div>
					<div class="step__body">
						<div class="step__text"><h3>Take the 4-minute assessment</h3><p>Copables isn't right for everyone. A short set of questions about you and your symptoms checks if you're a good fit.</p></div>
						<div class="step__img ph" data-label="step-1: assessment / quiz screen mock"></div>
					</div>
				</div>
				<div class="step reveal">
					<div class="step__marker"><span class="n">2</span></div>
					<div class="step__body">
						<div class="step__text"><h3>Your 14-day kit arrives</h3><p>One OLP-2 protocol box: 30 gummies, your set of daily cards, a 14-day tracker, a pen, and access to the guided app.</p></div>
						<div class="step__img ph" data-label="step-2: the kit / box photo"></div>
					</div>
				</div>
				<div class="step reveal">
					<div class="step__marker"><span class="n">3</span></div>
					<div class="step__body">
						<div class="step__text"><h3>Fifteen minutes a day</h3><p>Each day the app walks you through a 3-step, science-backed protocol that includes physical handwriting to help rewire your thoughts.</p></div>
						<div class="step__img ph" data-label="step-3: app + handwritten card"></div>
					</div>
				</div>
				<div class="step reveal">
					<div class="step__marker"><span class="n">4</span></div>
					<div class="step__body">
						<div class="step__text"><h3>Feel like yourself again.</h3><p>Take forward any relief you've gained over the protocol, plus 14 days of science-backed strategies to manage your IBS.</p></div>
						<div class="step__img ph" data-label="step-4: person looking relieved / back to normal"></div>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── CLOSING CTA removed per spec §2(f); four steps is the final section ── -->

</main>
</div>

<style>
/* ── Reset padding from layout ─────────────────────── */
:global(main:has(.prelander-page)) { padding: 0; }

.prelander-page {
	font-family: var(--ff);
	background: var(--paper);
	color: var(--ink);
	font-size: 18px;
	line-height: 1.55;
	font-weight: 400;
	-webkit-font-smoothing: antialiased;
	text-rendering: optimizeLegibility;
}

/* ── Layout helpers ──────────────────────────────── */
.wrap { width:100%; max-width:var(--maxw); margin:0 auto; padding:0 24px; }
.section { padding: clamp(56px,8vw,110px) 0; }
.section--tight { padding: clamp(48px,6vw,80px) 0; }
.alt  { background: var(--paper-2); border-top: 2px solid var(--ink); }
.center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }
.measure { max-width: 620px; }

/* ── Eyebrow ─────────────────────────────────────── */
.eyebrow {
	font-weight: 800; font-size: 11px; letter-spacing:.22em; text-transform:uppercase;
	color: var(--accent-deep); margin:0 0 20px;
	display: inline-flex; align-items: center; gap: 10px;
}
.eyebrow::before { content:""; width:26px; height:2px; background:currentColor; display:inline-block; }

/* ── Type ────────────────────────────────────────── */
h1,h2,h3 { margin:0; font-weight:800; line-height:1.0; letter-spacing:-0.03em; }
.h1 { font-size: clamp(44px,7.5vw,92px); line-height:0.95; letter-spacing:-0.035em; }
.h2 { font-size: clamp(38px,5.5vw,68px); line-height:0.97; letter-spacing:-0.04em; }
.ital { font-style:italic; font-weight:800; }
.u-accent { color: var(--accent-deep); }
.squig { position: relative; white-space: nowrap; }
.squig svg { position: absolute; left: -2%; bottom: -0.12em; width: 104%; height: 0.32em; overflow: visible; }
.squig svg path { fill: none; stroke: var(--orange); stroke-width: 5; stroke-linecap: round; }
.lead { font-size: clamp(18px,1.6vw,22px); color:var(--ink-soft); line-height:1.55; }
.tiny { font-size:13.5px; line-height:1.5; color:var(--ink-soft); }

/* ── Buttons ─────────────────────────────────────── */
.btn {
	display:inline-flex; align-items:center; justify-content:center; gap:10px;
	font-family:var(--ff); font-weight:800; font-size:17px; letter-spacing:-0.01em;
	padding:17px 30px; border-radius:999px; border:0; cursor:pointer;
	text-decoration:none; transition:transform .14s ease, box-shadow .2s ease;
	line-height:1;
}
.btn--primary { background: var(--accent); color:#fff; box-shadow:0 6px 0 var(--accent-deep); }
.btn--primary:hover { transform:translateY(-2px); box-shadow:0 8px 0 var(--accent-deep); }
.btn--primary:active { transform:translateY(2px); box-shadow:0 3px 0 var(--accent-deep); }
.btn--green { background: var(--green-ok); color:#fff; box-shadow:0 6px 0 var(--green-deep); }
.btn--green:hover { transform:translateY(-2px); box-shadow:0 8px 0 var(--green-deep); }
.btn--green:active { transform:translateY(2px); box-shadow:0 3px 0 var(--green-deep); }
.btn--lg { font-size:19px; padding:21px 40px; }
.btn .arrow { font-size:1.15em; line-height:0; transform:translateY(1px); }
.cta-note { margin-top:14px; font-size:14px; color:var(--ink-soft); display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

/* ── Offer strip (rotating ticker) ───────────────── */
.offer {
	--offer-h: 40px;
	background:var(--ink); color:var(--paper);
	font-size:14px; font-weight:600; letter-spacing:-0.01em;
}
.offer__viewport { height:var(--offer-h); overflow:hidden; }
.offer__track { display:flex; flex-direction:column; will-change:transform; animation:offer-roll 16s infinite; }
.offer__item {
	flex:none; height:var(--offer-h); line-height:var(--offer-h);
	padding:0 16px; text-align:center; white-space:nowrap;
}
.offer :global(b) { color:var(--orange); font-weight:800; }

/* Swipe-up roll: hold each message, then ease up to the next. 4 messages + a
   clone of the first at the end so the reset from -4h back to 0 is seamless. */
@keyframes offer-roll {
	0%,   22%  { transform:translateY(0);                            animation-timing-function:cubic-bezier(.65,0,.35,1); }
	25%,  47%  { transform:translateY(calc(var(--offer-h) * -1));    animation-timing-function:cubic-bezier(.65,0,.35,1); }
	50%,  72%  { transform:translateY(calc(var(--offer-h) * -2));    animation-timing-function:cubic-bezier(.65,0,.35,1); }
	75%,  97%  { transform:translateY(calc(var(--offer-h) * -3));    animation-timing-function:cubic-bezier(.65,0,.35,1); }
	100%       { transform:translateY(calc(var(--offer-h) * -4)); }
}
@media (prefers-reduced-motion:reduce) {
	.offer__track { animation:none; }
}
@media (max-width:560px) {
	.offer { --offer-h:36px; font-size:12.5px; }
	.offer__item { padding:0 12px; }
}

/* ── Header ──────────────────────────────────────── */
.header {
	position:sticky; top:0; z-index:60;
	background:rgba(251,246,234,.86); backdrop-filter:blur(10px);
	border-bottom:1px solid var(--line);
}
.header__row { display:flex; align-items:center; justify-content:space-between; height:70px; gap:16px; }
.brand { display:flex; align-items:center; gap:12px; text-decoration:none; }
.wordmark { font-family:var(--ff); font-weight:900; font-size:22px; color:var(--ink); letter-spacing:-0.03em; }
.tag {
	font-size:11px; font-weight:800; letter-spacing:.1em; text-transform:uppercase;
	color:var(--wine); background:#f6e3e3; border:1px solid #eccccc;
	padding:4px 9px; border-radius:999px;
}
.header .btn { padding:12px 22px; font-size:15px; box-shadow:0 4px 0 var(--accent-deep); }
.header__right { display:flex; align-items:center; gap:18px; }
@media (max-width:640px) { .tag { display:none; } }

/* ── Hero ────────────────────────────────────────── */
.hero { position:relative; overflow:hidden; background:var(--paper); }
.hero-grid { display:grid; grid-template-columns:1fr; gap:38px; align-items:center; padding:clamp(46px,6vw,76px) 0 clamp(54px,7vw,86px); }
@media (min-width:940px) { .hero-grid { grid-template-columns:1.05fr .95fr; gap:56px; } }
.hero h1 { margin-bottom:0; font-size:clamp(42px,5.5vw,72px); line-height:0.97; letter-spacing:-0.04em; }
@media (min-width:1180px) { .hero h1 { font-size:78px; } }
.hero .lead { max-width:38ch; }
.hero-checks { list-style:none; margin:28px 0 32px; padding:0; display:grid; gap:14px; }
.hero-checks li { display:flex; align-items:flex-start; gap:13px; font-size:17px; font-weight:600; line-height:1.45; }
.hero-checks .ck { flex:none; width:26px; height:26px; border-radius:50%; background:var(--accent-tint); color:var(--accent-deep); display:grid; place-items:center; font-weight:900; font-size:14px; margin-top:1px; }

/* ── Hero visual ─────────────────────────────────── */
.hero-visual { position:relative; }
.hero-frame { aspect-ratio:4/5; border-radius:var(--frame-radius-lg); }
.hero-frame img { width:100%; height:100%; object-fit:cover; }
.hero-stamp {
	position:absolute; left:18px; bottom:18px; z-index:2;
	background:var(--paper); color:var(--ink); border-radius:14px; padding:12px 16px;
	font-weight:800; box-shadow:var(--shadow-md); max-width:70%; font-size:14px; line-height:1.25;
}
.hero-stamp small { display:block; font-weight:700; color:var(--ink-soft); font-size:11.5px; letter-spacing:.04em; text-transform:uppercase; margin-bottom:3px; }

/* ── Image placeholder ───────────────────────────── */
.ph { background: repeating-linear-gradient(135deg,#d7cdb8 0 9px,#cfc4ad 9px 18px); position:relative; }
.ph[data-label]::after {
	content:attr(data-label); position:absolute; inset:0; display:grid; place-items:center; text-align:center;
	font-family:ui-monospace,"SF Mono",Menlo,monospace; font-size:10px; font-weight:600;
	letter-spacing:.04em; color:#6c6149; padding:6px;
}

/* ── Trust strip ─────────────────────────────────── */
.trust { border-top:2px solid var(--ink); border-bottom:2px solid var(--ink); }
.trust .wrap { padding-top:56px; padding-bottom:52px; }
.trust .lbl { text-align:center; font-size:11px; font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:38px; }
.trust .logos { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:clamp(32px,5vw,72px); max-width:980px; margin:0 auto; }
.trust .logos img { height:clamp(26px,3vw,36px); width:auto; opacity:.62; filter:grayscale(1); transition:opacity .2s; }
.trust .logos img:hover { opacity:1; }
.trust-line { text-align:center; margin:38px 0 0; font-size:14px; font-weight:700; color:var(--ink-soft); }
.trust-line span { color:var(--accent-deep); font-weight:900; }

/* ── Copables isn't right for everyone (redesigned) ── */
.fit-wrap { max-width:860px; }
.fit__under { position:relative; color:var(--accent-deep); font-style:italic; font-weight:800; }
.fit__under::after {
	content:""; position:absolute; left:-2px; right:-2px; bottom:-2px; height:8px;
	background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 8' preserveAspectRatio='none'%3E%3Cpath d='M2 5 Q 15 1, 30 4 T 60 5 T 90 4 T 118 5' stroke='%232F95F2' stroke-width='2.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E") no-repeat center/100% 100%;
	opacity:.55;
}

/* B. Qualification grid (2x2, airy, on paper) */
.qual-grid { display:grid; grid-template-columns:1fr; gap:24px; margin-bottom:56px; }
@media (min-width:620px) { .qual-grid { grid-template-columns:1fr 1fr; gap:32px 48px; } }
.qual-item { display:flex; gap:14px; align-items:flex-start; font-size:18px; font-weight:600; line-height:1.45; color:var(--ink); }
.qual-item .ck { flex:none; width:28px; height:28px; border-radius:50%; background:var(--accent); color:#fff; display:grid; place-items:center; font-weight:900; font-size:13px; margin-top:2px; }

/* C. Guarantee panel (focal blue-tint) */
.guarantee-panel {
	background:var(--green-tint); border:var(--frame-bw) solid var(--frame-ink); border-radius:var(--radius-lg); padding:clamp(32px,4.5vw,52px);
	box-shadow:var(--frame-shadow-sm); text-align:center; max-width:680px; margin:0 auto;
}
.gp__top { display:flex; align-items:center; justify-content:center; gap:16px; flex-wrap:wrap; margin-bottom:24px; }
.gp__eyebrow { margin:0; color:var(--green-deep); }
.trust-chip { display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:800; color:var(--green-deep); background:#fff; padding:6px 14px; border-radius:999px; border:1px solid var(--green-deep); }
.trust-chip .ic { font-weight:900; }
.gp__body { font-size:17px; line-height:1.6; color:var(--ink); margin:0 0 36px; }
.gp__steps { display:grid; grid-template-columns:1fr; gap:24px; margin:0 0 36px; }
@media (min-width:560px) { .gp__steps { grid-template-columns:repeat(3,1fr); gap:24px; } }
.gstep { display:flex; flex-direction:column; align-items:center; text-align:center; gap:10px; }
.gstep .rn { width:40px; height:40px; border-radius:50%; background:var(--card); border:2px solid var(--green-deep); color:var(--green-deep); display:grid; place-items:center; font-weight:800; font-size:14px; letter-spacing:-0.02em; }
.gstep div { font-size:14.5px; line-height:1.45; color:var(--ink-soft); }
.gstep strong { color:var(--ink); font-weight:800; }

/* ── Harvard trial stat ──────────────────────────── */
.stat-callout { display:flex; align-items:center; justify-content:center; gap:clamp(20px,4vw,48px); margin:0 auto 44px; }
.stat-pill { display:flex; flex-direction:column; align-items:center; gap:4px; background:var(--card); border:2px solid var(--ink); border-radius:var(--radius); padding:18px 28px; box-shadow:var(--frame-shadow-sm); min-width:140px; }
.stat-pill .yr { font-size:12px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; color:var(--ink-soft); }
.stat-pill .num { font-size:clamp(34px,5vw,52px); font-weight:900; line-height:.9; letter-spacing:-0.03em; color:var(--ink); }
.stat-pill .unt { font-size:13px; font-weight:700; color:var(--ink-soft); }
.stat-arrow { font-size:clamp(28px,4vw,44px); font-weight:900; color:var(--accent); line-height:1; }
.cite-grid { display:grid; grid-template-columns:1fr; gap:20px; max-width:860px; margin:0 auto; }
@media (min-width:720px) { .cite-grid { grid-template-columns:1fr 1fr; } }
.cite-card { background:var(--card); border:var(--frame-bw) solid var(--frame-ink); border-radius:var(--radius); padding:24px; box-shadow:var(--frame-shadow-sm); display:flex; flex-direction:column; gap:14px; }
.cite-text { font-size:14.5px; line-height:1.55; color:var(--ink-2); margin:0; }
.cite-link { font-weight:800; font-size:14px; color:var(--accent-deep); text-decoration:none; margin-top:auto; }
.cite-link:hover { text-decoration:underline; }

/* ── Testimonials ────────────────────────────────── */
.bigquote { text-align:center; }
.bigquote .qmark { font-size:88px; line-height:0; color:var(--accent); font-weight:900; height:38px; display:block; }
.bigquote h2 { font-size:clamp(26px,3.6vw,42px); font-weight:800; letter-spacing:-0.03em; line-height:1.12; margin:24px auto 26px; max-width:22ch; }
.stars { color:var(--orange); letter-spacing:3px; font-size:22px; }
.rating-line { margin-top:12px; font-weight:700; font-size:15px; color:var(--ink-soft); }
.t-grid { display:grid; grid-template-columns:1fr; gap:20px; margin-top:12px; }
@media (min-width:760px) { .t-grid { grid-template-columns:repeat(3,1fr); } }
.t-card { background:var(--card); border:var(--frame-bw) solid var(--frame-ink); border-radius:var(--radius); padding:26px 24px; box-shadow:var(--frame-shadow-sm); display:flex; flex-direction:column; }
.t-card .t-head { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.avatar { flex:none; width:44px; height:44px; border-radius:50%; display:grid; place-items:center; font-weight:800; color:#fff; font-size:16px; }
.t-card .who { font-weight:800; font-size:15.5px; line-height:1.1; }
.t-card .where { font-size:12.5px; color:var(--ink-soft); font-weight:600; }
.t-card .body { font-size:15.5px; line-height:1.5; color:var(--ink-2); }
.t-card .t-foot { margin-top:auto; padding-top:16px; display:flex; align-items:center; justify-content:space-between; }
.t-card .stars { font-size:15px; letter-spacing:2px; }
.t-card .date { font-size:12px; color:var(--ink-soft); }
.verified { font-size:11.5px; font-weight:800; color:var(--green-ok); display:inline-flex; gap:5px; align-items:center; }

/* ── Gut-brain diagram ───────────────────────────── */
.split { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
@media (min-width:900px) { .split { grid-template-columns:1fr 1fr; gap:80px; } }
.split p { margin:0 0 18px; }
.gutbrain { display:grid; place-items:center; padding:18px; }
.loop { position:relative; width:min(460px,100%); aspect-ratio:1/1; }
.loop-title {
	position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
	font-weight:900; font-size:15px; letter-spacing:-0.01em; text-align:center;
	color:var(--ink-soft); max-width:50%;
}
.node {
	position:absolute; width:128px; height:128px; border-radius:50%;
	display:grid; place-items:center; text-align:center; font-weight:800; font-size:13.5px; line-height:1.2;
	border:var(--frame-bw) solid var(--frame-ink); box-shadow:var(--frame-shadow-sm); padding:8px;
}
.node small { display:block; font-size:10px; font-weight:700; letter-spacing:.12em; text-transform:uppercase; opacity:.7; margin-bottom:4px; }
.node--gut   { top:50%; left:0; transform:translateY(-50%); background:var(--accent); color:#fff; }
.node--brain { top:0; left:50%; transform:translateX(-50%); background:var(--ink); color:var(--paper); }
.node--pain  { top:50%; right:0; transform:translateY(-50%); background:var(--orange); color:#fff; }
.node--anx   { bottom:0; left:50%; transform:translateX(-50%); background:var(--wine); color:#fff; }
.loop .arc { position:absolute; inset:64px; border:3px dashed var(--line); border-radius:50%; }
.loop .arrow { position:absolute; font-size:20px; font-weight:900; color:var(--accent-deep); line-height:1; }
.loop .a1 { top:18%; left:18%; transform:rotate(45deg); }
.loop .a2 { top:18%; right:18%; transform:rotate(45deg); }
.loop .a3 { bottom:18%; right:18%; transform:rotate(45deg); }
.loop .a4 { bottom:18%; left:18%; transform:rotate(45deg); }

/* ── What's in the kit ───────────────────────────── */
.kit-cols { display:grid; grid-template-columns:1fr; gap:36px; }
@media (min-width:820px) {
	.kit-cols { grid-template-columns:52fr 48fr; gap:56px; align-items:start; }
	.kit-cols__photo { position:sticky; top:96px; }
}
.kit-carousel { position:relative; }
/* wraps the image only, so the arrows anchor to the photo's corner, not the
   full carousel (which also holds the caption + dots below). */
.kit-stage { position:relative; }
.kit-carousel__viewport { position:relative; aspect-ratio:4/5; border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--frame-shadow-sm); }
.kit-slide { position:absolute; inset:0; margin:0; opacity:0; transition:opacity 400ms ease; }
.kit-slide.active { opacity:1; }
.kit-slide img { width:100%; height:100%; object-fit:cover; }
.kit-badge {
	position:absolute; top:16px; left:16px; z-index:3;
	display:inline-block; padding:8px 16px; border-radius:999px;
	font-family:var(--ff); font-weight:800; font-size:11px; letter-spacing:.16em; text-transform:uppercase;
	color:#fff; box-shadow:var(--frame-shadow-sm); transform:rotate(-4deg); white-space:nowrap;
}
.kit-badge--wine { background:var(--wine); }
.kit-badge--blue { background:var(--blue); }
.kit-badge--orange { background:var(--orange); }
.kit-arrow {
	position:absolute; bottom:20px;
	width:48px; height:48px; border-radius:999px;
	background:var(--card); border:2px solid var(--frame-ink);
	box-shadow:var(--frame-shadow-sm);
	display:flex; align-items:center; justify-content:center;
	color:var(--ink); cursor:pointer; z-index:3;
	transition: transform .15s ease, box-shadow .15s ease;
}
.kit-arrow:hover { box-shadow:8px 8px 0 0 rgba(20,19,15,.14); transform:translateY(-2px); }
.kit-arrow:active { transform:translateY(0); }
.kit-arrow svg { width:20px; height:20px; }
.kit-arrow--prev { right:80px; }
.kit-arrow--next { right:20px; }
.kit-full__cap { text-align:center; margin:14px 0 10px; font-size:13.5px; font-weight:700; color:var(--ink-soft); font-family:ui-monospace,"SF Mono",Menlo,monospace; }
.kit-dots { display:flex; justify-content:center; gap:8px; }
.kit-dot { width:8px; height:8px; border-radius:999px; border:none; background:var(--ink); opacity:0.2; cursor:pointer; padding:0; transition: background .2s ease, opacity .2s ease, transform .15s ease; }
.kit-dot:hover { transform:scale(1.2); }
.kit-dot.active { background:var(--accent); opacity:1; }
.kit-cols__list .eyebrow { margin-bottom:6px; }
.kit-row { display:flex; gap:18px; padding:18px 0; border-bottom:1px solid var(--line); align-items:flex-start; }
.kit-row:first-of-type { border-top:1px solid var(--line); }
.kit-row__icon { flex:0 0 44px; width:44px; height:44px; color:var(--ink); display:inline-flex; align-items:center; justify-content:center; border-radius:999px; transition: color .2s ease; }
.kit-row__icon.tint-blue { background:var(--blue-tint); color:var(--blue-deep); }
.kit-row__icon.tint-orange { background:var(--orange-tint); color:var(--orange-deep); }
.kit-row__icon svg { width:26px; height:26px; }
.kit-row h3 { font-size:18px; margin:0 0 4px; font-weight:800; letter-spacing:-0.02em; line-height:1.1; }
.kit-row p { margin:0; font-size:14.5px; line-height:1.5; color:var(--ink-soft); }
@media (max-width:819px) {
	.kit-carousel { max-width:560px; margin:0 auto; }
	.kit-carousel__viewport { aspect-ratio:16/10; }
}

/* ── Steps (Nerva-style timeline) ─────────────────── */
.band-rule { border:0; border-top:2px solid var(--ink); margin:0 0 clamp(56px, 8vw, 110px); width:100%; }
.steps-layout { display:grid; grid-template-columns:1fr; gap:32px; }
@media (min-width:900px) {
	.steps-layout { grid-template-columns:minmax(280px,340px) 1fr; gap:64px; align-items:start; }
	.steps-intro { position:sticky; top:90px; }
}
.steps-intro { display:flex; flex-direction:column; align-items:flex-start; gap:18px; }
.steps-intro .eyebrow { margin-bottom:0; }
.steps-intro h2 { margin:0; }
.steps-intro .btn { margin-top:8px; }
@media (max-width:640px) {
	.steps-intro { align-items:center; text-align:center; }
	.steps-intro .eyebrow { justify-content:center; }
}

.steps-timeline { position:relative; display:grid; gap:44px; }
.steps-timeline::before {
	content:""; position:absolute; left:27px; top:var(--line-top,54px); bottom:var(--line-bottom,54px); width:2px; background:var(--line);
}
@media (max-width:640px) { .steps-timeline::before { left:23px; } }

.step { display:block; position:relative; margin-left:72px; background:var(--card); border:var(--frame-bw) solid var(--frame-ink); border-radius:var(--radius); padding:26px 30px; box-shadow:var(--frame-shadow-sm); }
.step__marker { position:absolute; left:-72px; top:26px; z-index:1; }
.step .n {
	width:56px; height:56px; border-radius:50%;
	background:var(--ink); color:var(--paper);
	display:grid; place-items:center; font-weight:800; font-size:24px;
}
.step:nth-child(2) .n { background:var(--accent); }
.step:nth-child(3) .n { background:var(--orange); }
.step:nth-child(4) .n { background:var(--wine); }

.step__body { display:flex; flex-direction:column; gap:18px; }
.step__text h3 { font-size:21px; margin:0 0 6px; }
.step__text p { margin:0; font-size:15.5px; color:var(--ink-soft); line-height:1.55; }
.step__img { aspect-ratio:16/9; border-radius:var(--frame-radius); border:var(--frame-bw) solid var(--frame-ink); box-shadow:var(--frame-shadow-sm); overflow:hidden; max-width:520px; }
:global(.step__img img) { width:100%; height:100%; object-fit:cover; display:block; }

@media (max-width:640px) {
	.step { margin-left:60px; padding:20px; }
	.step__marker { left:-60px; top:20px; }
	.step .n { width:48px; height:48px; font-size:20px; }
	.step__body { gap:14px; }
	.step__text h3 { font-size:18px; }
	.step__text p { font-size:14px; }
	.step__img { aspect-ratio:4/3; max-width:none; }
}

/* ── Mobile-first polish (99% of traffic) ─────────── */
@media (max-width:640px) {
	.wrap { padding:0 18px; }
	.section { padding: clamp(44px,12vw,72px) 0; }
	.section--tight { padding: clamp(36px,10vw,60px) 0; }

	/* make the big CTAs easy to thumb */
	.btn--lg { display:flex; width:100%; font-size:18px; padding:20px 28px; }
	.header .btn { padding:10px 16px; font-size:14px; }

	/* hero */
	.hero-grid { gap:28px; padding:clamp(36px,8vw,56px) 0; }
	.hero h1 { font-size:clamp(36px,10vw,46px); line-height:1.0; }
	.hero .lead { font-size:17px; }
	.hero-checks { gap:12px; margin:22px 0 26px; }
	.hero-checks li { font-size:16px; }
	.hero-frame { aspect-ratio:1/1; }
	.hero-stamp { left:12px; bottom:12px; padding:10px 12px; font-size:12px; }

	/* trust strip */
	.trust .wrap { padding-top:38px; padding-bottom:34px; }
	.trust .lbl { font-size:10px; letter-spacing:.18em; margin-bottom:26px; }
	.trust .logos { gap:22px 32px; }
	.trust .logos img { height:26px; }
	.trust-line { margin-top:26px; }

	/* root cause diagram */
	.split { gap:32px; }
	.gutbrain { padding:0; }
	.loop { width:min(320px,100%); }
	.node { width:92px; height:92px; font-size:11px; }
	.node small { font-size:9px; letter-spacing:.08em; }
	.loop .arc { inset:46px; border-width:2px; }
	.loop-title { font-size:12px; }
	.loop .arrow { font-size:15px; }

	/* Harvard stat */
	.stat-callout { flex-direction:column; gap:16px; }
	.stat-pill { width:100%; max-width:240px; padding:16px 22px; }
	.stat-pill .num { font-size:38px; }
	.stat-arrow { transform:rotate(90deg); }
	.cite-card { padding:20px; }

	/* testimonials */
	.bigquote .qmark { font-size:64px; height:28px; }
	.bigquote h2 { font-size:clamp(22px,6.5vw,26px); margin:18px auto 20px; }
	.t-card { padding:22px 20px; }

	/* fit / guarantee */
	.qual-grid { gap:16px; margin-bottom:36px; }
	.qual-item { font-size:16px; gap:12px; }
	.guarantee-panel { padding:28px 20px; }
	.gp__top { gap:10px; margin-bottom:16px; }
	.gp__body { font-size:16px; margin-bottom:24px; }
	.gp__steps { gap:18px; }
	.gstep .rn { width:36px; height:36px; font-size:13px; }

	/* four steps */
	.steps-timeline { gap:32px; }

	/* kit tiles */
	.kit-full__img { aspect-ratio:4/3; }
}

/* ── Reveal animation ────────────────────────────── */
@media (prefers-reduced-motion:no-preference) {
	.reveal { opacity:0; transform:translateY(22px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
	:global(.reveal.in) { opacity:1; transform:none; }
}
</style>
