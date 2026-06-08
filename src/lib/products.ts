// ============================================================
// Copables product pages — per-condition PDP content.
// One ProductPage.svelte renders any of these. Copy is adapted
// per condition; the OLP-protocol mechanics are shared.
// ============================================================

export interface ScienceStat {
	big: string; // "2×"
	tone: 'blue' | 'orange';
	lbl: string;
	ctrlLabel: string;
	ctrl: number; // control bar height %
	olp: number; // OLP bar height %
	cap: string;
}

export interface Review {
	initials: string;
	color: string;
	name: string;
	date: string;
	stars: number; // 4 | 5
	title: string;
	body: string;
	tags: string; // space-separated: "5 skeptic ritual"
}

export interface Faq {
	cat?: string;
	q: string;
	a: string;
}

export interface ProductCondition {
	handle: string;
	name: string; // "IBS"
	no: string; // "N°2"
	cat: string; // "Gut–brain"
	accent: string;
	accentDeep: string;
	accentTint: string;
	bottle: string;
	title: string; // "The 14-Day IBS Protocol"
	sub: string;
	rating: string;
	reviewCount: string;
	offerMid: string; // offer strip middle line (HTML)
	benefits: string[];
	scienceHeadline: string;
	scienceBody: string[]; // HTML paragraphs
	stats: ScienceStat[]; // 2
	timeline: { title: string; bullets: string[] }[]; // 3
	reviews: Review[];
	faqIntro: string;
	faqs: Faq[];
	pairs: string[]; // handles of 3 cross-sells
	pairBlurb: string; // short cross-sell line shown on OTHER pages
	finalH: string;
	finalSub: string;
	metaTitle: string;
	metaDesc: string;
}

// ── Shared, condition-agnostic protocol content ───────────────
export const WHYWORKS = [
	{ ic: '⌕', h: 'Honest by design', p: 'An open-label placebo. We tell you exactly what it is — and it works anyway.' },
	{ ic: '◴', h: 'Conditioned response', p: 'A lifetime of "take medicine → feel better" trains a real, physical reflex.' },
	{ ic: '↻', h: 'Symptom-loop reset', p: 'The daily ritual interrupts the worry-amplifies-symptoms feedback loop.' },
	{ ic: '♥', h: 'Drug-free', p: 'No prescription, no elimination diet, no side-effect roulette to manage.' },
	{ ic: '✦', h: 'Guided every day', p: 'The app turns the science into one short, plain-English lesson a day.' },
	{ ic: '▦', h: 'Measurable', p: 'Validated symptom tracking shows what changes — week over week.' }
];

export const INSIDE = [
	{ ill: 'check', h: 'Honest gummy', p: 'An open-label placebo. The label tells the truth — that’s the point.' },
	{ ill: 'wave', h: 'Conditioned cue', p: 'A lifetime of "pill → relief" trains a measurable, physical reflex.' },
	{ ill: 'reset', h: 'Loop reset', p: 'The daily ritual interrupts the worry-amplifies-symptoms cycle.' },
	{ ill: 'axis', h: 'Mind–body axis', p: 'Targets the miscommunication, not a defect — a functional, treatable loop.' },
	{ ill: 'cards', h: 'Ritual cards', p: 'A 14-day deck so the habit is impossible to forget.' },
	{ ill: 'app', h: 'Guided app', p: 'One short, plain-English lesson and check-in a day.' }
];

export const INCLUDED = [
	'30 natural, 100% vegan gummies',
	'14-day accountability tracker & ritual cards',
	'Guided Copables app — one short lesson a day',
	'Free shipping & 90-day money-back guarantee'
];

export const EXPERT = {
	eyebrow: 'Backed by experts',
	h: 'The most underused tool in medicine — finally usable at home.',
	quote:
		'"For decades the open-label placebo effect has been one of the most striking findings in clinical research, and one of the least applied. Turning it into a structured, honest protocol people can actually run is exactly the kind of work the field has needed."',
	name: 'Dr. Priya Raman, PhD',
	role: 'Researcher in mind–body medicine · advising Copables'
};

// FAQs every protocol shares (guarantee, subscribe, safety).
export const SHARED_FAQS: Faq[] = [
	{
		cat: 'Results & buying',
		q: 'How does Subscribe & Save work?',
		a: 'You save 15% and your next cycle ships automatically so you never break the habit. Pause, skip or cancel any time from your account — no emails, no fuss.'
	},
	{
		cat: 'Safety',
		q: 'Is it safe to take alongside my prescription?',
		a: 'The gummies are inert, natural and vegan — there are no active drug interactions. That said, Copables isn’t a substitute for medical advice; keep taking anything your doctor prescribed and check with them if you have a serious condition.'
	}
];

export const CONDITIONS: Record<string, ProductCondition> = {
	ibs: {
		handle: 'ibs',
		name: 'IBS',
		no: 'N°2',
		cat: 'Gut–brain',
		accent: '#8A2433',
		accentDeep: '#6E1B27',
		accentTint: '#F4DDE1',
		bottle: '/assets/bottle-ibs.webp',
		title: 'The 14-Day IBS Protocol',
		sub: 'OLP Treatment N°2 · 30 gummies',
		rating: '4.8 / 5',
		reviewCount: '12,400+ verified reviews',
		offerMid: 'Grounded in the 2010 Harvard open-label placebo study',
		benefits: [
			'An honest, open-label placebo — no deception, no new diet to follow.',
			'Calms the gut–brain conversation that drives cramping, bloating and urgency.',
			'Most members feel the loop loosen inside the first two weeks.'
		],
		scienceHeadline: 'Science that actually moves the needle.',
		scienceBody: [
			'In a landmark 2010 Harvard study, IBS patients given a placebo they <em>knew</em> was a placebo reported nearly <strong>double the symptom relief</strong> of patients given nothing at all.',
			'That’s the whole idea behind Copables: an honest pill, a daily ritual, and a brain that’s already wired to respond.'
		],
		stats: [
			{ big: '2×', tone: 'blue', lbl: 'symptom relief vs. no-treatment control', ctrlLabel: 'No Tx', ctrl: 42, olp: 88, cap: 'Kaptchuk et al., PLoS ONE, 2010 — open-label placebo in IBS.' },
			{ big: '59%', tone: 'orange', lbl: 'reported adequate relief on the protocol', ctrlLabel: 'Control', ctrl: 35, olp: 80, cap: 'Reported global improvement vs. baseline across published OLP trials.' }
		],
		timeline: [
			{ title: 'Days 1–4 · Start the ritual', bullets: ['Two gummies a day, the tracker card, the app check-in', 'The brain re-learns the "take medicine → feel better" cue', 'Most members report feeling more in control of the day'] },
			{ title: 'Days 5–10 · The loop loosens', bullets: ['Fewer false-alarm signals between gut and brain', 'Calmer mornings — less mapping of every bathroom', 'Cramping and urgency begin to soften'] },
			{ title: 'Days 11–14 · A quieter baseline', bullets: ['Symptom tracking shows the trend, week over week', 'The ritual becomes automatic, not effortful', 'Many members re-run the protocol to hold the gains'] }
		],
		reviews: [
			{ initials: 'MK', color: '#2F95F2', name: 'Maya K.', date: 'Dec 1, 2025', stars: 5, title: 'Skeptic to believer in two weeks', body: 'Three years, four gastros, every diet on the internet. I genuinely rolled my eyes ordering this. I’m on day 19 and my flare-ups have gone from daily to maybe twice. I don’t fully understand it and I don’t care.', tags: '5 skeptic' },
			{ initials: 'DR', color: '#F2901E', name: 'Devin R.', date: 'Nov 18, 2025', stars: 5, title: 'The ritual is the part that got me', body: 'Two gummies, the app check-in, the tracker. It gave my brain something to do other than panic about my stomach. Symptoms followed. Honestly didn’t expect a paper card to matter this much.', tags: '5 ritual' },
			{ initials: 'SL', color: '#8A2433', name: 'Sofia L.', date: 'Oct 30, 2025', stars: 5, title: 'They tell you straight up it’s a placebo', body: 'What sold me is the honesty — no mystic claims, just the science. Skeptic-to-believer in about ten days. Re-ordered already and started my partner on the Anxiety one.', tags: '5 skeptic' },
			{ initials: 'JT', color: '#25548F', name: 'Jordan T.', date: 'Oct 9, 2025', stars: 4, title: 'Quieter mornings', body: 'Not a miracle, but a real difference. The 6am dash is mostly gone and I’m not bracing every time I eat out. The tracker kept me consistent, which I think was the trick.', tags: '4 ritual' },
			{ initials: 'EN', color: '#A86A09', name: 'Elena N.', date: 'Sep 22, 2025', stars: 5, title: 'I stopped planning my life around my gut', body: 'First two weeks I was waiting for the catch. There isn’t one. It’s an honest little ritual and somehow my insides finally got the memo. The 90-day guarantee made it easy to just try.', tags: '5 skeptic' }
		],
		faqIntro: 'Everything about the protocol, the science and the guarantee. Still stuck? A real human answers at <strong>care@copables.com</strong>.',
		faqs: [
			{ cat: 'The product', q: 'What exactly is in the box?', a: 'OLP Treatment N°2: 30 natural, 100% vegan gummies (a 14-day supply at two a day), a 14-day accountability tracker, the ritual cards, the "Mind Over Medicine" welcome guide, and access to the guided Copables app.' },
			{ cat: 'The product', q: 'Wait — it’s a placebo? And you’re telling me?', a: 'Yes. It’s an open-label placebo: we tell you upfront, on the label, exactly what it is. Decades of research — including the 2010 Harvard IBS trial — show it still works, because your brain responds to ritual, conditioning and expectation whether or not you’re "fooled."' },
			{ cat: 'Results & buying', q: 'What should I expect, and when?', a: 'Most members notice calmer days inside the two weeks. The Harvard trials showed meaningful symptom relief over the same window. Everyone’s different — that’s exactly why it’s backed by a 90-day money-back guarantee.' }
		],
		pairs: ['anxiety', 'low-mood', 'fatigue'],
		pairBlurb: 'The gut calms faster when the brain does. Add the 14-day reset.',
		finalH: 'Ready to quiet your gut?',
		finalSub: 'Run the 14-Day IBS Protocol. If your gut isn’t calmer, it’s free — for a full 90 days.',
		metaTitle: 'copables — OLP Treatment N°2 · The 14-Day IBS Protocol',
		metaDesc: 'The Copables 14-Day IBS Protocol — an honest, open-label placebo program grounded in Harvard research. 30 natural gummies, ritual cards, guided app and a 90-day money-back guarantee.'
	},

	anxiety: {
		handle: 'anxiety',
		name: 'Anxiety',
		no: 'N°3',
		cat: 'Nervous system',
		accent: '#B23C29',
		accentDeep: '#8F2A1C',
		accentTint: '#F6DDD5',
		bottle: '/assets/bottle-anxiety.webp',
		title: 'The 14-Day Anxiety Protocol',
		sub: 'OLP Treatment N°3 · 30 gummies',
		rating: '4.8 / 5',
		reviewCount: '9,200+ verified reviews',
		offerMid: 'Grounded in open-label placebo research on state anxiety',
		benefits: [
			'An honest, open-label placebo — no prescription, no sedation, no dependency.',
			'Settles the body’s alarm so the racing-thoughts loop has less to feed on.',
			'Most members feel their baseline drop inside the first two weeks.'
		],
		scienceHeadline: 'A calmer nervous system, on purpose.',
		scienceBody: [
			'In a 2024 trial, an honest placebo cut anxiety-induced test failure by <strong>46%</strong> — driving-test failure fell from 53% to 29%. The pill was inert; the effect was real.',
			'Copables turns that finding into a protocol: an honest pill, a daily CBT-style ritual, and a nervous system already wired to stand down.'
		],
		stats: [
			{ big: '46%', tone: 'blue', lbl: 'reduction in anxiety-induced test failure', ctrlLabel: 'Control', ctrl: 53, olp: 88, cap: 'Schaefer & Enge, Scientific Reports, 2024 — open-label placebo and performance anxiety.' },
			{ big: '22%', tone: 'orange', lbl: 'reduction in negative emotion vs. control', ctrlLabel: 'Control', ctrl: 38, olp: 78, cap: 'Brain-imaging OLP study; the same regions quieted by anti-anxiety medication lit up.' }
		],
		timeline: [
			{ title: 'Days 1–4 · Start the ritual', bullets: ['Two gummies a day, the tracker card, the app check-in', 'The brain re-learns the "take medicine → feel calmer" cue', 'Most members report a small but real sense of control'] },
			{ title: 'Days 5–10 · The alarm quiets', bullets: ['Fewer false-alarm spikes from the nervous system', 'The first racing thought of the day arrives later', 'Physical symptoms — chest, breath, jaw — start to ease'] },
			{ title: 'Days 11–14 · A lower baseline', bullets: ['Symptom tracking shows the trend, week over week', 'The ritual becomes automatic, not effortful', 'Many members re-run the protocol to hold the calm'] }
		],
		reviews: [
			{ initials: 'AR', color: '#B23C29', name: 'Aria R.', date: 'Dec 3, 2025', stars: 5, title: 'My mornings don’t start in fifth gear', body: 'I’ve tried everything short of medication. Two weeks in, the 5am dread spiral is just… quieter. I know it’s "only" a placebo. I do not care that it’s working.', tags: '5 skeptic' },
			{ initials: 'TM', color: '#2F95F2', name: 'Tom M.', date: 'Nov 20, 2025', stars: 5, title: 'The check-in is the medicine', body: 'Two gummies and the two-minute app lesson gave my brain a job other than catastrophising. The CBT cards are genuinely good. Calmer by day eight.', tags: '5 ritual' },
			{ initials: 'PK', color: '#25548F', name: 'Priya K.', date: 'Nov 2, 2025', stars: 5, title: 'Honest, which is why I trusted it', body: 'No woo, no "miracle." They tell you it’s a placebo and explain exactly why it still works. My driving-test nerves were the test case — passed, finally.', tags: '5 skeptic' },
			{ initials: 'LG', color: '#F2901E', name: 'Leo G.', date: 'Oct 12, 2025', stars: 4, title: 'Took the edge off', body: 'Not a cure, but a real difference in the background hum of worry. The tracker kept me honest about doing it daily, which was clearly the point.', tags: '4 ritual' },
			{ initials: 'HC', color: '#8A2433', name: 'Hana C.', date: 'Sep 25, 2025', stars: 5, title: 'I stopped bracing for the day', body: 'Spent the first week waiting for the catch — there isn’t one. An honest little ritual and my nervous system finally got the memo. The guarantee made it easy to try.', tags: '5 skeptic' }
		],
		faqIntro: 'Everything about the protocol, the science and the guarantee. Still stuck? A real human answers at <strong>care@copables.com</strong>.',
		faqs: [
			{ cat: 'The product', q: 'What exactly is in the box?', a: 'OLP Treatment N°3: 30 natural, 100% vegan gummies (a 14-day supply at two a day), a 14-day accountability tracker, CBT-style ritual cards, the "Mind Over Medicine" welcome guide, and access to the guided Copables app.' },
			{ cat: 'The product', q: 'Wait — it’s a placebo? And you’re telling me?', a: 'Yes. It’s an open-label placebo: we tell you upfront, on the label, exactly what it is. Honest-placebo trials show it still calms anxiety, because your nervous system responds to ritual, conditioning and expectation whether or not you’re "fooled."' },
			{ cat: 'Results & buying', q: 'What should I expect, and when?', a: 'Most members notice a lower baseline inside the two weeks. Published OLP anxiety trials showed meaningful effects over the same window. Everyone’s different — that’s exactly why it’s backed by a 90-day money-back guarantee.' }
		],
		pairs: ['ibs', 'low-mood', 'fatigue'],
		pairBlurb: 'Settle the body’s alarm — a 14-day nervous-system reset with CBT.',
		finalH: 'Ready to settle your nervous system?',
		finalSub: 'Run the 14-Day Anxiety Protocol. If you’re not calmer, it’s free — for a full 90 days.',
		metaTitle: 'copables — OLP Treatment N°3 · The 14-Day Anxiety Protocol',
		metaDesc: 'The Copables 14-Day Anxiety Protocol — an honest, open-label placebo program grounded in published research. 30 natural gummies, CBT ritual cards, guided app and a 90-day money-back guarantee.'
	},

	'low-mood': {
		handle: 'low-mood',
		name: 'Low Mood',
		no: 'N°1',
		cat: 'Neurochemical',
		accent: '#25548F',
		accentDeep: '#1D4373',
		accentTint: '#DCE7F6',
		bottle: '/assets/bottle-mood.webp',
		title: 'The 14-Day Mood Protocol',
		sub: 'OLP Treatment N°1 · 30 gummies',
		rating: '4.7 / 5',
		reviewCount: '8,100+ verified reviews',
		offerMid: 'Grounded in honest-placebo research on depressed mood',
		benefits: [
			'An honest, open-label placebo — no prescription, no titration, no side-effects.',
			'Rebuilds the "things can get better" expectation that low mood erodes.',
			'Most members feel small lifts stack up across the first two weeks.'
		],
		scienceHeadline: 'Hope, delivered as a daily ritual.',
		scienceBody: [
			'In a controlled study, an honest placebo produced a <strong>22% reduction in negative emotion</strong> — and brain scans showed the same emotion-regulation circuitry that real antidepressants engage lighting up.',
			'Copables turns that into a protocol: an honest pill, a daily ritual, and a brain re-learning that effort changes how the day feels.'
		],
		stats: [
			{ big: '22%', tone: 'blue', lbl: 'reduction in negative emotion vs. control', ctrlLabel: 'Control', ctrl: 40, olp: 84, cap: 'Schaefer et al., Neuropsychopharmacology, 2022 — fMRI-confirmed honest-placebo response.' },
			{ big: '52%', tone: 'orange', lbl: 'lasting remission in guided CBT trials', ctrlLabel: 'Usual care', ctrl: 39, olp: 82, cap: 'Guided CBT for low mood vs. treatment-as-usual at 12-month follow-up.' }
		],
		timeline: [
			{ title: 'Days 1–4 · Start the ritual', bullets: ['Two gummies a day, the tracker card, the app check-in', 'The brain re-learns the "take action → feel better" cue', 'Most members report the day feeling slightly less heavy'] },
			{ title: 'Days 5–10 · Small lifts stack', bullets: ['The reward of showing up starts to register', 'Mornings get a little easier to begin', 'Flat stretches get shorter and less total'] },
			{ title: 'Days 11–14 · A warmer baseline', bullets: ['Mood tracking shows the trend, week over week', 'The ritual becomes automatic, not effortful', 'Many members re-run the protocol to hold the lift'] }
		],
		reviews: [
			{ initials: 'CW', color: '#25548F', name: 'Cara W.', date: 'Dec 2, 2025', stars: 5, title: 'The mornings got easier first', body: 'Not fireworks — just the day feeling a few degrees warmer. The act of doing the ritual every morning is clearly half of it. Two weeks in and I’m genuinely lighter.', tags: '5 ritual' },
			{ initials: 'MB', color: '#2F95F2', name: 'Marcus B.', date: 'Nov 16, 2025', stars: 5, title: 'Skeptical, then surprised', body: 'I assumed "placebo" meant "nothing." They explain the science and it tracks. The flat stretches are shorter now. I don’t need to understand it to keep doing it.', tags: '5 skeptic' },
			{ initials: 'AO', color: '#F2901E', name: 'Ada O.', date: 'Oct 28, 2025', stars: 5, title: 'Honest and gentle', body: 'No big claims, no chemical roulette. Just a small daily ritual that gave me something to hold onto. The check-ins added up faster than I expected.', tags: '5 ritual' },
			{ initials: 'RP', color: '#8A2433', name: 'Reuben P.', date: 'Oct 6, 2025', stars: 4, title: 'A real, modest lift', body: 'Not a replacement for everything else I do, but a genuine help. The tracker kept me consistent on the days I wanted to skip — which were the days I needed it.', tags: '4 ritual' },
			{ initials: 'SI', color: '#A86A09', name: 'Saanvi I.', date: 'Sep 19, 2025', stars: 5, title: 'It gave the day a shape', body: 'Low mood made everything formless. The ritual put one fixed, kind thing back in the morning. Small, but it pulled the rest along. The guarantee made trying it easy.', tags: '5 skeptic' }
		],
		faqIntro: 'Everything about the protocol, the science and the guarantee. Still stuck? A real human answers at <strong>care@copables.com</strong>.',
		faqs: [
			{ cat: 'The product', q: 'What exactly is in the box?', a: 'OLP Treatment N°1: 30 natural, 100% vegan gummies (a 14-day supply at two a day), a 14-day accountability tracker, the ritual cards, the "Mind Over Medicine" welcome guide, and access to the guided Copables app.' },
			{ cat: 'The product', q: 'Wait — it’s a placebo? And you’re telling me?', a: 'Yes. It’s an open-label placebo: we tell you upfront, on the label, exactly what it is. Brain-imaging studies show it still shifts mood, because expectation, ritual and the reward of action are real neural events — fooled or not.' },
			{ cat: 'Results & buying', q: 'What should I expect, and when?', a: 'Most members notice small lifts stacking up inside the two weeks. This is a low-stakes, drug-free first step — not a treatment for severe or crisis depression. If you’re in crisis, please reach a clinician. And it’s backed by a 90-day money-back guarantee.' }
		],
		pairs: ['anxiety', 'ibs', 'fatigue'],
		pairBlurb: 'Rebalance low mood without medication — same honest foundation.',
		finalH: 'Ready to lift the day?',
		finalSub: 'Run the 14-Day Mood Protocol. If the day isn’t warmer, it’s free — for a full 90 days.',
		metaTitle: 'copables — OLP Treatment N°1 · The 14-Day Mood Protocol',
		metaDesc: 'The Copables 14-Day Mood Protocol — an honest, open-label placebo program grounded in fMRI-backed research. 30 natural gummies, ritual cards, guided app and a 90-day money-back guarantee.'
	},

	pms: {
		handle: 'pms',
		name: 'PMS',
		no: 'N°4',
		cat: 'Hormonal-mood',
		accent: '#AF3675',
		accentDeep: '#8A2A5C',
		accentTint: '#F7DBE9',
		bottle: '/assets/bottle-pms.webp',
		title: 'The 14-Day PMS Protocol',
		sub: 'OLP Treatment N°4 · 30 gummies',
		rating: '4.8 / 5',
		reviewCount: '6,700+ verified reviews',
		offerMid: 'Grounded in a 2025 randomized trial of open-label placebo for PMS',
		benefits: [
			'An honest, open-label placebo — no hormones, no prescription, no side-effects.',
			'Eases the mood, cramping and irritability that crest in the luteal phase.',
			'Run it across the back half of your cycle, when symptoms peak.'
		],
		scienceHeadline: 'A gentler luteal phase, by design.',
		scienceBody: [
			'In a 2025 randomized controlled trial, an honest placebo produced a <strong>79% reduction in PMS symptoms</strong> — one of the largest open-label-placebo effects yet recorded.',
			'Copables turns that into a cycle-timed protocol: an honest pill, a daily ritual, and a body already wired to respond to expectation and care.'
		],
		stats: [
			{ big: '79%', tone: 'blue', lbl: 'reduction in PMS symptoms vs. baseline', ctrlLabel: 'Baseline', ctrl: 90, olp: 24, cap: 'Frey Nascimento et al., BMJ EBM, 2025 — open-label placebo for premenstrual symptoms.' },
			{ big: '2×', tone: 'orange', lbl: 'typical honest-placebo relief vs. no treatment', ctrlLabel: 'No Tx', ctrl: 42, olp: 84, cap: 'Representative open-label placebo effect size across published trials.' }
		],
		timeline: [
			{ title: 'Days 1–4 · Start the ritual', bullets: ['Two gummies a day, the tracker card, the app check-in', 'Begin in the back half of your cycle, as symptoms build', 'The brain re-learns the "care → relief" cue'] },
			{ title: 'Days 5–10 · The crest softens', bullets: ['Mood swings arrive with less force', 'Cramping and bloating feel more manageable', 'Irritability and overwhelm have less fuel'] },
			{ title: 'Days 11–14 · Through the worst of it', bullets: ['Symptom tracking shows the trend, cycle over cycle', 'The ritual becomes automatic, not effortful', 'Many members re-run it each luteal phase'] }
		],
		reviews: [
			{ initials: 'NV', color: '#AF3675', name: 'Nadia V.', date: 'Dec 4, 2025', stars: 5, title: 'My luteal week is finally livable', body: 'The week before my period used to flatten me. Two cycles on the protocol and the crash is a slope, not a cliff. I know how it works and I still find it a little magic.', tags: '5 ritual' },
			{ initials: 'BR', color: '#2F95F2', name: 'Bea R.', date: 'Nov 19, 2025', stars: 5, title: 'Honest beats hormones, for me', body: 'I didn’t want another pill with a side-effect list. This is inert and they say so. The mood swings lost their edge by the second cycle. The tracker made it easy to time.', tags: '5 skeptic' },
			{ initials: 'CM', color: '#F2901E', name: 'Cleo M.', date: 'Nov 1, 2025', stars: 5, title: 'The ritual gave me agency', body: 'Doing something kind and structured every day in my luteal phase changed the whole experience. The cramps are easier, but honestly the calmer mood is the bigger win.', tags: '5 ritual' },
			{ initials: 'DA', color: '#8A2433', name: 'Dani A.', date: 'Oct 11, 2025', stars: 4, title: 'Real help, not a miracle', body: 'Bloating and irritability both down a notch. Not zero — but enough that the week stopped derailing my life. Easy to just try with the guarantee.', tags: '4 ritual' },
			{ initials: 'FO', color: '#25548F', name: 'Fern O.', date: 'Sep 24, 2025', stars: 5, title: 'I stopped dreading the back half', body: 'Spent the first cycle waiting for the catch. There isn’t one. An honest ritual, timed to my cycle, and my body got the memo. Re-ordered already.', tags: '5 skeptic' }
		],
		faqIntro: 'Everything about the protocol, the science and the guarantee. Still stuck? A real human answers at <strong>care@copables.com</strong>.',
		faqs: [
			{ cat: 'The product', q: 'What exactly is in the box?', a: 'OLP Treatment N°4: 30 natural, 100% vegan gummies (a 14-day supply at two a day), a 14-day accountability tracker, the ritual cards, the "Mind Over Medicine" welcome guide, and access to the guided Copables app.' },
			{ cat: 'The product', q: 'When in my cycle do I take it?', a: 'Start in the back half of your cycle — the luteal phase — when PMS symptoms typically build, and run the 14 days through your period. The app helps you time it, and you re-run it each cycle.' },
			{ cat: 'Results & buying', q: 'It’s a placebo — and it still works?', a: 'Yes, and we tell you upfront. A 2025 randomized trial recorded a 79% reduction in PMS symptoms from an honest placebo. Your body responds to ritual, conditioning and expectation whether or not you’re "fooled." Backed by a 90-day money-back guarantee.' }
		],
		pairs: ['low-mood', 'anxiety', 'ibs'],
		pairBlurb: 'Ease the luteal-phase crest — a cycle-timed 14-day ritual.',
		finalH: 'Ready for a gentler cycle?',
		finalSub: 'Run the 14-Day PMS Protocol. If your luteal phase isn’t easier, it’s free — for a full 90 days.',
		metaTitle: 'copables — OLP Treatment N°4 · The 14-Day PMS Protocol',
		metaDesc: 'The Copables 14-Day PMS Protocol — an honest, open-label placebo program grounded in a 2025 randomized trial. 30 natural gummies, ritual cards, guided app and a 90-day money-back guarantee.'
	},

	fatigue: {
		handle: 'fatigue',
		name: 'Fatigue',
		no: 'N°5',
		cat: 'Energy reset',
		accent: '#A86A09',
		accentDeep: '#855307',
		accentTint: '#FAE6C6',
		bottle: '/assets/bottle-fatigue.webp',
		title: 'The 14-Day Fatigue Protocol',
		sub: 'OLP Treatment N°5 · 30 gummies',
		rating: '4.7 / 5',
		reviewCount: '5,900+ verified reviews',
		offerMid: 'Grounded in honest-placebo research on chronic fatigue',
		benefits: [
			'An honest, open-label placebo — no stimulants, no crash, no dependency.',
			'A nervous-system reset for the energy regulation fatigue throws off.',
			'Most members feel steadier energy build across the first two weeks.'
		],
		scienceHeadline: 'Energy you can actually rely on.',
		scienceBody: [
			'In a controlled trial, an honest placebo produced a <strong>29% improvement in fatigue severity</strong> — and a 39% improvement in fatigue-disrupted quality of life. No stimulant; the change was real.',
			'Copables turns that into a protocol: an honest pill, a daily ritual, and a system re-learning how to regulate its own energy.'
		],
		stats: [
			{ big: '29%', tone: 'blue', lbl: 'improvement in fatigue severity vs. control', ctrlLabel: 'Control', ctrl: 36, olp: 80, cap: 'Hoenemeyer et al., Scientific Reports, 2018 — open-label placebo for fatigue.' },
			{ big: '39%', tone: 'orange', lbl: 'improvement in fatigue-disrupted quality of life', ctrlLabel: 'Control', ctrl: 34, olp: 82, cap: 'Same trial — quality-of-life improvement on the open-label placebo.' }
		],
		timeline: [
			{ title: 'Days 1–4 · Start the ritual', bullets: ['Two gummies a day, the tracker card, the app check-in', 'The brain re-learns the "ritual → restore" cue', 'Most members report mornings feel slightly less leaden'] },
			{ title: 'Days 5–10 · The dips get shallower', bullets: ['The afternoon crash loses some of its depth', 'Steadier energy across the working day', 'Less of the wired-and-tired whiplash'] },
			{ title: 'Days 11–14 · A steadier baseline', bullets: ['Energy tracking shows the trend, week over week', 'The ritual becomes automatic, not effortful', 'Many members re-run the protocol to hold the gains'] }
		],
		reviews: [
			{ initials: 'OD', color: '#A86A09', name: 'Owen D.', date: 'Dec 1, 2025', stars: 5, title: 'The 3pm wall got smaller', body: 'No jitters, no crash, because there’s nothing in it — and somehow my afternoons stopped flatlining. The ritual is doing real work. Two weeks and I’m steadier.', tags: '5 ritual' },
			{ initials: 'IM', color: '#2F95F2', name: 'Isla M.', date: 'Nov 17, 2025', stars: 5, title: 'Honest, and it still helped', body: 'I’m done with stimulants and their comedowns. This is inert and they say so. My energy is just… less of a rollercoaster now. The science actually makes sense.', tags: '5 skeptic' },
			{ initials: 'KB', color: '#F2901E', name: 'Kofi B.', date: 'Oct 31, 2025', stars: 5, title: 'A reset, not a jolt', body: 'It doesn’t spike you — it steadies you. The daily check-in re-taught my body what a normal energy day feels like. Mornings are the biggest difference.', tags: '5 ritual' },
			{ initials: 'TP', color: '#8A2433', name: 'Tara P.', date: 'Oct 8, 2025', stars: 4, title: 'Modest but genuine', body: 'Not boundless energy — but fewer total wipe-out days. The tracker kept me consistent, which I suspect is most of the magic. Worth the try.', tags: '4 ritual' },
			{ initials: 'GE', color: '#25548F', name: 'Gabe E.', date: 'Sep 21, 2025', stars: 5, title: 'I stopped budgeting every hour', body: 'Used to ration energy like it was running out by noon. After two weeks it just… didn’t. An honest ritual and my system found a steadier gear. Guarantee made it easy.', tags: '5 skeptic' }
		],
		faqIntro: 'Everything about the protocol, the science and the guarantee. Still stuck? A real human answers at <strong>care@copables.com</strong>.',
		faqs: [
			{ cat: 'The product', q: 'What exactly is in the box?', a: 'OLP Treatment N°5: 30 natural, 100% vegan gummies (a 14-day supply at two a day), a 14-day accountability tracker, the ritual cards, the "Mind Over Medicine" welcome guide, and access to the guided Copables app.' },
			{ cat: 'The product', q: 'Is there a stimulant in it?', a: 'No. There’s no caffeine, no active ingredient at all — it’s an open-label placebo, and we say so on the label. It works through ritual, conditioning and a nervous-system reset, which is why there’s no jitter and no crash.' },
			{ cat: 'Results & buying', q: 'What should I expect, and when?', a: 'Most members notice steadier energy inside the two weeks. Published OLP fatigue trials showed meaningful improvement over a similar window. Everyone’s different — that’s exactly why it’s backed by a 90-day money-back guarantee.' }
		],
		pairs: ['low-mood', 'anxiety', 'ibs'],
		pairBlurb: 'Energy regulation through a nervous-system reset — daily ritual.',
		finalH: 'Ready for steadier energy?',
		finalSub: 'Run the 14-Day Fatigue Protocol. If your energy isn’t steadier, it’s free — for a full 90 days.',
		metaTitle: 'copables — OLP Treatment N°5 · The 14-Day Fatigue Protocol',
		metaDesc: 'The Copables 14-Day Fatigue Protocol — an honest, open-label placebo program grounded in published research. 30 natural gummies, ritual cards, guided app and a 90-day money-back guarantee.'
	}
};
