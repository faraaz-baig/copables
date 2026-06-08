<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	/* ── Quiz (single-question gateway) ──────────────── */
	const QUIZ_Q1 = {
		title: 'How long have you been dealing with IBS?',
		options: ['Under a year', '1–3 years', '3–5 years', '5+ years / forever']
	};

	/** Returns an existing UID or mints a new one and persists it. */
	function getOrCreateUID(): string {
		let uid = localStorage.getItem('copables_uid');
		if (!uid) {
			// crypto.randomUUID() is supported in all modern browsers
			uid = typeof crypto !== 'undefined' && crypto.randomUUID
				? crypto.randomUUID()
				: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
						const r = (Math.random() * 16) | 0;
						return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
					});
			localStorage.setItem('copables_uid', uid);
		}
		return uid;
	}

	let quizLoading = $state(false);

	function choose(opt: string) {
		if (quizLoading) return;
		quizLoading = true;

		const uid = getOrCreateUID();

		// Persist session — quiz page + pixels read this on arrival
		localStorage.setItem('copables_session', JSON.stringify({
			uid,
			source: 'prelander/ibs',
			started_at: Date.now(),
			prelander_q1: opt          // "Under a year" | "1–3 years" | etc.
		}));

		// GTM dataLayer push — lets FB Pixel, GA4, Google Ads, etc. fire from GTM triggers
		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({ event: 'quiz_start', user_id: uid, prelander_answer: opt });

		// PostHog + GTM via the shared track() wrapper
		track('prelander_quiz_start', {
			uid,
			question: 'ibs_duration',
			answer: opt,
			source: 'prelander/ibs'
		});

		window.location.href = '/quiz/ibs';
	}

	/* ── FAQ ──────────────────────────────────────────── */
	let openFaq = $state<string | null>(null);
	function toggleFaq(id: string) {
		openFaq = openFaq === id ? null : id;
	}

	/* ── Quiz link scroll ─────────────────────────────── */
	function handleQuizLink(e: Event) {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
		setTimeout(() => {
			const card = document.getElementById('quizcard');
			if (card) {
				card.style.transition = 'box-shadow .3s, transform .3s';
				card.style.transform = 'scale(1.012)';
				card.style.boxShadow = '0 30px 70px rgba(47,149,242,.32)';
				setTimeout(() => { card.style.transform = ''; card.style.boxShadow = ''; }, 650);
			}
		}, 520);
	}

	/* ── Intersection observers (reveal, count-up, bars) */
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
			const isPct = el.classList.contains('pct');
			const dur = 1100; let start: number | null = null;
			(function tick(ts: number) {
				if (!start) start = ts;
				const p = Math.min((ts - start) / dur, 1);
				const ease = 1 - Math.pow(1 - p, 3);
				const val = Math.round(target * ease);
				el.textContent = (target >= 1000 ? val.toLocaleString() : val) + (isPct ? '%' : suffix);
				if (p < 1) requestAnimationFrame(tick);
			})(0);
		}
		const countIO = new IntersectionObserver((entries) => {
			entries.forEach(en => { if (en.isIntersecting) { animateCount(en.target); countIO.unobserve(en.target); } });
		}, { threshold: 0.6 });
		document.querySelectorAll('[data-count]').forEach(el => countIO.observe(el));

		// stat bars
		const barIO = new IntersectionObserver((entries) => {
			entries.forEach(en => {
				if (en.isIntersecting) {
					en.target.querySelectorAll<HTMLElement>('.fill').forEach(f => {
						f.style.width = (f.getAttribute('data-pct') || '0') + '%';
					});
					barIO.unobserve(en.target);
				}
			});
		}, { threshold: 0.5 });
		document.querySelectorAll('[data-statbar]').forEach(el => barIO.observe(el));

		// sticky mobile CTA
		const sticky = document.getElementById('stickyCta');
		const heroQuiz = document.getElementById('quiz');
		if (sticky && heroQuiz) {
			const stickyIO = new IntersectionObserver((entries) => {
				sticky.classList.toggle('show', !entries[0].isIntersecting);
			}, { threshold: 0 });
			stickyIO.observe(heroQuiz);
		}

		return () => { revealIO.disconnect(); countIO.disconnect(); barIO.disconnect(); };
	});

	const FAQS: { id: string; cat: string; q: string; a: string }[] = [
		{ id: 'f1', cat: 'The science', q: 'Wait, this is a placebo. How is that supposed to help me?', a: 'Totally fair question, and we\'d rather answer it honestly than dodge it. An open-label placebo means you know exactly what you\'re taking. And yes, it still works. Harvard ran proper randomized controlled trials on this, and IBS patients showed real, measurable symptom improvement. The reason it works isn\'t magic or self-deception. Your gut has its own nervous system and it responds to ritual, expectation, and consistency in ways that are now well understood. It\'s not in your head. It\'s just that your head is also part of what\'s making your gut flare up.' },
		{ id: 'f2', cat: '', q: 'Why is there CBT in this? My stomach is the problem, not my mental health.', a: 'We hear this a lot, and it\'s a reasonable thing to push back on. IBS is officially classified as a disorder of gut-brain interaction, which basically means the signalling between your nervous system and your gut has gone off track. Stress, life upheaval, anxiety about the symptoms themselves, it all feeds back into the gut in ways that diet and medication alone don\'t fix. CBT isn\'t suggesting the pain isn\'t real. It\'s targeting the feedback loop that keeps the pain coming back. Most people who\'ve done the program say this is the part that surprised them most.' },
		{ id: 'f3', cat: '', q: 'How do I know this is legit and not just another wellness brand?', a: 'The research behind this comes from Dr. Ted Kaptchuk at Harvard Medical School, published in peer-reviewed journals like PLOS ONE and Psychosomatic Medicine. These are papers that had to survive scrutiny from other scientists before they could be published. We include the actual citations in your Welcome Guide. If you want them before you decide to buy, just ask and we\'ll send them over.' },
		{ id: 'f4', cat: 'The product', q: 'What am I actually getting? Is it just pills?', a: 'No, and that distinction matters. A pill on its own doesn\'t activate the ritual layer that makes this work. The kit includes the capsules, a physical card deck you use throughout the 14 days, a Welcome Guide that walks you through the science, and access to the app. In the app you scan the cards and get CBT prompts tailored to your specific symptom patterns that day. It is structured like a real program, not a supplement routine.' },
		{ id: 'f5', cat: '', q: 'How much time does this take every day?', a: 'About 5 to 10 minutes. Take the capsules, scan a card, do the reflection the app gives you. That is genuinely it. The structure is intentional though, it needs to feel like a ritual rather than something you rush through. Most people do it before work or in the evening.' },
		{ id: 'f6', cat: '', q: 'I\'m already on medication for IBS. Can I still do this?', a: 'Yes. The program works through behavioral and neurological pathways, not pharmacological ones, so it doesn\'t interfere with what you\'re already taking. A lot of people come to Copables while they\'re mid-treatment or just finishing a course of meds. It works alongside, not instead of. If you have a specific question about your prescription, your doctor is the right person for that.' },
		{ id: 'f7', cat: 'Is this right for me?', q: 'I\'ve already tried everything. Low FODMAP, probiotics, cutting out dairy. Why would this be different?', a: 'Because none of those things target the brain-gut axis, which is often the actual driver, especially for people who\'ve been through the full medical workup and come out the other side with no clear answer. If your tests came back normal, if your doctor basically told you it\'s stress-related, if your symptoms seem to follow your life circumstances more than what you ate, those are signs the gut-brain pathway is where the problem lives. That\'s what Copables is built for.' },
		{ id: 'f8', cat: '', q: 'My IBS started when everything in my life changed at once. Is that relevant?', a: 'Really relevant, actually. A big move, a relationship shift, a business going sideways, a period of feeling stuck. This pattern shows up consistently in people who respond well to the Copables program. The gut doesn\'t distinguish between physical stress and emotional stress. When life piles on, the gut often takes the hit. The program is specifically designed for people whose symptoms have that kind of origin.' },
		{ id: 'f9', cat: '', q: 'I travel all the time and barely have a routine. Can I realistically do this?', a: 'Yes. The kit fits in a bag, the app works anywhere, and the daily commitment is short enough for a hotel room or an airport lounge. The 14 days don\'t have to be consecutive either. What matters is consistent engagement over the arc of the program, not perfect daily execution.' },
		{ id: 'f10', cat: 'Results and buying', q: 'What should I actually expect to happen, and when?', a: 'The Harvard trials showed meaningful symptom reduction within the 3 week protocol window. People generally notice flare-ups becoming less intense, more time between bad days, and less of that constant background anxiety about when the next one is coming. That last one tends to come first, and it matters more than people expect because the anxiety itself is part of what keeps the cycle going. This is a 14 day reset, not a cure. But most people who respond say it\'s the first thing that made the rest of their management feel actually manageable.' },
		{ id: 'f11', cat: '', q: 'I\'ve spent hundreds on things that didn\'t work. What if this doesn\'t either?', a: 'We get it. Tests, specialist fees, diets that required buying a whole new kitchen, prescription courses that insurance wouldn\'t cover. If you complete the full 14 day program and don\'t see meaningful improvement, we will refund you. The one condition is that you actually finish it, because the evidence only holds for people who saw it through. A week in doesn\'t give the mechanism enough time to do its thing.' },
		{ id: 'f12', cat: '', q: 'Does Copables only work for IBS?', a: 'IBS is the flagship because the research base is deepest there. But the same brain-body mechanism applies to anxiety, chronic pain, and depression, and Copables is building out protocols for those too. A lot of users also report unexpected side effects in the best sense, better sleep, less procrastination, more follow-through on things they\'d been putting off for years. The CBT component tends to spill over in ways people don\'t anticipate.' }
	];
</script>

<svelte:head>
	<title>copables — The 14-Day IBS Protocol</title>
	<meta name="description" content="Yes, an honest placebo can quiet your gut. Take the 60-second quiz to see if the Copables 14-Day IBS Protocol can work for you." />
</svelte:head>

<div class="prelander-page">

<!-- ── OFFER STRIP ──────────────────────────────────── -->
<div class="offer">
	Grounded in the 2010 Harvard open-label placebo study&nbsp;·&nbsp;
	<b>14-Day IBS Protocol</b>&nbsp;·&nbsp;now with a <b>90-day money-back guarantee</b>
</div>

<!-- ── HEADER ───────────────────────────────────────── -->
<header class="header">
	<div class="wrap header__row">
		<a class="brand" href="#top" aria-label="copables home" onclick={handleQuizLink}>
			<span class="wordmark">copables</span>
			<span class="tag">IBS</span>
		</a>
		<div class="header__right">
			<a class="header__login" href="#faq">How it works</a>
			<a class="btn btn--primary" href="#quiz" onclick={handleQuizLink}>Take the quiz</a>
		</div>
	</div>
</header>

<main id="top">

<!-- ── HERO + INLINE QUIZ ──────────────────────────── -->
<section class="hero dark" id="quiz">
	<div class="wrap">
		<div class="hero-grid">
			<div>
				<p class="eyebrow">The 60-second IBS quiz</p>
				<h1 class="h1">Yes, an <span class="ital u-accent">honest</span> placebo can quiet your gut.</h1>
				<p class="lead" style="margin-top:22px">No deception. No new elimination diet. Just the most fascinating finding in modern medicine — turned into a 14-day protocol for IBS.</p>
				<div class="hero-badges">
					<span class="hbadge"><span class="ic">✓</span> 100% natural &amp; vegan</span>
					<span class="hbadge"><span class="ic">✓</span> No prescription</span>
					<span class="hbadge"><span class="ic">✓</span> Works even when you know</span>
				</div>
			</div>

			<!-- inline quiz card — single gateway question, routes to full quiz on click -->
			<div class="quizcard" id="quizcard">
				<p class="q-eyebrow">Start here</p>
				<p class="q-title">{QUIZ_Q1.title}</p>
				<div class="q-options">
					{#each QUIZ_Q1.options as opt (opt)}
						<button
							class="q-opt"
							type="button"
							onclick={() => choose(opt)}
							disabled={quizLoading}
						>
							<span>{opt}</span>
							<span class="chev">{quizLoading ? '…' : '→'}</span>
						</button>
					{/each}
				</div>
				<div class="q-foot">
					<span>Takes 60 seconds</span><span class="dot"></span>
					<span>100% free</span><span class="dot"></span>
					<span>No email to start</span>
				</div>
			</div>
		</div>
	</div>
	<div class="wave-strip"></div>
</section>

<!-- ── PROMISE ─────────────────────────────────────── -->
<section class="section">
	<div class="wrap">
		<div class="promise-grid">
			<div class="reveal">
				<p class="eyebrow">Tried everything?</p>
				<h2 class="h2">You've done the diets. Your gut didn't get the memo.</h2>
				<p class="lead" style="margin-top:20px">In a landmark 2010 Harvard study, IBS patients given a placebo they <em>knew</em> was a placebo reported <strong style="color:var(--ink)">nearly double the symptom relief</strong> of those given nothing at all. We turned that finding into a protocol.</p>
				<ul class="xlist">
					<li><span class="mk x">✕</span><span>Endless elimination diets that shrink your life</span></li>
					<li><span class="mk x">✕</span><span>Prescriptions, waitlists, and side effects</span></li>
					<li><span class="mk x">✕</span><span>Another probiotic that did… nothing</span></li>
					<li><span class="mk v">✓</span><span><strong>A calmer gut — on your own terms</strong></span></li>
				</ul>
				<a class="btn btn--primary btn--lg" href="/quiz/ibs" onclick={handleQuizLink}>Take the quiz <span class="arrow">→</span></a>
				<p class="cta-note"><span>"The more you believe, the more you achieve."</span></p>
			</div>
			<div class="reveal">
				<div class="product-frame" style="aspect-ratio:4/5">
					<div class="ph ph-img" data-label="OLP Treatment No.2 — IBS bottle"></div>
					<div class="stamp"><small>OLP Treatment N°2</small>14-Day IBS Program · 30 gummies</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── RESEARCH BAR ─────────────────────────────────── -->
<section class="research">
	<div class="wrap">
		<p class="lbl">Grounded in research from</p>
		<div class="logos">
			<span class="uni">HARVARD<small>MEDICAL SCHOOL</small></span>
			<span class="uni">COLUMBIA<small>UNIVERSITY</small></span>
			<span class="uni">DANA·FARBER<small>INSTITUTE</small></span>
			<span class="uni">BETH ISRAEL<small>DEACONESS</small></span>
			<span class="uni">STANFORD<small>MEDICINE</small></span>
		</div>
	</div>
</section>

<!-- ── FEATURED TESTIMONIAL ────────────────────────── -->
<section class="section section--tight">
	<div class="wrap">
		<div class="bigquote reveal measure mx-auto">
			<span class="qmark">"</span>
			<h2>I was sure it was nonsense. Two weeks in, I stopped mapping every bathroom in the city.</h2>
			<div class="stars">★★★★★</div>
			<p class="rating-line">4.8 / 5 from 12,400+ verified members</p>
		</div>
	</div>
</section>

<!-- ── TESTIMONIAL CARDS ────────────────────────────── -->
<section class="section--tight" style="padding-top:0">
	<div class="wrap">
		<div class="t-grid">
			<article class="t-card reveal">
				<div class="t-head"><span class="avatar" style="background:#2F95F2">MK</span><div><div class="who">Maya K.</div><div class="where">United States</div></div></div>
				<p class="body">"Three years, four gastros, every diet on the internet. I genuinely rolled my eyes ordering this. I'm on day 19 and my flare-ups have gone from daily to maybe twice. I don't fully understand it and I don't care."</p>
				<div class="t-foot"><span class="stars">★★★★★</span><span class="date">Dec 1, 2025</span></div>
			</article>
			<article class="t-card reveal">
				<div class="t-head"><span class="avatar" style="background:#F2901E">DR</span><div><div class="who">Devin R.</div><div class="where">United Kingdom</div></div></div>
				<p class="body">"The ritual is the part that got me. Two gummies, the app check-in, the tracker. It gave my brain something to <em>do</em> other than panic about my stomach. Symptoms followed."</p>
				<div class="t-foot"><span class="stars">★★★★★</span><span class="date">Nov 18, 2025</span></div>
			</article>
			<article class="t-card reveal">
				<div class="t-head"><span class="avatar" style="background:#8A2433">SL</span><div><div class="who">Sofia L.</div><div class="where">Canada</div></div></div>
				<p class="body">"What sold me is that they tell you straight up it's a placebo. No mystic claims, just the science. Skeptic-to-believer in about ten days. Re-ordered already."</p>
				<div class="t-foot"><span class="stars">★★★★★</span><span class="date">Oct 30, 2025</span></div>
			</article>
		</div>
		<p class="tiny center" style="margin-top:22px"><span class="verified">✓ Verified members</span>&nbsp;·&nbsp;reviews collected by an independent platform</p>
	</div>
</section>

<!-- ── ROOT CAUSE ───────────────────────────────────── -->
<section class="section alt">
	<div class="wrap">
		<div class="split">
			<div class="reveal">
				<p class="eyebrow">The root cause</p>
				<h2 class="h2">Your IBS lives on the <span class="u-accent">gut–brain axis</span>.</h2>
				<p class="lead" style="margin-top:20px">IBS is now classified as a <strong style="color:var(--ink)">disorder of gut–brain interaction</strong> — a miscommunication, not a defect in your gut.</p>
				<p>When the line between gut and brain gets noisy, ordinary signals get read as alarms: cramping, bloating, the sudden 6&nbsp;a.m. dash. The gut isn't broken. The conversation is.</p>
				<p>That's exactly why expectation has so much power here. Teach the brain to stop sounding false alarms, and the symptoms it was amplifying can quiet down with it.</p>
			</div>
			<div class="gutbrain reveal">
				<div class="loop">
					<div class="arc"></div>
					<div class="arc b"></div>
					<div class="node node--brain"><span><small>Brain</small>over-reads<br>the signal</span></div>
					<div class="node node--gut"><span><small>Gut</small>sends a<br>normal signal</span></div>
					<div class="pill-tag l">false alarm ↑</div>
					<div class="pill-tag r">expectation ↓</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── SCIENCE (dark) ──────────────────────────────── -->
<section class="section dark">
	<div class="wrap">
		<div class="center measure mx-auto reveal" style="margin-bottom:46px">
			<p class="eyebrow" style="justify-content:center">The science</p>
			<h2 class="h2">Why a placebo you can <span class="ital u-accent">see through</span> still works.</h2>
			<p class="lead" style="margin-top:18px">Open-label placebos (OLPs) don't rely on fooling you. They work through three mechanisms your brain runs whether you're watching or not.</p>
		</div>
		<div class="mech-grid">
			<div class="mech reveal">
				<div class="num">01 — MECHANISM</div>
				<h3>Conditioned Expectation</h3>
				<p>A lifetime of "take medicine → feel better" trains a physical response. The pill triggers it — no belief required, like a reflex.</p>
			</div>
			<div class="mech reveal">
				<div class="num">02 — MECHANISM</div>
				<h3>Symptom-Loop Reset</h3>
				<p>Anxiety about symptoms amplifies symptoms. A daily ritual interrupts that feedback loop and turns the volume back down.</p>
			</div>
			<div class="mech reveal">
				<div class="num">03 — MECHANISM</div>
				<h3>The Reward of Action</h3>
				<p>Doing something deliberate for your gut every day restores a sense of control — and control itself measurably eases IBS.</p>
			</div>
		</div>
		<div class="science-card reveal" style="margin-top:34px; color:var(--ink)">
			<div class="split" style="gap:40px; align-items:center">
				<div>
					<h3 class="h3" style="margin-bottom:8px">Open-label placebo vs. no treatment</h3>
					<p class="tiny" style="margin-bottom:22px">Adequate IBS symptom relief reported over the trial period.</p>
					<div class="statbar" data-statbar>
						<div class="row"><span>Honest placebo</span><span class="track"><span class="fill a" data-pct="59"></span></span><span class="pct" data-count="59">0%</span></div>
						<div class="row"><span>No treatment</span><span class="track"><span class="fill b" data-pct="35"></span></span><span class="pct" data-count="35">0%</span></div>
					</div>
					<p class="cite">Kaptchuk T.J. et&nbsp;al. (2010). "Placebos without Deception: A Randomized Controlled Trial in Irritable Bowel Syndrome." <em>PLoS&nbsp;ONE</em> 5(12):e15591. Figures illustrative of published findings; individual results vary.</p>
				</div>
				<div>
					<div class="cred">
						<div class="ph" style="border-radius:50%; width:56px; height:56px; flex:none" data-label="Dr. Voss"></div>
						<div>
							<div class="nm">Dr. Elena Voss, PhD</div>
							<div class="ro">Behavioral neuroscientist &amp; Copables scientific advisor. Studies expectation effects in gut-brain disorders.</div>
						</div>
					</div>
					<p style="margin-top:18px; font-size:16px; line-height:1.55; color:var(--ink-2)">"The open-label placebo is one of the only 'honest' tools in medicine that still moves the needle on IBS. The ritual is the active ingredient."</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── HOW IT WORKS ─────────────────────────────────── -->
<section class="section alt" id="faq">
	<div class="wrap">
		<div class="center reveal" style="margin-bottom:14px">
			<p class="eyebrow" style="justify-content:center">How it works</p>
			<h2 class="h2">Four steps. Fourteen days.</h2>
		</div>
		<div class="steps">
			<div class="step reveal"><span class="n">1</span><div><h3>Take the 60-second quiz</h3><p>Tell us about your symptoms and history. We match you to the right protocol.</p></div></div>
			<div class="step reveal"><span class="n">2</span><div><h3>Your 14-day IBS kit arrives</h3><p>30 natural gummies, the accountability tracker, and the guided app — everything in one box.</p></div></div>
			<div class="step reveal"><span class="n">3</span><div><h3>Two gummies a day, with the ritual</h3><p>A 2-minute daily check-in retrains the gut-brain conversation. Consistency is the whole game.</p></div></div>
			<div class="step reveal"><span class="n">4</span><div><h3>Feel the loop loosen</h3><p>Most members notice calmer days inside the two weeks — and keep the habit long after.</p></div></div>
		</div>
		<div class="center" style="margin-top:38px">
			<a class="btn btn--primary btn--lg" href="/quiz/ibs" onclick={handleQuizLink}>Start the quiz <span class="arrow">→</span></a>
		</div>
	</div>
</section>

<!-- ── WHY COPABLES ─────────────────────────────────── -->
<section class="section">
	<div class="wrap">
		<div class="center measure mx-auto reveal" style="margin-bottom:48px">
			<h2 class="h2">Why <span data-count="12000" data-suffix="+">12,000+</span> people chose Copables for their gut.</h2>
		</div>
		<div class="cols">
			<div class="col-feat reveal"><div class="ic">⌕</div><h3>Science-backed</h3><p>Built on peer-reviewed open-label placebo research, not vibes.</p></div>
			<div class="col-feat reveal"><div class="ic">⏱</div><h3>Results in ~2 weeks</h3><p>A short, structured protocol designed to fit a real life.</p></div>
			<div class="col-feat reveal"><div class="ic">✕</div><h3>No diets or drugs</h3><p>Nothing to cut out, no prescription, no side-effect roulette.</p></div>
			<div class="col-feat reveal"><div class="ic">♥</div><h3>100% natural</h3><p>Vegan gummies, honest label, and a real human on support.</p></div>
		</div>
	</div>
</section>

<!-- ── COMPARISON ───────────────────────────────────── -->
<section class="section alt">
	<div class="wrap">
		<div class="center reveal" style="margin-bottom:38px">
			<p class="eyebrow" style="justify-content:center">More than a sugar pill</p>
			<h2 class="h2">The usual IBS playbook, vs. Copables.</h2>
		</div>
		<div class="compare reveal">
			<div class="crow chead">
				<span></span>
				<span class="c1">Usual playbook</span>
				<span class="c2"><span class="cophead">copables</span></span>
			</div>
			<div class="crow"><span class="feat">No elimination diet required</span><span class="c1">✕</span><span class="c2">✓</span></div>
			<div class="crow"><span class="feat">No prescription or waitlist</span><span class="c1">✕</span><span class="c2">✓</span></div>
			<div class="crow"><span class="feat">Works <em>knowing</em> it's a placebo</span><span class="c1">✕</span><span class="c2">✓</span></div>
			<div class="crow"><span class="feat">Daily ritual + guided app</span><span class="c1">✕</span><span class="c2">✓</span></div>
			<div class="crow"><span class="feat">100% natural &amp; vegan</span><span class="c1">—</span><span class="c2">✓</span></div>
			<div class="crow"><span class="feat">90-day money-back guarantee</span><span class="c1">✕</span><span class="c2">✓</span></div>
		</div>
	</div>
</section>

<!-- ── QUALIFY CHECKLIST ────────────────────────────── -->
<section class="section">
	<div class="wrap">
		<div class="qualify-grid">
			<div class="reveal">
				<p class="eyebrow">Sound familiar?</p>
				<h2 class="h2">Copables is likely a fit if…</h2>
				<ul class="qlist">
					<li><span class="ck">✓</span> You've tried treatments for IBS that disappointed you</li>
					<li><span class="ck">✓</span> Your gut has quietly shrunk where you'll go and what you'll eat</li>
					<li><span class="ck">✓</span> Stress and anxiety seem to set off your symptoms</li>
					<li><span class="ck">✓</span> You always know where the nearest bathroom is</li>
					<li><span class="ck">✓</span> You're open to a mind-body approach with real science behind it</li>
					<li><span class="ck">✓</span> You've had IBS for years — or were recently diagnosed</li>
				</ul>
				<a class="btn btn--primary btn--lg" href="/quiz/ibs" onclick={handleQuizLink}>See if it fits — take the quiz <span class="arrow">→</span></a>
			</div>
			<div class="reveal">
				<div class="product-frame" style="aspect-ratio:1/1">
					<div class="ph ph-img" data-label="Copables welcome kit: gummies · tracker · guided app"></div>
					<div class="stamp"><small>In the box</small>Gummies · tracker · guided app</div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── PROGRAM / KIT ────────────────────────────────── -->
<section class="section alt">
	<div class="wrap">
		<div class="kit-grid">
			<div class="reveal">
				<div class="product-frame" style="aspect-ratio:4/5">
					<div class="ph ph-img" data-label="Copables OLP protocol range lineup"></div>
				</div>
			</div>
			<div class="reveal">
				<p class="eyebrow">The program</p>
				<h2 class="h2" style="margin-bottom:30px">Everything the protocol needs.</h2>
				<div class="feat-list">
					<div class="feat"><div class="ic">◷</div><h3>14-day gummy supply</h3><p>Two natural gummies a day — that's the whole dose.</p></div>
					<div class="feat"><div class="ic">✓</div><h3>Daily ritual prompts</h3><p>Two minutes in the app that do the real work.</p></div>
					<div class="feat"><div class="ic">▦</div><h3>Accountability tracker</h3><p>A 14-day card so the habit actually sticks.</p></div>
					<div class="feat"><div class="ic">◎</div><h3>Flare-up toolkit</h3><p>Calming exercises for the rough days.</p></div>
					<div class="feat"><div class="ic">✦</div><h3>Guided by the app</h3><p>Plain-English science, one short lesson a day.</p></div>
					<div class="feat"><div class="ic">☺</div><h3>Real human support</h3><p>Say bye to bots — a real person, when you need one.</p></div>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- ── GUARANTEE ────────────────────────────────────── -->
<section class="section">
	<div class="wrap">
		<div class="guarantee reveal">
			<div class="seal" aria-hidden="true">
				<span class="seal-num">90</span>
				<span class="seal-unit">day</span>
			</div>
			<p class="eyebrow" style="justify-content:center">Our promise to you</p>
			<h2 class="h2">Run the 14 days. If your gut isn't calmer, it's free.</h2>
			<p class="lead measure mx-auto" style="margin-top:18px">We've helped over 12,000 people live easier with IBS — but we know it won't work for everyone. So every protocol is backed by a full <strong style="color:var(--ink)">90-day money-back guarantee.</strong></p>
			<blockquote class="promise-quote">
				"We built this for the people who've been told it's 'just in your head,' as if that makes it less real. It isn't. The gut-brain link is real — and so is the relief."
				<cite>— Theo Marsh, Co-founder of Copables</cite>
			</blockquote>
			<div class="refund-steps">
				<div class="rstep"><span class="rn">1</span><div><h3>Finish the 14 days</h3><p>Complete the protocol, ritual and all.</p></div></div>
				<div class="rstep"><span class="rn">2</span><div><h3>Email us once</h3><p>No forms, no return shipping, no hold music.</p></div></div>
				<div class="rstep"><span class="rn">3</span><div><h3>Get a full refund</h3><p>Every cent back, any time within 90 days.</p></div></div>
			</div>
			<a class="btn btn--primary btn--lg" href="/quiz/ibs" onclick={handleQuizLink}>Take the quiz <span class="arrow">→</span></a>
		</div>
	</div>
</section>

<!-- ── FAQ ──────────────────────────────────────────── -->
<section class="section alt">
	<div class="wrap">
		<div class="center reveal" style="margin-bottom:34px">
			<h2 class="h2">Questions, answered straight.</h2>
		</div>
		<div class="faq">
			{#each FAQS as faq (faq.id)}
				{#if faq.cat}
					<p class="faq-cat">{faq.cat}</p>
				{/if}
				<div class="faq-item" class:open={openFaq === faq.id}>
					<button class="faq-q" onclick={() => toggleFaq(faq.id)}>
						{faq.q}<span class="pm">+</span>
					</button>
					<div class="faq-a" style:max-height={openFaq === faq.id ? '600px' : '0px'}>
						<div>{faq.a}</div>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- ── FINAL CTA ────────────────────────────────────── -->
<section class="final">
	<span class="final-wave" aria-hidden="true">
		{#each Array(24) as _, i (i)}<i></i>{/each}
	</span>
	<div class="wrap">
		<div class="final-badge">
			<img src="/assets/face.webp" alt="copables" />
		</div>
		<p class="final-eyebrow">Mind over medicine</p>
		<h2 class="final-h">Ready to quiet your gut?</h2>
		<p class="final-sub">Take the 60-second quiz and see if the 14-Day IBS Protocol is right for you. No commitment — just answers.</p>
		<a class="btn btn--primary btn--lg final-cta" href="/quiz/ibs" onclick={handleQuizLink}>Take the 60-second quiz <span class="arrow">→</span></a>
		<div class="final-chips">
			<span class="fchip"><i>✓</i> 100% free</span>
			<span class="fchip"><i>✓</i> No email to start</span>
			<span class="fchip"><i>✓</i> 90-day guarantee</span>
		</div>
	</div>
</section>

</main>
</div>

<!-- ── STICKY MOBILE CTA ────────────────────────────── -->
<div class="sticky-cta" id="stickyCta">
	<a class="btn btn--primary" href="/quiz/ibs" onclick={handleQuizLink}>Take the 60-second quiz →</a>
</div>

<style>
/* ── Reset padding from layout ─────────────────────── */
:global(main:has(.prelander-page)) { padding: 0; }

/* tokens come from app.css :root — no need to redefine here */

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
.section { padding: clamp(80px,10vw,130px) 0; }
.section--tight { padding: clamp(60px,7vw,100px) 0; }
.dark { background: var(--ink); color: var(--paper); }
.alt  { background: var(--paper-2); border-top: 2px solid var(--ink); }
/* Alt sections right after a dark section don't need a border — dark background creates the break */
.section.dark + .section.alt { border-top: 0; }
.center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }
.measure { max-width: 620px; }
.measure-sm { max-width: 460px; }

/* ── Eyebrow ─────────────────────────────────────── */
.eyebrow {
	font-weight: 800; font-size: 11px; letter-spacing:.22em; text-transform:uppercase;
	color: var(--accent-deep); margin:0 0 20px;
	display: inline-flex; align-items: center; gap: 10px;
}
.dark .eyebrow { color: var(--accent); }
.eyebrow::before { content:""; width:26px; height:2px; background:currentColor; display:inline-block; }

/* ── Type ────────────────────────────────────────── */
h1,h2,h3 { margin:0; font-weight:800; line-height:1.0; letter-spacing:-0.03em; }
.h1 { font-size: clamp(44px,7.5vw,92px); line-height:0.95; letter-spacing:-0.035em; }
.h2 { font-size: clamp(38px,5.5vw,68px); line-height:0.97; letter-spacing:-0.04em; }
.h3 { font-size: clamp(24px,2.8vw,36px); line-height:1.04; letter-spacing:-0.025em; }
.ital { font-style:italic; font-weight:800; }
.u-accent { color: var(--accent-deep); }
.dark .u-accent { color: var(--accent); }
.lead { font-size: clamp(18px,1.6vw,22px); color:var(--ink-soft); line-height:1.55; }
.dark .lead { color: rgba(251,246,234,.78); }
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
.btn--lg { font-size:19px; padding:21px 40px; }
.btn--block { display:flex; width:100%; }
.btn .arrow { font-size:1.15em; line-height:0; transform:translateY(1px); }
.cta-note { margin-top:14px; font-size:14px; color:var(--ink-soft); display:flex; gap:8px; align-items:center; flex-wrap:wrap; }

/* ── Offer strip ─────────────────────────────────── */
.offer {
	background:var(--ink); color:var(--paper); text-align:center;
	font-size:14px; font-weight:600; padding:9px 16px; letter-spacing:-0.01em;
}
.offer :global(b) { color:var(--orange); font-weight:800; }

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
.header__login { font-weight:700; font-size:15px; text-decoration:none; color:var(--ink); }
@media (max-width:640px) { .tag, .header__login { display:none; } }

/* ── Hero ────────────────────────────────────────── */
.hero { position:relative; overflow:hidden; }
.hero .wrap { position:relative; z-index:2; }
.hero-grid { display:grid; grid-template-columns:1fr; gap:38px; align-items:start; padding:clamp(46px,6vw,76px) 0 clamp(54px,7vw,86px); }
@media (min-width:940px) { .hero-grid { grid-template-columns:1.05fr .95fr; gap:56px; align-items:center; } }
.hero h1 { margin-bottom:24px; font-size:clamp(42px,5.5vw,72px); line-height:0.97; letter-spacing:-0.04em; }
@media (min-width:1180px) { .hero h1 { font-size:78px; } }
.hero .lead { max-width:34ch; }
.hero-badges { display:flex; flex-wrap:wrap; gap:10px; margin:26px 0 0; }
.hbadge {
	display:inline-flex; align-items:center; gap:7px; font-size:13.5px; font-weight:700;
	background:rgba(251,246,234,.08); border:1px solid rgba(251,246,234,.16); color:rgba(251,246,234,.92);
	padding:8px 13px; border-radius:999px;
}
.hbadge .ic { color:var(--accent); font-weight:900; }

/* ── Quiz card ───────────────────────────────────── */
.quizcard {
	background:var(--paper); color:var(--ink); border-radius:var(--radius-lg);
	padding:clamp(22px,3vw,32px); box-shadow:var(--shadow-lg); border:1px solid var(--line-2);
}
.quizcard .q-eyebrow { font-size:12.5px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--accent-deep); margin:0 0 6px; }
.quizcard .q-title { font-size:clamp(20px,2.4vw,25px); font-weight:800; letter-spacing:-0.02em; line-height:1.1; margin:0 0 18px; }
.q-options { display:grid; gap:11px; }
.q-opt {
	display:flex; align-items:center; justify-content:space-between; gap:12px;
	width:100%; text-align:left; cursor:pointer;
	background:#fff; border:2px solid var(--line); border-radius:14px;
	padding:15px 18px; font-family:var(--ff); font-size:16.5px; font-weight:700; color:var(--ink);
	transition:border-color .15s, background .15s, transform .1s;
}
.q-opt:hover { border-color:var(--accent); background:var(--accent-tint); }
.q-opt:active { transform:scale(.99); }
.q-opt .chev { color:var(--accent-deep); font-weight:900; opacity:0; transform:translateX(-6px); transition:.15s; }
.q-opt:hover .chev { opacity:1; transform:translateX(0); }
.q-foot { margin-top:16px; display:flex; align-items:center; justify-content:center; gap:8px; font-size:13px; color:var(--ink-soft); font-weight:600; flex-wrap:wrap; }
.q-foot .dot { width:4px; height:4px; border-radius:50%; background:currentColor; opacity:.45; }
.q-progress { height:5px; border-radius:99px; background:var(--line); margin-bottom:20px; overflow:hidden; }
.q-progress > i { display:block; height:100%; background:var(--accent); border-radius:99px; transition:width .4s cubic-bezier(.2,.8,.2,1); }

/* ── Wave decoration ─────────────────────────────── */
.wave-strip { height:10px; background:repeating-linear-gradient(90deg,var(--orange) 0 28px,var(--blue) 28px 56px,var(--wine) 56px 84px); opacity:.9; }

/* ── Promise ─────────────────────────────────────── */
.promise-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
@media (min-width:900px) { .promise-grid { grid-template-columns:1.05fr .95fr; gap:80px; } }
.xlist { list-style:none; margin:26px 0 30px; padding:0; display:grid; gap:14px; }
.xlist li { display:flex; align-items:flex-start; gap:13px; font-size:18px; font-weight:600; }
.xlist .mk { flex:none; width:26px; height:26px; border-radius:50%; display:grid; place-items:center; font-weight:900; font-size:14px; margin-top:1px; }
.xlist .x  { background:#fbe3e3; color:var(--wine); }
.xlist .v  { background:var(--accent-tint); color:var(--accent-deep); }
.xlist .x + span { color:var(--ink-soft); }

/* ── Product frame ───────────────────────────────── */
.product-frame { position:relative; border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); background:#ddd; }
.product-frame .stamp {
	position:absolute; left:18px; bottom:18px; z-index:2;
	background:var(--paper); color:var(--ink); border-radius:14px; padding:12px 16px;
	font-weight:800; box-shadow:var(--shadow-md); max-width:70%; font-size:14px; line-height:1.25;
}
.product-frame .stamp small { display:block; font-weight:700; color:var(--ink-soft); font-size:11.5px; letter-spacing:.04em; text-transform:uppercase; margin-bottom:3px; }

/* ── Image placeholder ───────────────────────────── */
.ph { background: repeating-linear-gradient(135deg,#d7cdb8 0 9px,#cfc4ad 9px 18px); position:relative; }
.ph-img { width:100%; height:100%; position:absolute; inset:0; }
.ph[data-label]::after {
	content:attr(data-label); position:absolute; inset:0; display:grid; place-items:center; text-align:center;
	font-family:ui-monospace,"SF Mono",Menlo,monospace; font-size:10px; font-weight:600;
	letter-spacing:.04em; color:#6c6149; padding:6px;
}

/* ── Research bar ────────────────────────────────── */
.research { border-top:2px solid var(--ink); border-bottom:2px solid var(--ink); }
.research .wrap { padding-top:44px; padding-bottom:44px; }
.research .lbl { text-align:center; font-size:11px; font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:var(--ink-soft); margin-bottom:28px; }
.logos { display:flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:clamp(22px,4vw,56px); }
.logos .uni { font-weight:800; letter-spacing:.02em; font-size:clamp(15px,1.6vw,20px); color:var(--ink); opacity:.62; white-space:nowrap; }
.logos .uni small { display:block; font-size:9.5px; letter-spacing:.18em; opacity:.7; font-weight:700; }
.logos .uni:hover { opacity:1; }

/* ── Testimonials ────────────────────────────────── */
.bigquote { text-align:center; }
.bigquote .qmark { font-size:88px; line-height:0; color:var(--accent); font-weight:900; height:38px; display:block; }
.bigquote h2 { font-size:clamp(28px,4vw,48px); font-weight:800; letter-spacing:-0.03em; line-height:1.08; margin:24px auto 26px; max-width:18ch; }
.stars { color:var(--orange); letter-spacing:3px; font-size:22px; }
.rating-line { margin-top:12px; font-weight:700; font-size:15px; color:var(--ink-soft); }
.t-grid { display:grid; grid-template-columns:1fr; gap:20px; margin-top:12px; }
@media (min-width:760px) { .t-grid { grid-template-columns:repeat(3,1fr); } }
.t-card { background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius); padding:26px 24px; box-shadow:var(--shadow-sm); display:flex; flex-direction:column; }
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
.loop { position:relative; width:min(420px,100%); aspect-ratio:1.15/1; }
.node { position:absolute; width:130px; height:130px; border-radius:50%; display:grid; place-items:center; text-align:center; font-weight:800; font-size:15px; box-shadow:var(--shadow-md); }
.node small { display:block; font-size:11px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; opacity:.7; }
.node--brain { top:0; left:50%; transform:translateX(-50%); background:var(--ink); color:var(--paper); }
.node--gut   { bottom:0; left:50%; transform:translateX(-50%); background:var(--accent); color:#fff; }
.loop .arc { position:absolute; inset:18px 70px; border:3px dashed var(--line); border-radius:50%; }
.loop .arc.b { border-color:var(--accent); border-style:solid; clip-path:inset(0 0 50% 0); opacity:.55; }
.loop .pill-tag { position:absolute; top:50%; transform:translateY(-50%); background:var(--orange-tint); color:var(--orange-deep); font-weight:800; font-size:12px; padding:6px 12px; border-radius:999px; white-space:nowrap; }
.loop .pill-tag.l { left:-8px; }
.loop .pill-tag.r { right:-8px; background:var(--accent-tint); color:var(--accent-deep); }

/* ── Mechanisms ──────────────────────────────────── */
.mech-grid { display:grid; grid-template-columns:1fr; gap:20px; margin-top:12px; }
@media (min-width:800px) { .mech-grid { grid-template-columns:repeat(3,1fr); } }
.mech { background:rgba(251,246,234,.05); border:1px solid rgba(251,246,234,.18); border-radius:var(--radius); padding:36px 28px; }
.dark .mech { color:var(--paper); }
.mech .num { font-size:11px; font-weight:800; letter-spacing:.22em; color:var(--accent); margin-bottom:18px; }
.mech h3 { font-size:24px; margin-bottom:12px; }
.mech p { font-size:15.5px; line-height:1.55; color:rgba(251,246,234,.74); margin:0; }
.statbar { display:grid; gap:12px; margin-top:6px; }
.statbar .row { display:grid; grid-template-columns:150px 1fr 56px; align-items:center; gap:14px; font-weight:700; font-size:14px; }
.statbar .track { height:30px; border-radius:8px; background:rgba(20,19,15,.07); overflow:hidden; }
.statbar .fill { height:100%; border-radius:8px; width:0; transition:width 1.1s cubic-bezier(.2,.8,.2,1); }
.statbar .fill.a { background:var(--accent); }
.statbar .fill.b { background:#c9c2b0; }
.statbar .pct { text-align:right; font-weight:800; }
.science-card { background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius-lg); padding:clamp(24px,3vw,36px); box-shadow:var(--shadow-md); }
.cite { font-size:11.5px; color:var(--ink-soft); line-height:1.45; margin-top:22px; max-width:80ch; }
.cred { display:flex; align-items:center; gap:14px; margin-top:24px; }
.cred .nm { font-weight:800; font-size:15px; }
.cred .ro { font-size:13px; color:var(--ink-soft); max-width:38ch; }

/* ── Steps ───────────────────────────────────────── */
.steps { display:grid; gap:16px; max-width:760px; margin:12px auto 0; }
.step { display:grid; grid-template-columns:72px 1fr; gap:24px; align-items:center; background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius); padding:26px 30px; box-shadow:var(--shadow-sm); }
.step .n { width:56px; height:56px; border-radius:50%; background:var(--ink); color:var(--paper); display:grid; place-items:center; font-weight:800; font-size:24px; }
.step:nth-child(2) .n { background:var(--accent); }
.step:nth-child(3) .n { background:var(--orange); }
.step:nth-child(4) .n { background:var(--wine); }
.step h3 { font-size:21px; margin-bottom:6px; }
.step p { margin:0; font-size:15.5px; color:var(--ink-soft); }

/* ── Feature columns ─────────────────────────────── */
.cols { display:grid; grid-template-columns:repeat(2,1fr); gap:30px 24px; margin-top:8px; }
@media (min-width:860px) { .cols { grid-template-columns:repeat(4,1fr); } }
.col-feat { text-align:center; }
.col-feat .ic { width:56px; height:56px; margin:0 auto 16px; border-radius:16px; display:grid; place-items:center; background:var(--accent-tint); color:var(--accent-deep); font-size:26px; font-weight:900; }
.col-feat:nth-child(2) .ic { background:var(--orange-tint); color:var(--orange-deep); }
.col-feat:nth-child(3) .ic { background:#f6e3e3; color:var(--wine); }
.col-feat:nth-child(4) .ic { background:#e3f1e9; color:var(--green-ok); }
.col-feat h3 { font-size:18px; margin-bottom:6px; }
.col-feat p { font-size:14.5px; color:var(--ink-soft); margin:0; }

/* ── Comparison ──────────────────────────────────── */
.compare { max-width:760px; margin:0 auto; background:var(--card); border-radius:var(--radius-lg); border:1px solid var(--line-2); box-shadow:var(--shadow-md); overflow:hidden; }
.compare .crow { display:grid; grid-template-columns:1fr 110px 130px; align-items:center; gap:8px; padding:17px clamp(18px,3vw,28px); border-top:1px solid var(--line-2); }
.compare .crow:first-child { border-top:0; }
.compare .chead { background:var(--paper-2); font-weight:800; }
.compare .chead .c1,.compare .chead .c2 { text-align:center; font-size:13.5px; letter-spacing:.02em; }
.compare .chead .c2 { color:var(--accent-deep); }
.compare .feat { font-weight:700; font-size:15.5px; }
.compare .c1,.compare .c2 { text-align:center; font-weight:900; font-size:18px; }
.compare .c1 { color:#c9b9a6; }
.compare .c2 { color:var(--accent-deep); }
.compare .cophead { font-family:var(--ff); font-weight:900; font-size:15px; letter-spacing:-0.02em; color:var(--ink); }
@media (max-width:560px) { .compare .crow { grid-template-columns:1fr 60px 70px; } .compare .chead .c1,.compare .chead .c2 { font-size:11px; } }

/* ── Qualify ─────────────────────────────────────── */
.qualify-grid { display:grid; grid-template-columns:1fr; gap:48px; align-items:center; }
@media (min-width:900px) { .qualify-grid { grid-template-columns:1.1fr .9fr; gap:72px; } }
.qlist { list-style:none; margin:28px 0 34px; padding:0; display:grid; gap:20px; }
.qlist li { display:flex; gap:16px; align-items:flex-start; font-size:18px; font-weight:600; line-height:1.45; }
.qlist .ck { flex:none; width:30px; height:30px; border-radius:50%; background:var(--accent); color:#fff; display:grid; place-items:center; font-weight:900; font-size:14px; margin-top:2px; }

/* ── Kit grid ────────────────────────────────────── */
.kit-grid { display:grid; grid-template-columns:1fr; gap:44px; align-items:center; }
@media (min-width:900px) { .kit-grid { grid-template-columns:.92fr 1.08fr; gap:60px; } }
.feat-list { display:grid; grid-template-columns:1fr; gap:22px; }
@media (min-width:560px) { .feat-list { grid-template-columns:1fr 1fr; } }
.feat .ic { width:42px; height:42px; border-radius:12px; background:var(--accent-tint); color:var(--accent-deep); display:grid; place-items:center; font-weight:900; font-size:20px; margin-bottom:12px; }
.feat h3 { font-size:17px; margin-bottom:5px; }
.feat p { margin:0; font-size:14px; color:var(--ink-soft); line-height:1.45; }

/* ── Guarantee ───────────────────────────────────── */
.guarantee { text-align:center; max-width:880px; margin:0 auto; }
.guarantee h2 { max-width:18ch; margin-left:auto; margin-right:auto; }
.seal {
	position:relative; width:132px; height:132px; margin:0 auto 30px; border-radius:50%;
	display:grid; place-items:center; background:var(--accent-tint); color:var(--accent-deep);
	border:2px dashed var(--accent);
}
.seal .seal-num { font-size:46px; font-weight:900; line-height:.8; letter-spacing:-0.03em; }
.seal .seal-unit { font-size:14px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; margin-top:3px; }
.promise-quote {
	margin:36px auto; max-width:660px; padding:0; border:0;
	font-size:clamp(20px,2.4vw,26px); font-weight:700; font-style:italic;
	line-height:1.34; letter-spacing:-0.015em; color:var(--ink);
}
.promise-quote cite { display:block; margin-top:18px; font-style:normal; font-weight:800; font-size:15px; color:var(--ink-soft); }
.refund-steps { display:grid; grid-template-columns:1fr; gap:14px; max-width:760px; margin:0 auto 38px; text-align:left; }
@media (min-width:720px) { .refund-steps { grid-template-columns:repeat(3,1fr); gap:18px; } }
.rstep { display:flex; gap:14px; align-items:flex-start; background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius); padding:20px; box-shadow:var(--shadow-sm); }
.rstep .rn { flex:none; width:34px; height:34px; border-radius:50%; background:var(--accent); color:#fff; display:grid; place-items:center; font-weight:900; font-size:16px; }
.rstep h3 { font-size:16.5px; margin-bottom:3px; }
.rstep p { margin:0; font-size:14px; color:var(--ink-soft); line-height:1.4; }

/* ── FAQ ─────────────────────────────────────────── */
.faq { max-width:820px; margin:0 auto; }
.faq-cat { font-size:11px; font-weight:800; letter-spacing:.22em; text-transform:uppercase; color:var(--accent-deep); margin:44px 0 2px; padding-bottom:4px; }
.faq-item { border-top:1px solid var(--line); }
.faq-item:last-child { border-bottom:1px solid var(--line); }
.faq-q {
	width:100%; background:none; border:0; cursor:pointer; font-family:var(--ff);
	display:flex; align-items:center; justify-content:space-between; gap:18px; text-align:left;
	padding:26px 4px; font-size:clamp(17px,2vw,22px); font-weight:800; color:var(--ink); letter-spacing:-0.02em;
}
.faq-q .pm { flex:none; width:32px; height:32px; border-radius:50%; border:2px solid var(--ink); display:grid; place-items:center; font-size:18px; transition:transform .25s; }
.faq-item.open .faq-q .pm { transform:rotate(45deg); background:var(--accent); border-color:var(--accent); color:#fff; }
.faq-a { overflow:hidden; max-height:0; transition:max-height .35s ease; }
.faq-a > div { padding:0 4px 24px; font-size:16px; color:var(--ink-soft); line-height:1.6; max-width:70ch; }

/* ── Final CTA ───────────────────────────────────── */
.final { position:relative; background:var(--ink); color:var(--paper); text-align:center; overflow:hidden; margin-top:10px; }
.final .wrap { padding:clamp(64px,9vw,118px) 24px clamp(54px,7vw,82px); position:relative; z-index:2; max-width:820px; }
.final-wave { position:absolute; top:0; left:0; right:0; height:9px; z-index:3; display:flex; }
.final-wave i { flex:1 1 auto; display:block; }
.final-wave :global(i:nth-child(3n+1)) { background:var(--orange); }
.final-wave :global(i:nth-child(3n+2)) { background:var(--blue); }
.final-wave :global(i:nth-child(3n))   { background:var(--wine); }
.final-badge {
	width:84px; height:84px; margin:0 auto 28px;
	border-radius:50%; overflow:hidden;
	background:var(--paper);
	border:3px solid var(--paper);
	box-shadow:0 12px 30px rgba(0,0,0,.45);
}
.final-badge img { width:100%; height:100%; object-fit:cover; display:block; }
.final-eyebrow { font-weight:800; font-size:13px; letter-spacing:.2em; text-transform:uppercase; color:var(--accent); margin:0 0 16px; }
.final-h { font-size:clamp(44px,6.5vw,82px); font-weight:800; line-height:0.97; letter-spacing:-0.04em; color:var(--paper); margin:0 auto 24px; max-width:14ch; }
.final-sub { font-size:clamp(17px,1.7vw,21px); line-height:1.5; color:rgba(251,246,234,.74); max-width:40ch; margin:0 auto 38px; }
.final-cta { white-space:nowrap; box-shadow:0 7px 0 var(--accent-deep); }
.final-chips { display:flex; flex-wrap:wrap; justify-content:center; gap:10px; margin-top:26px; }
.fchip { display:inline-flex; align-items:center; gap:8px; font-size:14px; font-weight:700; color:rgba(251,246,234,.9); background:rgba(251,246,234,.06); border:1px solid rgba(251,246,234,.16); padding:9px 16px; border-radius:999px; }
.fchip i { font-style:normal; color:var(--accent); font-weight:900; }

/* ── Reveal animation ────────────────────────────── */
/* .in is added by JS at runtime — :global prevents Svelte tree-shaking it away */
@media (prefers-reduced-motion:no-preference) {
	.reveal { opacity:0; transform:translateY(22px); transition:opacity .7s ease, transform .7s cubic-bezier(.2,.8,.2,1); }
	:global(.reveal.in) { opacity:1; transform:none; }
}

/* ── Sticky mobile CTA ───────────────────────────── */
:global(.sticky-cta) {
	position:fixed; left:0; right:0; bottom:0; z-index:70; padding:12px 16px calc(12px + env(safe-area-inset-bottom));
	background:rgba(251,246,234,.92); backdrop-filter:blur(10px); border-top:1px solid rgba(20,19,15,.12);
	transform:translateY(140%); transition:transform .3s ease;
}
:global(.sticky-cta.show) { transform:none; }
:global(.sticky-cta .btn) {
	width:100%;
	/* Hardcoded — this element is outside .prelander-page so CSS vars don't reach it */
	background:#2F95F2 !important;
	color:#fff !important;
	box-shadow:0 6px 0 #1A6FC4 !important;
}
@media (min-width:860px) { :global(.sticky-cta) { display:none; } }
</style>
