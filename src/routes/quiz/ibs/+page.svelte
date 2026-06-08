<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	// ── Screen definitions (47 screens, verbatim from spec) ───────────────
	const SCALE = ['Not at all', 'A little', 'Somewhat Agree', 'Strongly Agree'];

	const SCREENS: any[] = [
		/* 1 */ { type:'single', tag:'Your symptoms', kick:"Let's start with you", title:'How long have you been struggling with IBS?', options:['Less than 1 month','1–3 months','3–6 months','6–12 months','1+ year'] },
		/* 2 */ { type:'multi', tag:'Your symptoms', kick:'Physical symptoms', title:'What physical symptoms do you normally experience?', hint:'Select all that apply.', options:['Diarrhea','Constipation','Sudden urgency to go','Straining on the toilet','Abdominal pain','Bloating','Gas / wind','Nausea'] },
		/* 3 */ { type:'multi', tag:'Your symptoms', kick:'Your triggers', title:'What are your IBS triggers?', hint:'Check all that apply.', options:['Certain foods','Caffeine','Poor sleep','Anxiety / stress','Medication','Exercise','Other',"I'm not sure"] },
		/* 4 */ { type:'single', tag:'About you', kick:'A little context', title:"What's your gender?", options:['Male','Female','Non-binary','Other','Prefer not to say'] },
		/* 5 */ { type:'single', tag:'About you', kick:'Age', title:"What's your age group?", options:['18–24','25–34','35–44','45–54','55+'] },
		/* 6 */ { type:'slider', tag:'Your symptoms', kick:'Pain severity', title:'Rate your abdominal pain severity from 0-100 (Select 0 if none)', hint:'Select 0 if none.', left:'None', right:'Severe', readout:['No pain','Mild','Moderate','Strong','Severe'] },
		/* 7 */ { type:'slider', tag:'Your symptoms', kick:'Pain frequency', days:true, title:'For every 10 days, how many days do you experience abdominal pain?', left:'0 days', right:'10 days' },
		/* 8 */ { type:'slider', tag:'Your symptoms', kick:'Bowel movements', title:'How dissatisfied with your bowel movements are you from 0-100?', left:'Satisfied', right:'Totally dissatisfied', readout:['Satisfied','Mostly satisfied','Mixed','Dissatisfied','Totally dissatisfied'] },
		/* 9 */ { type:'slider', tag:'Your symptoms', kick:'Bloating', title:'Do you suffer from bloating?', left:'None', right:'Severe', readout:['None','Mild','Moderate','Strong','Severe'] },
		/* 10 */ { type:'slider', tag:'Your symptoms', kick:'Life impact', title:'How much does your IBS affect your life?', left:'None', right:'Completely interferes', readout:['No impact','A little','Moderate','A lot','Completely interferes'] },
		/* 11 */ { type:'info', tag:'A clear picture', tone:'paper', kick:'A clear picture', title:"We can already see a clear pattern in what you've told us.", sub:"The symptoms you're describing are real and may respond to the right approach, depending on your psychographic profile. That's exactly what the rest of this assessment will figure out for you. Let's keep going.", cta:'Continue' },
		/* 12 */ { type:'info', tag:'A closer look', tone:'paper', glyph:'◉', kick:'A closer look', title:'For this next group of statements, tell us how much you agree with each one.', cta:'Continue' },
		/* 13 */ { type:'scale', tag:'Sounds like me?', kick:'Group 1 of 3', title:'How much does each statement sound like you?', hint:'Tap a response for every line.', scaleLabels:SCALE, statements:['I often think about where the nearest bathroom is.','Before an important event, I eat less, or nothing, just in case.','When I eat or drink something, it sometimes feels like a gamble.'] },
		/* 14 */ { type:'scale', tag:'Sounds like me?', kick:'Group 2 of 3', title:'And these?', hint:'Tap a response for every line.', scaleLabels:SCALE, statements:["I've turned down plans, dates, or travel because of my gut.",'My stomach gets worse at inconvenient or stressful times.',"I've slowly cut out foods I used to love, and the list keeps growing."] },
		/* 15 */ { type:'scale', tag:'Sounds like me?', kick:'Group 3 of 3', title:'Last few.', hint:'Tap a response for every line.', scaleLabels:SCALE, statements:["I feel embarrassed talking about my symptoms, even with people close to me.",'When a flare hits, my mood often drops.',"Sometimes it feels like my own body betrays me at the worst possible moments."] },
		/* 16 */ { type:'info', tag:"You're not alone", tone:'paper', face:true, kick:"You're not alone", title:'The American College of Gastroenterology estimates as many as 1 in 7 American adults live with IBS.', sub:"And most never get a clear answer; only about 5–7% are ever formally diagnosed.", quote:{ text:"I started searching unexplainable stomach pain on reddit and then found out about IBS. But then all the other treatments I started doing besides Copables all seemed vibe-based, you miss out on actually having a rigorous process to get better.", by:'Lucas P.', role:'Verified member', av:['LP','#2F95F2'] }, foot:'Prevalence figure attributed to the American College of Gastroenterology.' },
		/* 17 */ { type:'info', tag:'Your history', tone:'paper', glyph:'✦', kick:'Your history', title:"Now a bit about your history, so we can tell whether this protocol is actually right for you.", foot:'About 90 seconds left.', cta:'Continue' },
		/* 18 */ { type:'single', tag:'Your history', kick:'Stress', title:'How would you rate your stress over the last year?', options:['High and constant','Comes in waves','Manageable','Low'] },
		/* 19 */ { type:'single', tag:'Your history', kick:'Sleep', title:"How's your sleep?", options:['Poor, I wake up tired','Inconsistent','Pretty good','Great'] },
		/* 20 */ { type:'single', tag:'Your history', kick:'Medication', title:'Do you currently take any medication for your gut?', options:['Yes, prescription','Yes, over-the-counter','No'] },
		/* 21 */ { type:'single', tag:'Your history', kick:'Where you are', title:'Where would say you are right now in your IBS journey?', options:['In the middle of trying treatments and want something that actually works','Finished other treatments and need ongoing relief','Never got a real answer and I\'m open to a new approach','Just starting to take IBS seriously'] },
		/* 22 */ { type:'multi', tag:'Your history', kick:'Life impact', title:'How does IBS negatively impact your life?', hint:'Select all that apply.', options:['Physical pain or discomfort',"Can't eat foods I love",'Affects my confidence','Bad toilet experiences','Affects personal relationships','Worrying about travel','Struggle with work','More / other'] },
		/* 23 */ { type:'multi', tag:'Your history', kick:"What you've tried", title:"Finding the right solution can be hard; a lot of people end up feeling like they've tried everything. What have you tried?", hint:'Select all that apply.', options:['Avoiding certain foods / FODMAP','Medication','Peppermint','Probiotics','Therapy','Acupuncture / alternative medicine','Supplements','More / other'] },
		/* 24 */ { type:'single', tag:'Your history', kick:'The result', title:'Did these solutions work?', options:['Yes','Somewhat','A little','No','Not sure'] },
		/* 25 */ { type:'single', tag:'Your history', kick:'The cost', title:'Roughly how much money have you already spent over your lifetime trying to fix this?', hint:'Count tests, appointments, doctors, diets, supplements, over-the-counter meds, all of it.', options:['$0 -$50','$50 - $100','$100 - $250','$250+'] },
		/* 26 */ { type:'multi', tag:'Your history', kick:'The goal', title:'What would you like to do if you were free from IBS restrictions?', hint:'Check all that apply.', options:['Eat the foods I love','Enjoy social life and relationships','Sleep better','Travel with confidence','Be more present at work','More / other'] },
		/* 27 */ { type:'single', tag:'Your history', kick:'The doctor', title:'If you\'ve seen a doctor, what did they tell you?', options:['"Your tests are normal," but I\'m still in pain','"It\'s probably just stress"','"Learn to manage it / change your diet"','I got a diagnosis but the treatment didn\'t fix it',"I never went; it comes and goes, so I rode it out"] },
		/* 28 */ { type:'multi', tag:'Safety check', kick:'A quick check', title:'Have you noticed any of the following? (Select any that apply.)', hint:'If you select any of these, your results will show the "please see a doctor first" path instead of the Copables protocol.', options:['Blood in your stool','Unexplained weight loss','Symptoms that regularly wake you from sleep','Symptoms that first started after age 50','A family history of bowel disease or bowel cancer','None of these'] },
		/* 29 */ { type:'info', tag:'Real results', tone:'paper', glyph:'★', kick:'Real results from real people', title:"Benefits beyond IBS from a recent user:", quote:{ text:"I did the 2-week Copables protocol for IBS, and beyond a noticeable improvement in symptoms, I got an unexpected benefit worth far more than I imagined. For the first time in my life, I had the confidence and discipline to make progress on long-time goals I'd repeatedly failed at. My best guess is part of the protocol sank into my subconscious.", by:'Shawn T.', role:'Verified member · Feb 2026', av:['ST','#2F95F2'] }, cta:'Continue' },
		/* 30 */ { type:'single', tag:'A quick check', kick:'Stress & symptoms', title:'Do your symptoms get worse during periods of high stress or anxiety?', options:['Yes','Somewhat','No'] },
		/* 31 */ { type:'single', tag:'A quick check', kick:'Your experience', title:'Have you ever tried Cognitive Behavioural Therapy-style techniques for IBS? (Reframing, journalling, etc.)', options:['Yes, I practice regularly','I have some experience',"No, but I'm open to it","No, and I'm not interested"] },
		/* 32 */ { type:'info', tag:'Our approach', tone:'dark', wide:true, kick:"Here's what's really going on", title:"Your gut may be miscommunicating with your brain.", loop:true, prose:["IBS is now known as a dysfunction of the gut-brain axis Your gut and brain are connected by a constant two-way signal. Under prolonged stress, or after a big life change, that signal can get stuck in threat or alarm mode, so your brain amplifies or misinterprets sensations in your gut. IBS can be caused by a constant miscommunication between these two major organs in your body.","A Harvard researcher, Dr. Ted Kaptchuk, pioneered groundbreaking researach in 2010 that showed that the gut-brain connection can respond to a structured mind-body protocol centred around placebos, even when patients knew exactly what they were taking. "], cta:'So what do I do about it?' },
		/* 33 */ { type:'info', tag:'Our approach', tone:'paper', wide:true, kick:'We got you', title:'This Harvard research on non-deceptive placebos forms the foundation of a Copables protocol.', product:'/assets/ibs-bottle.webp', sub:"Copables is a 2-week research and science-backed protocol that focuses on repairing the gut-brain axis. It works together with your nervous system instead of fighting your body and what's going on in your gut.", comp:[{ ic:'◷', h:'A daily capsule ritual', p:'Your physical anchor — the cue your nervous system learns to trust.' },{ ic:'✦', h:'Guided CBT-style cards', p:'Short techniques that calm the stress-gut loop at its source.' },{ ic:'▦', h:'A simple app', p:'Tracks your symptoms and adapts the protocol to you.' }], honest:{ q:"Here's the part no one else will tell you upfront:", p:'There is no medical ingredient contained anywhere in this protocol and yet, the research still shows that non-deceptive placebos can help. That\'s because the "how" behind this protocol is more important than what it is you are actually taking.' }, cta:"Let's finish and build your personal protocol" },
		/* 34 */ { type:'info', tag:'Almost there', tone:'paper', kick:'Almost there', title:"You're nearly done.", sub:"These last questions check how well this specific Copables OLP protocol approach fits you. OLP isn't the right fit for everyone, and we'd rather be honest with you than suggest something that won't work.", cta:'Continue' },
		/* 35 */ { type:'slider', tag:'Fit check', kick:'When a flare begins', title:'When a flare-up begins, which reaction feels closer to yours?', left:'I can manage it', right:'My day is destroyed', readout:["I can manage it","Mostly manageable","It depends","Hard to cope","My day is destroyed"] },
		/* 36 */ { type:'slider', tag:'Fit check', kick:'Small sensations', title:'How often does a small sensation make you brace for a severe flare?', left:'Never', right:'Always', readout:['Never','Rarely','Sometimes','Often','Always'] },
		/* 37 */ { type:'slider', tag:'Fit check', kick:'New experiences', title:'How open are you to trying unconventional experiences in life?', left:'Not open', right:'Very open', readout:['Not open','Slightly open','Balanced','Pretty open','Very open'] },
		/* 38 */ { type:'slider', tag:'Fit check', kick:'Curiosity', title:'How curious are you about the "why" behind your gut symptoms?', left:'Not curious', right:'Very curious', readout:['Not curious','A little','Somewhat','Curious','Very curious'] },
		/* 39 */ { type:'info', tag:'Fit check', tone:'paper', glyph:'◍', wide:true, kick:'Good signs', title:"Curiosity about one's own physiology and an open mind are two of the traits that line up with a strong response to this kind of approach.", cta:'Continue' },
		/* 40 */ { type:'single', tag:'Fit check', kick:'Mind & body', title:'How strongly do you believe in the mind-body connection?', options:['Completely','Strongly','Moderately','Slightly','Not at all'] },
		/* 41 */ { type:'single', tag:'Fit check', kick:'The idea', title:'Does "training your nervous system like a muscle" make sense to you?', options:['Complete sense','A lot','Some','A little','None'] },
		/* 42 */ { type:'slider', tag:'Fit check', kick:'Your role', title:'When it comes to your own health, do you see yourself as an active participant?', left:'Passive', right:'Very active', readout:['Passive','Mostly passive','In between','Active','Very active'] },
		/* 43 */ { type:'info', tag:'Fit check', tone:'paper', glyph:'∿', wide:true, kick:'The one thing that matters most', title:"The people who get the most out of this protocol want to take ownership over their health and treat this protocol as a tool they're using - not something being done to them.", cta:'Continue' },
		/* 44 */ { type:'info', tag:'Last step', tone:'paper', glyph:'✓', kick:'Last step', title:'Just a little more before we get to your results.', cta:'Continue' },
		/* 45 */ { type:'single', tag:'Last step', kick:'Evidence', title:'If a protocol had real published research behind it, how much would that matter?', options:['A lot, I trust facts and studies over wellness hype','Somewhat','A little','Not much'] },
		/* 46 */ { type:'single', tag:'Last step', kick:'The commitment', title:'Is 15 minutes a day for 2 weeks an investment in yourself you\'re willing to make to improve this?', options:['Yes, absolutely','Yes, I think so',"I'm not sure",'Probably not'] },
		/* 47 */ { type:'loader', tone:'dark', lines:['Analyzing your symptom pattern...','Scoring your IBS severity...','Mapping your gut-brain profile...','Checking your responder traits...','Calculating your protocol fit...','Building your personalized results...'] },
		/* 48 */ { type:'email', tag:'Your results', tone:'paper', kick:'Your plan is ready', title:'Where should we send your personalized results?', sub:"You've spent the last few minutes building this. Pop in your email and we'll unlock your full results.", cta:'Show my results' }
	];

	// Assign progress percentages
	const isQ = (s: any) => ['single','multi','scale','slider'].includes(s.type);
	const qTotal = SCREENS.filter(isQ).length;
	let done = 0;
	SCREENS.forEach(s => { if (isQ(s)) done++; s._progress = Math.round(done / qTotal * 100); });

	// ── Persistence key ────────────────────────────────────────────────────
	const STORAGE_KEY = 'copables_quiz_v1';

	// ── Reactive state ─────────────────────────────────────────────────────
	let idx      = $state(0);
	let answers  = $state<Record<number, any>>({});
	let uid      = $state('');

	// Per-screen local state (synced when idx changes)
	let multiSel   = $state<string[]>([]);
	let sliderVal  = $state(50);
	let scaleAns   = $state<Record<number,number>>({});
	let emailVal   = $state('');
	let consentVal = $state(false);

	// Loader
	const LOADER_MS = 20000; // fake "building your result" loader — ~20s total
	let loaderPct        = $state(0);
	let loaderStates     = $state<('pending'|'active'|'done')[]>([]);
	let submitLoading    = $state(false);

	// ── Derived ────────────────────────────────────────────────────────────
	let screen     = $derived(SCREENS[idx]);
	let isDark     = $derived(screen.tone === 'dark');
	let canGoBack  = $derived(idx > 0 && screen.type !== 'loader');
	let progress   = $derived(screen._progress ?? 0);
	let sliderMax  = $derived(screen.days ? 10 : 100);

	let footEnabled = $derived(
		screen.type === 'multi'  ? multiSel.length > 0 :
		screen.type === 'scale'  ? (screen.statements || []).every((_: any, k: number) => scaleAns[k] !== undefined) :
		screen.type === 'email'  ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim()) && consentVal :
		true
	);

	// ── Persist on every state change ──────────────────────────────────────
	$effect(() => {
		const snap = { index: idx, answers };
		try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snap)); } catch {}
	});

	// ── Sync per-screen state when screen changes ──────────────────────────
	$effect(() => {
		const s = SCREENS[idx];
		const saved = answers[idx];
		if (s.type === 'multi')   { multiSel  = Array.isArray(saved) ? [...saved] : []; }
		if (s.type === 'slider')  { sliderVal = typeof saved === 'number' ? saved : (s.days ? 5 : 50); }
		if (s.type === 'scale')   { scaleAns  = (saved && typeof saved === 'object' && !Array.isArray(saved)) ? { ...saved } : {}; }
		if (s.type === 'email')   { emailVal  = saved?.email ?? ''; consentVal = saved?.consent ?? false; }
	});

	// ── Loader animation + auto-advance ───────────────────────────────────
	// NOTE: build the line states from a local index and NEVER read `loaderStates`
	// inside this effect. Reading it would make it a tracked dependency, so the
	// timers reassigning it would re-trigger the effect, clear its own timers, and
	// restart the loader forever (it would hang and never advance).
	$effect(() => {
		if (screen.type !== 'loader') return;
		const lines = screen.lines as string[];
		const perLine = LOADER_MS / lines.length;

		// activeIdx: lines before it are done, the line at it is active, rest pending
		const paint = (activeIdx: number) => {
			loaderStates = lines.map((_, i) =>
				i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending'
			);
		};
		paint(0);
		loaderPct = 0;

		const timers: ReturnType<typeof setTimeout>[] = [];
		for (let i = 1; i <= lines.length; i++) {
			timers.push(setTimeout(() => paint(i), perLine * i));
		}

		let advanced = false;
		timers.push(setTimeout(() => {
			if (advanced) return;
			advanced = true;
			loaderPct = 100;
			next();
		}, LOADER_MS + 400));

		const startT = performance.now();
		let raf = 0;
		const tick = () => {
			if (advanced) return;
			loaderPct = Math.min(Math.round((performance.now() - startT) / LOADER_MS * 100), 99);
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);

		return () => { advanced = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
	});

	// ── Mount ──────────────────────────────────────────────────────────────
	onMount(() => {
		document.body.classList.add('quiz-body');

		// User ID
		let storedUid = localStorage.getItem('copables_uid') || '';
		if (!storedUid) {
			try { storedUid = crypto.randomUUID(); } catch { storedUid = Math.random().toString(36).slice(2); }
			localStorage.setItem('copables_uid', storedUid);
		}
		uid = storedUid;

		// Inherit UID from prelander session if present
		try {
			const sess = JSON.parse(localStorage.getItem('copables_session') || 'null');
			if (sess?.uid) uid = sess.uid;
		} catch {}

		// Restore saved quiz state
		try {
			const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
			if (saved?.index >= 0 && saved.index < SCREENS.length) {
				idx = saved.index;
				answers = saved.answers || {};
			}
		} catch {}

		// PostHog identify
		try { (window as any).posthog?.identify?.(uid); } catch {}

		// GTM
		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({ event: 'quiz_started', user_id: uid });

		track('quiz_started', { uid });

		return () => { document.body.classList.remove('quiz-body'); };
	});

	// ── Navigation ─────────────────────────────────────────────────────────
	function go(i: number) {
		if (i < 0 || i >= SCREENS.length) return;
		idx = i;
		track('quiz_screen', { uid, i, type: SCREENS[i].type });
	}
	function next() { go(idx + 1); }
	function back() { go(idx - 1); }
	function reset() { answers = {}; idx = 0; localStorage.removeItem(STORAGE_KEY); }

	// ── Answer handlers ────────────────────────────────────────────────────
	function chooseSingle(opt: string) {
		answers = { ...answers, [idx]: opt };
		setTimeout(next, 240);
	}

	function toggleMulti(opt: string) {
		const sel = [...multiSel];
		const i = sel.indexOf(opt);
		if (i >= 0) sel.splice(i, 1); else sel.push(opt);
		multiSel = sel;
		answers = { ...answers, [idx]: sel };
	}

	function onSlider(e: Event) {
		const v = parseInt((e.target as HTMLInputElement).value, 10);
		sliderVal = v;
		answers = { ...answers, [idx]: v };
	}

	function setScale(stmtIdx: number, val: number) {
		scaleAns = { ...scaleAns, [stmtIdx]: val };
		answers = { ...answers, [idx]: scaleAns };
	}

	function sliderReadout(v: number): string {
		if (screen.days) return v + (v === 1 ? ' day' : ' days');
		if (screen.readout) return screen.readout[Math.min(4, Math.floor(v / 20))];
		return String(v);
	}

	function submitEmail() {
		if (!footEnabled || submitLoading) return;
		submitLoading = true;
		const email = emailVal.trim();
		answers = { ...answers, [idx]: { email, consent: consentVal } };
		track('quiz_completed', { uid, email });
		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({ event: 'quiz_complete', user_id: uid, email });
		localStorage.removeItem(STORAGE_KEY);
		setTimeout(() => { window.location.href = '/science'; }, 650); // TODO: wire to results page
	}

	function continueScreen() {
		if (screen.type === 'email') { submitEmail(); return; }
		if (!footEnabled) return;
		next();
	}
</script>

<svelte:head>
	<title>60-Second IBS Quiz — Is the Copables Protocol Right for You?</title>
	<meta name="description" content="A 60-second quiz that helps you understand what's going on with your gut — and whether the Copables 14-Day IBS Protocol is honestly right for you." />
	<meta property="og:title" content="60-Second IBS Quiz — Is the Copables Protocol Right for You?" />
	<meta property="og:description" content="Understand your gut symptoms in 60 seconds." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta name="twitter:title" content="60-Second IBS Quiz" />
	<meta name="twitter:description" content="Understand your gut symptoms in 60 seconds." />
	<meta name="twitter:image" content="https://copables.com/assets/lineup.webp" />
</svelte:head>

<div class="funnel" class:tone-dark={isDark}>

	<!-- ── Top bar ─────────────────────────────────────────── -->
	<div class="qtop">
		<div class="qprog"><i style="width:{progress}%"></i></div>
		<div class="qbar">
			<button class="qback" style:visibility={canGoBack ? 'visible' : 'hidden'} onclick={back}>
				← Back
			</button>
			<a class="qbrand" href="/quiz/ibs" aria-label="Restart quiz" onclick={(e) => { e.preventDefault(); reset(); }}>
				<img src="/assets/wordmark.webp" alt="copables" />
			</a>
			<span class="qstep">{screen.tag ?? ''}</span>
		</div>
	</div>

	<!-- ── Scrollable stage ─────────────────────────────────── -->
	<main class="qstage">
		{#key idx}
		<div class="qwrap" class:wide={screen.wide}>
			<div class="qscreen">

				<!-- ── SINGLE ─────────────────────────────────── -->
				{#if screen.type === 'single'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					<div class="q-options">
						{#each screen.options as opt (opt)}
							{@const chosen = answers[idx] === opt}
							<button
								class="q-opt"
								class:chosen
								type="button"
								onclick={() => chooseSingle(opt)}
							>
								<span class="lbl">{opt}</span>
								<span class="chev">→</span>
							</button>
						{/each}
					</div>

				<!-- ── MULTI ──────────────────────────────────── -->
				{:else if screen.type === 'multi'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					<div class="q-options">
						{#each screen.options as opt (opt)}
							{@const sel = multiSel.includes(opt)}
							<button
								class="q-opt"
								class:selected={sel}
								type="button"
								onclick={() => toggleMulti(opt)}
							>
								<span class="box"><span>✓</span></span>
								<span class="lbl">{opt}</span>
							</button>
						{/each}
					</div>

				<!-- ── SCALE ──────────────────────────────────── -->
				{:else if screen.type === 'scale'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					<div class="scale-list">
						{#each screen.statements as stmt, k (k)}
							<div class="scale-row" class:answered={scaleAns[k] !== undefined}>
								<p class="scale-stmt">{stmt}</p>
								<div class="scale-segs">
									{#each (screen.scaleLabels || SCALE) as lbl, v (v)}
										<button
											class="scale-seg"
											class:on={scaleAns[k] === v}
											data-v={v}
											onclick={() => setScale(k, v)}
										>{lbl}</button>
									{/each}
								</div>
							</div>
						{/each}
					</div>

				<!-- ── SLIDER ─────────────────────────────────── -->
				{:else if screen.type === 'slider'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					<div class="qslider-wrap">
						<div class="qslider-bubble">
							<span class="reading">{sliderReadout(sliderVal)}</span>
						</div>
						<input
							type="range"
							class="qrange"
							min="0"
							max={sliderMax}
							step="1"
							value={sliderVal}
							style="--fill:{(sliderVal / sliderMax * 100)}%"
							oninput={onSlider}
						/>
						<div class="qends">
							<span>{screen.left}</span>
							<span>{screen.right}</span>
						</div>
					</div>

				<!-- ── INFO / REVEAL ──────────────────────────── -->
				{:else if screen.type === 'info'}
					<div class="qinfo">
						{#if screen.face}
							<img class="qface" src="/assets/face.webp" alt="" />
						{:else if screen.glyph}
							<div class="qglyph">{screen.glyph}</div>
						{/if}
						{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
						<h1 class="qh">{screen.title}</h1>
						{#if screen.sub}<p class="qsub">{screen.sub}</p>{/if}

						{#if screen.stat}
							<div class="qstat">{screen.stat}</div>
							<p class="qstat-cap">{screen.statCap ?? ''}</p>
						{/if}

						{#if screen.loop}
							<div class="gutbrain">
								<div class="loop">
									<div class="arc"></div>
									<div class="arc b"></div>
									<div class="node node--brain"><span><small>Brain</small>reads it<br>as a threat</span></div>
									<div class="node node--gut"><span><small>Gut</small>sends a<br>normal signal</span></div>
									<div class="pill-tag l">false alarm ↑</div>
									<div class="pill-tag r">stuck on alert</div>
								</div>
							</div>
						{/if}

						{#if screen.product}
							<div class="qproduct"><img src={screen.product} alt="Copables OLP Treatment N°2" /></div>
						{/if}

						{#if screen.prose}
							<div class="qprose">
								{#each screen.prose as p (p)}
									<p>{@html p}</p>
								{/each}
							</div>
						{/if}

						{#if screen.comp}
							<div class="qcomp">
								{#each screen.comp as c, ci (ci)}
									<div class="qcomp-item">
										<span class="ic">{c.ic}</span>
										<div><h3>{c.h}</h3><p>{c.p}</p></div>
									</div>
								{/each}
							</div>
						{/if}

						{#if screen.honest}
							<div class="qhonest">
								<p class="q">{screen.honest.q}</p>
								<p>{@html screen.honest.p}</p>
							</div>
						{/if}

						{#if screen.quote}
							<div class="qquote">
								<span class="qm">"</span>
								<p>{screen.quote.text}</p>
								<div class="by">
									<span class="avatar" style="background:{screen.quote.av[1]}">{screen.quote.av[0]}</span>
									<div>
										<div class="nm">{screen.quote.by}</div>
										<div class="role">{screen.quote.role}</div>
									</div>
								</div>
							</div>
						{/if}
					</div>

				<!-- ── LOADER ─────────────────────────────────── -->
				{:else if screen.type === 'loader'}
					<div class="qloader">
						<div class="loader-dial">
							<svg viewBox="0 0 150 150">
								<circle class="lt" cx="75" cy="75" r="65"/>
								<circle class="lf" cx="75" cy="75" r="65" style="--loaddur:{LOADER_MS / 1000}s"/>
							</svg>
							<div class="lpct">{loaderPct}%</div>
						</div>
						<p class="q-kick qinfo-eyebrow" style="justify-content:center">Building your result</p>
						<h1 class="qh" style="font-size:clamp(24px,3.4vw,32px);margin-bottom:22px">Hang tight — charting your best-fit plan.</h1>
						<div class="loader-lines">
							{#each (screen.lines || []) as line, k (k)}
								<div class="loader-line" class:active={loaderStates[k]==='active'} class:done={loaderStates[k]==='done'}>
									<span class="lck">✓</span>
									<span>{line}</span>
								</div>
							{/each}
						</div>
					</div>

				<!-- ── EMAIL ──────────────────────────────────── -->
				{:else if screen.type === 'email'}
					<div class="qemail">
						<img class="qface" src="/assets/face.webp" alt="" />
						{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
						<h1 class="qh">{screen.title}</h1>
						<p class="qsub">{screen.sub}</p>
						<div class="qemail-form">
							<input
								class="qfield"
								type="email"
								inputmode="email"
								autocomplete="email"
								placeholder="you@email.com"
								bind:value={emailVal}
							/>
							<label class="qconsent">
								<input type="checkbox" bind:checked={consentVal} />
								<span>I agree to receive my results and understand my answers (including symptom info) are handled per the <a href="/privacy">Privacy Policy</a>.</span>
							</label>
						</div>
						<div class="qlock">🔒 Your answers stay private. No spam.</div>
					</div>
				{/if}

			</div><!-- /.qscreen -->
		</div><!-- /.qwrap -->
		{/key}
	</main>

	<!-- ── Footer CTA ──────────────────────────────────────── -->
	{#if screen.type !== 'single' && screen.type !== 'loader'}
		<footer class="qfoot" class:tone-dark={isDark}>
			<div class="qfoot-inner">
				<button
					class="btn btn--primary btn--lg qcontinue"
					disabled={!footEnabled || submitLoading}
					onclick={continueScreen}
				>
					{submitLoading ? 'Unlocking your results…' : (screen.cta ?? 'Continue')} {submitLoading ? '' : '→'}
				</button>
				{#if screen.foot}
					<p class="qfoot-note">{screen.foot}</p>
				{/if}
				{#if screen.type === 'email'}
					<p class="qfoot-note">By continuing you agree to our Privacy Policy.</p>
				{/if}
			</div>
		</footer>
	{/if}

</div>

<style>
/* ── Shell ────────────────────────────────────────────── */
.funnel {
	position: fixed; inset: 0;
	display: grid; grid-template-rows: auto 1fr auto;
	background: var(--paper); color: var(--ink);
	transition: background .5s ease, color .5s ease;
	font-family: var(--ff);
}
.funnel.tone-dark { background: var(--ink); color: var(--paper); }

/* ── Top bar ──────────────────────────────────────────── */
.qtop { position: relative; z-index: 5; }
.qprog { height: 5px; background: rgba(20,19,15,.10); width: 100%; overflow: hidden; }
.tone-dark .qprog { background: rgba(251,246,234,.14); }
.qprog > i { display:block; height:100%; width:0%; background:var(--accent); border-radius:0 99px 99px 0; transition:width .55s cubic-bezier(.2,.8,.2,1); }

.qbar {
	display:flex; align-items:center; justify-content:space-between; gap:14px;
	height:60px; padding:0 clamp(16px,4vw,30px); max-width:1100px; margin:0 auto; width:100%;
}
.qback {
	appearance:none; border:0; background:none; cursor:pointer; font-family:var(--ff);
	display:inline-flex; align-items:center; gap:7px; font-weight:800; font-size:14.5px;
	color:inherit; opacity:.62; padding:8px 6px; transition:opacity .15s, transform .15s;
}
.qback:hover { opacity:1; transform:translateX(-2px); }
.qbrand { display:inline-flex; align-items:center; gap:9px; }
.qbrand img { height:19px; width:auto; display:block; }
.tone-dark .qbrand img { filter:invert(1) brightness(1.7); }
.qstep { font-size:12px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; opacity:.5; }

/* ── Stage ────────────────────────────────────────────── */
.qstage { overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch; display:flex; }
.qstage::-webkit-scrollbar { width:0; }
.qwrap { width:100%; max-width:600px; margin:auto; padding:clamp(22px,5vw,48px) clamp(18px,4vw,30px) 28px; }
.qwrap.wide { max-width:720px; }

@media (prefers-reduced-motion:no-preference) {
	.qscreen { animation:qin .42s cubic-bezier(.2,.8,.2,1); }
	@keyframes qin { from { transform:translateY(14px); opacity:.4; } to { transform:none; opacity:1; } }
}

/* ── Question header ──────────────────────────────────── */
.q-kick {
	font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase;
	color:var(--accent-deep); margin:0 0 14px; display:inline-flex; align-items:center; gap:9px;
}
.tone-dark .q-kick { color:var(--accent); }
.q-kick::before { content:""; width:22px; height:2px; background:currentColor; display:inline-block; }
.qh { font-size:clamp(26px,4.2vw,38px); font-weight:800; line-height:1.05; letter-spacing:-0.025em; margin:0; }
.qsub { font-size:clamp(16px,1.7vw,18px); color:var(--ink-soft); line-height:1.5; margin:14px 0 0; }
.tone-dark .qsub { color:rgba(251,246,234,.74); }
.qhint { font-size:13px; font-weight:700; color:var(--ink-soft); margin:10px 0 0; opacity:.85; }
.tone-dark .qhint { color:rgba(251,246,234,.6); }

/* ── Options (single / multi) ─────────────────────────── */
.q-options { display:grid; gap:11px; margin-top:26px; }
.q-opt {
	display:flex; align-items:center; gap:14px; width:100%; text-align:left; cursor:pointer;
	background:#fff; border:2px solid var(--line); border-radius:15px;
	padding:16px 18px; font-family:var(--ff); font-size:16.5px; font-weight:700; color:var(--ink);
	transition:border-color .15s, background .15s, transform .08s, box-shadow .15s;
}
.tone-dark .q-opt { background:rgba(251,246,234,.05); border-color:rgba(251,246,234,.18); color:var(--paper); }
.q-opt:hover { border-color:var(--accent); background:var(--accent-tint); }
.tone-dark .q-opt:hover { background:rgba(47,149,242,.12); }
.q-opt:active { transform:scale(.99); }
.q-opt .lbl { flex:1; }
.q-opt .chev { color:var(--accent-deep); font-weight:900; opacity:0; transform:translateX(-6px); transition:.15s; }
.q-opt:hover .chev { opacity:1; transform:none; }
.q-opt.chosen { border-color:var(--accent); background:var(--accent-tint); box-shadow:0 0 0 3px var(--accent-tint); }
.q-opt .box { flex:none; width:24px; height:24px; border-radius:8px; border:2px solid var(--line); display:grid; place-items:center; font-size:14px; font-weight:900; color:#fff; background:#fff; transition:.14s; }
.tone-dark .q-opt .box { background:transparent; border-color:rgba(251,246,234,.3); }
.q-opt .box span { opacity:0; transform:scale(.4); transition:.14s; }
.q-opt.selected { border-color:var(--accent); background:var(--accent-tint); box-shadow:var(--shadow-sm); }
.tone-dark .q-opt.selected { background:rgba(47,149,242,.16); }
.q-opt.selected .box { background:var(--accent); border-color:var(--accent); }
.q-opt.selected .box span { opacity:1; transform:none; }

/* ── Scale ────────────────────────────────────────────── */
.scale-list { display:grid; gap:14px; margin-top:26px; }
.scale-row { background:#fff; border:2px solid var(--line); border-radius:16px; padding:16px 18px 14px; transition:border-color .2s; }
.scale-row.answered { border-color:var(--accent); }
.scale-stmt { font-size:16.5px; font-weight:700; line-height:1.35; margin:0 0 13px; color:var(--ink); }
.scale-segs { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
.scale-seg {
	appearance:none; cursor:pointer; font-family:var(--ff); font-weight:800; font-size:12.5px;
	border:1.5px solid var(--line); background:var(--paper); color:var(--ink-soft); border-radius:10px;
	padding:10px 4px; line-height:1.15; text-align:center; transition:.12s;
}
.scale-seg:hover { border-color:var(--accent); color:var(--ink); }
.scale-seg.on { background:var(--accent); border-color:var(--accent); color:#fff; box-shadow:0 4px 12px rgba(47,149,242,.28); }
.scale-seg[data-v="3"].on { background:var(--green-ok); border-color:var(--green-ok); }
.scale-seg[data-v="1"].on { background:var(--orange); border-color:var(--orange); }
.scale-seg[data-v="0"].on { background:var(--wine); border-color:var(--wine); }

/* ── Slider ───────────────────────────────────────────── */
.qslider-wrap { margin-top:34px; }
.qslider-bubble { text-align:center; margin-bottom:22px; }
.reading { display:inline-block; font-weight:800; font-size:15px; letter-spacing:-0.01em; background:var(--accent-tint); color:var(--accent-deep); border-radius:999px; padding:9px 20px; min-width:140px; transition:background .2s; }
.tone-dark .reading { background:rgba(47,149,242,.18); color:#fff; }
.qrange {
	-webkit-appearance:none; appearance:none; width:100%; height:10px; border-radius:999px;
	background:linear-gradient(90deg, var(--accent) var(--fill,50%), var(--line) var(--fill,50%));
	outline:none; cursor:pointer;
}
.tone-dark .qrange { background:linear-gradient(90deg, var(--accent) var(--fill,50%), rgba(251,246,234,.18) var(--fill,50%)); }
.qrange::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:34px; height:34px; border-radius:50%; background:#fff; border:4px solid var(--accent); box-shadow:var(--shadow-md); cursor:grab; }
.qrange::-moz-range-thumb { width:34px; height:34px; border-radius:50%; background:#fff; border:4px solid var(--accent); box-shadow:var(--shadow-md); cursor:grab; }
.qends { display:flex; justify-content:space-between; gap:16px; margin-top:16px; }
.qends span { font-size:13.5px; font-weight:700; color:var(--ink-soft); max-width:44%; line-height:1.3; }
.tone-dark .qends span { color:rgba(251,246,234,.66); }
.qends span:last-child { text-align:right; }

/* ── Footer ───────────────────────────────────────────── */
.qfoot { padding:14px clamp(16px,4vw,30px) calc(18px + env(safe-area-inset-bottom)); }
.qfoot.tone-dark { background:var(--ink); }
.qfoot-inner { max-width:600px; margin:0 auto; }
.qcontinue { width:100%; }
.qcontinue:disabled { opacity:.4; cursor:not-allowed; box-shadow:0 6px 0 var(--accent-deep); transform:none; }
.qfoot-note { text-align:center; font-size:12.5px; font-weight:600; color:var(--ink-soft); margin:10px 0 0; }
.tone-dark .qfoot-note { color:rgba(251,246,234,.55); }

/* shared btn (mirrors prelander) */
.btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; font-family:var(--ff); font-weight:800; font-size:17px; letter-spacing:-0.01em; padding:17px 30px; border-radius:999px; border:0; cursor:pointer; text-decoration:none; transition:transform .14s ease, box-shadow .2s ease; line-height:1; }
.btn--primary { background:var(--accent); color:#fff; box-shadow:0 6px 0 var(--accent-deep); }
.btn--primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 0 var(--accent-deep); }
.btn--primary:active:not(:disabled) { transform:translateY(2px); box-shadow:0 3px 0 var(--accent-deep); }
.btn--lg { font-size:19px; padding:21px 40px; }

/* ── Info / reveal screens ────────────────────────────── */
.qinfo-eyebrow { justify-content:center; }
.qinfo { text-align:center; }
.qinfo .qh { font-size:clamp(28px,4.6vw,42px); }
.qinfo .qsub { margin-left:auto; margin-right:auto; max-width:46ch; }

.qglyph { width:76px; height:76px; margin:0 auto 22px; border-radius:22px; background:var(--accent-tint); color:var(--accent-deep); display:grid; place-items:center; font-size:36px; font-weight:900; box-shadow:var(--shadow-sm); }
.tone-dark .qglyph { background:rgba(47,149,242,.16); color:var(--accent); }

.qface { width:78px; margin:0 auto 20px; display:block; }

/* product image inside reveal */
.qproduct { border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); margin:0 auto 6px; max-width:300px; aspect-ratio:4/5; background:#ddd; }
.qproduct img { width:100%; height:100%; object-fit:cover; }

.qstat { font-size:clamp(58px,12vw,92px); font-weight:900; letter-spacing:-0.04em; line-height:.92; color:var(--accent-deep); margin:4px 0 4px; }
.tone-dark .qstat { color:var(--accent); }
.qstat-cap { font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-soft); }
.tone-dark .qstat-cap { color:rgba(251,246,234,.5); }

/* gut-brain loop */
.gutbrain { display:grid; place-items:center; padding:18px; margin:8px auto 4px; }
.loop { position:relative; width:min(380px,100%); aspect-ratio:1.15/1; }
.node { position:absolute; width:120px; height:120px; border-radius:50%; display:grid; place-items:center; text-align:center; font-weight:800; font-size:14px; box-shadow:var(--shadow-md); }
.node small { display:block; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; opacity:.7; }
.node--brain { top:0; left:50%; transform:translateX(-50%); background:var(--paper); color:var(--ink); }
.tone-dark .node--brain { background:rgba(251,246,234,.1); color:var(--paper); }
.node--gut { bottom:0; left:50%; transform:translateX(-50%); background:var(--accent); color:#fff; }
.loop .arc { position:absolute; inset:16px 64px; border:3px dashed rgba(20,19,15,.18); border-radius:50%; }
.tone-dark .loop .arc { border-color:rgba(251,246,234,.18); }
.loop .arc.b { border-color:var(--accent); border-style:solid; clip-path:inset(0 0 50% 0); opacity:.55; }
.pill-tag { position:absolute; top:50%; transform:translateY(-50%); background:var(--orange-tint); color:var(--orange-deep); font-weight:800; font-size:11px; padding:5px 10px; border-radius:999px; white-space:nowrap; }
.pill-tag.l { left:-4px; }
.pill-tag.r { right:-4px; background:var(--accent-tint); color:var(--accent-deep); }

/* prose */
.qprose { text-align:left; margin-top:22px; }
.qprose p { font-size:17px; line-height:1.62; color:var(--ink-2); margin:0 0 16px; }
.tone-dark .qprose p { color:rgba(251,246,234,.84); }
.qprose p :global(strong) { color:var(--ink); }
.tone-dark .qprose p :global(strong) { color:var(--paper); }

/* component list */
.qcomp { display:grid; gap:12px; margin:24px 0 4px; text-align:left; }
.qcomp-item { display:grid; grid-template-columns:46px 1fr; gap:15px; align-items:start; background:var(--card); border:1px solid var(--line-2); border-radius:14px; padding:17px 18px; box-shadow:var(--shadow-sm); }
.tone-dark .qcomp-item { background:rgba(251,246,234,.05); border-color:rgba(251,246,234,.14); }
.qcomp-item .ic { width:46px; height:46px; border-radius:13px; background:var(--accent-tint); color:var(--accent-deep); display:grid; place-items:center; font-size:22px; font-weight:900; }
.qcomp-item:nth-child(2) .ic { background:var(--orange-tint); color:var(--orange-deep); }
.qcomp-item:nth-child(3) .ic { background:#e3f1e9; color:var(--green-ok); }
.qcomp-item h3 { font-size:17px; margin:0 0 4px; }
.qcomp-item p { font-size:14.5px; line-height:1.45; color:var(--ink-soft); margin:0; }
.tone-dark .qcomp-item p { color:rgba(251,246,234,.7); }

/* honest callout */
.qhonest { text-align:left; background:var(--accent-tint); border-radius:var(--radius); padding:22px 24px; margin-top:22px; }
.tone-dark .qhonest { background:rgba(47,149,242,.12); border:1px solid rgba(47,149,242,.28); }
.qhonest .q { font-weight:800; font-size:16px; color:var(--accent-deep); margin:0 0 8px; }
.tone-dark .qhonest .q { color:var(--accent); }
.qhonest p { margin:0; font-size:15.5px; line-height:1.55; color:var(--ink-2); }
.tone-dark .qhonest p { color:rgba(251,246,234,.84); }

/* quote */
.qquote { text-align:left; background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius-lg); padding:clamp(22px,3vw,30px); box-shadow:var(--shadow-sm); margin-top:26px; }
.tone-dark .qquote { background:rgba(251,246,234,.05); border-color:rgba(251,246,234,.14); }
.qquote .qm { font-size:46px; line-height:0; height:22px; color:var(--accent); font-weight:900; display:block; }
.qquote p { font-size:17px; line-height:1.55; color:var(--ink-2); margin:16px 0 18px; font-weight:500; }
.tone-dark .qquote p { color:rgba(251,246,234,.9); }
.qquote .by { display:flex; align-items:center; gap:12px; }
.nm { font-weight:800; font-size:15px; }
.role { font-size:12.5px; color:var(--ink-soft); font-weight:600; }
.tone-dark .role { color:rgba(251,246,234,.6); }
.avatar { width:42px; height:42px; border-radius:50%; display:grid; place-items:center; color:#fff; font-weight:800; font-size:14px; flex:none; }

/* ── Loader ───────────────────────────────────────────── */
.qloader { text-align:center; }
.loader-dial { position:relative; width:150px; height:150px; margin:0 auto 34px; }
.loader-dial svg { width:100%; height:100%; transform:rotate(-90deg); }
.lt { fill:none; stroke:rgba(251,246,234,.14); stroke-width:12; }
.lf { fill:none; stroke:var(--accent); stroke-width:12; stroke-linecap:round; stroke-dasharray:408; stroke-dashoffset:408; animation:loaderfill var(--loaddur,4s) linear forwards; }
@keyframes loaderfill { to { stroke-dashoffset:60; } }
.lpct { position:absolute; inset:0; display:grid; place-items:center; font-size:30px; font-weight:900; color:var(--paper); font-variant-numeric:tabular-nums; letter-spacing:-0.02em; }
.loader-lines { display:grid; gap:12px; max-width:360px; margin:0 auto; text-align:left; }
.loader-line { display:flex; align-items:center; gap:13px; font-size:16px; font-weight:700; color:rgba(251,246,234,.4); transition:color .35s; }
.loader-line .lck { flex:none; width:26px; height:26px; border-radius:50%; border:2px solid rgba(251,246,234,.2); display:grid; place-items:center; font-size:13px; font-weight:900; color:transparent; transition:.3s; }
.loader-line.active { color:var(--paper); }
.loader-line.done { color:rgba(251,246,234,.85); }
.loader-line.done .lck { background:var(--accent); border-color:var(--accent); color:#fff; }
.loader-line.active .lck { border-color:var(--accent); }

/* ── Email ────────────────────────────────────────────── */
.qemail { text-align:center; }
.qemail-form { margin-top:28px; text-align:left; }
.qfield { width:100%; font-family:var(--ff); font-size:17px; font-weight:600; color:var(--ink); background:#fff; border:2px solid var(--line); border-radius:14px; padding:17px 18px; outline:none; transition:border-color .15s, box-shadow .15s; }
.qfield::placeholder { color:#a59c89; }
.qfield:focus { border-color:var(--accent); box-shadow:0 0 0 4px var(--accent-tint); }
.qconsent { display:flex; align-items:flex-start; gap:11px; margin:16px 0 4px; cursor:pointer; }
.qconsent input { margin-top:3px; width:18px; height:18px; accent-color:var(--accent); flex:none; cursor:pointer; }
.qconsent span { font-size:13px; line-height:1.5; color:var(--ink-soft); font-weight:500; }
.qconsent a { color:var(--accent-deep); text-decoration:underline; text-underline-offset:2px; }
.qlock { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:700; color:var(--ink-soft); margin-top:16px; justify-content:center; }

/* ── iOS / mobile optimization ───────────────────────────── */
@supports (height: 100dvh) {
	.funnel { height: 100dvh; }
}
@supports not (height: 100dvh) {
	.funnel { height: 100vh; }
}

/* Prevent overscroll bounce and pull-to-refresh */
.funnel, .qstage {
	overscroll-behavior: none;
	-webkit-overflow-scrolling: touch;
}

/* Ensure all touch targets are 44px+ */
.q-opt, .scale-seg, .qback, .qcontinue, .qfield {
	min-height: 44px;
}

/* Active touch feedback */
.q-opt:active, .scale-seg:active, .qback:active, .qcontinue:active {
	transform: scale(0.98);
}

/* Larger slider thumb for touch */
.qrange::-webkit-slider-thumb {
	width: 44px;
	height: 44px;
}
.qrange::-moz-range-thumb {
	width: 44px;
	height: 44px;
}

/* Compact iOS adjustments */
@media (max-width: 540px) {
	.qbar { height: 52px; }
	.qback { font-size: 14px; padding: 10px 8px; }
	.qh { font-size: clamp(22px, 6vw, 30px); }
	.qinfo .qh { font-size: clamp(24px, 6vw, 32px); }
	.qsub { font-size: 15px; }
	.q-kick { font-size: 11px; }
	.q-opt { font-size: 15px; padding: 14px 16px; }
	.scale-stmt { font-size: 15px; }
	.scale-seg { font-size: 12px; padding: 12px 4px; }
	.qfoot { padding: 12px 16px calc(16px + env(safe-area-inset-bottom)); }
	.qproduct { max-width: 240px; }
	.qglyph { width: 60px; height: 60px; font-size: 28px; }
	.qface { width: 64px; }
	.loop { width: min(320px, 92vw); }
	.node { width: 96px; height: 96px; font-size: 12px; }
	.qprose p { font-size: 15px; }
	.qcomp-item { padding: 14px; }
	.qcomp-item h3 { font-size: 15px; }
	.qcomp-item p { font-size: 13px; }
	.qquote { padding: 20px; }
	.qquote p { font-size: 15px; }
	.qhonest { padding: 18px 20px; }
	.qhonest p { font-size: 14px; }
	.qstat { font-size: clamp(48px, 14vw, 72px); }
	.loader-dial { width: 120px; height: 120px; }
	.lpct { font-size: 24px; }
	.qfield { font-size: 16px; padding: 14px 16px; }
	.qconsent span { font-size: 13px; }
}

/* Prevent font size inflation on iOS */
.qscreen { -webkit-text-size-adjust: 100%; }
</style>
