<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';
	import Footer from '$components/Footer.svelte';

	const RESULTS_KEY = 'copables_quiz_results';
	const PRICE = 99;
	const FIT_STRONG = 80;
	const FIT_GOOD = 60;
	const PROJECTED_DROP = 50;

	const KAPTCHUK_2010 = 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591';
	const LEMBO_2021 = 'https://journals.lww.com/pain/Fulltext/2021/09000/Open_label_placebo_vs_double_blind_placebo_for.6.aspx';

	const STUDIES = [
		{ featured: true, result: '59% reported adequate relief vs 35% with no treatment', source: 'Kaptchuk et al. · PLoS ONE · 2010', oneliner: 'The foundational IBS open-label placebo trial — 80 patients took sugar pills they knew were sugar pills, and did roughly twice as well as those who took nothing.', url: KAPTCHUK_2010 },
		{ featured: true, result: '69% saw a clinically meaningful 50+ point drop in symptom severity', source: 'Lembo et al. · PAIN · 2021', oneliner: '262 IBS patients; the honest placebo matched the hidden one. 1 in 4 saw a 150+ point drop — a shift considered life-altering.', url: LEMBO_2021 },
		{ result: '22% reduction in negative emotion (fMRI-confirmed)', source: 'Schaefer et al. · Neuropsychopharmacology · 2022', oneliner: 'Brain imaging showed OLPs create genuinely different brain activity — the same regions real anti-anxiety medication engages.', url: 'https://www.nature.com/articles/s41386-022-01296-3' },
		{ result: '46% reduction in anxiety-induced test failure', source: 'Schaefer & Enge · Scientific Reports · 2024', oneliner: 'Driving-test failure dropped from 53% to 29% on an honest placebo.', url: 'https://www.nature.com/articles/s41598-024-56600-6' },
		{ result: '79% reduction in PMS symptoms', source: 'Frey Nascimento et al. · BMJ Evidence-Based Medicine · 2025', oneliner: 'A randomized controlled trial of open-label placebo for premenstrual symptoms.', url: 'https://ebm.bmj.com/content/early/2025/03/03/bmjebm-2024-112875' },
		{ result: '29% improvement in fatigue severity', source: 'Hoenemeyer et al. · Scientific Reports · 2018', oneliner: 'Open-label placebo for cancer-related fatigue; a 39% improvement in fatigue-disrupted quality of life.', url: 'https://www.nature.com/articles/s41598-018-20993-y' },
		{ result: 'A sugar pill honestly labelled “placebo” produced over half the pain relief of the real drug', source: 'Kam-Hansen et al. · Science Translational Medicine · 2014', oneliner: 'How a placebo is framed changes what it does. The label is part of the medicine.', url: 'https://www.science.org/doi/10.1126/scitranslmed.3006175' },
		{ result: '52% lasting remission at 12-month follow-up', source: 'Journal of Affective Disorders · 2022', oneliner: 'Guided CBT for depression and anxiety, vs 39% for treatment-as-usual.', url: 'https://www.sciencedirect.com/science/article/pii/S0165032722010217' }
	];

	const FEATURED_REVIEW = {
		quote: 'The CBT part sank in deeper than I expected. For the first time I had the discipline to actually show up for other things — the gym, my goals. Five months later I’m still at it, and the only thing that changed was doing this program.',
		name: 'Shawn T.',
		initials: 'ST',
		color: '#2E9E6B',
		where: 'BC, Canada',
		date: 'Feb 2026',
		headline: 'A real improvement in symptoms — plus the unexpected discipline to finally follow through on goals I’d failed at for years.'
	};

	const SUPPORTING_REVIEWS = [
		{ quote: 'I really enjoyed the streak, the ritual, being led through the guided OLP, learning about the process, and getting to have candy every day.', name: 'Veronica E.', initials: 'VE', color: '#2F95F2', where: 'United States', date: 'Feb 2026' },
		{ quote: 'The ritual is the part that got me. Two capsules, the app check-in, the tracker. It gave my brain something to do other than panic about my stomach. Symptoms followed.', name: 'Devin R.', initials: 'DR', color: '#F2901E', where: 'United Kingdom', date: 'Jan 2026' },
		{ quote: 'What sold me is that they tell you straight up it’s a placebo. No mystic claims, just the science. Skeptic to believer in about ten days. Re-ordered already.', name: 'Sofia L.', initials: 'SL', color: '#8A2433', where: 'Canada', date: 'Jan 2026' }
	];

	const TRAIT_ICONS: Record<string, string> = {
		search: '<circle cx="11" cy="11" r="7" /><line x1="16.5" y1="16.5" x2="21" y2="21" />',
		flask: '<path d="M9 3h6" /><path d="M10 3v5.6L4.9 17.7A1.4 1.4 0 0 0 6.1 19.8h11.8a1.4 1.4 0 0 0 1.2-2.1L14 8.6V3" /><line x1="7.2" y1="14.2" x2="16.8" y2="14.2" />',
		loop: '<polyline points="20 4 20 9 15 9" /><polyline points="4 20 4 15 9 15" /><path d="M19 9a7 7 0 0 0-12-3.2L4 8.5" /><path d="M5 15a7 7 0 0 0 12 3.2L20 15.5" />',
		heart: '<path d="M12 20.3l-1.5-1.4C5.4 14.3 2.5 11.7 2.5 8.4A4.6 4.6 0 0 1 7.1 3.8c1.6 0 3 .8 3.9 2 .9-1.2 2.3-2 3.9-2a4.6 4.6 0 0 1 4.6 4.6c0 3.3-2.9 5.9-8 10.5L12 20.3z" />'
	};

	const TRAITS = [
		{ tone: 'ink', icon: 'search', title: 'Curious about your own physiology', body: 'You want to understand the mechanism — not just numb the noise.' },
		{ tone: 'blue', icon: 'flask', title: 'A believer in science-backed evidence', body: 'You trust the data, and the evidence behind this is real.' },
		{ tone: 'orange', icon: 'loop', title: 'Open to a mind-body approach', body: 'You accept the gut and brain run on one connected system.' },
		{ tone: 'wine', icon: 'heart', title: 'An active participant in your health', body: 'You show up daily — and showing up is the active ingredient.' }
	];

	const FAILS = [
		{ t: 'Elimination diets', b: 'shrink your world without fixing the signal.' },
		{ t: 'Medical tests', b: 'look for damage, find none, and you get told it’s “just stress” and sent home.' },
		{ t: 'None of it', b: 'touches the actual mechanism: the gut–brain connection itself.' }
	];

	const PHASES = [
		{ range: 'Days 1–3', theme: 'Gut awareness & gentle observation', items: ['Start the ritual', 'Notice patterns without judging them', 'Set the daily rhythm'] },
		{ range: 'Days 4–7', theme: 'Reframing food & flare thoughts', items: ['The “danger” prediction starts to loosen', 'Fewer catastrophic what-ifs', 'Meals feel less like gambling'] },
		{ range: 'Days 8–10', theme: 'Living beyond the symptoms', items: ['Showing up gets easier', 'Flat stretches get shorter', 'You think about it less'] },
		{ range: 'Days 11–14', theme: 'Action & long-term confidence', items: ['A warmer baseline', 'The habit holds on its own', 'Confidence that it can stay this way'] }
	];

	const GUARANTEE_STEPS = [
		{ n: '01', t: 'Try it', b: 'Finish all 14 days.' },
		{ n: '02', t: 'Wait', b: 'Let it settle — give it the full two weeks.' },
		{ n: '03', t: 'Get a full refund', b: 'If you’re not satisfied, a full refund.' }
	];

	const KIT_SLIDES = [
		{ src: '/assets/kit.webp', alt: 'The complete Copables 14-day IBS protocol kit laid out', cap: 'Everything in your 14-day box.' },
		{ src: '/assets/ibs-bottle.webp', alt: 'The OLP capsules jar, 30 open-label placebo capsules', cap: 'The OLP capsules, 30 per jar.' },
		{ src: '/assets/ritual-cards.webp', alt: 'Daily CBT cards fanned out with a pen', cap: 'Daily ritual cards, one per day.' }
	];

	const FAQS = [
		{ cat: 'The product', q: 'What exactly is in the box?', a: 'OLP Treatment N°2: 30 natural, 100% vegan capsules (a 14-day supply at two a day), a 14-day accountability tracker, the ritual cards, the “Mind Over Medicine” welcome guide, and access to the guided Copables app.' },
		{ cat: 'The product', q: 'Wait — it’s a placebo? And you’re telling me?', a: 'Yes. It’s an open-label placebo: we tell you upfront, on the label, exactly what it is. Decades of research — including the 2010 Harvard IBS trial — show it still works, because your brain responds to ritual, conditioning and expectation whether or not you’re “fooled.”' },
		{ cat: 'Results & buying', q: 'What should I expect, and when?', a: 'Most members notice calmer days inside the two weeks. The Harvard trials showed meaningful symptom relief over the same window. Everyone’s different — that’s exactly why it’s backed by a 90-day money-back guarantee.' },
		{ cat: 'Results & buying', q: 'How does Subscribe & Save work?', a: 'You save 15% and your next cycle ships automatically so you never break the habit. Pause, skip or cancel any time from your account — no emails, no fuss.' },
		{ cat: 'Safety', q: 'Is it safe to take alongside my prescription?', a: 'The capsules are inert, natural and vegan — there are no active drug interactions. That said, Copables isn’t a substitute for medical advice; keep taking anything your doctor prescribed and check with them if you have a serious condition.' }
	];

	let mounted = $state(false);
	let results: any = $state(null);

	let fitScore = $derived(typeof results?.fit?.score === 'number' ? results.fit.score : null);
	let severityScore = $derived(typeof results?.sss === 'number' ? results.sss : null);
	let redFlag = $derived(results?.safety === true);

	let fitBand = $derived(fitScore === null ? null : fitScore >= FIT_STRONG ? 'strong' : fitScore >= FIT_GOOD ? 'good' : 'minority');
	let severityBand = $derived(severityScore === null ? null : severityScore <= 175 ? 'mild' : severityScore <= 300 ? 'moderate' : 'severe');
	let projectedScore = $derived(severityScore === null ? null : Math.max(0, severityScore - PROJECTED_DROP));
	let projectedDropPct = $derived(severityScore && severityScore > 0 ? Math.round((PROJECTED_DROP / severityScore) * 1000) / 10 : null);

	let goalCallback = $derived(buildGoal(results?.goal));
	let yearsPhrase = $derived(phraseDuration(results?.answers?.duration));
	let triedList = $derived(lowerList(results?.answers?.tried));
	let symptomList = $derived(lowerList(results?.answers?.symptoms));
	let stressClause = $derived(buildStressClause(results?.answers));

	let mirrorClauses = $derived(buildMirrorClauses(yearsPhrase, triedList, symptomList, stressClause));

	let verdict = $derived(fitBand ? verdictCopy(fitBand) : null);
	let fitHeadlineHtml = $derived(
		fitBand === 'minority'
			? 'Why are you a <span style="white-space:nowrap"><span style="color:var(--blue)">partial</span> fit?</span>'
			: `Why are you a <span style="white-space:nowrap"><span style="color:var(--green-ok)">${fitBand === 'strong' ? 'strong' : 'good'}</span> fit?</span>`
	);

	const RING_R = 86;
	const RING_CIRC = 2 * Math.PI * RING_R;

	let scoreState = $state(0);
	let ringOffset = $state(RING_CIRC);
	let openPhase = $state(2);
	let openFaq = $state(-1);
	let kitIndex = $state(0);
	let kitPaused = $state(false);

	function lowerList(v: any): string[] | null {
		if (!Array.isArray(v) || v.length === 0) return null;
		return v.map((s) => String(s).toLowerCase()).filter(Boolean);
	}
	function joinList(arr: string[]): string {
		if (arr.length === 1) return arr[0];
		return arr.slice(0, -1).join(', ') + ' and ' + arr[arr.length - 1];
	}
	function phraseDuration(v: any): string | null {
		if (!v || typeof v !== 'string') return null;
		return v.charAt(0).toLowerCase() + v.slice(1);
	}
	function buildGoal(v: any): string {
		const arr = Array.isArray(v) ? v : [];
		const raw = arr.length ? arr[0] : '';
		if (raw && raw !== "I haven't figured that out yet") {
			return raw.charAt(0).toLowerCase() + raw.slice(1);
		}
		return 'to feel in control again';
	}
	function buildStressClause(a: any): string | null {
		const worse = a?.stress_worse;
		if (worse === 'Definitely' || worse === 'Sometimes') return 'your flares spike around stress';
		const timing = Number(a?.agree_stresstiming);
		if (Number.isFinite(timing) && timing >= 3) return 'your flares spike around stress';
		return null;
	}
	function buildMirrorClauses(yrs: string | null, tried: string[] | null, symp: string[] | null, stress: string | null): string[] {
		const out: string[] = [];
		if (yrs) out.push(`You’ve been living with this for ${yrs}.`);
		if (tried) out.push(`You’ve already tried ${joinList(tried)}.`);
		if (symp) out.push(`Your worst symptoms are ${joinList(symp)}, and ${stress ?? 'they shape your days'}.`);
		else if (stress) out.push(`And ${stress}.`);
		return out;
	}
	function verdictCopy(band: string) {
		if (band === 'strong') return { word: 'strong', cls: 'acc-green', head: 'You’re a strong fit for an OLP protocol.' };
		if (band === 'good') return { word: 'good', cls: 'acc-green', head: 'You’re a good fit for an OLP protocol.' };
		return { word: 'some', cls: 'acc-blue', head: 'OLP works best for a certain profile — you share some of it.' };
	}
	function heroSub(band: string): string {
		const g = goalCallback;
		if (band === 'strong') return `Based on everything you told us, an open-label placebo protocol is a strong match for you — the curiosity, the openness, and the active-participant mindset are exactly the traits tied to the strongest responses. Here’s what that means, and how it could help you ${g}.`;
		if (band === 'good') return `Based on everything you told us, an open-label placebo protocol is a good match for you — most of your answers line up with the traits tied to a strong response. Here’s what that means, and how it could help you ${g}.`;
		return `OLP works best for a certain profile, and you share some of it. The mechanism doesn’t require a perfect fit, and the daily ritual can still retrain the gut–brain loop — our guarantee removes the risk of finding out. Here’s what that means, and how it could help you ${g}.`;
	}
	function guaranteeHeadline(band: string): string {
		if (band === 'minority') return 'If the protocol doesn’t help, we’ll refund you. Simple as that.';
		return 'Because your Protocol Fit Score is in the Ideal range, we’ll refund your protocol if you don’t feel better.';
	}
	function guaranteeInline(band: string): string {
		if (band === 'minority') return 'If it doesn’t help, we refund you — no Ideal-range needed.';
		return 'Because your Fit Score is in the Ideal range, if you don’t feel better, we refund you. (Details below.)';
	}
	function buy(label: string) { track('cta_click', { label, page: 'quiz_ibs_results' }); }
	function scrollToId(id: string) {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}

	$effect(() => {
		if (!mounted || !results || redFlag || fitScore === null) return;
		const target = fitScore;
		const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			scoreState = target;
			ringOffset = RING_CIRC * (1 - target / 100);
			return;
		}
		scoreState = 0;
		ringOffset = RING_CIRC;
		const dur = 1100;
		const start = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / dur);
			const e = 1 - Math.pow(1 - t, 3);
			scoreState = Math.round(target * e);
			ringOffset = RING_CIRC * (1 - (target / 100) * e);
			if (t < 1) raf = requestAnimationFrame(tick);
			else { scoreState = target; ringOffset = RING_CIRC * (1 - target / 100); }
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	onMount(() => {
		try {
			const raw = localStorage.getItem(RESULTS_KEY);
			if (raw) results = JSON.parse(raw);
		} catch { results = null; }
		mounted = true;
	});

	$effect(() => {
		if (!mounted || !results) return;
		const revealIO = new IntersectionObserver((entries) => {
			entries.forEach((en) => {
				if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); }
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
		document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

		const lineIO = new IntersectionObserver((entries) => {
			entries.forEach((en) => {
				if (en.isIntersecting) { en.target.classList.add('draw'); lineIO.unobserve(en.target); }
			});
		}, { threshold: 0.45 });
		const lineEl = document.querySelector('.outlook-line') as SVGPathElement | null;
		if (lineEl) {
			const len = lineEl.getTotalLength();
			lineEl.style.setProperty('--len', String(len));
			lineIO.observe(lineEl);
		}

		return () => { revealIO.disconnect(); lineIO.disconnect(); };
	});

	function projY(score: number): number {
		return 150 - (Math.min(500, Math.max(0, score)) / 500) * 120;
	}
	function togglePhase(i: number) { openPhase = openPhase === i ? -1 : i; }
	function kitGo(i: number) { kitIndex = ((i % KIT_SLIDES.length) + KIT_SLIDES.length) % KIT_SLIDES.length; }
	function kitNext() { kitGo(kitIndex + 1); }
	function kitPrev() { kitGo(kitIndex - 1); }

	$effect(() => {
		if (kitPaused) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		const current = kitIndex; // tracked: restarts the 4s timer after every manual jump
		const t = setInterval(() => { kitIndex = (current + 1) % KIT_SLIDES.length; }, 4000);
		return () => clearInterval(t);
	});
</script>

<svelte:head>
	<title>Your IBS Results — Copables</title>
	<meta name="description" content="Your personalized IBS severity score, protocol fit, and the 14-day Copables protocol built around your answers." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="results-page">
	<header class="rhead">
		<a class="rbrand" href="/" aria-label="Copables home">
			<img src="/assets/wordmark.webp" alt="copables" />
		</a>
		{#if !redFlag && mounted && results}
			<button class="rhead-cta" onclick={() => scrollToId('offer')}>Start my protocol →</button>
		{/if}
	</header>

	<main id="top">
		{#if !mounted}
			<section class="rloading">
				<h1>Retrieving your results…</h1>
			</section>
		{:else if !results}
			<section class="rempty">
				<p class="eyebrow">No results found</p>
				<h1>We couldn’t find your quiz results.</h1>
				<p class="rsub">If you completed the quiz, your session may have expired. Otherwise, start fresh below.</p>
				<a class="btn btn--primary" href="/quiz/ibs">Retake the quiz →</a>
			</section>
		{:else if redFlag}
			<!-- ── SAFETY OVERRIDE (§4.1) ───────────────────────── -->
			<section class="rhero rhero--safety">
				<div class="wrap narrow">
					<div class="safety-panel reveal">
						<div class="safety-icon" aria-hidden="true">!</div>
						<p class="eyebrow acc-blue">Please speak to a clinician first</p>
						<h1 class="rh-h1">Some of your answers are worth a doctor’s eyes before any self-directed protocol.</h1>
						<p class="rsub">A few symptoms you noted can sometimes signal a condition that needs medical evaluation — not because this protocol is dangerous, but because something more urgent should be ruled out first. We’re not showing a purchase option here on purpose. Please see a doctor, then come back if it still fits.</p>
						<a class="btn btn--ink" href="https://www.nhs.uk/service-search/find-a-gp" target="_blank" rel="noopener noreferrer" onclick={() => buy('safety_find_gp')}>Find a GP or gastroenterologist →</a>
						<a class="rlink" href="/science">Read the science →</a>
					</div>
				</div>
			</section>

			<!-- Educational sections may still render (informative, harmless) -->
			{#if mirrorClauses.length}
				<section class="rmirror reveal"><div class="wrap narrow"><p class="mirror-p">{mirrorClauses.join(' ')} <span class="mirror-tail">You’re not imagining the pattern — and you’re not the kind of person who wants to be told to “just relax.”</span></p></div></section>
			{/if}
		{:else}
			<!-- ── §5.1 HERO — Your Result ─────────────────────────── -->
			<section class="rhero" id="result">
				<div class="wrap hero-grid">
					<div class="gauge-col reveal">
						{#if fitScore !== null}
							<div class="gauge" role="img" aria-label={`Protocol fit score: ${fitScore} percent, ${fitBand} fit`}>
								<svg viewBox="0 0 200 200" class="gauge-svg">
									<circle cx="100" cy="100" r={RING_R} fill="none" stroke="rgba(20,19,15,.12)" stroke-width="14" />
									<circle cx="100" cy="100" r={RING_R} fill="none" stroke="var(--blue)" stroke-width="14" stroke-linecap="round" stroke-dasharray={RING_CIRC} stroke-dashoffset={ringOffset} transform="rotate(-90 100 100)" />
								</svg>
								<div class="gauge-center">
									<span class="gauge-num">{scoreState}</span>
									<span class="gauge-label">Protocol Fit</span>
								</div>
							</div>
							<div class="fit-scale" aria-hidden="true">
								<div class="fit-scale-bar">
									<span class="seg seg-low"></span>
									<span class="seg seg-limited"></span>
									<span class="seg seg-good"></span>
									<span class="seg seg-strong"></span>
								</div>
								<div class="fit-marker" style="left:{Math.max(2, Math.min(98, fitScore))}%"></div>
								<div class="fit-scale-labels"><span>Low</span><span>Limited</span><span>Good</span><span>Strong</span></div>
							</div>
						{/if}
					</div>
					<div class="verdict-col reveal">
						<p class="eyebrow acc-blue">Your result</p>
						<h1 class="rh-h1">{#if verdict}{@html verdict.head.replace(verdict.word, `<span class="${verdict.cls}">${verdict.word}</span>`)}{:else}Here’s your result.{/if}</h1>
						<p class="rsub">{heroSub(fitBand ?? 'minority')}</p>
						{#if severityScore !== null}
							<p class="anchor-line">You started this quiz with an IBS Severity Score of <strong>{severityScore}</strong> ({severityBand}) — a lot of room to improve.</p>
						{/if}
						<button class="rlink rlink--arrow" onclick={() => scrollToId('offer')}>See your protocol ↓</button>
					</div>
				</div>
			</section>

			<!-- ── §5.2 + §5.3 MERGED — Mirror + Why you fit (one argument) ── -->
			<section class="rsection" id="fit">
				<div class="wrap">
					<div class="mirror-fit reveal">
						<p class="eyebrow mirror-fit__eyebrow">Based on what you told us</p>
						<h2 class="rh-h2 mirror-fit__h2">{@html fitHeadlineHtml}</h2>
						{#if mirrorClauses.length}
							<p class="mirror-fit__lead">{mirrorClauses.join(' ')} You’re not imagining the pattern — and you’re not the kind of person who wants to be told to “just relax.”</p>
							<p class="mirror-fit__bridge">This is exactly the pattern an open-label placebo protocol is built to interrupt.</p>
						{/if}
						<p class="mirror-fit__sub">Your answers line up with the profile that responds best. <strong>Because you are:</strong></p>
					</div>
					<div class="trait-grid reveal">
						{#each TRAITS as tr (tr.title)}
							<article class="trait-card tone-{tr.tone}">
								<span class="trait-chip" aria-hidden="true">
									<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">{@html TRAIT_ICONS[tr.icon]}</svg>
								</span>
								<h3 class="trait-title">{tr.title}</h3>
								<p class="trait-body">{tr.body}</p>
							</article>
						{/each}
					</div>
				</div>
			</section>

			<!-- ── §5.4 WHERE THIS TENDS TO GO ────────────────────── -->
			{#if severityScore !== null && projectedScore !== null}
				<section class="rsection rsection--paper2" id="outlook">
					<div class="wrap">
						<div class="center reveal" style="margin-bottom:40px">
							<p class="eyebrow acc-blue">A projected outlook</p>
							<h2 class="rh-h2">Where this tends to go.</h2>
						</div>
						<div class="outlook-card brand-frame reveal">
							<div class="outlook-graph">
								<svg viewBox="0 0 360 184" class="outlook-svg" role="img" aria-label={`Projected IBS severity from ${severityScore} today to about ${projectedScore} after 14 days`}>
									<!-- axes -->
									<line x1="56" y1="150" x2="304" y2="150" stroke="var(--ink)" stroke-width="2" />
									<line x1="56" y1="26" x2="56" y2="150" stroke="var(--ink)" stroke-width="2" />
									<!-- baseline reference -->
									<line x1="56" y1={projY(severityScore)} x2="304" y2={projY(severityScore)} stroke="var(--ink-soft)" stroke-width="1.5" stroke-dasharray="5 5" opacity="0.4" />
									<text x="64" y={projY(severityScore) - 9} text-anchor="start" font-size="9" font-weight="800" letter-spacing="0.1em" fill="var(--ink-soft)">IF NOTHING CHANGES</text>
									<!-- projection area + line -->
									<path class="outlook-fill" d="M 56 {projY(severityScore)} Q 180 {projY((severityScore + projectedScore) / 2)} 304 {projY(projectedScore)} L 304 150 L 56 150 Z" fill="var(--blue-tint)" opacity="0.45" />
									<path class="outlook-line" d="M 56 {projY(severityScore)} Q 180 {projY((severityScore + projectedScore) / 2)} 304 {projY(projectedScore)}" fill="none" stroke="var(--blue)" stroke-width="3.5" stroke-linecap="round" />
									<!-- endpoints -->
									<circle cx="56" cy={projY(severityScore)} r="6" fill="var(--wine)" stroke="var(--ink)" stroke-width="2" />
									<circle cx="304" cy={projY(projectedScore)} r="6" fill="var(--blue)" stroke="var(--ink)" stroke-width="2" />
									<!-- value labels, parked in the side margins clear of the line -->
									<text x="42" y={projY(severityScore) + 5} text-anchor="end" font-size="15" font-weight="800" fill="var(--wine)">{severityScore}</text>
									<text x="318" y={projY(projectedScore) + 5} text-anchor="start" font-size="15" font-weight="800" fill="var(--blue-deep)">~{projectedScore}</text>
									<!-- day axis -->
									<text x="56" y="172" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink-soft)">Day 1</text>
									<text x="304" y="172" text-anchor="middle" font-size="10.5" font-weight="700" fill="var(--ink-soft)">Day 14</text>
								</svg>
								{#if projectedDropPct !== null}
									<div class="outlook-callout"><span class="callout-arrow">↓</span> <strong>{projectedDropPct}%</strong> in symptom severity</div>
								{/if}
							</div>
							<div class="outlook-foot">
								<img class="outlook-harvard" src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" />
								<p class="outlook-disclaim">Projection based on the symptom-severity improvement reported in published open-label placebo trials: 69% of IBS participants saw a clinically meaningful drop of 50+ points on the IBS-SSS (Kaptchuk et al., 2010; Lembo et al., 2021), applied to your starting score. This is a research-based projection, not a guarantee — individual results vary.</p>
							</div>
						</div>
					</div>
				</section>
			{/if}

			<!-- ── §5.5 WHY OTHER SOLUTIONS KEPT FAILING (dark) ──── -->
			<section class="rsection rsection--ink">
				<div class="wrap">
					<div class="center reveal" style="margin-bottom:40px">
						<p class="eyebrow eyebrow--dark">The real reason</p>
						<h2 class="rh-h2 rh-h2--dark">Other solutions keep failing you because they only chase your <span class="acc-blue">symptoms</span>.</h2>
					</div>
					<div class="fails reveal">
						{#each FAILS as f, i (f.t)}
							<div class="fail-row">
								<span class="fail-num">{String(i + 1).padStart(2, '0')}</span>
								<p class="fail-p"><strong>{f.t}</strong> {f.b}</p>
							</div>
						{/each}
					</div>
				</div>
			</section>

			<!-- ── §5.6 THE MECHANISM ─────────────────────────────── -->
			<section class="rsection" id="mechanism">
				<div class="wrap">
					<div class="center reveal" style="margin-bottom:36px">
						<p class="eyebrow">The honest part</p>
						<h2 class="rh-h2">The honesty <span class="acc-blue">is</span> the science.</h2>
						<p class="mech-lede">Your protocol contains no active drug — and we tell you that. Here’s why it still works.</p>
					</div>

					<div class="mech-loop reveal">
						<div class="loop" aria-hidden="true">
							<div class="loop-title">The gut–brain loop</div>
							<div class="loop-arc"></div>
							<span class="loop-dir loop-dir--tl"></span>
							<span class="loop-dir loop-dir--tr"></span>
							<span class="loop-dir loop-dir--br"></span>
							<span class="loop-dir loop-dir--bl"></span>
							<div class="loop-node node-gut"><span><small>Gut</small>sends an<br>ordinary signal</span></div>
							<div class="loop-node node-brain"><span><small>Brain</small>predicts<br>pain</span></div>
							<div class="loop-node node-pain"><span><small>Felt as</small>pain &amp;<br>urgency</span></div>
							<div class="loop-node node-anx"><span><small>Anxiety</small>confirms the<br>prediction</span></div>
						</div>
					</div>

					<div class="mech-beats reveal">
						<div class="mech-box">
							<h3 class="mech-box-h">IBS is a learned loop</h3>
							<p class="mech-box-p">Your brain over-predicts pain in your gut, and the prediction becomes the symptom.</p>
						</div>
						<div class="mech-arrow">
							<span class="mech-arrow-label">The 14-day ritual</span>
							<span class="mech-arrow-glyph" aria-hidden="true">→</span>
						</div>
						<div class="mech-box">
							<h3 class="mech-box-h">The ritual rewrites it</h3>
							<p class="mech-box-p">14 days of a daily capsule, card, and check-in teach your brain to predict safety instead of pain.</p>
						</div>
					</div>
				</div>
			</section>

			<!-- pull quote — dark full-bleed moment between mechanism and evidence -->
			<section class="mech-quote-band reveal">
				<span class="mech-quote-mark" aria-hidden="true">“</span>
				<blockquote class="mech-pull">How you take something can matter just as much as <span class="mech-pull-accent">what</span> you are taking.</blockquote>
			</section>

			<!-- ── §5.7 THE EVIDENCE ──────────────────────────────── -->
			<section class="rsection rsection--paper2" id="evidence">
				<div class="wrap">
					<div class="center reveal" style="margin-bottom:40px">
						<p class="eyebrow">The evidence</p>
						<h2 class="rh-h2">Peer-reviewed research.</h2>
						<p class="rsub measure">A selection of the most important studies that shaped open-label placebo. Read the methods yourself.</p>
					</div>

					<div class="evidence-featured reveal">
						{#each STUDIES.filter((s) => s.featured) as s (s.url)}
							{@render studyCard(s, true)}
						{/each}
					</div>
					<div class="evidence-grid reveal">
						{#each STUDIES.filter((s) => !s.featured) as s (s.url)}
							{@render studyCard(s, false)}
						{/each}
					</div>

					<div class="trust-explainer reveal">
						<p><strong>Why trust these?</strong> Every study here was peer-reviewed: independent scientists pressure-tested the methods and the math before publication. None of these are ours — we point you to the originals on purpose.</p>
					</div>
				</div>
			</section>

			<!-- ── §5.8 THE OFFER ─────────────────────────────────── -->
			<section class="rsection" id="offer">
				<div class="wrap offer-grid">
					<div class="offer-media reveal" role="region" aria-label="Product photos"
						onmouseenter={() => (kitPaused = true)}
						onmouseleave={() => (kitPaused = false)}
						onfocusin={() => (kitPaused = true)}
						onfocusout={() => (kitPaused = false)}
						ontouchstart={() => (kitPaused = true)}
						ontouchend={() => (kitPaused = false)}
					>
						<div class="offer-stage brand-img">
							{#each KIT_SLIDES as slide, i (slide.src)}
								<figure class="offer-slide" class:active={i === kitIndex}>
									<img src={slide.src} alt={slide.alt} loading={i === 0 ? 'eager' : 'lazy'} aria-hidden={i !== kitIndex} />
								</figure>
							{/each}
							<span class="offer-badge">14-Day Protocol</span>
							<button class="offer-arrow offer-arrow--prev" onclick={kitPrev} aria-label="Previous photo">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
							</button>
							<button class="offer-arrow offer-arrow--next" onclick={kitNext} aria-label="Next photo">
								<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
							</button>
						</div>
						<div class="offer-dots" role="tablist" aria-label="Product photos">
							{#each KIT_SLIDES as slide, i (slide.src)}
								<button class="offer-dot" class:active={i === kitIndex} onclick={() => kitGo(i)} aria-label={`Photo ${i + 1} of ${KIT_SLIDES.length}`} aria-selected={i === kitIndex} role="tab"></button>
							{/each}
						</div>
						<div class="offer-thumbs">
							{#each KIT_SLIDES as slide, i (slide.src)}
								<button class="offer-thumb" class:active={i === kitIndex} onclick={() => kitGo(i)} aria-label={`View ${slide.cap}`}>
									<img src={slide.src} alt="" loading="lazy" />
								</button>
							{/each}
						</div>
						<p class="offer-cap">{KIT_SLIDES[kitIndex].cap}</p>
					</div>

					<div class="offer-box reveal">
						<p class="eyebrow">OLP Treatment N°2 · IBS</p>
						<h2 class="rh-h2 offer-title">The 14-Day IBS Protocol</h2>

						<ul class="check-list check-list--blue">
							<li><span>✓</span> An honest, open-label placebo — no prescription, no titration, no side-effects.</li>
							<li><span>✓</span> Targets the gut–brain axis that actually drives IBS symptoms.</li>
							<li><span>✓</span> A daily ritual designed so small changes stack across two weeks.</li>
						</ul>

						<p class="included-h">What’s included</p>
						<ul class="check-list check-list--green">
							<li><span>✓</span> 30 OLP capsules · 14-day supply</li>
							<li><span>✓</span> 14-day accountability tracker + write-on ritual cards</li>
							<li><span>✓</span> Sticker calendar to mark each day</li>
							<li><span>✓</span> Guided Copables app — one short lesson a day</li>
						</ul>

						<a class="btn btn--primary btn--lg btn--block" href="/shop/ibs" onclick={() => buy('results_offer_cta')}>Pre-order now — ${PRICE}</a>
						<p class="offer-note">You won’t be charged until your order ships. Cancel any time before dispatch.</p>
				{#if fitBand === 'minority'}
						<p class="guarantee-inline">If it doesn’t help, we refund you — no Ideal-range needed. <button class="gi-link" onclick={() => scrollToId('guarantee')}>See the guarantee →</button></p>
					{:else}
						<p class="guarantee-inline">Because your Fit Score is in the Ideal range, if you don’t feel better, we refund you. <button class="gi-link" onclick={() => scrollToId('guarantee')}>See the guarantee →</button></p>
					{/if}

						<div class="trust-badges">
							<span>Free shipping</span><span>·</span><span>Honest, open-label</span><span>·</span><span>Pause or cancel any time</span>
						</div>

						<div class="ritual-callout">
							<p class="rc-h">The ritual is the medicine.</p>
							<p class="rc-p">Two capsules and a two-minute app check-in a day retrain the gut–brain conversation. Consistency is the whole game.</p>
						</div>
					</div>
				</div>
			</section>

			<!-- ── §5.9 WHAT YOU’LL ACTUALLY DO (syllabus) ─────────── -->
			<section class="rsection rsection--paper2" id="syllabus">
				<div class="wrap">
					<div class="center reveal" style="margin-bottom:44px">
						<p class="eyebrow">The syllabus</p>
						<h2 class="rh-h2">What your 14 days look like.</h2>
					</div>
					<div class="syllabus-grid">
						<div class="syllabus-acc reveal">
							{#each PHASES as ph, i (ph.range)}
								<div class="phase" class:open={openPhase === i}>
									<button class="phase-head" onclick={() => togglePhase(i)} aria-expanded={openPhase === i}>
										<span class="phase-dot"></span>
										<span class="phase-title"><span class="phase-range">{ph.range}</span> · {ph.theme}</span>
										<span class="phase-pm" aria-hidden="true">+</span>
									</button>
									<div class="phase-body" style:max-height={openPhase === i ? '260px' : '0'}>
										<ul>
											{#each ph.items as it (it)}<li>{it}</li>{/each}
										</ul>
									</div>
								</div>
							{/each}
							<p class="syllabus-note">Results vary. This is a ritual-based protocol, not a substitute for medical care. If symptoms are severe or worsening, see a doctor.</p>
						</div>
						<div class="syllabus-phone reveal">
							<div class="ph" data-label="app screen · daily lesson & two-minute check-in"></div>
						</div>
					</div>
				</div>
			</section>

			<!-- ── §5.10 PROOF ────────────────────────────────────── -->
			<section class="rsection" id="proof">
				<div class="wrap">
					<div class="center reveal" style="margin-bottom:40px">
						<p class="eyebrow">Real results</p>
						<h2 class="rh-h2">From people who actually ran it.</h2>
					</div>
				<article class="review-featured brand-frame reveal">
					<span class="rf-q">“</span>
					<p class="rf-headline">{FEATURED_REVIEW.headline}</p>
					<p class="rf-quote">{FEATURED_REVIEW.quote}</p>
					<div class="rf-attr">
						<span class="rf-avatar" style="background:{FEATURED_REVIEW.color}">{FEATURED_REVIEW.initials}</span>
						<div class="rf-meta">
							<div class="rf-name">{FEATURED_REVIEW.name}</div>
							<div class="rf-where">{FEATURED_REVIEW.where} · {FEATURED_REVIEW.date}</div>
							<span class="rf-verified">✓ Verified · collected via user interview</span>
						</div>
					</div>
				</article>
				<div class="review-grid reveal">
					{#each SUPPORTING_REVIEWS as r (r.name)}
						<article class="review-card">
							<span class="rc-stars" aria-label="5 out of 5 stars">★★★★★</span>
							<p class="rc-quote">{r.quote}</p>
							<div class="rc-attr">
								<span class="rc-avatar" style="background:{r.color}">{r.initials}</span>
								<div class="rc-meta">
									<div class="rc-name">{r.name}</div>
									<div class="rc-where">{r.where} · {r.date}</div>
									<span class="rc-verified">✓ Verified</span>
								</div>
							</div>
						</article>
					{/each}
				</div>
				</div>
			</section>

			<!-- ── §5.11 RISK REVERSAL ────────────────────────────── -->
			<section class="rsection rsection--paper2" id="guarantee">
				<div class="wrap narrow">
				<div class="guarantee-panel reveal">
					<p class="eyebrow acc-green gp-eyebrow">Our promise to you</p>
					<h2 class="rh-h2 gp-h2">{guaranteeHeadline(fitBand ?? 'minority')}</h2>
					<div class="gp-steps">
						{#each GUARANTEE_STEPS as gs (gs.n)}
							<div class="gp-step"><span class="gp-rn">{gs.n}</span><div><strong>{gs.t}</strong> — {gs.b}</div></div>
						{/each}
					</div>
					<button class="btn btn--green btn--lg" onclick={() => scrollToId('offer')}>Start my protocol — ${PRICE}</button>
				</div>
				</div>
			</section>

			<!-- ── §5.12 FAQ ──────────────────────────────────────── -->
			<section class="rsection" id="faq">
				<div class="wrap">
					<div class="center reveal" style="margin-bottom:40px">
						<p class="eyebrow">Before you start</p>
						<h2 class="rh-h2">Questions, answered.</h2>
						<p class="rsub measure">Everything about the protocol, the science and the guarantee. Still stuck? A real human answers at <strong>care@copables.com</strong>.</p>
					</div>
					<div class="faq reveal">
						{#each FAQS as f, i (f.q)}
							{#if i === 0 || f.cat !== FAQS[i - 1].cat}
								<p class="faq-cat">{f.cat}</p>
							{/if}
							<div class="faq-item" class:open={openFaq === i}>
								<button class="faq-q" onclick={() => (openFaq = openFaq === i ? -1 : i)} aria-expanded={openFaq === i}>{f.q}<span class="faq-pm" aria-hidden="true">+</span></button>
								<div class="faq-a" style:max-height={openFaq === i ? '320px' : '0'}><div>{f.a}</div></div>
							</div>
						{/each}
					</div>
				</div>
			</section>
		{/if}
	</main>

	<Footer />
</div>

{#snippet studyCard(s: { result: string; source: string; oneliner: string; url: string; featured?: boolean }, featured: boolean)}
	<article class="study-card" class:study-card--featured={featured}>
		<p class="study-result">{s.result}</p>
		<p class="study-source">{s.source}</p>
		<p class="study-oneliner">{s.oneliner}</p>
		<a class="study-link" href={s.url} target="_blank" rel="noopener noreferrer">Read paper →</a>
	</article>
{/snippet}

<style>
	:global(main:has(.results-page)) { padding: 0; }
	.results-page { background: var(--paper); color: var(--ink); font-family: var(--ff); }

	.wrap { width: 100%; max-width: 1120px; margin: 0 auto; padding: 0 24px; }
	.narrow { max-width: 760px; }
	.center { text-align: center; }
	.measure { max-width: 620px; margin-left: auto; margin-right: auto; }

	/* ── Eyebrow ─────────────────────────────────────── */
	.eyebrow {
		font-weight: 800; font-size: 12px; letter-spacing: .12em; text-transform: uppercase;
		color: var(--ink-soft); margin: 0 0 18px; display: inline-flex; align-items: center; gap: 10px;
	}
	.eyebrow::before { content: ""; width: 24px; height: 2px; background: currentColor; display: inline-block; }
	.eyebrow.acc-blue { color: var(--blue); }
	.eyebrow.eyebrow--dark { color: rgba(251,246,234,.6); }

	/* ── Type ────────────────────────────────────────── */
	.rh-h1 { font-size: clamp(40px, 7vw, 88px); font-weight: 900; line-height: .98; letter-spacing: -.02em; margin: 0; }
	.rh-h2 { font-size: clamp(32px, 4.5vw, 56px); font-weight: 800; line-height: 1.0; letter-spacing: -.02em; margin: 0; }
	.rh-h2--dark { color: var(--paper); }
	.rsub { font-size: clamp(17px, 1.6vw, 19px); color: var(--ink); opacity: .85; line-height: 1.55; margin: 18px 0 0; }
	.acc-green { color: var(--green-ok); }
	.acc-blue { color: var(--blue); }

	/* ── Buttons ─────────────────────────────────────── */
	.btn {
		display: inline-flex; align-items: center; justify-content: center; gap: 10px;
		font-family: var(--ff); font-weight: 800; font-size: 17px; letter-spacing: -.01em;
		padding: 18px 32px; border-radius: 999px; border: 0; cursor: pointer; text-decoration: none;
		transition: transform .14s ease, box-shadow .2s ease, filter .14s ease; line-height: 1;
	}
	.btn--primary { background: var(--blue); color: #fff; box-shadow: 0 6px 0 var(--blue-deep); }
	.btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--blue-deep); }
	.btn--primary:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--blue-deep); }
	.btn--ink { background: var(--ink); color: var(--paper); box-shadow: 0 6px 0 #000; }
	.btn--ink:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #000; }
	.btn--ink:active { transform: translateY(3px); box-shadow: 0 3px 0 #000; }
	.btn--green { background: var(--green-ok); color: #fff; box-shadow: 0 6px 0 var(--green-deep); }
	.btn--green:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--green-deep); }
	.btn--green:active { transform: translateY(3px); box-shadow: 0 3px 0 var(--green-deep); }
	.btn--lg { font-size: 19px; padding: 21px 40px; }
	.btn--sm { font-size: 15px; padding: 13px 24px; }
	.btn--block { width: 100%; }
	.btn:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 3px; }
	.rhead-cta:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 2px; border-radius: 4px; }
	.rlink:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 2px; border-radius: 4px; }
	.offer-thumb:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 2px; }
	.offer-arrow:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 2px; }
	.offer-dot:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: 2px; }
	.phase-head:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: -3px; border-radius: var(--frame-radius); }

	/* ── Header ──────────────────────────────────────── */
	.rhead {
		position: sticky; top: 0; z-index: 60;
		display: flex; align-items: center; justify-content: space-between;
		padding: 16px clamp(16px, 4vw, 32px);
		background: rgba(251,246,234,.88); backdrop-filter: blur(10px);
		border-bottom: 1px solid var(--line);
	}
	.rbrand img { height: 20px; width: auto; display: block; }
	.rhead-cta {
		font-family: var(--ff); font-weight: 800; font-size: 14px; color: var(--ink);
		background: transparent; border: 0; cursor: pointer; padding: 8px 4px;
		border-bottom: 2px solid var(--blue);
	}
	.rhead-cta:hover { color: var(--blue-deep); }

	/* ── Loading / empty ─────────────────────────────── */
	.rloading, .rempty { padding: clamp(80px, 14vw, 140px) 24px; text-align: center; }
	.rempty .btn { margin-top: 24px; }

	/* ── Section rhythm ──────────────────────────────── */
	.rsection { padding: clamp(72px, 9vw, 120px) 0; }
	.rsection--paper2 { background: var(--paper-2); border-top: 2px solid var(--ink); border-bottom: 2px solid var(--ink); }
	.rsection--ink { background: var(--ink); color: var(--paper); }

	/* ── Hero ────────────────────────────────────────── */
	.rhero { padding: clamp(56px, 7vw, 88px) 0 clamp(64px, 8vw, 96px); }
	.rhero--safety { padding: clamp(72px, 10vw, 120px) 0; }
	.hero-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
	@media (min-width: 940px) { .hero-grid { grid-template-columns: .85fr 1.15fr; gap: 64px; } }

	.gauge-col { display: flex; flex-direction: column; align-items: center; gap: 28px; }
	.gauge { position: relative; width: min(260px, 70vw); aspect-ratio: 1/1; }
	.gauge-svg { width: 100%; height: 100%; }
	.gauge-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
	.gauge-num { font-size: clamp(56px, 11vw, 84px); font-weight: 900; letter-spacing: -.04em; line-height: .9; color: var(--ink); font-variant-numeric: tabular-nums; }
	.gauge-label { font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--ink-soft); margin-top: 8px; }

	.fit-scale { position: relative; width: min(320px, 80vw); }
	.fit-scale-bar { display: flex; height: 12px; border: 2px solid var(--ink); border-radius: 8px; overflow: hidden; }
	.seg { flex: 1; }
	.seg-low { background: rgba(138,36,51,.18); }
	.seg-limited { background: rgba(242,144,30,.22); border-left: 2px solid var(--ink); }
	.seg-good { background: rgba(47,149,242,.20); border-left: 2px solid var(--ink); }
	.seg-strong { background: rgba(46,158,107,.24); border-left: 2px solid var(--ink); }
	.fit-marker { position: absolute; top: -7px; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 15px solid var(--blue); transform: translateX(-50%); filter: drop-shadow(0 2px 2px rgba(20,19,15,.25)); transition: left 1.1s cubic-bezier(.2,.8,.2,1); }
	.fit-scale-labels { display: flex; justify-content: space-between; margin-top: 12px; }
	.fit-scale-labels span { font-size: 10.5px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--ink-soft); flex: 1; text-align: center; }

	.verdict-col { display: flex; flex-direction: column; align-items: flex-start; }
	.verdict-col .rh-h1 { margin-bottom: 0; }
	.anchor-line { margin: 22px 0 0; font-size: 16px; font-weight: 600; color: var(--ink-soft); }
	.anchor-line strong { color: var(--ink); font-weight: 900; }

	.rlink { background: none; border: 0; font-family: var(--ff); font-weight: 800; font-size: 15px; color: var(--ink); cursor: pointer; padding: 0; border-bottom: 2px solid var(--blue); text-decoration: none; }
	.rlink--arrow { margin-top: 24px; }
	.rlink:hover { color: var(--blue-deep); }

	/* ── Safety panel ────────────────────────────────── */
	.safety-panel { background: var(--card); border: 2px solid var(--ink); border-radius: var(--radius-lg); box-shadow: var(--frame-shadow); padding: clamp(32px, 5vw, 56px); text-align: center; }
	.safety-icon { width: 60px; height: 60px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 30px; font-weight: 900; margin: 0 auto 20px; }
	.safety-panel .btn { margin-top: 28px; }
	.safety-panel .rlink { margin-top: 18px; display: inline-block; }

	/* ── Mirror (safety-branch standalone paragraph) ─── */
	.rmirror { padding: clamp(40px, 5vw, 60px) 0 clamp(56px, 7vw, 96px); }
	.mirror-p { font-size: clamp(20px, 2.2vw, 22px); font-weight: 500; line-height: 1.45; color: var(--ink); opacity: .9; margin: 0; }
	.mirror-tail { color: var(--ink-soft); font-weight: 500; }

	/* ── Mirror + Fit (merged — one descending hierarchy) ─── */
	.mirror-fit { display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 660px; margin: 0 auto; }
	.mirror-fit__eyebrow { justify-content: center; margin: 0 0 24px; }
	.mirror-fit__h2 { max-width: 13ch; margin: 0; text-wrap: balance; }
	.mirror-fit__lead { max-width: 640px; margin: 32px 0 0; font-size: 19px; font-weight: 450; line-height: 1.5; color: var(--ink); opacity: .85; }
	.mirror-fit__bridge { max-width: 640px; margin: 18px 0 0; font-size: 15px; font-weight: 600; line-height: 1.45; color: var(--blue); }
	.mirror-fit__sub { max-width: 560px; margin: 64px 0 0; font-size: 17px; font-weight: 500; line-height: 1.5; color: rgba(20,19,15,.8); }
	.mirror-fit__sub strong { font-weight: 700; color: var(--ink); }
	.trait-grid { margin-top: 24px; }

	/* ── Trait grid ──────────────────────────────────── */
	.trait-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
	@media (min-width: 640px) { .trait-grid { grid-template-columns: 1fr 1fr; } }
	.trait-card { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: 16px; box-shadow: var(--frame-shadow-sm); padding: 28px; display: flex; flex-direction: column; }
	.trait-chip { width: 44px; height: 44px; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 12px; }
	.trait-chip svg { width: 20px; height: 20px; display: block; }
	.trait-title { font-size: 18px; font-weight: 700; letter-spacing: -.01em; line-height: 1.2; margin: 0 0 6px; color: var(--ink); }
	.trait-body { font-size: 15px; line-height: 1.5; color: var(--ink); opacity: .75; margin: 0; }
	.tone-ink .trait-chip { background: rgba(20,19,15,.12); color: var(--ink); }
	.tone-blue .trait-chip { background: rgba(47,149,242,.12); color: var(--blue); }
	.tone-orange .trait-chip { background: rgba(242,144,30,.12); color: var(--orange-deep); }
	.tone-wine .trait-chip { background: rgba(138,36,51,.12); color: var(--wine); }

	/* ── Outlook graph ───────────────────────────────── */
	.outlook-card { padding: clamp(24px, 4vw, 40px); }
	.outlook-graph { position: relative; max-width: 720px; margin: 0 auto; text-align: center; }
	.outlook-svg { width: 100%; height: auto; display: block; }
	.outlook-callout {
		position: absolute; right: clamp(4px, 8vw, 40px); top: clamp(8px, 10vw, 28px);
		background: var(--card); border: 2px solid var(--ink); border-radius: 999px; box-shadow: var(--frame-shadow-sm);
		padding: 10px 18px; font-size: 15px; font-weight: 700; color: var(--ink);
	}
	.outlook-callout strong { color: var(--blue-deep); font-weight: 900; font-size: 18px; }
	.outlook-callout .callout-arrow { color: var(--blue); font-weight: 900; }
	.outlook-foot { display: flex; align-items: flex-start; gap: 16px; margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--line); }
	.outlook-harvard { height: 26px; width: auto; opacity: .7; flex: none; }
	.outlook-disclaim { font-size: 12px; line-height: 1.55; color: var(--ink-soft); margin: 0; }

	/* ── Fails (dark) ────────────────────────────────── */
	.fails { max-width: 760px; margin: 0 auto; display: grid; gap: 20px; }
	.fail-row { display: flex; align-items: baseline; gap: 18px; border-top: 1px solid rgba(251,246,234,.18); padding-top: 20px; }
	.fail-row:first-child { border-top: 0; padding-top: 0; }
	.fail-num { font-size: 14px; font-weight: 900; color: var(--blue); letter-spacing: .04em; flex: none; }
	.fail-p { font-size: clamp(18px, 2vw, 22px); font-weight: 500; line-height: 1.4; color: var(--paper); margin: 0; }
	.fail-p strong { font-weight: 900; color: #fff; }

	/* ── Mechanism ───────────────────────────────────── */
	.mech-lede { font-size: clamp(17px, 1.8vw, 20px); line-height: 1.5; color: var(--ink-soft); margin: 18px auto 0; max-width: 560px; }
	.loop { position: relative; width: min(420px, 100%); aspect-ratio: 1/1; }
	.loop-title { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); font-weight: 900; font-size: 15px; color: var(--ink-soft); text-align: center; max-width: 50%; }
	.loop-arc { position: absolute; inset: 54px; border: 2px dashed rgba(20,19,15,.18); border-radius: 50%; }
	.loop-dir { position: absolute; width: 16px; height: 16px; display: grid; place-items: center; transform: translate(-50%, -50%) rotate(var(--r)); }
	.loop-dir::before { content: ""; width: 0; height: 0; border-left: 9px solid rgba(20,19,15,.42); border-top: 5.5px solid transparent; border-bottom: 5.5px solid transparent; }
	.loop-dir--tl { top: 23.8%; left: 23.8%; --r: -45deg; }
	.loop-dir--tr { top: 23.8%; left: 76.2%; --r: 45deg; }
	.loop-dir--br { top: 76.2%; left: 76.2%; --r: 135deg; }
	.loop-dir--bl { top: 76.2%; left: 23.8%; --r: 225deg; }
	.loop-node { position: absolute; width: 128px; height: 128px; border-radius: 50%; display: grid; place-items: center; text-align: center; font-weight: 800; font-size: 13px; line-height: 1.2; border: 2px solid var(--ink); box-shadow: 0 8px 18px rgba(20,19,15,.16); padding: 8px; }
	.loop-node small { display: block; font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; opacity: .7; margin-bottom: 4px; }
	.node-gut { top: 50%; left: 0; transform: translateY(-50%); background: var(--blue); color: #fff; }
	.node-brain { top: 0; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--paper); }
	.node-pain { top: 50%; right: 0; transform: translateY(-50%); background: var(--orange); color: #fff; }
	.node-anx { bottom: 0; left: 50%; transform: translateX(-50%); background: var(--wine); color: #fff; }
	.mech-loop { display: grid; place-items: center; margin: 32px auto 0; max-width: 420px; }
	.mech-beats { display: grid; grid-template-columns: 1fr; gap: 24px; max-width: 840px; margin: 48px auto 0; align-items: stretch; }
	@media (min-width: 768px) { .mech-beats { grid-template-columns: 1fr auto 1fr; gap: 32px; } }
	.mech-box { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); padding: 32px 30px; box-shadow: var(--frame-shadow-sm); display: flex; flex-direction: column; justify-content: center; }
	.mech-box-h { font-size: 19px; font-weight: 800; letter-spacing: -.01em; line-height: 1.2; margin: 0 0 8px; color: var(--ink); }
	.mech-box-p { font-size: 15px; line-height: 1.45; color: var(--ink); opacity: .75; margin: 0; }
	.mech-arrow { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; }
	.mech-arrow-label { font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--ink); opacity: .6; }
	.mech-arrow-glyph { font-size: 44px; font-weight: 900; color: var(--blue); line-height: 1; }
	@media (max-width: 767px) { .mech-arrow { flex-direction: column; } .mech-arrow-glyph { transform: rotate(90deg); } }
	.mech-quote-band { background: var(--ink); padding: clamp(72px, 10vw, 120px) 24px; text-align: center; }
	.mech-quote-mark { display: block; font-size: 88px; line-height: .6; color: var(--blue); opacity: .55; font-weight: 900; margin-bottom: 18px; }
	.mech-pull { font-size: clamp(24px, 3.4vw, 40px); font-weight: 800; line-height: 1.25; letter-spacing: -.02em; margin: 0 auto; max-width: 820px; color: var(--paper); }
	.mech-pull-accent { color: var(--blue); }
	@media (max-width: 640px) { .loop { width: min(300px, 100%); } .loop-node { width: 96px; height: 96px; font-size: 11px; } .loop-node small { font-size: 8.5px; } .loop-arc { inset: 48px; } .loop-title { font-size: 12px; } .loop-dir--tl { top: 26%; left: 26%; } .loop-dir--tr { top: 26%; left: 74%; } .loop-dir--br { top: 74%; left: 74%; } .loop-dir--bl { top: 74%; left: 26%; } }

	/* ── Evidence ────────────────────────────────────── */
	.evidence-featured { display: grid; grid-template-columns: 1fr; gap: 22px; margin-bottom: 24px; }
	@media (min-width: 720px) { .evidence-featured { grid-template-columns: 1fr 1fr; } }
	.evidence-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
	@media (min-width: 640px) { .evidence-grid { grid-template-columns: 1fr 1fr; } }
	@media (min-width: 1000px) { .evidence-grid { grid-template-columns: 1fr 1fr 1fr; } }
	.study-card { background: var(--card); border: 2px solid var(--ink); border-radius: var(--radius); box-shadow: var(--frame-shadow-sm); padding: 26px 24px; display: flex; flex-direction: column; gap: 10px; }
	.study-card--featured { padding: clamp(28px, 3vw, 36px); }
	.study-result { font-size: clamp(20px, 2.4vw, 26px); font-weight: 800; letter-spacing: -.01em; line-height: 1.15; color: var(--ink); margin: 0; }
	.study-card--featured .study-result { font-size: clamp(24px, 3vw, 32px); color: var(--blue-deep); }
	.study-source { font-size: 12px; font-weight: 800; letter-spacing: .1em; text-transform: uppercase; color: var(--ink-soft); margin: 0; }
	.study-oneliner { font-size: 15px; line-height: 1.55; color: var(--ink-soft); margin: 0; flex: 1; }
	.study-link { font-weight: 800; font-size: 14px; color: var(--blue-deep); text-decoration: none; border-bottom: 2px solid var(--blue); align-self: flex-start; padding-bottom: 2px; margin-top: 6px; }
	.study-link:hover { color: var(--blue); }
	.trust-explainer { margin: 36px auto 0; max-width: 620px; text-align: center; font-size: 14.5px; line-height: 1.6; color: var(--ink-soft); }
	.trust-explainer strong { color: var(--ink); }

	/* ── Offer ───────────────────────────────────────── */
	.offer-grid { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: start; }
	@media (min-width: 900px) { .offer-grid { grid-template-columns: .95fr 1.05fr; gap: 56px; } }
	.offer-media { display: flex; flex-direction: column; gap: 14px; position: sticky; top: 88px; }
	@media (max-width: 899px) { .offer-media { position: static; } }
	.offer-stage { position: relative; aspect-ratio: 1/1; }
	.offer-slide { position: absolute; inset: 0; margin: 0; opacity: 0; transition: opacity .5s ease; }
	.offer-slide.active { opacity: 1; }
	.offer-slide img { width: 100%; height: 100%; object-fit: cover; }
	.offer-badge { position: absolute; top: 16px; left: 16px; z-index: 3; background: var(--wine); color: #fff; padding: 8px 16px; border-radius: 999px; font-size: 11px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; box-shadow: var(--frame-shadow-sm); transform: rotate(-4deg); }
	.offer-arrow { position: absolute; bottom: 16px; width: 44px; height: 44px; border-radius: 999px; background: var(--card); border: 2px solid var(--frame-ink); box-shadow: var(--frame-shadow-sm); display: flex; align-items: center; justify-content: center; color: var(--ink); cursor: pointer; z-index: 4; transition: transform .15s ease, box-shadow .15s ease; }
	.offer-arrow:hover { transform: translateY(-2px); box-shadow: 8px 8px 0 0 rgba(20,19,15,.14); }
	.offer-arrow:active { transform: translateY(0); }
	.offer-arrow svg { width: 19px; height: 19px; }
	.offer-arrow--prev { right: 72px; }
	.offer-arrow--next { right: 16px; }
	.offer-dots { display: flex; justify-content: center; gap: 8px; }
	.offer-dot { width: 8px; height: 8px; border-radius: 999px; border: 0; background: var(--ink); opacity: .2; cursor: pointer; padding: 0; transition: background .2s ease, opacity .2s ease, transform .15s ease; }
	.offer-dot:hover { transform: scale(1.2); }
	.offer-dot.active { background: var(--blue); opacity: 1; }
	.offer-thumbs { display: flex; gap: 10px; }
	.offer-thumb { width: 64px; height: 64px; border: 2px solid var(--ink); border-radius: 12px; overflow: hidden; padding: 0; cursor: pointer; background: var(--paper-2); box-shadow: 0 3px 0 rgba(20,19,15,.14); transition: transform .14s ease; }
	.offer-thumb.active { border-color: var(--blue); box-shadow: 0 3px 0 var(--blue-deep); }
	.offer-thumb:hover { transform: translateY(-2px); }
	.offer-thumb img { width: 100%; height: 100%; object-fit: cover; }
	.offer-cap { font-size: 13px; font-weight: 700; color: var(--ink-soft); margin: 0; }
	@media (prefers-reduced-motion: reduce) { .offer-slide { transition: none; } }

	.offer-box { display: flex; flex-direction: column; }
	.offer-title { font-size: clamp(30px, 4vw, 48px); margin: 6px 0 22px; }
	.check-list { list-style: none; margin: 0 0 22px; padding: 0; display: grid; gap: 12px; }
	.check-list li { display: flex; align-items: flex-start; gap: 12px; font-size: 16px; font-weight: 600; line-height: 1.45; color: var(--ink); }
	.check-list span { flex: none; width: 22px; height: 22px; border-radius: 50%; color: #fff; display: grid; place-items: center; font-size: 12px; font-weight: 900; margin-top: 2px; }
	.check-list--blue span { background: var(--blue); }
	.check-list--green span { background: var(--green-ok); }
	.included-h { font-size: 12px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--ink-soft); margin: 0 0 12px; }

	.offer-note { font-size: 12.5px; color: var(--ink-soft); margin: 12px 0 0; text-align: center; }
	.guarantee-inline { font-size: 14.5px; font-weight: 700; color: var(--green-deep); background: var(--green-tint); border: 1px solid var(--green-ok); border-radius: 12px; padding: 12px 16px; margin: 16px 0 0; text-align: center; }
	.gi-link { background: none; border: 0; font-family: var(--ff); font-weight: 800; font-size: 14.5px; color: var(--green-deep); cursor: pointer; text-decoration: underline; text-underline-offset: 3px; padding: 0; vertical-align: baseline; }
	.gi-link:hover { color: var(--green-ok); }
	.gi-link:focus-visible { outline: 3px solid var(--green-deep); outline-offset: 2px; border-radius: 4px; }
	.trust-badges { display: flex; align-items: center; justify-content: center; gap: 10px; flex-wrap: wrap; margin: 22px 0 0; font-size: 12.5px; font-weight: 700; color: var(--ink-soft); }
	.ritual-callout { background: var(--paper); border: 1.5px solid var(--line); border-radius: var(--radius); padding: 20px 22px; margin: 22px 0 0; }
	.rc-h { font-weight: 800; font-size: 15px; margin: 0 0 4px; }
	.rc-p { font-size: 14.5px; color: var(--ink-soft); line-height: 1.5; margin: 0; }

	/* ── Syllabus ────────────────────────────────────── */
	.syllabus-grid { display: grid; grid-template-columns: 1fr; gap: 36px; align-items: start; }
	@media (min-width: 900px) { .syllabus-grid { grid-template-columns: 1.15fr .85fr; gap: 56px; } }
	.syllabus-acc { display: grid; gap: 12px; }
	.phase { border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); background: var(--card); box-shadow: var(--frame-shadow-sm); overflow: hidden; }
	.phase-head { display: flex; align-items: center; gap: 14px; width: 100%; padding: 18px 20px; background: transparent; border: 0; cursor: pointer; text-align: left; font-family: var(--ff); color: var(--ink); }
	.phase-dot { flex: none; width: 12px; height: 12px; border-radius: 50%; background: var(--line); border: 2px solid var(--ink-soft); }
	.phase.open .phase-dot { background: var(--blue); border-color: var(--blue); }
	.phase-title { flex: 1 1 auto; font-size: 18px; font-weight: 700; letter-spacing: -.01em; color: var(--ink); }
	.phase-range { font-weight: 800; }
	.phase-pm { flex: none; color: var(--ink-soft); font-size: 18px; font-weight: 800; transition: transform .25s ease; }
	.phase.open .phase-pm { transform: rotate(45deg); }
	.phase-body { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
	.phase-body ul { list-style: none; margin: 0; padding: 0 20px 20px 50px; display: grid; gap: 9px; }
	.phase-body li { font-size: 14.5px; color: var(--ink-soft); font-weight: 600; line-height: 1.4; position: relative; padding-left: 18px; }
	.phase-body li::before { content: "✓"; position: absolute; left: 0; color: var(--green-ok); font-weight: 900; }
	.syllabus-note { font-size: 12.5px; color: var(--ink-soft); line-height: 1.5; margin: 12px 4px 0; }
	.syllabus-phone .ph { aspect-ratio: 9/16; max-width: 320px; margin: 0 auto; border-radius: 28px; box-shadow: var(--frame-shadow); }

	/* ── Placeholder (striped) ───────────────────────── */
	.ph { background: repeating-linear-gradient(135deg, #d7cdb8 0 9px, #cfc4ad 9px 18px); position: relative; border: 2px solid var(--ink); box-shadow: var(--frame-shadow-sm); }
	.ph[data-label]::after { content: attr(data-label); position: absolute; inset: 0; display: grid; place-items: center; text-align: center; font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; font-weight: 600; letter-spacing: .04em; color: #6c6149; padding: 12px; }

	/* ── Reviews ─────────────────────────────────────── */
	.review-featured { padding: clamp(28px, 4vw, 44px); margin: 0 auto; max-width: 820px; text-align: center; }
	.rf-avatar, .rc-avatar { flex: none; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; font-weight: 800; color: #fff; font-size: 16px; letter-spacing: .02em; border: 2px solid var(--ink); box-shadow: 0 3px 0 rgba(20,19,15,.18); }
	.rf-avatar { width: 64px; height: 64px; font-size: 20px; }
	.rf-q { font-size: 72px; line-height: 0; height: 48px; color: var(--blue); font-weight: 900; display: block; }
	.rf-headline { font-size: clamp(20px, 2.6vw, 28px); font-weight: 800; line-height: 1.2; letter-spacing: -.01em; margin: 36px 0 20px; color: var(--ink); }
	.rf-quote { font-size: clamp(16px, 1.8vw, 19px); line-height: 1.55; color: var(--ink-soft); margin: 0; font-style: italic; }
	.rf-attr { display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap; margin: 28px auto 0; padding-top: 20px; border-top: 1px solid var(--line); max-width: 560px; text-align: left; }
	.rf-meta { display: flex; flex-direction: column; gap: 2px; }
	.rf-name { font-weight: 900; font-size: 16px; }
	.rf-where { font-size: 13px; color: var(--ink-soft); }
	.rf-verified { font-size: 12px; font-weight: 800; color: var(--green-ok); margin-top: 2px; }
	.review-grid { display: grid; grid-template-columns: 1fr; gap: 18px; margin-top: 22px; }
	@media (min-width: 760px) { .review-grid { grid-template-columns: repeat(3, 1fr); } }
	.review-card { background: var(--card); border: 2px solid var(--ink); border-radius: var(--radius); box-shadow: var(--frame-shadow-sm); padding: 24px 22px; display: flex; flex-direction: column; gap: 16px; }
	.rc-stars { color: var(--orange); letter-spacing: 2px; font-size: 15px; }
	.review-card .rc-quote { font-size: 15px; line-height: 1.5; color: var(--ink-2); margin: 0; }
	.rc-attr { display: flex; align-items: center; gap: 14px; margin-top: auto; padding-top: 14px; border-top: 1px solid var(--line); }
	.rc-meta { display: flex; flex-direction: column; gap: 2px; }
	.rc-name { font-weight: 800; font-size: 14.5px; }
	.rc-where { font-size: 12px; color: var(--ink-soft); }
	.rc-verified { font-size: 11px; font-weight: 800; color: var(--green-ok); margin-top: 2px; }

	/* ── Guarantee panel ─────────────────────────────── */
	.guarantee-panel { background: var(--green-tint); border: 2px solid var(--ink); border-radius: var(--radius-lg); box-shadow: var(--frame-shadow-sm); padding: clamp(32px, 5vw, 52px); text-align: center; }
	.gp-eyebrow { color: var(--green-deep); }
	.gp-h2 { font-size: clamp(28px, 3.6vw, 44px); margin: 6px 0 32px; }
	.gp-steps { display: grid; grid-template-columns: 1fr; gap: 22px; margin: 0 0 32px; }
	@media (min-width: 560px) { .gp-steps { grid-template-columns: repeat(3, 1fr); } }
	.gp-step { display: flex; flex-direction: column; align-items: center; gap: 10px; }
	.gp-rn { width: 44px; height: 44px; border-radius: 50%; background: var(--card); border: 2px solid var(--green-deep); color: var(--green-deep); display: grid; place-items: center; font-weight: 800; font-size: 14px; }
	.gp-step div { font-size: 14.5px; line-height: 1.45; color: var(--ink-soft); }
	.gp-step strong { color: var(--ink); font-weight: 800; }

	/* ── FAQ ─────────────────────────────────────────── */
	.faq { max-width: 820px; margin: 0 auto; }
	.faq-cat { font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--blue); margin: 28px 0 12px; }
	.faq-cat:first-child { margin-top: 0; }
	.faq-item { border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); background: var(--card); margin-bottom: 12px; overflow: hidden; box-shadow: var(--frame-shadow-sm); }
	.faq-q { width: 100%; background: none; border: 0; cursor: pointer; font-family: var(--ff); display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 22px; text-align: left; font-size: 16px; font-weight: 800; color: var(--ink); line-height: 1.3; }
	.faq-pm { flex: none; width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--frame-ink); display: grid; place-items: center; font-size: 17px; font-weight: 800; transition: transform .25s ease; }
	.faq-item.open .faq-pm { transform: rotate(45deg); }
	.faq-q:focus-visible { outline: 3px solid var(--blue-deep); outline-offset: -3px; border-radius: var(--frame-radius); }
	.faq-a { max-height: 0; overflow: hidden; transition: max-height .3s ease; }
	.faq-a > div { padding: 0 22px 22px; font-size: 15px; line-height: 1.6; color: var(--ink-soft); }

	/* ── Responsive ──────────────────────────────────── */
	@media (max-width: 640px) {
		.wrap { padding: 0 18px; }
		.rsection { padding: clamp(56px, 12vw, 72px) 0; }
		.btn--lg { width: 100%; }
		.gauge-col { order: -1; }
		.outlook-callout { position: static; display: inline-block; margin: 12px auto 0; }
		.fail-row { gap: 14px; }
	}

	/* ── Reveal + line-draw motion ───────────────────── */
	@media (prefers-reduced-motion: no-preference) {
		.reveal { opacity: 0; transform: translateY(14px); transition: opacity .45s ease-out, transform .45s ease-out; }
		:global(.results-page .reveal.in) { opacity: 1; transform: none; }
		.outlook-line { stroke-dasharray: var(--len, 600); stroke-dashoffset: var(--len, 600); transition: stroke-dashoffset .9s ease-in-out; }
		.outlook-line.draw { stroke-dashoffset: 0; }
	}
</style>
