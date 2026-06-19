<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	const RESULTS_KEY = 'copables_quiz_results';

	let mounted = $state(false);
	let results: any = $state(null);

	function sssBand(score: number) {
		if (score <= 75) return { label: 'Remission', tone: 'mild', desc: 'Your symptoms are currently in the remission range.' };
		if (score <= 175) return { label: 'Mild IBS', tone: 'mild', desc: 'Your symptoms are present but relatively mild on the clinical scale.' };
		if (score <= 300) return { label: 'Moderate IBS', tone: 'moderate', desc: 'Your symptoms sit in the moderate range — this is where the protocol tends to show the clearest signal.' };
		return { label: 'Severe IBS', tone: 'severe', desc: 'Your symptoms are in the severe range. The protocol may help, and a clinician should also be in the loop.' };
	}

	function fitCopy(score: number) {
		if (score >= 72) return { label: 'Strong fit', body: 'Your answers line up well with the traits that predict a strong response to an open-label placebo protocol.' };
		if (score >= 55) return { label: 'Good fit', body: 'Most of your answers point toward a good response. The daily ritual and CBT-style cards should land well.' };
		if (score >= 40) return { label: 'Moderate fit', body: 'You show some of the responder traits, but it may take a little longer for the protocol to feel natural.' };
		return { label: 'Likely not a fit', body: 'Based on your answers, this approach is less likely to feel credible or useful to you right now. That is honest data too.' };
	}

	function buy(label: string) {
		track('cta_click', { label, page: 'quiz_ibs_results' });
	}

	onMount(() => {
		try {
			const raw = localStorage.getItem(RESULTS_KEY);
			if (raw) results = JSON.parse(raw);
		} catch {}
		mounted = true;
	});

	let score = $derived(results?.sss ?? 0);
	let band = $derived(sssBand(score));
	let fit = $derived(results?.fit ?? { score: 0, verdict: '' });
	let fitCopyOut = $derived(fitCopy(fit.score));
	let alarm = $derived(results?.alarmLevel ?? { label: '', pct: 0 });
	let safetyYes = $derived(results?.safety === 'Yes, one or more apply');
	const BAND_CHARGE: Record<string, string> = { mild: 'var(--green-ok)', moderate: 'var(--orange)', severe: 'var(--wine)' };
	let chargeColor = $derived(BAND_CHARGE[band.tone] ?? 'var(--accent)');
	let markerPct = $derived(Math.min(100, (Math.min(500, score) / 500) * 100));
	let scoreState = $state(0);
	let markerState = $state(0);
	let responderType = $derived(results?.responderType ?? null);
	let proj = $derived(results?.projection ?? null);

	// Editorial score count-up + marker slide
	$effect(() => {
		if (!mounted || !results) return;
		scoreState = 0;
		markerState = 0;
		const dur = 1100;
		const start = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / dur);
			const eased = 1 - Math.pow(1 - t, 3);
			scoreState = Math.round(score * eased);
			markerState = markerPct * eased;
			if (t < 1) raf = requestAnimationFrame(tick);
			else { scoreState = score; markerState = markerPct; }
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});
</script>

<svelte:head>
	<title>Your IBS Results — Copables</title>
	<meta name="description" content="Your personalized IBS severity score and Copables protocol fit." />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="results">
	<header class="rhead">
		<a class="rbrand" href="/" aria-label="Copables home">
			<img src="/assets/wordmark.webp" alt="copables" />
		</a>
	</header>

	<main class="rmain">
		{#if !mounted}
			<div class="rcard loading">
				<p class="q-kick">Loading</p>
				<h1 class="rh">Retrieving your results…</h1>
			</div>
		{:else if !results}
			<div class="rcard">
				<p class="q-kick">No results found</p>
				<h1 class="rh">We couldn't find your quiz results.</h1>
				<p class="rsub">If you completed the quiz, your session may have expired. Otherwise, start fresh below.</p>
				<a class="btn btn--primary btn--lg" href="/quiz/ibs">Retake the quiz →</a>
			</div>
		{:else}
			<!-- ── Hero score ─────────────────────────────────── -->
			<section class="rcard hero">
				<p class="q-kick">Your IBS Severity Score (IBS-SSS)</p>
				<div class="score-card" style="--charge:{chargeColor}">
					<span class="score-num">{scoreState}</span>
					<span class="score-of">of 500 · IBS-SSS</span>
					<div class="score-scale" aria-label="IBS severity scale">
						<div class="score-scale-bar">
							<span class="band-seg band-mild"></span>
							<span class="band-seg band-moderate"></span>
							<span class="band-seg band-severe"></span>
						</div>
						<div class="score-marker" style="left:{markerState}%"></div>
						<div class="score-scale-labels">
							<span>Mild</span><span>Moderate</span><span>Severe</span>
						</div>
					</div>
					<div class="band-stamp band-{band.tone}">{band.label}</div>
				</div>
				<h1 class="rh">{band.desc}</h1>
				<p class="rsub">The IBS-SSS is a validated 0–500 severity scale. A higher number means a bigger daily impact. This score is the same one used in the Harvard open-label placebo trials.</p>
			</section>

			<!-- ── Responder type ─────────────────────────────── -->
			{#if responderType}
				<section class="rcard rtype">
					<p class="q-kick">Your responder profile</p>
					<div class="type-stamp"><span class="type-name">{responderType.name}</span></div>
					<h2 class="rh">{responderType.title}</h2>
					<p class="rsub">{responderType.body}</p>
				</section>
			{/if}

			<!-- ── Projection ─────────────────────────────────── -->
			{#if proj && !safetyYes}
				<section class="rcard proj">
					<p class="q-kick">Your projection</p>
					<h2 class="rh">Where your score could land after 14 days.</h2>
					<div class="proj-display">
						<div class="proj-current">
							<span class="proj-label">Today</span>
							<span class="proj-num">{score}</span>
						</div>
						<span class="proj-arrow">→</span>
						<div class="proj-future">
							<span class="proj-label">After 14 days</span>
							<span class="proj-num proj-range">{proj.high}–{proj.low}</span>
						</div>
					</div>
					<p class="rsub">As {responderType?.name ?? 'a responder'}, you're projected toward a {proj.pctLow}–{proj.pctHigh}% drop. That's the average improvement seen in responders in the published research.</p>
					<p class="proj-disclaim">Projection based on average improvement in responders in published research (Kaptchuk 2021: IBS-SSS fell ~37%). Individual results vary and aren't guaranteed.</p>
				</section>
			{/if}

			<!-- ── Safety verdict (if flagged) ────────────────── -->
			{#if safetyYes}
				<section class="rcard safety">
					<div class="safety-icon">!</div>
					<p class="q-kick">Please speak to a clinician first</p>
					<h2 class="rh">You selected one or more alarm features.</h2>
					<p class="rsub">Those symptoms can sometimes signal a condition that needs medical evaluation before any self-directed protocol. We are not showing a purchase option here; please see a doctor to rule out anything urgent.</p>
				</section>
			{/if}

			<!-- ── Fit verdict ────────────────────────────────── -->
			<section class="rcard fit">
				<p class="q-kick">Protocol fit</p>
				<div class="fit-score">
					<span class="fit-num">{fit.score}</span>
					<span class="fit-of">/ 100</span>
				</div>
				<h2 class="rh">{fitCopyOut.label}</h2>
				<p class="rsub">{fitCopyOut.body} This score is derived from your flare reaction, anticipatory sensitivity, and the fit-check statements — openness, curiosity, active role, and nervous-system retraining.</p>
			</section>

			<!-- ── Research proof (heavy artillery for conversion) ─ -->
			<section class="rcard proof">
				<p class="q-kick">The research behind the protocol</p>
				<div class="qharvard"><img src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" /></div>
				<h2 class="rh">Honest placebos produced real, measurable relief.</h2>
				<div class="proof-grid">
					<div class="proof-item">
						<div class="donut" aria-label="69% reported clinically meaningful relief">
							<svg viewBox="0 0 120 120">
								<circle cx="60" cy="60" r="50" fill="none" stroke="rgba(20,19,15,.12)" stroke-width="12" />
								<circle cx="60" cy="60" r="50" fill="none" stroke="var(--accent)" stroke-width="12" stroke-linecap="round" stroke-dasharray="314" stroke-dashoffset="97" transform="rotate(-90 60 60)" />
							</svg>
							<div class="donut-text">69%</div>
						</div>
						<p class="proof-cap">reported clinically meaningful relief in the 2021 Harvard follow-up.</p>
					</div>
					<div class="proof-item">
						<div class="big-stat">1 in 4</div>
						<p class="proof-cap">people with IBS say the condition is life-altering. You are not alone, and the research offers a genuine lever.</p>
					</div>
				</div>
				<div class="study-row">
					<div class="study">
						<span class="study-year">2010</span>
						<p><strong>59%</strong> adequate relief with open-label placebo vs. 35% with no treatment.</p>
						<a href="https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591" target="_blank" rel="noopener noreferrer">View study →</a>
					</div>
					<div class="study">
						<span class="study-year">2021</span>
						<p><strong>~73%</strong> more symptom improvement than no treatment (n=262).</p>
						<a href="https://journals.lww.com/pain/Fulltext/2021/09000/Open_label_placebo_vs_double_blind_placebo_for.6.aspx" target="_blank" rel="noopener noreferrer">View study →</a>
					</div>
				</div>
			</section>

			<!-- ── Offer / buy box (suppressed if safety flagged) ─ -->
			{#if !safetyYes}
				<section class="rcard offer">
					<div class="offer-media">
						<img src="/assets/bottle-ibs.webp" alt="Copables 14-Day IBS Protocol" />
					</div>
					<div class="offer-body">
						<p class="q-kick">Recommended for you</p>
						<h2 class="rh">The 14-Day IBS Protocol</h2>
						<p class="rsub">An honest, open-label placebo ritual plus guided CBT-style cards — designed for people whose gut and brain are stuck in a threat loop.</p>
						<ul class="offer-list">
							<li><span>✓</span> 30 natural, 100% vegan gummies</li>
							<li><span>✓</span> 14-day tracker & ritual cards</li>
							<li><span>✓</span> Guided app — one short lesson a day</li>
							<li><span>✓</span> Free shipping & 90-day money-back guarantee</li>
						</ul>
						<div class="offer-price">
							<span class="price">$48</span>
							<span class="subprice">or $40.80 with Subscribe & Save</span>
						</div>
						<a class="btn btn--primary btn--lg" href="/shop/ibs" onclick={() => buy('results_cta')}>Pre-order now →</a>
						<p class="offer-note">You won't be charged until your order ships. Cancel any time before dispatch.</p>
					</div>
				</section>
			{/if}

			<div class="rfoot">
				<a href="/quiz/ibs" onclick={() => track('quiz_restart', { page: 'quiz_ibs_results' })}>Start over</a>
				<span>·</span>
				<a href="/science">Read the science →</a>
			</div>
		{/if}
	</main>
</div>

<style>
.results { min-height: 100dvh; background: var(--paper); color: var(--ink); font-family: var(--ff); }
.rhead { padding: 18px clamp(16px,4vw,30px); max-width: 800px; margin: 0 auto; }
.rbrand img { height: 19px; width: auto; display: block; }
.rmain { max-width: 720px; margin: 0 auto; padding: 0 clamp(16px,4vw,30px) 60px; display: grid; gap: 22px; }

.rcard { background: var(--card); border: 2px solid var(--ink); border-radius: var(--frame-radius-lg); padding: clamp(26px,5vw,40px); box-shadow: var(--frame-shadow); text-align: center; }
.rcard.loading { opacity: .7; }

.q-kick { font-size: 12px; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-deep); margin: 0 0 14px; display: inline-flex; align-items: center; gap: 9px; }
.q-kick::before { content: ""; width: 22px; height: 2px; background: currentColor; display: inline-block; }
.rh { font-size: clamp(26px,4.2vw,36px); font-weight: 800; line-height: 1.05; letter-spacing: -0.025em; margin: 0; }
.rsub { font-size: clamp(15px,1.6vw,17px); color: var(--ink-soft); line-height: 1.55; margin: 14px 0 0; max-width: 52ch; margin-left: auto; margin-right: auto; }

/* editorial scorecard (§8.2) */
.score-card { background: var(--paper); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--radius); box-shadow: var(--frame-shadow-sm); padding: clamp(24px,5vw,36px) clamp(20px,4vw,32px) clamp(22px,4vw,30px); text-align: center; margin: 8px auto 22px; max-width: 420px; }
.score-num { display:block; font-family: var(--ff); font-size: clamp(78px,18vw,116px); font-weight: 900; letter-spacing: -0.05em; line-height: .9; color: var(--ink); font-variant-numeric: tabular-nums; }
.score-of { display:block; font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-soft); margin-top:6px; }
.score-scale { position:relative; margin:24px auto 6px; max-width:340px; }
.score-scale-bar { display:flex; height:10px; border:2px solid var(--ink); border-radius:6px; overflow:hidden; }
.band-seg { flex:1; }
.band-seg.band-mild { background:rgba(46,158,107,.22); }
.band-seg.band-moderate { background:rgba(242,144,30,.22); border-left:2px solid var(--ink); }
.band-seg.band-severe { background:rgba(138,36,51,.20); border-left:2px solid var(--ink); }
.score-marker { position:absolute; top:-6px; width:0; height:0; border-left:11px solid transparent; border-right:11px solid transparent; border-top:14px solid var(--charge, var(--accent)); transform:translateX(-50%); transition:left 1s cubic-bezier(.2,.8,.2,1); filter:drop-shadow(0 2px 2px rgba(20,19,15,.25)); }
.score-scale-labels { display:flex; justify-content:space-between; margin-top:12px; }
.score-scale-labels span { font-size:10.5px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); }
.score-scale-labels span:nth-child(1) { flex:0 0 35%; text-align:left; }
.score-scale-labels span:nth-child(2) { flex:0 0 30%; text-align:center; }
.score-scale-labels span:nth-child(3) { flex:0 0 35%; text-align:right; }
.band-stamp { display:inline-block; margin:18px auto 0; font-size:13px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; padding:8px 18px; border:2px solid var(--ink); border-radius:6px; transform:rotate(-1.5deg); box-shadow:3px 3px 0 var(--frame-ink); }
.band-stamp.band-mild { color:#1f5c3e; background:#e3f1e9; border-color:#1f5c3e; box-shadow:3px 3px 0 #1f5c3e; }
.band-stamp.band-moderate { color:var(--orange-deep); background:var(--orange-tint); border-color:var(--orange-deep); box-shadow:3px 3px 0 var(--orange-deep); }
.band-stamp.band-severe { color:var(--wine); background:#f4dde1; border-color:var(--wine); box-shadow:3px 3px 0 var(--wine); }

.qharvard { margin:4px auto 14px; max-width:200px; }
.qharvard img { width:100%; height:auto; display:block; opacity:.82; }

/* responder type */
.rtype .type-stamp { display:inline-block; margin:6px auto 18px; padding:12px 26px; border:2.5px solid var(--ink); border-radius:8px; transform:rotate(-2deg); box-shadow:5px 5px 0 var(--frame-ink); background:var(--paper-2); }
.rtype .type-name { font-size:clamp(20px,3.5vw,28px); font-weight:900; letter-spacing:-0.02em; color:var(--ink); }

/* projection */
.proj-display { display:flex; align-items:center; justify-content:center; gap:20px; margin:24px auto; flex-wrap:wrap; }
.proj-current, .proj-future { display:flex; flex-direction:column; align-items:center; gap:6px; }
.proj-label { font-size:12px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); }
.proj-num { font-size:clamp(42px,8vw,58px); font-weight:900; letter-spacing:-0.04em; line-height:1; color:var(--ink); font-variant-numeric:tabular-nums; }
.proj-range { color:var(--accent-deep); }
.proj-arrow { font-size:36px; font-weight:900; color:var(--ink-soft); }
.proj-disclaim { font-size:11.5px; font-weight:600; color:var(--ink-soft); line-height:1.45; margin:14px 0 0; opacity:.75; max-width:48ch; margin-left:auto; margin-right:auto; }

/* safety */
.safety { background: #fff8f0; border-color: var(--orange); }
.safety-icon { width: 56px; height: 56px; border-radius: 50%; background: var(--orange); color: #fff; display: grid; place-items: center; font-size: 28px; font-weight: 900; margin: 0 auto 16px; }

/* fit */
.fit-score { margin: 10px 0 12px; }
.fit-num { font-size: 48px; font-weight: 900; letter-spacing: -0.03em; }
.fit-of { font-size: 15px; font-weight: 700; color: var(--ink-soft); }

/* proof */
.proof-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; margin: 26px 0; }
.proof-item { background: var(--paper); border: 1.5px solid var(--line); border-radius: var(--radius); padding: 22px 16px; }
.donut { position: relative; width: 110px; height: 110px; margin: 0 auto 12px; }
.donut svg { width: 100%; height: 100%; }
.donut-text { position: absolute; inset: 0; display: grid; place-items: center; font-size: 28px; font-weight: 900; }
.big-stat { font-size: 48px; font-weight: 900; letter-spacing: -0.03em; color: var(--accent-deep); line-height: 1; margin-bottom: 10px; }
.proof-cap { font-size: 13px; font-weight: 700; color: var(--ink-soft); line-height: 1.45; margin: 0; }
.study-row { display: grid; gap: 12px; text-align: left; }
.study { background: var(--paper); border: 1.5px solid var(--line); border-radius: var(--radius); padding: 18px 20px; }
.study-year { display: inline-block; font-size: 11px; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; color: var(--accent-deep); margin-bottom: 8px; }
.study p { font-size: 15px; line-height: 1.45; color: var(--ink-2); margin: 0 0 10px; }
.study a { font-size: 13px; font-weight: 800; color: var(--ink); text-decoration: none; border-bottom: 1.5px solid var(--accent); }

/* offer */
.offer { display: grid; grid-template-columns: 1fr; gap: 26px; text-align: left; }
@media (min-width: 640px) { .offer { grid-template-columns: 0.9fr 1.1fr; align-items: center; } }
.offer-media { border-radius: var(--frame-radius); overflow: hidden; background: var(--paper-2); aspect-ratio: 1/1; }
.offer-media img { width: 100%; height: 100%; object-fit: cover; }
.offer-body { display: flex; flex-direction: column; }
.offer-list { list-style: none; margin: 18px 0 0; padding: 0; display: grid; gap: 9px; }
.offer-list li { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: var(--ink-2); }
.offer-list span { width: 20px; height: 20px; border-radius: 50%; background: var(--green-ok); color: #fff; display: grid; place-items: center; font-size: 11px; font-weight: 900; flex: none; }
.offer-price { margin: 22px 0 16px; }
.price { font-size: 36px; font-weight: 900; letter-spacing: -0.02em; }
.subprice { display: block; font-size: 13px; font-weight: 700; color: var(--ink-soft); }
.offer-note { font-size: 12px; color: var(--ink-soft); margin: 12px 0 0; }

/* footer */
.rfoot { display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 13px; font-weight: 800; color: var(--ink-soft); }
.rfoot a { color: var(--ink); text-decoration: none; border-bottom: 1.5px solid var(--accent); }

/* buttons */
.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--ff); font-weight: 800; font-size: 17px; letter-spacing: -0.01em; padding: 17px 30px; border-radius: 999px; border: 0; cursor: pointer; text-decoration: none; transition: transform .14s ease, box-shadow .2s ease; line-height: 1; }
.btn--primary { background: var(--accent); color: #fff; box-shadow: 0 6px 0 var(--accent-deep); }
.btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--accent-deep); }
.btn--primary:active { transform: translateY(2px); box-shadow: 0 3px 0 var(--accent-deep); }
.btn--lg { font-size: 19px; padding: 21px 40px; width: 100%; }

@media (max-width: 640px) {
	.proof-grid { grid-template-columns: 1fr; }
	.score-dial { width: 160px; height: 160px; }
}
</style>
