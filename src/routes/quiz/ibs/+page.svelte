<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	// ── Screen definitions (ordered funnel) ───────────────────────────────
	const SCALE = ['Not at all', 'A little', 'Somewhat Agree', 'Strongly Agree'];

	const SCREENS: any[] = [
		// ── Act 1: Reframe hook ─────────────────────────────────────────────
		/* 1 */ { id:'hook', type:'info', illu:'hero', kick:'Before we start', title:"If everything you've tried hasn't worked, it wasn't you. It was the approach.", sub:"IBS isn't a willpower problem or a food you haven't cut yet. It's a miscommunication between your gut and brain — and unlike a diet, that can be retrained. There's Harvard research behind it. We'll show you, then see if it fits you.", cta:'Show me →' },
		// ── Act 2: Easy intake, foot-in-the-door ────────────────────────────
		/* 2 */ { id:'goal_anchor', type:'single', tag:'About you', kick:"Let's start with you", title:'What would getting your gut under control give you back?', options:['Eating what I want without fear','Not planning my life around bathrooms','Just feeling normal again','My energy and focus back',"I haven't figured that out yet"] },
		/* 3 */ { id:'gender', type:'single', tag:'About you', kick:'A little context', title:"What's your gender?", hint:'Hormones shape the gut-brain axis — this sharpens your read. Optional.', options:['Male','Female','Non-binary','Other','Prefer not to say'] },
		/* 4 */ { id:'age', type:'single', tag:'About you', kick:'Age', title:"What's your age group?", hint:'So we can benchmark your score against people like you.', options:['18–24','25–34','35–44','45–54','55+'] },
		/* 5 */ { id:'name', type:'text', kick:'Nice to meet you', title:'Before we go further — what should we call you?', hint:'First name is all we need.', cta:'Continue →' },
		/* 6 */ { id:'duration', type:'single', tag:'Your symptoms', kick:"Let's start with you", title:'How long has your gut been like this?', options:['Less than 1 month','1–3 months','3–6 months','6–12 months','1+ year'] },
		/* 7 */ { id:'symptoms', type:'multi', tag:'Your symptoms', kick:'Physical symptoms', title:'Which symptoms hit you most?', hint:'Select all that apply.', options:['Diarrhea','Constipation','Sudden urgency to go','Straining on the toilet','Abdominal pain','Bloating','Gas / wind','Nausea'] },
		/* 8 */ { id:'triggers', type:'multi', tag:'Your symptoms', kick:'Your triggers', title:'What sets it off?', hint:'Check all that apply.', options:['Certain foods','Caffeine','Poor sleep','Anxiety / stress','Medication','Exercise','Other',"I'm not sure"] },
		/* 9 */ { id:'stress_level', type:'single', tag:'Your symptoms', kick:'Stress', title:'How has your stress been this past year?', hint:'Stress is one of the strongest gut-brain triggers — it matters more than most people think.', options:['High and constant','Comes in waves','Manageable','Low'] },
		/* 10 */ { id:'i_validate_1', type:'info', illu:'spot', kick:'Good start', title:'Good start, {name}.', sub:"Most people have never mapped this out. You're already ahead.", cta:'Continue' },
		// ── Act 3: Severity / score inputs ──────────────────────────────────
		/* 11 */ { id:'i_measure_intro', type:'info', tag:'Your symptoms', kick:'Your symptoms', title:"Now let's measure where you are.", sub:'These five answers build your IBS Severity Score — the scale used in clinical research. Drag each to what\'s true for you.', cta:'Continue' },
		/* 12 */ { id:'pain_severity', type:'slider', tag:'Your symptoms', kick:'Pain severity', title:'How bad is your abdominal pain right now?', hint:'Drag to 0 if none.', left:'None', right:'Severe', readout:['No pain','Mild','Moderate','Strong','Severe'], requiresInteraction:true },
		/* 13 */ { id:'pain_frequency', type:'slider', tag:'Your symptoms', kick:'Pain frequency', days:true, title:'Out of every 10 days, how many bring pain?', hint:'Pain every day? Slide to 10.', left:'0 days', right:'10 days', requiresInteraction:true },
		/* 14 */ { id:'bloating', type:'slider', tag:'Your symptoms', kick:'Bloating', title:'How bad is the bloating and tightness?', left:'None', right:'Severe', readout:['None','Mild','Moderate','Strong','Severe'], requiresInteraction:true },
		/* 15 */ { id:'bowel', type:'slider', tag:'Your symptoms', kick:'Bowel movements', title:'How happy are you with your bowel movements lately?', left:'Satisfied', right:'Totally dissatisfied', readout:['Satisfied','Mostly satisfied','Mixed','Dissatisfied','Totally dissatisfied'], requiresInteraction:true },
		/* 16 */ { id:'life_impact', type:'slider', tag:'Your symptoms', kick:'Life impact', title:'How much is IBS running your life?', left:'None', right:'Completely interferes', readout:['No impact','A little','Moderate','A lot','Completely interferes'], requiresInteraction:true },
		/* 17 */ { id:'i_validate_2', type:'info', illu:'spot', kick:'That took honesty', title:'That took honesty, {name}.', sub:"Most people never get their symptoms measured properly. You just did — and your score is taking shape.", cta:'Continue' },
		// ── Act 4: Proof + anchor + labor illusion ───────────────────────────
		/* 18 */ { id:'edu_proof', type:'info', illu:'chart', kick:'The part that sounds too strange to be true', title:'Patients improved on a placebo they were openly told was a placebo.', sub:"In a Harvard trial, IBS patients took an inactive pill and were told plainly it was a placebo — and 59% got real relief. A 2021 study with 3× the people confirmed it. The honesty is the point: your nervous system can be retrained on purpose.", stat:'59%', statCap:'reported adequate relief', bars:[{label:'OLP',value:59},{label:'No treatment',value:35}], harvard:true, cite:'Kaptchuk TJ, et al. PLoS ONE. 2010;5(12):e15591.', cta:'Continue' },
		/* 19 */ { id:'target_set', type:'target', tag:'Your symptoms', kick:'Your 14-day target', title:'Where would you like your score in two weeks?', sub:'Most responders aim to cut their score by about a third. Set your 14-day target.', requiresInteraction:true },
		/* 20 */ { id:'loading', type:'loader', lines:['Scoring your symptom severity...','Matching your responder profile...','Pulling the research for people like you...','Building your projection...'] },
		// ── Act 5: Email gate → first projection ─────────────────────────────
		/* 21 */ { id:'email', type:'email', tag:'Your results', kick:'Your projection is ready', title:'See where your score could be in 14 days.', sub:'Enter your email to reveal your projection and the plan matched to your profile.', cta:'Show my projection →' },
		/* 22 */ { id:'projection_1', type:'projection', tag:'Your results', kick:'Your projection', title:"Here's where you could be, {name}.", cta:'Continue' },
		// ── Act 6: Identity → archetype ─────────────────────────────────────
		/* 23 */ { id:'i_profile_intro', type:'info', tag:'Your profile', kick:"Now let's find your type", title:"Now let's find your responder profile, {name}.", sub:'A few quick questions about how you approach your health. There are no right answers.', cta:'Continue' },
		/* 24 */ { id:'rs_open', type:'semantic', tag:'Your profile', kick:'Sounds like you?', title:'Which is closer to you?', leftLabel:"I'm open to unconventional approaches", rightLabel:'I prefer proven, conventional ones', requiresInteraction:true },
		/* 25 */ { id:'rs_curious', type:'semantic', tag:'Your profile', kick:'Sounds like you?', title:'Which is closer to you?', leftLabel:"I'm curious about how my body works", rightLabel:'I just want it fixed, not explained', requiresInteraction:true },
		/* 26 */ { id:'rs_active', type:'semantic', tag:'Your profile', kick:'Sounds like you?', title:'Which is closer to you?', leftLabel:'I see myself as active in my own health', rightLabel:"I'd rather things were handled for me", requiresInteraction:true },
		/* 27 */ { id:'rs_proof', type:'semantic', tag:'Your profile', kick:'Sounds like you?', title:'Which is closer to you?', leftLabel:'I trust published research', rightLabel:'I trust how something feels in practice', requiresInteraction:true },
		/* 28 */ { id:'responder_type', type:'type-reveal', tag:'Your profile', kick:'Your responder profile', illu:'emblem', cta:'Continue' },
		// ── Act 7: Problem agitation ────────────────────────────────────────
		/* 29 */ { id:'relate_1', type:'relate', tag:'Your experience', illu:'scene', title:"I've cancelled plans because I wasn't sure I'd be near a bathroom." },
		/* 30 */ { id:'relate_2', type:'relate', tag:'Your experience', illu:'scene', title:"I've sat through a meal in pain, smiling like everything was fine." },
		/* 31 */ { id:'relate_3', type:'relate', tag:'Your experience', illu:'scene', title:"I've lain awake convinced something was seriously wrong." },
		/* 32 */ { id:'future_event', type:'single', tag:'Your experience', illu:'scene', kick:'Looking ahead', title:'Is there something coming up you\'d love to feel normal for?', options:['A trip','A wedding or event','A dinner out','Just an ordinary week','I just want my life back'] },
		// ── Act 8: History/loss + objection-handling ────────────────────────
		/* 33 */ { id:'tried', type:'multi', tag:'Your history', kick:"What you've tried", title:'What have you already tried?', hint:"Most people feel like they've tried it all. Check all that apply.", options:['Avoiding certain foods / FODMAP','Medication','Peppermint','Probiotics','Therapy / CBT','Acupuncture / alternative medicine','Supplements','More / other'] },
		/* 34 */ { id:'did_work', type:'single', tag:'Your history', kick:'The result', title:'Did any of it actually work?', options:['Yes','Somewhat','A little','No','Not sure'] },
		/* 35 */ { id:'doctor', type:'single', tag:'Your history', kick:'The doctor', title:'What did the doctors land on?', options:['"Your tests are normal," but I\'m still in pain','"It\'s probably just stress"','"Learn to manage it / change your diet"','I got a diagnosis but the treatment didn\'t fix it',"I never went; it comes and goes, so I rode it out"] },
		/* 36 */ { id:'cost', type:'single', tag:'Your history', kick:'The cost', title:'Roughly what has this cost you — over your whole life?', hint:'Tests, doctors, diets, supplements, OTC meds — all of it.', options:['$0 -$50','$50 - $100','$100 - $250','$250+'] },
		/* 37 */ { id:'i_validate_3', type:'info', illu:'spot', kick:'A reframe', title:"That's a lot — and none of it was your fault.", sub:'The approach was wrong, not you. That\'s exactly what we\'re here to change.', cta:'Continue' },
		/* 38 */ { id:'obj_placebo', type:'lesson', tag:'Your history', illu:'chart', kick:'Quick one', title:'"If it\'s a placebo, isn\'t it just… nothing?"', options:['True — it\'s basically nothing','False — it does something real'], correct:1, reveal_title_correct:"You're right.", reveal_title_wrong:'Actually —', reveal:"Told plainly it was a placebo, 59% of patients still got real, measured relief. The effect is real; the honesty doesn't break it.", harvard:true },
		/* 39 */ { id:'obj_why_failed', type:'info', tag:'Your history', kick:'A fair question', title:'So why didn\'t the diets and pills work?', sub:'They treated the symptom, not the signal. Elimination diets and antispasmodics manage flare-ups; they don\'t calm the over-reactive gut-brain line generating them. That\'s what the protocol targets.', cta:'Continue' },
		/* 40 */ { id:'obj_work_for_me', type:'info', tag:'Your history', kick:'A fair question', title:'"But will it work for me?"', sub:'A larger 2021 Harvard study held up — ~73% more improvement than no treatment. And as {responder_type_name}, your profile lines up with people who respond well.', cta:'Continue' },
		/* 41 */ { id:'obj_food', type:'info', tag:'Your history', kick:'A fair question', title:'Do I have to give up foods?', sub:'No. This isn\'t another elimination diet. You\'re retraining the signal, not shrinking your plate.', cta:'Continue' },
		// ── Act 9: Commitment + safety ──────────────────────────────────────
		/* 42 */ { id:'behavior_commit', type:'single', tag:'Last step', kick:'Your routine', title:'When would you do your daily 15-minute ritual?', hint:'The most consistent people anchor it to a time.', options:['First thing in the morning','Midday reset','After dinner','Before bed'] },
		/* 43 */ { id:'commitment', type:'single', tag:'Last step', kick:'The commitment', title:'Is 15 minutes a day for 2 weeks an investment in yourself you\'re willing to make to improve this?', options:['Yes, absolutely','Yes, I think so',"I'm not sure",'Probably not'] },
		/* 44 */ { id:'safety', type:'single', tag:'Safety check', kick:'A quick check', title:'Have you noticed any of the following?', hint:'If you answer yes, your results will show the "please see a doctor first" path instead of the Copables protocol.', bullets:['Blood in your stool','Unexplained weight loss','Symptoms that regularly wake you from sleep','Symptoms that first started after age 50','A family history of bowel disease or bowel cancer'], options:['No, none of these apply','Yes, one or more apply'] },
		// ── Act 10: Momentum → offer ────────────────────────────────────────
		/* 45 */ { id:'projection_2', type:'projection', tag:'Your results', kick:'Good news', title:"Good news, {name} — your numbers moved.", cta:'See my full results →' },
		/* 46 */ { id:'how_heard', type:'single', tag:'Your results', kick:'One last thing', title:'How did you hear about Copables?', hint:'Optional — helps us understand where people come from.', options:['Instagram','TikTok','Google search','Reddit','Friend or family','Podcast','Other'] }
	];

	// ── Persistence key (bumped because screen order / answer keying changed) ─
	const STORAGE_KEY = 'copables_quiz_v7';
	const RESULTS_KEY = 'copables_quiz_results';

	// ── Helpers ────────────────────────────────────────────────────────────
	function screenIdx(id: string) { return SCREENS.findIndex((s) => s.id === id); }
	function getAnswer(id: string) { return answers[id]; }

	function computeSssScore(a: Record<string, any>): number {
		const sev = (id: string, days = false) => {
			const v = Number(a[id]);
			if (!Number.isFinite(v)) return 0;
			return days ? Math.min(100, v * 10) : v;
		};
		return Math.round(
			sev('pain_severity') +
			sev('pain_frequency', true) +
			sev('bloating') +
			sev('bowel') +
			sev('life_impact')
		);
	}

	function matrixAlarmLevel(a: Record<string, any>): { label: string; pct: number } {
		// Matrices were cut in v5; retained for results-page payload compatibility
		return { label: 'N/A', pct: 0 };
	}

	// ── IBS-SSS band + verdict marker (mirrors the results page) ───────────
	const BAND_CHARGE: Record<string, string> = {
		mild: 'var(--green-ok)',
		moderate: 'var(--orange)',
		severe: 'var(--wine)'
	};
	function sssBand(score: number) {
		if (score <= 75) return { label: 'Remission', tone: 'mild', desc: 'Your symptoms are currently in the remission range.' };
		if (score <= 175) return { label: 'Mild IBS', tone: 'mild', desc: 'Your symptoms are present but relatively mild on the clinical scale.' };
		if (score <= 300) return { label: 'Moderate IBS', tone: 'moderate', desc: 'Your symptoms sit in the moderate range — this is where the protocol tends to show the clearest signal.' };
		return { label: 'Severe IBS', tone: 'severe', desc: 'Your symptoms are in the severe range. The protocol may help, and a clinician should also be in the loop.' };
	}

	// ── {name} / {responder_type_name} interpolation ───────────────────────
	function interp(s: string): string {
		const name = answers.name || '';
		const typeName = responderType?.name || '';
		return s.replace(/\{name\}/g, name).replace(/\{responder_type_name\}/g, typeName);
	}

	// SVG y-coordinate for a score value in the projection chart (0-500 → 140-30)
	function projY(score: number): number {
		return 140 - (Math.min(500, Math.max(0, score)) / 500) * 110;
	}

	// ── Responder type mapping (Noom #6) ──────────────────────────────────
	const RESPONDER_TYPES = {
		analytical: { id:'analytical', name:'Analytical Responder', title:"You're an Analytical Responder.", body:"You trust evidence over hype — and you're in the right place. The part that matters: skepticism doesn't weaken the effect. Harvard's results held even for people who doubted it going in." },
		open: { id:'open', name:'Open Rebuilder', title:"You're an Open Rebuilder.", body:"You're ready to take an active role in your own health — the single biggest predictor of getting the most out of this. You treat tools like tools." },
		cautious: { id:'cautious', name:'Cautious Starter', title:"You're a Cautious Starter.", body:"You're understandably guarded after everything you've tried. Good news: this asks for openness, not certainty — and people who start cautious often surprise themselves." }
	};

	function computeResponderType(a: Record<string, any>) {
		// rs_* are individual semantic sliders: 0-4 where 0=strongly left, 4=strongly right
		const rs = (id: string) => { const v = Number(a[id]); return Number.isFinite(v) ? v : 2; };
		// openness: rs_open low (open) + rs_curious low (curious) + rs_active low (active)
		const openness = ((4 - rs('rs_open')) + (4 - rs('rs_curious')) + (4 - rs('rs_active'))) / 12 * 100;
		// proof/conventional lean: rs_open high (conventional) + rs_proof low (research-trusting)
		const proof = (rs('rs_open') + (4 - rs('rs_proof'))) / 8 * 100;
		// readiness: commitment radio (first = high)
		const commitIdx = a.commitment ? (SCREENS.find((x) => x.id === 'commitment')?.options || []).indexOf(a.commitment) : -1;
		const readiness = commitIdx >= 0 ? Math.round(((3 - commitIdx) / 3) * 100) : 50;

		if (readiness < 40) return RESPONDER_TYPES.cautious;
		if (openness > proof + 10) return RESPONDER_TYPES.open;
		return RESPONDER_TYPES.analytical;
	}

	// ── Projection (Noom #5 — the improving prediction) ───────────────────
	// Based on Kaptchuk 2021: IBS-SSS fell ~292→184 (~37%); 59-73% of responders improved.
	// Generic range 25-40%; type-adjusted: Open 35-40%, Analytical 30-37%, Cautious 25-32%.
	function projection(score: number, typeId: string) {
		const ranges: Record<string, [number, number]> = {
			open: [35, 40], analytical: [30, 37], cautious: [25, 32]
		};
		const [lo, hi] = ranges[typeId] ?? [25, 40];
		return {
			low: Math.round(score * (1 - hi / 100)),
			high: Math.round(score * (1 - lo / 100)),
			pctLow: lo,
			pctHigh: hi
		};
	}

	// ── Reactive state ─────────────────────────────────────────────────────
	let idx      = $state(0);
	let answers  = $state<Record<string, any>>({});
	let touched  = $state<Record<string, boolean>>({});
	let uid      = $state('');

	// Per-screen local state (synced when idx changes)
	let multiSel   = $state<string[]>([]);
	let sliderVal  = $state(50);
	let scaleAns   = $state<Record<number,number>>({});
	let emailVal   = $state('');
	let consentVal = $state(false);
	let nameVal    = $state('');
	let lessonAns  = $state(-1);
	let lessonRevealed = $state(false);
	let semanticVal = $state(2);
	let semanticAns = $state<Record<number,number>>({});
	let targetVal = $state(0);

	// Loader
	const LOADER_MS = 7000; // ~7s total
	let loaderPct        = $state(0);
	let loaderStates     = $state<('pending'|'active'|'done')[]>([]);
	let submitLoading    = $state(false);

	// ── Derived ────────────────────────────────────────────────────────────
	let screen     = $derived(SCREENS[idx]);
	let canGoBack  = $derived(idx > 0 && screen.type !== 'loader');
	let sliderMax  = $derived(screen.days ? 10 : 100);

	// Verdict: IBS-SSS score, band, editorial marker, count-up
	let sssScore     = $derived(computeSssScore(answers));
	let sssBandOut   = $derived(sssBand(sssScore));
	let markerPct    = $derived(Math.min(100, (Math.min(500, sssScore) / 500) * 100));
	let chargeColor  = $derived(BAND_CHARGE[sssBandOut.tone] ?? 'var(--accent)');
	let scoreState   = $state(0);
	let markerState  = $state(0);

	// Responder type + projection (Noom #5/#6)
	let responderType = $derived(computeResponderType(answers));
	let projOut       = $derived(projection(sssScore, responderType?.id ?? 'analytical'));
	// Generic projection (25-40%) shown before the type improvement
	let projGeneric   = $derived(projection(sssScore, 'cautious')); // 25-32% = the conservative generic

	// Verdict: fit verdict + answer recap (interpolated from real answers)
	let fitResult    = $derived(computeFit(answers));
	let verdictRecap = $derived.by(() => {
		const dur = answers.duration ?? 'a while';
		const triedCount = Array.isArray(answers.tried) ? answers.tried.length : 0;
		const cost = answers.cost ?? 'an unknown amount';
		return `You've dealt with this for ${dur}, tried ${triedCount} things, and spent roughly ${cost}.`;
	});

	// Non-linear progress: faster early, slower late
	let rawProgress = $derived((idx + 1) / SCREENS.length);
	let progress    = $derived(Math.round(Math.pow(rawProgress, 0.7) * 100));

	// Section milestone label + "building your profile" chips
	const sectionOrder = $derived.by(() => {
		const seen: string[] = [];
		SCREENS.forEach((s) => { if (s.tag && !seen.includes(s.tag)) seen.push(s.tag); });
		return seen;
	});
	function sectionMeta() {
		const current = screen.tag ?? '';
		if (!current) return { current: '', pos: 0, total: 0 };
		const pos = sectionOrder.indexOf(current);
		const total = sectionOrder.length;
		return { current, pos: pos >= 0 ? pos + 1 : 0, total };
	}

	// Profile-building chips: which sections are complete (have any answer)
	const SECTIONS_TRACKED = ['Your symptoms', 'Your history', 'Your profile', 'Safety check'];
	let sectionDone = $derived.by(() => {
		const done: Record<string, boolean> = {};
		const seenTags = new Set<string>();
		for (let i = 0; i < idx && i < SCREENS.length; i++) {
			const t = SCREENS[i].tag;
			if (t && SECTIONS_TRACKED.includes(t)) seenTags.add(t);
		}
		SECTIONS_TRACKED.forEach((t) => { done[t] = seenTags.has(t); });
		return done;
	});

	let footEnabled = $derived(
		screen.type === 'multi'  ? multiSel.length > 0 :
		screen.type === 'email'  ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim()) && consentVal :
		screen.type === 'text'   ? nameVal.trim().length >= 1 :
		screen.type === 'semantic' ? (screen.requiresInteraction ? !!touched[screen.id] : true) :
		screen.type === 'lesson' ? lessonRevealed :
		screen.type === 'target' ? !!touched[screen.id] :
		screen.type === 'projection' ? true :
		screen.type === 'relate' ? !!answers[screen.id] :
		screen.type === 'slider' ? (screen.requiresInteraction ? !!touched[screen.id] : true) :
		true
	);

	// matrixAlarmLevel still computed for the results page payload (see submitEmail)

	// ── Persist on every state change ──────────────────────────────────────
	$effect(() => {
		const snap = { index: idx, answers, touched };
		try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snap)); } catch {}
	});

	// ── Sync per-screen state when screen changes ──────────────────────────
	$effect(() => {
		const s = SCREENS[idx];
		const saved = answers[s.id];
		if (s.type === 'multi')   { multiSel  = Array.isArray(saved) ? [...saved] : []; }
		if (s.type === 'slider')  { sliderVal = typeof saved === 'number' ? saved : (s.days ? 5 : 50); }
		if (s.type === 'scale')   { scaleAns  = (saved && typeof saved === 'object' && !Array.isArray(saved)) ? { ...saved } : {}; }
		if (s.type === 'email')   { emailVal  = saved?.email ?? ''; consentVal = saved?.consent ?? false; }
		if (s.type === 'text')    { nameVal   = typeof saved === 'string' ? saved : ''; }
		if (s.type === 'lesson')  { lessonAns = typeof saved === 'number' ? saved : -1; lessonRevealed = typeof saved === 'number'; }
		if (s.type === 'semantic') { semanticVal = typeof saved === 'number' ? saved : 2; }
		if (s.type === 'target')  { targetVal = typeof saved === 'number' ? saved : Math.round(sssScore * 0.67); }
	});

	// ── Verdict: count-up number + marker slide to real score ─────────────
	$effect(() => {
		if (screen.id !== 'verdict') return;
		scoreState = 0;
		markerState = 0;
		const dur = 1000;
		const start = performance.now();
		let raf = 0;
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / dur);
			const eased = 1 - Math.pow(1 - t, 3);
			scoreState = Math.round(sssScore * eased);
			markerState = markerPct * eased;
			if (t < 1) raf = requestAnimationFrame(tick);
			else { scoreState = sssScore; markerState = markerPct; }
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	});

	// ── Loader animation + auto-advance ───────────────────────────────────
	$effect(() => {
		if (screen.type !== 'loader') return;
		const lines = screen.lines as string[];
		const perLine = LOADER_MS / lines.length;

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
				touched = saved.touched || {};
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
		track('quiz_screen', { uid, i, type: SCREENS[i].type, id: SCREENS[i].id });
	}
	function next() { go(idx + 1); }
	function back() { go(idx - 1); }
	function reset() { answers = {}; touched = {}; idx = 0; localStorage.removeItem(STORAGE_KEY); }

	// ── Answer handlers ────────────────────────────────────────────────────
	function chooseSingle(opt: string) {
		answers = { ...answers, [screen.id]: opt };
		if (idx >= SCREENS.length - 1) { setTimeout(finishQuiz, 240); return; }
		setTimeout(next, 240);
	}

	function toggleMulti(opt: string) {
		const sel = [...multiSel];
		const i = sel.indexOf(opt);
		if (i >= 0) sel.splice(i, 1); else sel.push(opt);
		multiSel = sel;
		answers = { ...answers, [screen.id]: sel };
	}

	function onSlider(e: Event) {
		const v = parseInt((e.target as HTMLInputElement).value, 10);
		sliderVal = v;
		answers = { ...answers, [screen.id]: v };
		touched = { ...touched, [screen.id]: true };
	}

	function setScale(stmtIdx: number, val: number) {
		scaleAns = { ...scaleAns, [stmtIdx]: val };
		answers = { ...answers, [screen.id]: scaleAns };
	}

	function submitName() {
		if (!footEnabled) return;
		answers = { ...answers, [screen.id]: nameVal.trim() };
		next();
	}

	function chooseLesson(optIdx: number) {
		if (lessonRevealed) return;
		lessonAns = optIdx;
		answers = { ...answers, [screen.id]: optIdx };
		lessonRevealed = true;
	}

	function onSemantic(e: Event) {
		const v = parseInt((e.target as HTMLInputElement).value, 10);
		semanticVal = v;
		answers = { ...answers, [screen.id]: v };
		touched = { ...touched, [screen.id]: true };
	}

	function onTarget(e: Event) {
		const v = parseInt((e.target as HTMLInputElement).value, 10);
		targetVal = v;
		answers = { ...answers, [screen.id]: v };
		touched = { ...touched, [screen.id]: true };
	}

	function chooseRelate(opt: string) {
		answers = { ...answers, [screen.id]: opt };
		setTimeout(next, 240);
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
		answers = { ...answers, [screen.id]: { email, consent: consentVal } };

		// Cache the email + partial results (full payload cached at finishQuiz)
		track('quiz_email_captured', { uid, email, sss: computeSssScore(answers) });
		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({ event: 'quiz_email_captured', user_id: uid, email });
		submitLoading = false;
		next();
	}

	function finishQuiz() {
		// Compute and cache the final results payload for the results page
		const email = answers.email?.email ?? '';
		const sss = computeSssScore(answers);
		const alarmLevel = matrixAlarmLevel(answers);
		const fit = computeFit(answers);
		const safety = getAnswer('safety');
		const rType = computeResponderType(answers);
		const proj = projection(sss, rType?.id ?? 'analytical');
		const target = answers.target_set ?? null;
		const behaviorCommit = answers.behavior_commit ?? null;
		const futureEvent = answers.future_event ?? null;
		const results = { uid, email, sss, alarmLevel, fit, safety, answers, responderType: rType, projection: proj, target, behaviorCommit, futureEvent };
		try { localStorage.setItem(RESULTS_KEY, JSON.stringify(results)); } catch {}

		track('quiz_completed', { uid, email, sss, fit_score: fit.score, responder_type: rType?.id });
		const w = window as any;
		w.dataLayer = w.dataLayer || [];
		w.dataLayer.push({ event: 'quiz_complete', user_id: uid, email, sss });
		localStorage.removeItem(STORAGE_KEY);
		setTimeout(() => { window.location.href = '/quiz/ibs/results'; }, 240);
	}

	function computeFit(a: Record<string, any>) {
		// Normalize 0-100 sliders (higher = stronger fit)
		const s = (id: string) => Number(a[id]) || 0;
		// Radio map: first option = strongest fit (index 0), last = weakest
		const r = (id: string, len: number) => {
			const v = a[id];
			const i = v ? (Array.isArray(v) ? -1 : (SCREENS.find((x) => x.id === id)?.options || []).indexOf(v)) : -1;
			return i >= 0 ? Math.round(((len - 1 - i) / (len - 1)) * 100) : 50;
		};

		// rs_* individual semantic sliders: 0-4 where 0=strongly left (responder traits)
		const rs = (id: string) => { const v = Number(a[id]); return Number.isFinite(v) ? v : 2; };
		const rsScore = Math.round(((4 - rs('rs_open')) + (4 - rs('rs_curious')) + (4 - rs('rs_active')) + (4 - rs('rs_proof'))) / 16 * 100);

		const commitment = r('commitment', 4);

		const score = Math.round(
			rsScore * 0.85 +
			commitment * 0.15
		);
		let verdict: string;
		if (score >= 72) verdict = 'Strong fit';
		else if (score >= 55) verdict = 'Good fit';
		else if (score >= 40) verdict = 'Moderate fit';
		else verdict = 'Likely not a fit';
		return { score, verdict };
	}

	function continueScreen() {
		if (screen.type === 'email') { submitEmail(); return; }
		if (screen.type === 'text') { submitName(); return; }
		if (screen.id === 'projection_2') { finishQuiz(); return; }
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

<div class="funnel">

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
			<span class="qstep">
				{#if sectionMeta().total > 0}
					Section {sectionMeta().pos} of {sectionMeta().total} · {sectionMeta().current}
				{:else}
					{screen.tag ?? ''}
				{/if}
			</span>
		</div>
		{#if Object.values(sectionDone).some((d) => d)}
			<div class="qchips" aria-hidden="true">
				{#each SECTIONS_TRACKED as sect, i (sect)}
					<span class="qchip" class:done={sectionDone[sect]}>
						{#if sectionDone[sect]}✓{/if}
						{['Symptoms','History','Profile','Safety'][i]}
					</span>
				{/each}
			</div>
		{/if}
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
					{#if screen.bullets}
						<ul class="qbullets">
							{#each screen.bullets as b (b)}<li>{b}</li>{/each}
						</ul>
					{/if}
					<div class="q-options">
						{#each screen.options as opt (opt)}
							{@const chosen = answers[screen.id] === opt}
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
					{#if screen.id === 'how_heard'}
						<button class="qskip" type="button" onclick={finishQuiz}>Skip →</button>
					{/if}

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
						{#if screen.requiresInteraction && !touched[screen.id]}
							<p class="qslider-hint">Drag the slider to continue</p>
						{/if}
					</div>

				<!-- ── TEXT (name) ─────────────────────────────── -->
				{:else if screen.type === 'text'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					<div class="qtext-form">
						<input
							class="qfield"
							type="text"
							autocomplete="given-name"
							placeholder="Your first name"
							bind:value={nameVal}
							onkeydown={(e) => { if (e.key === 'Enter' && footEnabled) submitName(); }}
						/>
					</div>

				<!-- ── MINI-LESSON ─────────────────────────────── -->
				{:else if screen.type === 'lesson'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if !lessonRevealed}
						<div class="q-options qlesson-opts">
							{#each screen.options as opt, oi (opt)}
								<button
									class="q-opt"
									class:chosen={lessonAns === oi}
									type="button"
									onclick={() => chooseLesson(oi)}
								>
									<span class="lbl">{opt}</span>
									<span class="chev">→</span>
								</button>
							{/each}
						</div>
					{:else}
						<div class="qlesson-reveal">
							<p class="qlesson-title">{lessonAns === screen.correct ? screen.reveal_title_correct : screen.reveal_title_wrong}</p>
							<p class="qlesson-text">{screen.reveal}</p>
						</div>
					{/if}

				<!-- ── SEMANTIC SLIDER ─────────────────────────── -->
				{:else if screen.type === 'semantic'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					<div class="qsemantic">
						<div class="qsemantic-labels">
							<span class="sem-left">{screen.leftLabel}</span>
							<span class="sem-right">{screen.rightLabel}</span>
						</div>
						<input
							type="range" class="qrange sem-range"
							min="0" max="4" step="1"
							value={semanticVal}
							style="--fill:{(semanticVal / 4 * 100)}%"
							oninput={onSemantic}
						/>
						{#if screen.requiresInteraction && !touched[screen.id]}
							<p class="qslider-hint">Drag toward your answer</p>
						{/if}
					</div>

				<!-- ── TARGET (goal slider) ────────────────────── -->
				{:else if screen.type === 'target'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.sub}<p class="qsub">{screen.sub}</p>{/if}
					<div class="qslider-wrap">
						<div class="qslider-bubble">
							<span class="reading">Target: {targetVal}</span>
						</div>
						<input
							type="range" class="qrange"
							min="0" max={Math.max(1, sssScore)} step="1"
							value={targetVal}
							style="--fill:{(targetVal / Math.max(1, sssScore) * 100)}%"
							oninput={onTarget}
						/>
						<div class="qends">
							<span>0 (cured)</span>
							<span>Today ({sssScore})</span>
						</div>
						{#if !touched[screen.id]}
							<p class="qslider-hint">Drag to set your target</p>
						{/if}
					</div>

				<!-- ── RELATE CARD ─────────────────────────────── -->
				{:else if screen.type === 'relate'}
					{#if screen.illu}<div class="qillu qillu-{screen.illu}">[ illustration · {screen.illu} ]</div>{/if}
					<p class="q-kick qinfo-eyebrow">Does this sound like you?</p>
					<h1 class="qh qrelate-title">{screen.title}</h1>
					<div class="q-options">
						<button class="q-opt" type="button" onclick={() => chooseRelate("Yes, that's me")}>
							<span class="lbl">Yes, that's me</span>
							<span class="chev">→</span>
						</button>
						<button class="q-opt" type="button" onclick={() => chooseRelate('Not really')}>
							<span class="lbl">Not really</span>
							<span class="chev">→</span>
						</button>
					</div>

				<!-- ── PROJECTION ──────────────────────────────── -->
				{:else if screen.type === 'projection'}
					<div class="qinfo">
						{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
						<h1 class="qh">{interp(screen.title)}</h1>
						{#if screen.illu}<div class="qillu qillu-{screen.illu}">[ illustration · {screen.illu} ]</div>{/if}
						<div class="qproj-chart">
							<svg viewBox="0 0 300 160" class="proj-svg">
								<line x1="30" y1="140" x2="280" y2="140" stroke="var(--ink)" stroke-width="2"/>
								<line x1="30" y1="20" x2="30" y2="140" stroke="var(--ink)" stroke-width="2"/>
								<line x1="30" y1={projY(sssScore)} x2="30" y2="140" stroke="var(--accent)" stroke-width="3" opacity="0.3"/>
								{#if screen.id === 'projection_2'}
									{@const endY = projY(projOut.high)}
									{@const midY = projY((sssScore + projOut.high) / 2)}
									<path d="M 30 {projY(sssScore)} Q 155 {midY} 280 {endY}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
									<path d="M 30 {projY(sssScore)} Q 155 {midY} 280 {endY} L 280 140 L 30 140 Z" fill="var(--accent-tint)" opacity="0.4"/>
									<circle cx="280" cy={endY} r="6" fill="var(--accent)"/>
									<text x="280" y={endY - 12} text-anchor="middle" font-size="13" font-weight="800" fill="var(--accent-deep)">{projOut.high}</text>
								{:else}
									{@const endY = projY(projGeneric.high)}
									{@const midY = projY((sssScore + projGeneric.high) / 2)}
									<path d="M 30 {projY(sssScore)} Q 155 {midY} 280 {endY}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
									<path d="M 30 {projY(sssScore)} Q 155 {midY} 280 {endY} L 280 140 L 30 140 Z" fill="var(--accent-tint)" opacity="0.4"/>
									<circle cx="280" cy={endY} r="6" fill="var(--accent)"/>
									<text x="280" y={endY - 12} text-anchor="middle" font-size="13" font-weight="800" fill="var(--accent-deep)">{projGeneric.high}</text>
								{/if}
								<circle cx="30" cy={projY(sssScore)} r="6" fill="var(--ink)"/>
								<text x="30" y={projY(sssScore) - 12} text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">{sssScore}</text>
								<text x="30" y="155" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink-soft)">Today</text>
								<text x="280" y="155" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink-soft)">Day 14</text>
							</svg>
						</div>
						{#if screen.id === 'projection_2'}
							<p class="qsub">Because you're {responderType.name} and you've committed to your {answers.behavior_commit ?? 'daily'} ritual, your projection shifted toward the higher end of what responders see.</p>
						{:else}
							<p class="qsub">Based on average improvement in responders, we project your score could fall from {sssScore} to around {projGeneric.high} in two weeks.</p>
						{/if}
						<p class="qproj-disclaim">A projection from published research, not a guarantee. Individual results vary.</p>
					</div>

				<!-- ── TYPE REVEAL ─────────────────────────────── -->
				{:else if screen.type === 'type-reveal'}
					<div class="qinfo">
						{#if screen.illu}<div class="qillu qillu-{screen.illu}">[ illustration · {screen.illu} ]</div>{/if}
						<p class="q-kick qinfo-eyebrow">{screen.kick}</p>
						<div class="type-stamp" style="--charge:{chargeColor}">
							<span class="type-name">{responderType.name}</span>
						</div>
						<h1 class="qh qtype-title">{interp(responderType.title)}</h1>
						<p class="qsub">{interp(responderType.body)}</p>
					</div>

				<!-- ── INFO / REVEAL ──────────────────────────── -->
				{:else if screen.type === 'info'}
					<div class="qinfo">
						{#if screen.illu && !screen.scorecard}
							<div class="qillu qillu-{screen.illu}">[ illustration · {screen.illu} ]</div>
						{/if}
						{#if screen.face}
							<img class="qface" src="/assets/face.webp" alt="" />
						{:else if screen.glyph}
							<div class="qglyph">{screen.glyph}</div>
						{/if}
					{#if screen.kick}<p class="q-kick qinfo-eyebrow">{interp(screen.kick)}</p>{/if}
					{#if screen.scorecard}
						<div class="qscore" style="--charge:{chargeColor}">
							<div class="score-card">
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
								<div class="band-stamp band-{sssBandOut.tone}">{sssBandOut.label}</div>
							</div>
							<h1 class="qh qscore-headline">Your IBS Severity Score is {sssScore}.</h1>
							{#if screen.verdict}
								<p class="qscore-recap">{verdictRecap}</p>
								<div class="qproj">
									<p class="qproj-generic">Responders typically see this score drop 25–40% over the 14-day protocol.</p>
									<p class="qproj-improved">As {responderType.name}, you're projected toward the higher end — a drop of {projOut.pctLow}–{projOut.pctHigh}%.</p>
									<p class="qproj-range">That puts you around <strong>{projOut.high}–{projOut.low}</strong> after 14 days.</p>
									<p class="qproj-disclaim">Projection based on average improvement in responders in published research. Individual results vary and aren't guaranteed.</p>
								</div>
							{/if}
						</div>
						{#if screen.cite}<p class="qcite">{screen.cite}</p>{/if}
					{:else}
						<h1 class="qh">{interp(screen.title)}</h1>
						{#if screen.sub}<p class="qsub">{interp(screen.sub)}</p>{/if}
					{/if}

						{#if screen.stat}
							<div class="qstat">{screen.stat}</div>
							<p class="qstat-cap">{screen.statCap ?? ''}</p>
						{/if}

						{#if screen.bars}
							<div class="qbars">
								{#each screen.bars as bar (bar.label)}
									<div class="qbar-row">
										<span class="qbar-label">{bar.label}</span>
										<div class="qbar-track"><div class="qbar-fill" style="width:{bar.value}%"></div></div>
										<span class="qbar-val">{bar.value}%</span>
									</div>
								{/each}
							</div>
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

						{#if screen.link}
							<a class="qlink" href={screen.link.url} target="_blank" rel="noopener noreferrer">{screen.link.label}</a>
						{/if}

					{#if screen.harvard}
						<div class="qharvard"><img src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" /></div>
					{/if}

					{#if screen.cite}
						<p class="qcite">{screen.cite}</p>
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
						<h1 class="qh">{interp(screen.title)}</h1>
						<p class="qsub">{interp(screen.sub)}</p>
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
						<div class="qlock">No spam. Your assessment stays private.</div>
					</div>
				{/if}

			</div><!-- /.qscreen -->
		</div><!-- /.qwrap -->
		{/key}
	</main>

	<!-- ── Footer CTA ──────────────────────────────────────── -->
	{#if screen.type !== 'single' && screen.type !== 'loader'}
		<footer class="qfoot">
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
	font-family: var(--ff);
}

/* ── Top bar ──────────────────────────────────────────── */
.qtop { position: relative; z-index: 5; }
.qprog { height: 5px; background: rgba(20,19,15,.10); width: 100%; overflow: hidden; }
.qprog > i { display:block; height:100%; width:0%; background:var(--accent); border-radius:0 99px 99px 0; transition:width .55s cubic-bezier(.2,.8,.2,1); }

.qchips { display:flex; gap:6px; justify-content:center; padding:4px clamp(16px,4vw,30px) 0; flex-wrap:wrap; }
.qchip { font-size:10px; font-weight:800; letter-spacing:.06em; text-transform:uppercase; color:var(--ink-soft); opacity:.45; display:inline-flex; align-items:center; gap:4px; padding:2px 8px; border-radius:999px; background:var(--card); border:1px solid var(--line); transition:.3s; }
.qchip.done { color:var(--green-ok); border-color:rgba(46,158,107,.3); opacity:1; background:rgba(46,158,107,.08); }

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
.qstep { font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; opacity:.55; text-align:right; line-height:1.25; max-width:46%; }

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
.q-kick::before { content:""; width:22px; height:2px; background:currentColor; display:inline-block; }
.qh { font-size:clamp(26px,4.2vw,38px); font-weight:800; line-height:1.05; letter-spacing:-0.025em; margin:0; }
.qsub { font-size:clamp(16px,1.7vw,18px); color:var(--ink-soft); line-height:1.5; margin:14px 0 0; }
.qhint { font-size:13px; font-weight:700; color:var(--ink-soft); margin:10px 0 0; opacity:.85; }

/* ── Bullets (used on safety radio) ───────────────────── */
.qbullets { list-style:none; margin:18px 0 0; padding:0; display:grid; gap:10px; }
.qbullets li { position:relative; padding-left:22px; font-size:14.5px; color:var(--ink-soft); line-height:1.45; }
.qbullets li::before { content:"•"; position:absolute; left:0; color:var(--accent); font-weight:900; font-size:18px; line-height:1; }

/* ── Options (single / multi) ─────────────────────────── */
.q-options { display:grid; gap:11px; margin-top:26px; }
.q-opt {
	display:flex; align-items:center; gap:14px; width:100%; text-align:left; cursor:pointer;
	background:#fff; border:2px solid var(--line); border-radius:15px;
	padding:16px 18px; font-family:var(--ff); font-size:16.5px; font-weight:700; color:var(--ink);
	transition:border-color .15s, background .15s, transform .08s, box-shadow .15s;
}
.q-opt:hover { border-color:var(--accent); background:var(--accent-tint); }
.q-opt:active { transform:scale(.99); }
.q-opt .lbl { flex:1; }
.q-opt .chev { color:var(--accent-deep); font-weight:900; opacity:0; transform:translateX(-6px); transition:.15s; }
.q-opt:hover .chev { opacity:1; transform:none; }
.q-opt.chosen { border-color:var(--accent); background:var(--accent-tint); box-shadow:0 0 0 3px var(--accent-tint); }
.q-opt .box { flex:none; width:24px; height:24px; border-radius:8px; border:2px solid var(--line); display:grid; place-items:center; font-size:14px; font-weight:900; color:#fff; background:#fff; transition:.14s; }
.q-opt .box span { opacity:0; transform:scale(.4); transition:.14s; }
.q-opt.selected { border-color:var(--accent); background:var(--accent-tint); box-shadow:var(--shadow-sm); }
.q-opt.selected .box { background:var(--accent); border-color:var(--accent); }
.q-opt.selected .box span { opacity:1; transform:none; }
.qskip { display:block; margin:18px auto 0; background:none; border:0; cursor:pointer; font-family:var(--ff); font-weight:800; font-size:14px; color:var(--ink-soft); text-decoration:underline; text-underline-offset:3px; }
.qskip:hover { color:var(--ink); }

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
.qrange {
	-webkit-appearance:none; appearance:none; width:100%; height:10px; border-radius:999px;
	background:linear-gradient(90deg, var(--accent) var(--fill,50%), var(--line) var(--fill,50%));
	outline:none; cursor:pointer;
}
.qrange::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:34px; height:34px; border-radius:50%; background:#fff; border:4px solid var(--accent); box-shadow:var(--shadow-md); cursor:grab; }
.qrange::-moz-range-thumb { width:34px; height:34px; border-radius:50%; background:#fff; border:4px solid var(--accent); box-shadow:var(--shadow-md); cursor:grab; }
.qends { display:flex; justify-content:space-between; gap:16px; margin-top:16px; }
.qends span { font-size:13.5px; font-weight:700; color:var(--ink-soft); max-width:44%; line-height:1.3; }
.qends span:last-child { text-align:right; }
.qslider-hint { text-align:center; font-size:12.5px; font-weight:700; color:var(--accent-deep); margin:14px 0 0; }

/* ── Footer ───────────────────────────────────────────── */
.qfoot { padding:14px clamp(16px,4vw,30px) calc(18px + env(safe-area-inset-bottom)); }
.qfoot-inner { max-width:600px; margin:0 auto; }
.qcontinue { width:100%; }
.qcontinue:disabled { opacity:.4; cursor:not-allowed; box-shadow:0 6px 0 var(--accent-deep); transform:none; }
.qfoot-note { text-align:center; font-size:12.5px; font-weight:600; color:var(--ink-soft); margin:10px 0 0; }

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

.qface { width:78px; margin:0 auto 20px; display:block; }

/* product image inside reveal */
.qproduct { border-radius:var(--radius-lg); overflow:hidden; box-shadow:var(--shadow-lg); margin:0 auto 6px; max-width:300px; aspect-ratio:4/5; background:#ddd; }
.qproduct img { width:100%; height:100%; object-fit:cover; }

.qstat { font-size:clamp(58px,12vw,92px); font-weight:900; letter-spacing:-0.04em; line-height:.92; color:var(--accent-deep); margin:4px 0 4px; }
.qstat-cap { font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-soft); }

/* Harvard credibility mark */
.qharvard { margin:18px auto 4px; max-width:220px; }
.qharvard img { width:100%; height:auto; display:block; opacity:.82; }

/* simple bar chart for info screens */
.qbars { display:grid; gap:12px; max-width:360px; margin:22px auto 0; text-align:left; }
.qbar-row { display:grid; grid-template-columns:90px 1fr 44px; align-items:center; gap:12px; }
.qbar-label { font-size:13px; font-weight:800; color:var(--ink-soft); }
.qbar-track { height:12px; background:var(--line); border-radius:999px; overflow:hidden; }
.qbar-fill { height:100%; background:var(--accent); border-radius:999px; }
.qbar-row:last-child .qbar-fill { background:var(--ink-soft); opacity:.55; }
.qbar-val { font-size:13px; font-weight:800; text-align:right; }

/* ── Verdict climax scorecard — editorial (§8.2) ─────────────────────── */
.qscore { margin-top:6px; }
.score-card {
	background: var(--card);
	border: var(--frame-bw) solid var(--frame-ink);
	border-radius: var(--frame-radius-lg);
	box-shadow: var(--frame-shadow);
	padding: clamp(24px,5vw,36px) clamp(20px,4vw,32px) clamp(22px,4vw,30px);
	text-align: center;
}
.qscore .score-num {
	display:block;
	font-family: var(--ff);
	font-size: clamp(78px,18vw,116px);
	font-weight: 900;
	letter-spacing: -0.05em;
	line-height: .9;
	color: var(--ink);
	font-variant-numeric: tabular-nums;
}
.qscore .score-of {
	display:block;
	font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase;
	color:var(--ink-soft); margin-top:6px;
}
.score-scale { position:relative; margin:24px auto 6px; max-width:340px; }
.score-scale-bar { display:flex; height:10px; border:2px solid var(--ink); border-radius:6px; overflow:hidden; }
.band-seg { flex:1; }
.band-seg.band-mild { background:rgba(46,158,107,.22); }
.band-seg.band-moderate { background:rgba(242,144,30,.22); border-left:2px solid var(--ink); }
.band-seg.band-severe { background:rgba(138,36,51,.20); border-left:2px solid var(--ink); }
.score-marker {
	position:absolute; top:-6px; width:0; height:0;
	border-left:11px solid transparent; border-right:11px solid transparent;
	border-top:14px solid var(--charge, var(--accent));
	transform:translateX(-50%); transition:left 1s cubic-bezier(.2,.8,.2,1);
	filter:drop-shadow(0 2px 2px rgba(20,19,15,.25));
}
.score-scale-labels { display:flex; justify-content:space-between; margin-top:12px; }
.score-scale-labels span { font-size:10.5px; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--ink-soft); }
.score-scale-labels span:nth-child(1) { flex:0 0 35%; text-align:left; }
.score-scale-labels span:nth-child(2) { flex:0 0 30%; text-align:center; }
.score-scale-labels span:nth-child(3) { flex:0 0 35%; text-align:right; }
.qscore .band-stamp {
	display:inline-block; margin:18px auto 0;
	font-size:13px; font-weight:900; letter-spacing:.14em; text-transform:uppercase;
	padding:8px 18px; border:2px solid var(--ink); border-radius:6px;
	transform:rotate(-1.5deg); box-shadow:3px 3px 0 var(--frame-ink);
}
.qscore .band-stamp.band-mild { color:#1f5c3e; background:#e3f1e9; border-color:#1f5c3e; box-shadow:3px 3px 0 #1f5c3e; }
.qscore .band-stamp.band-moderate { color:var(--orange-deep); background:var(--orange-tint); border-color:var(--orange-deep); box-shadow:3px 3px 0 var(--orange-deep); }
.qscore .band-stamp.band-severe { color:var(--wine); background:#f4dde1; border-color:var(--wine); box-shadow:3px 3px 0 var(--wine); }
.qinfo .qscore-headline { font-size:clamp(24px,3.6vw,32px); margin:18px 0 0; }
.qscore-fitline { font-size:18px; font-weight:800; color:var(--charge, var(--accent)); margin:16px 0 0; }
.qscore-recap { font-size:15.5px; font-weight:600; color:var(--ink-soft); line-height:1.55; margin:12px auto 0; max-width:42ch; }
.qscore-lossline { font-size:15.5px; font-weight:600; color:var(--ink-soft); line-height:1.55; margin:12px auto 0; max-width:42ch; font-style:italic; opacity:.82; }

/* gut-brain loop (cream: ink strokes, sky/terracotta accents) */
.gutbrain { display:grid; place-items:center; padding:18px; margin:8px auto 4px; }
.loop { position:relative; width:min(380px,100%); aspect-ratio:1.15/1; }
.node { position:absolute; width:120px; height:120px; border-radius:50%; display:grid; place-items:center; text-align:center; font-weight:800; font-size:14px; box-shadow:var(--frame-shadow-sm); border:2px solid var(--ink); }
.node small { display:block; font-size:10px; font-weight:700; letter-spacing:.1em; text-transform:uppercase; opacity:.7; }
.node--brain { top:0; left:50%; transform:translateX(-50%); background:var(--blue-tint); color:var(--ink); }
.node--gut { bottom:0; left:50%; transform:translateX(-50%); background:var(--orange-tint); color:var(--orange-deep); }
.loop .arc { position:absolute; inset:16px 64px; border:3px dashed rgba(20,19,15,.22); border-radius:50%; }
.loop .arc.b { border-color:var(--accent); border-style:solid; clip-path:inset(0 0 50% 0); opacity:.55; }
.pill-tag { position:absolute; top:50%; transform:translateY(-50%); background:var(--card); color:var(--ink); border:1.5px solid var(--ink); font-weight:800; font-size:11px; padding:5px 10px; border-radius:999px; white-space:nowrap; }
.pill-tag.l { left:-4px; }
.pill-tag.r { right:-4px; }

/* prose */
.qprose { text-align:left; margin-top:22px; }
.qprose p { font-size:17px; line-height:1.62; color:var(--ink-2); margin:0 0 16px; }
.qprose p :global(strong) { color:var(--ink); }

/* component list */
.qcomp { display:grid; gap:12px; margin:24px 0 4px; text-align:left; }
.qcomp-item { display:grid; grid-template-columns:46px 1fr; gap:15px; align-items:start; background:var(--card); border:1px solid var(--line-2); border-radius:14px; padding:17px 18px; box-shadow:var(--shadow-sm); }
.qcomp-item .ic { width:46px; height:46px; border-radius:13px; background:var(--accent-tint); color:var(--accent-deep); display:grid; place-items:center; font-size:22px; font-weight:900; }
.qcomp-item:nth-child(2) .ic { background:var(--orange-tint); color:var(--orange-deep); }
.qcomp-item:nth-child(3) .ic { background:#e3f1e9; color:var(--green-ok); }
.qcomp-item h3 { font-size:17px; margin:0 0 4px; }
.qcomp-item p { font-size:14.5px; line-height:1.45; color:var(--ink-soft); margin:0; }

/* honest callout */
.qhonest { text-align:left; background:var(--accent-tint); border-radius:var(--radius); padding:22px 24px; margin-top:22px; }
.qhonest .q { font-weight:800; font-size:16px; color:var(--accent-deep); margin:0 0 8px; }
.qhonest p { margin:0; font-size:15.5px; line-height:1.55; color:var(--ink-2); }

/* link + citation */
.qlink { display:inline-flex; align-items:center; gap:8px; font-weight:800; color:var(--accent-deep); text-decoration:none; border-bottom:2px solid var(--accent); padding-bottom:2px; margin-top:18px; }
.qlink:hover { opacity:.75; }
.qcite { font-size:12px; font-weight:700; color:var(--ink-soft); margin:16px 0 0; }

/* quote */
.qquote { text-align:left; background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius-lg); padding:clamp(22px,3vw,30px); box-shadow:var(--shadow-sm); margin-top:26px; }
.qquote .qm { font-size:46px; line-height:0; height:22px; color:var(--accent); font-weight:900; display:block; }
.qquote p { font-size:17px; line-height:1.55; color:var(--ink-2); margin:16px 0 18px; font-weight:500; }
.qquote .by { display:flex; align-items:center; gap:12px; }
.nm { font-weight:800; font-size:15px; }
.role { font-size:12.5px; color:var(--ink-soft); font-weight:600; }
.avatar { width:42px; height:42px; border-radius:50%; display:grid; place-items:center; color:#fff; font-weight:800; font-size:14px; flex:none; }

/* ── Loader (cream page: terracotta ring on ink-tint track) ──────────── */
.qloader { text-align:center; }
.loader-dial { position:relative; width:150px; height:150px; margin:0 auto 34px; }
.loader-dial svg { width:100%; height:100%; transform:rotate(-90deg); }
.lt { fill:none; stroke:rgba(20,19,15,.10); stroke-width:12; }
.lf { fill:none; stroke:var(--orange); stroke-width:12; stroke-linecap:round; stroke-dasharray:408; stroke-dashoffset:408; animation:loaderfill var(--loaddur,4s) linear forwards; }
@keyframes loaderfill { to { stroke-dashoffset:60; } }
.lpct { position:absolute; inset:0; display:grid; place-items:center; font-size:30px; font-weight:900; color:var(--ink); font-variant-numeric:tabular-nums; letter-spacing:-0.02em; }
.loader-lines { display:grid; gap:12px; max-width:360px; margin:0 auto; text-align:left; }
.loader-line { display:flex; align-items:center; gap:13px; font-size:16px; font-weight:700; color:var(--ink-soft); transition:color .35s; }
.loader-line .lck { flex:none; width:26px; height:26px; border-radius:50%; border:2px solid var(--line); display:grid; place-items:center; font-size:13px; font-weight:900; color:transparent; transition:.3s; }
.loader-line.active { color:var(--ink); }
.loader-line.done { color:var(--ink-2); }
.loader-line.done .lck { background:var(--orange); border-color:var(--orange); color:#fff; }
.loader-line.active .lck { border-color:var(--orange); }

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

/* ── Text (name) ──────────────────────────────────────── */
.qtext-form { margin-top:28px; }

/* ── Mini-lesson ──────────────────────────────────────── */
.qlesson-opts { margin-top:24px; }
.qlesson-reveal { background:var(--accent-tint); border-radius:var(--radius); padding:22px 24px; margin-top:24px; text-align:left; }
.qlesson-title { font-weight:800; font-size:17px; color:var(--accent-deep); margin:0 0 10px; }
.qlesson-text { font-size:16px; line-height:1.55; color:var(--ink-2); margin:0; }

/* ── Semantic slider ──────────────────────────────────── */
.qsemantic { margin-top:34px; }
.qsemantic-labels, .qsem-labels { display:flex; justify-content:space-between; gap:16px; margin-bottom:14px; }
.qsemantic-labels span, .qsem-labels span { font-size:14.5px; font-weight:700; line-height:1.3; max-width:46%; }
.qsemantic-labels .sem-left, .qsem-labels span:first-child { text-align:left; color:var(--ink); }
.qsemantic-labels .sem-right, .qsem-labels span:last-child { text-align:right; color:var(--ink-soft); }
.sem-range { margin-bottom:8px; }

/* ── Semantic group ───────────────────────────────────── */
.qsem-group { display:grid; gap:24px; margin-top:26px; }
.qsem-row { background:var(--card); border:2px solid var(--line); border-radius:16px; padding:18px; transition:border-color .2s; }
.qsem-row.answered { border-color:var(--accent); }

/* ── Type reveal ──────────────────────────────────────── */
.type-stamp { display:inline-block; margin:0 auto 22px; padding:12px 26px; border:2.5px solid var(--ink); border-radius:8px; transform:rotate(-2deg); box-shadow:5px 5px 0 var(--frame-ink); background:var(--paper-2); }
.type-name { font-size:clamp(20px,3.5vw,28px); font-weight:900; letter-spacing:-0.02em; color:var(--ink); }
.qtype-title { font-size:clamp(26px,4.2vw,38px); margin:6px 0 0; }

/* ── Illustration placeholders ────────────────────────── */
.qillu { margin:0 auto 22px; border:1.5px dashed var(--line); border-radius:var(--radius); background:var(--paper-2); display:grid; place-items:center; color:var(--ink-soft); font-size:11px; font-weight:700; letter-spacing:.06em; text-transform:uppercase; }
.qillu-hero { width:100%; max-width:520px; height:200px; }
.qillu-scene { width:100%; max-width:480px; height:140px; }
.qillu-chart { width:100%; max-width:480px; height:170px; }
.qillu-emblem { width:56px; height:56px; border-radius:50%; }
.qillu-spot { width:64px; height:64px; border-radius:50%; }

/* ── Relate card ──────────────────────────────────────── */
.qrelate-title { font-size:clamp(22px,3.6vw,30px); line-height:1.25; margin:14px 0 0; }

/* ── Projection chart ─────────────────────────────────── */
.qproj-chart { margin:24px auto; max-width:340px; }
.proj-svg { width:100%; height:auto; display:block; }
.qproj-disclaim { font-size:11.5px; font-weight:600; color:var(--ink-soft); line-height:1.45; margin:14px auto 0; opacity:.75; max-width:42ch; }

/* ── iOS / mobile optimization ───────────────────────────── */
@supports (height: 100dvh) {
	.funnel { height: 100dvh; }
}
</style>
