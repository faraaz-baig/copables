<script lang="ts">
	import { onMount } from 'svelte';
	import { track } from '$lib/analytics';

	// ── Citations (clickable) ───────────────────────────────────────────────
	const KAPTCHUK_2010 = 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591';
	const LEMBO_2021 = 'https://journals.lww.com/pain/Fulltext/2021/09000/Open_label_placebo_vs_double_blind_placebo_for.6.aspx';

	// ── Screen definitions — spec-verbatim copy, fixed order (v10) ───────────
	// 66 spec screens + 2 retained bonus lesson beats (placebo_q, relate_food).
	const SCREENS: any[] = [
		// ── Act 1: Hook, goal, intake → IBS Severity Score ──────────────────
		{ id:'hook', type:'info', illo:{ t:'scene', d:'A friendly, slightly skeptical person in glasses holding a single capsule up to the light, eyebrow raised, a tiny question mark nearby — the "too good to be true… but go on" moment.' },
			title:`You're here because you want help with your IBS.`,
			sub:`While honest placebos sound almost too good to be true, science-backed research has shown they can help. Open-label placebos don't work for everyone, and the science is upfront about that. This assessment will establish whether they're likely to work for someone like you.`,
			cta:`Let's get started` },

		{ id:'goal', type:'multi', tag:'About you', title:`What would you like to do if you were free from IBS restrictions?`, hint:`Pick all that apply.`, options:['Eat what I want without overthinking it','Say yes to plans without a backup plan','Travel without mapping every bathroom','Get through a workday without it derailing me','Just feel like myself again'] },

		{ id:'gender', type:'single', tag:'About you', title:`What's your gender?`, options:['Female','Male','Non-binary','Prefer not to say'] },

		{ id:'age', type:'single', tag:'About you', title:`What's your age group?`, options:['18–24','25–34','35–44','45–54','55–64','65+'] },

		{ id:'duration', type:'single', tag:'Your symptoms', title:`How long have you been struggling with IBS?`, options:['Under 6 months','6 months to a year','1–3 years','3–10 years','More than 10 years'] },

		{ id:'mv1', type:'info', title:`Thank you for sharing.`, sub:`Letting someone know how long you've carried this burden is a step most people never take.`, cta:`Continue` },

		{ id:'symptoms', type:'multi', tag:'Your symptoms', title:`What physical symptoms do you normally experience?`, hint:`Pick all that apply.`, options:['Abdominal pain or cramping','Bloating or swelling','Constipation','Diarrhea','Alternating between both','Urgency','Excess gas','Nausea'] },

		{ id:'triggers', type:'single', tag:'Your symptoms', title:`Do you know your IBS triggers?`, options:['Yes, I know most of them','I have a rough idea','Not really','No idea at all'] },

		{ id:'sss_intro', type:'info', tag:'Your symptoms', title:`Next, your clinical score.`, sub:`The next five questions make up the IBS Severity Scoring System, a clinically validated assessment. Your answers calculate your personal score.`, cite:`Francis, C. Y., Morris, J., & Whorwell, P. J. (1997). The irritable bowel severity scoring system: a simple method of monitoring irritable bowel syndrome and its progress.`, cta:`Start scoring` },

		{ id:'sss_pain', type:'slider', tag:'Your symptoms', kick:'Pain severity', title:`Do you currently suffer from abdominal or belly pain?`, left:'None', right:'Very severe', requiresInteraction:true },
		{ id:'sss_pain_days', type:'slider', tag:'Your symptoms', kick:'Pain frequency', days:true, title:`Out of every 10 days, how many do you typically experience abdominal pain?`, left:'0 days', right:'10 days', requiresInteraction:true },
		{ id:'sss_bloating', type:'slider', tag:'Your symptoms', kick:'Bloating', title:`Do you currently suffer from bloating, abdominal tightness or a swollen tummy?`, left:'None', right:'Very severe', requiresInteraction:true },
		{ id:'sss_bowel', type:'slider', tag:'Your symptoms', kick:'Bowel habits', title:`How satisfied are you with your bowel movements?`, left:'Completely satisfied', right:'Not at all satisfied', requiresInteraction:true },
		{ id:'sss_life', type:'slider', tag:'Your symptoms', kick:'Life impact', title:`How much does IBS affect your life in general?`, left:'Not at all', right:'Completely', requiresInteraction:true },

		{ id:'email', type:'email', tag:'Your score', kick:'One step to your score', title:`Unlock your clinically validated IBS Severity Score.`, sub:`Enter your name and email to see your score.`, cta:`Reveal my score` },

		{ id:'loader_1', type:'loader', tag:'Your score', loaderTitle:`Scoring your answers`, lines:['Scoring your symptom severity…','Comparing you to people like you…','Finalising your IBS Severity Score…'] },

		{ id:'score_reveal', type:'info', tag:'Your score', scorecard:true, harvard:true, cite:`Lembo et al., Pain (2021) — open-label vs double-blind placebo for IBS, Harvard Medical School.`, citeUrl:LEMBO_2021, illo:{ t:'scene', d:'The character holding a clipboard/report with a big circled number, giving a slow nod — relief and recognition. "My symptoms are real, and now they have a number."' },
			kick:'Your IBS severity score',
			title:`Here's where you're starting, {name}.`,
			sub:`A {X} puts you in the {band} range. This isn't in your head, and it isn't a verdict — your symptoms are real, and they're measurable.`,
			subhead:`What happens when you take a placebo you know is a placebo?`,
			sub2:`This Harvard Medical School 2021 study showed that a placebo can help your IBS even when you know it's a placebo. In a published trial, 69% of people who took the honest placebo experienced a clinically meaningful severity score drop of 50+ points. The rest of this will assess whether you're likely to fall into this group of people who experienced uplift from the honest placebo.`,
			cta:`Continue` },

		// [BONUS] retained engagement beat — not in spec; kept per build decision.
		{ id:'placebo_q', type:'lesson', tag:'Your score', kick:'Quick one', title:'What happens when you take a placebo you know is a placebo?', options:['Nothing — it only works if you\'re fooled','Your body can still respond, for real'], correct:1, reveal_title_correct:"That's right.", reveal_title_wrong:"Actually —", reveal:"Your body still responds. The effect comes from your nervous system, not from being tricked — which is exactly why being told the truth doesn't break it.", cta:'Continue' },

		// ── Act 2: Psychographic profile → lived experience → projection ────
		{ id:'agree_intro', type:'info', tag:'Your experience', title:`For this next group of statements, tell us how much you agree with each one.`, sub:`These aren't about symptoms — they're about what living with this actually feels like. Drag to rate each one. Be honest; no one's watching.`, cta:`I'm ready` },

		{ id:'agree_bathroom', type:'agree', tag:'Your experience', title:`I often think about where the nearest bathroom is.` },
		{ id:'agree_eatless', type:'agree', tag:'Your experience', title:`Before an important event, I eat less, or nothing, just in case.` },
		{ id:'agree_gamble', type:'agree', tag:'Your experience', title:`When I eat or drink something, it sometimes feels like a gamble.` },

		{ id:'not_alone', type:'info', tag:'Your experience', kick:`You're not alone`, illo:{ t:'scene', d:'A small, loose crowd of figures (the character among them), each a little different — warm and roomy. "1 in 7 — you\'re in good company."' },
			title:`The American College of Gastroenterology estimates 1 in 7 adults live with IBS.`,
			sub:`You're not imagining it, and you're not alone. Most people just never find a structured way through it.`,
			// TODO(launch): replace with a real, verified customer quote — spec §6.
			quote:{ text:`I'd tried everything and still felt lost. What I needed wasn't another diet — it was an actual system.`, by:'Verified member', role:'Copables', av:['VM','#2F95F2'] }, cta:`Continue` },

		{ id:'agree_turneddown', type:'agree', tag:'Your experience', title:`I've turned down plans, dates, or travel because of my gut.` },
		{ id:'agree_stresstiming', type:'agree', tag:'Your experience', title:`My stomach gets worse at inconvenient or stressful times.` },
		{ id:'agree_cutfoods', type:'agree', tag:'Your experience', title:`I've slowly cut out foods I used to love, and the list keeps growing.` },

		{ id:'mv2', type:'info', title:`We can see how much your IBS has affected you.`, sub:`Just a few more to round out the picture.`, cta:`Continue` },

		{ id:'agree_embarrassed', type:'agree', tag:'Your experience', title:`I feel embarrassed talking about my symptoms, even with people close to me.` },
		{ id:'agree_mood', type:'agree', tag:'Your experience', title:`When a flare hits, my mood often drops.` },
		{ id:'agree_betray', type:'agree', tag:'Your experience', title:`Sometimes it feels like my own body betrays me at the worst possible moments.` },

		{ id:'projection', type:'projection', tag:'Your experience', illo:{ t:'scene', d:'The character stepping onto a path that slopes gently downhill (score dropping = good), looking ahead with a small hopeful smile — the "this is changeable" beat.' },
			sub:`If those hit close to home, you're not being dramatic — that real, felt impact is what IBS actually does to your life. The good news: this is changeable.`,
			title:`Here's what changeable looks like.`,
			sub2:`Your IBS-SSS today is {X}. A 50-point drop puts you at {Y}. You told us you wanted to {goal} — a Copables protocol might be a path there.`,
			cta:`Continue` },

		// ── Act 3: History ──────────────────────────────────────────────────
		{ id:'history_intro', type:'info', tag:'Your history', title:`A bit of history.`, sub:`These next questions are about your story so far — they help us judge whether this protocol is actually right for you.`, cta:`Continue` },

		{ id:'stress', type:'single', tag:'Your history', title:`How would you rate your stress over the last year?`, options:['Low','Manageable','High','Through the roof'] },
		{ id:'sleep', type:'single', tag:'Your history', title:`How's your sleep?`, options:['Solid','Hit or miss','Poor','Barely sleeping'] },
		{ id:'stress_worse', type:'single', tag:'Your history', title:`Do your symptoms get worse during periods of high stress or anxiety?`, options:['Definitely','Sometimes','Not that I\'ve noticed','No'] },
		{ id:'tried_cbt', type:'single', tag:'Your history', title:`Have you tried CBT or any other mind-body approach for your gut?`, options:['Yes, and it helped','Yes, but it didn\'t stick','No, never','I didn\'t know that was a thing for IBS'] },

		{ id:'gut_brain', type:'info', tag:'Your history', illo:{ t:'scene', d:'A simple stomach and a brain joined by a squiggly, slightly tangled line with one little knot in the middle — conceptual and friendly. "The line\'s just noisy, not broken."' },
			title:`Your gut isn't broken. It's misunderstood.`,
			sub:`Science now recognises IBS as a disorder of gut–brain interaction — a miscommunication, not a defect in your gut. That connection can get noisy, so ordinary signals get amplified or misinterpreted. Your gut isn't broken, but its communication with your brain might be. A Copables protocol is specifically designed to help repair this channel, rather than just chasing your symptoms with restrictive diets.`,
			cta:`That makes sense` },

		// [BONUS] retained engagement beat — not in spec; kept per build decision.
		{ id:'relate_food', type:'lesson', tag:'Your history', kick:'Does this sound like you?', title:'"Certain foods seem to make my symptoms worse."', options:['Yes, definitely','Sometimes','Not really'], correct:-1, reveal_title_correct:'', reveal_title_wrong:'', reveal:"Really common with a gut like yours. High-FODMAP foods (think apples, onions) ferment fast and make the intestine expand — that part happens to everyone. But if the nerves in your gut are oversensitive (visceral hypersensitivity), they overreact to that stretch and fire false alarms to your brain — and that's where the pain comes from. So you've got two options: keep cutting the foods that trip those nerves, or change how your brain responds to their signals with gut-brain therapy. This protocol is the second one.", cta:'Continue' },

		{ id:'doctor', type:'single', tag:'Your history', title:`If you've seen a doctor, what did they tell you?`, options:['Diagnosed me with IBS','Said it was stress or anxiety','Ran tests, found nothing','Told me to change my diet','I haven\'t seen one'] },

		{ id:'quick_check', type:'multi', tag:'Safety check', kick:'A quick check', title:`Before we go further — do any of these apply?`, hint:`These aren't typical IBS, and they're worth a doctor's eyes.`, options:['Blood in your stool','Unexplained weight loss','Persistent fever','Trouble swallowing','Symptoms that wake you from sleep','I\'m currently on prescription medication for my gut','None of these'] },

		{ id:'tried', type:'multi', tag:'Your history', title:`What have you tried?`, hint:`Pick all that apply.`, options:['Low-FODMAP or elimination diets','Fiber supplements','Probiotics','Antispasmodics or prescription meds','Peppermint oil','Stress management','Honestly, everything','Nothing yet'] },
		{ id:'tried_work', type:'single', tag:'Your history', title:`Did these solutions work?`, options:['No, not really','A little, for a while','Some helped, some didn\'t','Nothing has worked'] },

		{ id:'mv3', type:'info', title:`You've already shown more initiative than most people ever do.`, sub:`By taking this survey and trying these solutions, you are taking ownership over your own health. That persistence is one of the biggest predictors of who this helps.`, cta:`Continue` },

		{ id:'real_results', type:'info', tag:'Real results', kick:'Real results from real people', title:`Sometimes it changes more than your gut.`, quote:{ text:`The CBT part sank in deeper than I expected. For the first time I had the discipline to actually show up for other things — the gym, my goals. Five months later I'm still at it, and the only thing that changed was doing this program.`, by:'Shawn T.', role:'BC, Canada', av:['ST','#2F95F2'] }, cta:`Continue` },

		// ── Act 4: Protocol reveal ──────────────────────────────────────────
		{ id:'protocol_reveal', type:'info', tag:'The protocol', kick:'We got you', illo:{ t:'scene', d:'The "DAY ONE" kit — the character holding the kit/notebook with quiet optimism: capsule bottle, write-on ritual cards, sticker calendar. The starting-line feeling.' },
			title:`Meet the 14-day Copables protocol.`,
			sub:`A science-backed, 14-day protocol that works by repairing the gut–brain signal — not by cutting more foods. The research shows some people respond more strongly than others, which is exactly what the last few questions will pin down. Here's how the kit comes together: the honest placebo capsules are your daily anchor, with nothing hidden about how they work; the write-on ritual cards are the guided exercises that do the real rewiring; the sticker calendar makes all 14 days actually happen; and the app tracks your score as it moves.`,
			sub2:`Capsules alone are nothing, and we'd never pretend otherwise. The ritual, the cards, the daily 15 minutes — that's what carries the effect. That's the protocol, and it's yours to drive.`,
			cta:`Continue` },

		// ── Act 5: Responder fit (feeds the Fit Score) ──────────────────────
		{ id:'almost_there', type:'info', tag:'Fit check', kick:'Almost there', title:`Open-label placebos aren't right for everyone — let's see if you're a good fit.`, sub:`These last questions evaluate whether your psychographic profile is likely to respond well to an OLP protocol.`, cta:`Continue` },

		{ id:'fit_flare', type:'single', tag:'Fit check', title:`When a flare-up begins, which reaction feels closer to yours?`, options:['I tense up and brace for the worst','I try to ride it out calmly','I distract myself and push through','I shut down until it passes'] },
		{ id:'fit_catastrophe', type:'single', tag:'Fit check', title:`How often does a small sensation make you brace for a severe catastrophe?`, options:['Almost always','Often','Sometimes','Rarely'] },

		{ id:'ceiling_info', type:'info', tag:'Fit check', kick:'Worth knowing', title:`1 in 4 experienced a drop of 150+ points.`, sub:`In the 2021 Harvard research study, 1 in 4 people experienced an astonishing 150+ point drop on the IBS Severity Scale — classified as a life-altering change.`, cta:`Continue` },

		{ id:'fit_open', type:'single', tag:'Fit check', title:`How open are you to trying unconventional experiences in life?`, options:['Very — I\'ll try most things','Fairly open','It depends','I\'m skeptical by nature'] },
		{ id:'fit_curious', type:'single', tag:'Fit check', title:`How curious are you about understanding 'the why' of your own body?`, options:['Very curious','Somewhat','A little','Not really'] },

		{ id:'good_signs', type:'info', tag:'Fit check', kick:'Good signs', illo:{ t:'spot', d:'The character with a pleased nod and a small checkmark or spark above — understated "good signs, you fit."' },
			title:`Those last two answers are a good sign.`,
			sub:`Curiosity about your own physiology and an open mind are two of the traits that correlate most with a strong response to this kind of protocol. If that's you, you're in promising territory.`, cta:`Continue` },

		{ id:'fit_muscle', type:'single', tag:'Fit check', title:`Does 'training your nervous system like a muscle' make sense to you?`, options:['Yes, that makes sense','Sort of','Not really','I\'d have to see it to believe it'] },
		{ id:'fit_agency', type:'single', tag:'Fit check', title:`When it comes to your own health, do you see yourself as an active participant or as someone who has things done to them?`, options:['An active participant','A bit of both','I usually follow what I\'m told','Things tend to be done to me'] },

		{ id:'active_key', type:'info', tag:'Fit check', illo:{ t:'spot', d:'The character rolling up their sleeves / working the ritual cards, hands-on — "you\'re driving this."' },
			title:`A Copables protocol isn't a magic bullet — it's a tool.`,
			sub:`The people most likely to see results treat it as something they're actively using, not something being done to them. Your active participation in your own health is a great sign.`, cta:`Continue` },

		// Objection handling
		{ id:'obj_skeptical', type:'info', tag:'Fit check', title:`"What if I'm skeptical?"`, sub:`How strongly people expected the placebo to help didn't predict how much they actually improved. The science shows belief is not required for open-label placebos to help.`, cite:`Expectancy ratings did not predict symptom improvement in open-label placebo trials.`, cta:`Continue` },

		{ id:'obj_diet', type:'info', tag:'Fit check', title:`"Do I have to be on another restrictive diet?"`, sub:`No. This protocol is about retraining the way your gut and brain communicate. Your lifestyle and diet are connected to your overall health, just as they are for everyone else — but this isn't another elimination diet.`, cta:`Continue` },

		{ id:'obj_diy', type:'info', tag:'Fit check', harvard:true, cite:`Locher et al., 2017; 2021 open-label placebo trial.`, citeUrl:LEMBO_2021, title:`"Couldn't I just do this myself?"`, sub:`Not everyone can participate in a research study at Harvard. And the research is clear that how an honest placebo is administered — the rationale, the ritual, the guidance — drives the effect far more than what you're actually taking (Locher et al., 2017; 2021 open-label placebo trial). Copables lets you replicate this experience from home.`, cta:`Continue` },

		// ── Act 6: Commitment, analysis & results ───────────────────────────
		{ id:'commit_research', type:'single', tag:'Last step', title:`If a protocol had real published research behind it, how much would that matter?`, options:['A lot — that\'s what I trust','Somewhat','A little','Not much'] },
		{ id:'commit_invest', type:'single', tag:'Last step', title:`15 minutes a day, for 14 days. After everything IBS has taken from you — is that an investment you're ready to make in yourself?`, options:['Yes — I\'m ready','I think so','I\'m not sure','Probably not'] },
		{ id:'commit_when', type:'single', tag:'Last step', title:`Last thing — when could you actually protect those 15 minutes?`, hint:`Picturing it now makes it far more likely to stick.`, options:['First thing in the morning','Midday','After dinner','Before bed'] },

		{ id:'loader_final', type:'loader', tag:'Last step', loaderTitle:`Building your result`, loaderSubTitle:`Give us a moment — we're putting this together from everything you told us.`, lines:['Analysing your symptom pattern…','Scoring your severity…','Mapping your gut-brain profile…','Checking your responder traits…','Calculating your protocol fit…'], harvard_loader:true, loaderSub:`Based on the open-label protocol from Kaptchuk et al., Harvard Medical School.`, harvardLoaderUrl:KAPTCHUK_2010 },

		{ id:'coverage_type', type:'single', tag:'Last step', title:`What type of health coverage do you have?`, options:['Private health insurance','Employer-sponsored insurance','Public / government program','I do not have health coverage'] },

		{ id:'insurance_provider', type:'single', tag:'Last step', skip:(a:Record<string, any>) => a.coverage_type === 'I do not have health coverage', title:`You may be eligible for Copables to be covered by your insurer.`, hint:`Select your insurance provider.`, options:['UnitedHealthcare','Anthem / Elevance','Aetna (CVS Health)','Cigna','Humana','Kaiser Permanente','Blue Cross Blue Shield','Centene','Molina Healthcare','Other','I\'m not sure'] },

		{ id:'discount', type:'info', tag:'Last step', title:`You qualify for a Copables discount.`, cta:`See my results` }, // body branches on coverage (discountSub)

		// ── Ending (§5) — fit results, mechanism, conversion ────────────────
		{ id:'fit_results', type:'info', tag:'Your results', kick:'Your OLP fit score', fitScore:true, harvard:true, cite:`Kaptchuk et al., Harvard Medical School.`, citeUrl:KAPTCHUK_2010, illo:{ t:'scene', d:'The character holding up a badge or result card with their Fit Score, a confident half-smile — the "built for you" payoff.' },
			title:`{name}, here's your verdict.`,
			sub:`Based on everything you told us, you're {fit_tier} — your openness and curiosity are exactly the traits that respond. Remember where you started: a {X} today, with a 50-point drop putting you around {Y}, on the road to {goal}. People with a profile like yours are among the most likely to see the bigger 150+ point shifts. This was built for someone like you.`,
			cta:`See my protocol` },

		{ id:'how_olp_works', type:'info', tag:'Your results', kick:'How this actually works', title:`Three reasons an honest placebo works — even now that you know.`, expand:[{ ic:'①', h:'Conditioning & expectation', p:'Your body learns to link the daily ritual with relief, the way it learns any automatic response.' },{ ic:'②', h:'Prediction-error processing', p:'Every calm day hands your brain new evidence, so it stops over-predicting pain from normal gut signals.' },{ ic:'③', h:'Agency over your health', p:'Doing something deliberate every day moves you from passenger to driver, and that shift alone changes how symptoms land.' }], cta:`Continue` },

		{ id:'conversion', type:'info', tag:'Your results', kick:'Start your 14 days', conversion:true, illo:{ t:'scene', d:'The character at the starting line with the radiating optimism ticks — "Day One" energy, ready to begin.' },
			title:`Your protocol is ready, {name}.`,
			sub:`Everything for your 14 days — the capsules, the ritual cards, the sticker calendar, and the app that tracks your score as it moves. Built around your profile, your {band} starting point, and the {goal} you're aiming for.`,
			guarantee:`And the risk is ours, not yours: if your IBS Severity Score hasn't moved after the full 14 days, you get your money back — every cent.`,
			cta:`Start my 14 days` }
	];

	const STORAGE_KEY = 'copables_quiz_v11';
	const RESULTS_KEY = 'copables_quiz_results';

	// Offer pricing — full retail anchored against the 15% direct-pay discount.
	const PRICE_FULL = 48;
	const PRICE_DISCOUNT = (PRICE_FULL * 0.85).toFixed(2); // 40.80

	// ── Helpers ────────────────────────────────────────────────────────────
	function computeSssScore(a: Record<string, any>): number {
		const sev = (id: string, days = false) => {
			const v = Number(a[id]);
			if (!Number.isFinite(v)) return 0;
			return days ? Math.min(100, v * 10) : v;
		};
		return Math.round(
			sev('sss_pain') +
			sev('sss_pain_days', true) +
			sev('sss_bloating') +
			sev('sss_bowel') +
			sev('sss_life')
		);
	}

	const BAND_CHARGE: Record<string, string> = { mild: 'var(--green-ok)', moderate: 'var(--orange)', severe: 'var(--wine)' };
	function sssBand(score: number) {
		if (score <= 75) return { label: 'Remission', tone: 'mild', desc: 'Your symptoms are currently in the remission range.' };
		if (score <= 175) return { label: 'Mild IBS', tone: 'mild', desc: 'Your symptoms are present but relatively mild on the clinical scale.' };
		if (score <= 300) return { label: 'Moderate IBS', tone: 'moderate', desc: 'Your symptoms sit in the moderate range.' };
		return { label: 'Severe IBS', tone: 'severe', desc: 'Your symptoms are in the severe range.' };
	}
	// Lower-case band word for inline copy: "the {band} range", "your {band} starting point".
	function sssBandWord(score: number): string {
		if (score <= 75) return 'remission';
		if (score <= 175) return 'mild';
		if (score <= 300) return 'moderate';
		return 'severe';
	}

	// ── Safety override ────────────────────────────────────────────────────
	const RED_FLAGS = ['Blood in your stool','Unexplained weight loss','Persistent fever','Trouble swallowing','Symptoms that wake you from sleep','I\'m currently on prescription medication for my gut'];
	function checkSafety(a: Record<string, any>): boolean {
		const sel: string[] = Array.isArray(a.quick_check) ? a.quick_check : [];
		return sel.some((s) => RED_FLAGS.includes(s));
	}

	// ── Fit Score + archetype (from Act-5 single-select radios) ───────────
	function computeFitScore(a: Record<string, any>): { score: number; tier: string; type: string; personal: string } {
		const r = (id: string, len: number) => {
			const v = a[id]; if (!v) return 50;
			const i = (SCREENS.find((x) => x.id === id)?.options || []).indexOf(v);
			return i >= 0 ? Math.round(((len - 1 - i) / (len - 1)) * 100) : 50;
		};
		const flare = r('fit_flare', 4);
		const catastrophe = r('fit_catastrophe', 4);
		const open = r('fit_open', 4);
		const curious = r('fit_curious', 4);
		const muscle = r('fit_muscle', 4);
		const agency = r('fit_agency', 4);
		const invest = r('commit_invest', 4);
		const research = r('commit_research', 4);

		const score = Math.round(
			open * 0.16 + curious * 0.16 + muscle * 0.12 + agency * 0.16 +
			(100 - catastrophe) * 0.10 + flare * 0.08 + invest * 0.12 + research * 0.10
		);

		// Tier (spec fit_results uses "a strong / a promising / a possible responder").
		let tier: string, personal: string;
		if (score >= 72) { tier = 'a strong responder'; personal = "you're open to unconventional approaches and curious about what's driving your body — two of the strongest predictors we measure."; }
		else if (score >= 55) { tier = 'a promising responder'; personal = "you've got the openness and the agency that line up with people who get the most out of this."; }
		else { tier = 'a possible responder'; personal = "you show some of the traits, and the protocol may take a little longer to click."; }

		// Archetype — dominant trait cluster (spec §2: e.g. Analytical / Open Rebuilder / Cautious Starter).
		const openness = (open + curious) / 2;
		const analytical = (research + muscle) / 2;
		let type: string;
		if (score < 50) type = 'Cautious Starter';
		else if (openness >= analytical) type = 'Open Rebuilder';
		else type = 'Analytical Responder';

		return { score, tier, type, personal };
	}

	// ── Interpolation ─────────────────────────────────────────────────────
	function interp(s: string): string {
		const name = answers.name || '';
		const band = sssBandWord(sssScore);
		const X = String(sssScore ?? 0);
		const Y = String(Math.max(0, (sssScore ?? 0) - 50));
		const goalRaw = Array.isArray(answers.goal) ? (answers.goal[0] ?? '') : '';
		// Lower only the first character so embedded "I" stays correct.
		const goal = goalRaw ? goalRaw.charAt(0).toLowerCase() + goalRaw.slice(1) : 'get your life back';
		const duration = answers.duration ?? 'this long';
		const fs = fitScoreOut;

		return s
			.replace(/\{name\}/g, name)
			.replace(/\{band\}/g, band)
			.replace(/\{X\}/g, X)
			.replace(/\{Y\}/g, Y)
			.replace(/\{goal\}/g, goal)
			.replace(/\{duration\}/g, duration)
			.replace(/\{fit_score\}/g, String(fs.score))
			.replace(/\{fit_tier\}/g, fs.tier)
			.replace(/\{type\}/g, fs.type)
			.replace(/\{provider\}/g, providerName)
			.replace(/\{fit_personal\}/g, fs.personal);
	}

	function projY(score: number): number {
		return 140 - (Math.min(500, Math.max(0, score)) / 500) * 110;
	}

	// ── Reactive state ─────────────────────────────────────────────────────
	let idx      = $state(0);
	let answers  = $state<Record<string, any>>({});
	let touched  = $state<Record<string, boolean>>({});
	let uid      = $state('');

	let multiSel   = $state<string[]>([]);
	let sliderVal  = $state(50);
	let scaleAns   = $state<Record<number,number>>({});
	let emailVal   = $state('');
	let consentVal = $state(false);
	let nameVal    = $state('');
	let lessonAns  = $state(-1);
	let lessonRevealed = $state(false);
	let semanticVal = $state(2);

	const LOADER_MS = 6000;
	const LOADER_FINAL_MS = 14000;
	let loaderPct = $state(0);
	let loaderStates = $state<('pending'|'active'|'done')[]>([]);
	let submitLoading = $state(false);

	// Exit-intent modal
	let showExitModal = $state(false);
	let exitHandled = $state(false);

	// ── Derived ────────────────────────────────────────────────────────────
	let screen     = $derived(SCREENS[idx]);
	let canGoBack  = $derived(idx > 0 && screen.type !== 'loader');
	let sliderMax  = $derived(screen.days ? 10 : 100);

	let sssScore     = $derived(computeSssScore(answers));
	let sssBandOut   = $derived(sssBand(sssScore));
	let markerPct    = $derived(Math.min(100, (Math.min(500, sssScore) / 500) * 100));
	let chargeColor  = $derived(BAND_CHARGE[sssBandOut.tone] ?? 'var(--accent)');
	let scoreState   = $state(0);
	let markerState  = $state(0);

	let fitScoreOut  = $derived(computeFitScore(answers));
	let safetyFlagged = $derived(checkSafety(answers));

	// Insurance branch (literal spec §4).
	let hasCoverage  = $derived(!!answers.coverage_type && answers.coverage_type !== 'I do not have health coverage');
	let providerName = $derived(
		answers.insurance_provider && answers.insurance_provider !== "I'm not sure" && answers.insurance_provider !== 'Other'
			? answers.insurance_provider
			: 'your insurer'
	);
	let discountSub  = $derived(hasCoverage
		? `While ${providerName} doesn't cover Copables, we've applied a 15% discount to make the program more accessible for you.`
		: `Since you're paying out of pocket, we've applied a 15% discount to make the program more accessible for you.`);

	let rawProgress = $derived((idx + 1) / SCREENS.length);
	let progress    = $derived(Math.round(Math.pow(rawProgress, 0.7) * 100));

	let footEnabled = $derived(
		screen.type === 'multi'  ? multiSel.length > 0 :
		screen.type === 'email'  ? nameVal.trim().length >= 1 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal.trim()) && consentVal :
		screen.type === 'agree'  ? !!touched[screen.id] :
		screen.type === 'lesson' ? lessonRevealed :
		screen.type === 'projection' ? true :
		screen.type === 'slider' ? (screen.requiresInteraction ? !!touched[screen.id] : true) :
		true
	);

	// ── Persist ────────────────────────────────────────────────────────────
	$effect(() => {
		const snap = { index: idx, answers, touched };
		try { localStorage.setItem(STORAGE_KEY, JSON.stringify(snap)); } catch {}
	});

	// ── Sync per-screen state ──────────────────────────────────────────────
	$effect(() => {
		const s = SCREENS[idx];
		const saved = answers[s.id];
		if (s.type === 'multi')   { multiSel  = Array.isArray(saved) ? [...saved] : []; }
		if (s.type === 'slider')  { sliderVal = typeof saved === 'number' ? saved : (s.days ? 5 : 50); }
		if (s.type === 'scale')   { scaleAns  = (saved && typeof saved === 'object' && !Array.isArray(saved)) ? { ...saved } : {}; }
		if (s.type === 'email')   { emailVal  = saved?.email ?? ''; consentVal = saved?.consent ?? false; nameVal = answers.name ?? ''; }
		if (s.type === 'lesson')  { lessonAns = typeof saved === 'number' ? saved : -1; lessonRevealed = typeof saved === 'number' && saved >= 0; }
		if (s.type === 'agree')   { semanticVal = typeof saved === 'number' ? saved : 2; }
	});

	// ── Scorecard count-up ─────────────────────────────────────────────────
	$effect(() => {
		if (!screen.scorecard) return;
		scoreState = 0; markerState = 0;
		const dur = 1000, start = performance.now(); let raf = 0;
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

	// ── Loader animation ───────────────────────────────────────────────────
	$effect(() => {
		if (screen.type !== 'loader') return;
		const ms = screen.id === 'loader_final' ? LOADER_FINAL_MS : LOADER_MS;
		const lines = screen.lines as string[];
		const perLine = ms / lines.length;
		const paint = (activeIdx: number) => {
			loaderStates = lines.map((_, i) => i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending');
		};
		paint(0); loaderPct = 0;
		const timers: ReturnType<typeof setTimeout>[] = [];
		for (let i = 1; i <= lines.length; i++) timers.push(setTimeout(() => paint(i), perLine * i));
		let advanced = false;
		timers.push(setTimeout(() => { if (advanced) return; advanced = true; loaderPct = 100; next(); }, ms + 400));
		const startT = performance.now(); let raf = 0;
		const tick = () => { if (advanced) return; loaderPct = Math.min(Math.round((performance.now() - startT) / ms * 100), 99); raf = requestAnimationFrame(tick); };
		raf = requestAnimationFrame(tick);
		return () => { advanced = true; timers.forEach(clearTimeout); cancelAnimationFrame(raf); };
	});

	// ── Mount ──────────────────────────────────────────────────────────────
	onMount(() => {
		document.body.classList.add('quiz-body');
		let storedUid = localStorage.getItem('copables_uid') || '';
		if (!storedUid) { try { storedUid = crypto.randomUUID(); } catch { storedUid = Math.random().toString(36).slice(2); } localStorage.setItem('copables_uid', storedUid); }
		uid = storedUid;
		try { const sess = JSON.parse(localStorage.getItem('copables_session') || 'null'); if (sess?.uid) uid = sess.uid; } catch {}
		try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); if (saved?.index >= 0 && saved.index < SCREENS.length) { idx = saved.index; answers = saved.answers || {}; touched = saved.touched || {}; } } catch {}
		try { (window as any).posthog?.identify?.(uid); } catch {}
		const w = window as any; w.dataLayer = w.dataLayer || []; w.dataLayer.push({ event: 'quiz_started', user_id: uid });
		track('quiz_started', { uid });

		// Exit-intent on the BROWSER back button — trap with pushState + popstate.
		history.pushState({ copablesQuiz: true }, '');
		const onPopState = () => {
			if (exitHandled) return;            // user chose Leave — allow navigation
			showExitModal = true;
			history.pushState({ copablesQuiz: true }, ''); // re-trap so they stay
		};
		window.addEventListener('popstate', onPopState);

		// Also guard tab-close / refresh.
		const onBeforeUnload = (e: BeforeUnloadEvent) => {
			if (exitHandled) return;
			e.preventDefault(); e.returnValue = '';
		};
		window.addEventListener('beforeunload', onBeforeUnload);

		return () => {
			document.body.classList.remove('quiz-body');
			window.removeEventListener('popstate', onPopState);
			window.removeEventListener('beforeunload', onBeforeUnload);
		};
	});

	// ── Exit modal handlers ────────────────────────────────────────────────
	function handleExitAttempt() { if (!exitHandled) showExitModal = true; }
	function keepGoing() { showExitModal = false; } // state re-trapped in popstate handler
	function leaveNow() { exitHandled = true; showExitModal = false; reset(); window.location.href = '/'; }

	// ── Navigation ─────────────────────────────────────────────────────────
	let direction = $state<'fwd'|'back'>('fwd');
	function go(i: number) {
		if (i < 0 || i >= SCREENS.length) return;
		direction = i > idx ? 'fwd' : 'back';
		idx = i;
		track('quiz_screen', { uid, i, type: SCREENS[i].type, id: SCREENS[i].id });
	}
	// Skip-aware stepping (e.g. insurance_provider when no coverage).
	function next() {
		let i = idx + 1;
		while (i < SCREENS.length && SCREENS[i].skip?.(answers)) i++;
		go(i);
	}
	function back() {
		let i = idx - 1;
		while (i > 0 && SCREENS[i].skip?.(answers)) i--;
		go(i); // in-quiz Back never triggers the exit modal
	}
	function reset() { answers = {}; touched = {}; idx = 0; localStorage.removeItem(STORAGE_KEY); }

	// ── Answer handlers ────────────────────────────────────────────────────
	function chooseSingle(opt: string) {
		answers = { ...answers, [screen.id]: opt };
		if (idx >= SCREENS.length - 1) { setTimeout(finishQuiz, 240); return; }
		setTimeout(next, 240);
	}
	function toggleMulti(opt: string) {
		const sel = [...multiSel]; const i = sel.indexOf(opt);
		if (i >= 0) sel.splice(i, 1); else sel.push(opt);
		multiSel = sel; answers = { ...answers, [screen.id]: sel };
	}
	function onSlider(e: Event) {
		const v = parseInt((e.target as HTMLInputElement).value, 10);
		sliderVal = v; answers = { ...answers, [screen.id]: v }; touched = { ...touched, [screen.id]: true };
	}
	function setScale(stmtIdx: number, val: number) { scaleAns = { ...scaleAns, [stmtIdx]: val }; answers = { ...answers, [screen.id]: scaleAns }; }
	function chooseLesson(optIdx: number) { if (lessonRevealed) return; lessonAns = optIdx; answers = { ...answers, [screen.id]: optIdx }; lessonRevealed = true; }
	function onSemantic(e: Event) { const v = parseInt((e.target as HTMLInputElement).value, 10); semanticVal = v; answers = { ...answers, [screen.id]: v }; touched = { ...touched, [screen.id]: true }; }
	function sliderReadout(v: number): string {
		if (screen.days) return v + (v === 1 ? ' day' : ' days');
		return String(v);
	}
	function submitEmail() {
		if (!footEnabled || submitLoading) return;
		submitLoading = true;
		const email = emailVal.trim(); const name = nameVal.trim();
		answers = { ...answers, name, [screen.id]: { email, consent: consentVal } };
		track('quiz_email_captured', { uid, email, name, sss: computeSssScore(answers) });
		const w = window as any; w.dataLayer = w.dataLayer || []; w.dataLayer.push({ event: 'quiz_email_captured', user_id: uid, email, name });
		submitLoading = false; next();
	}
	function finishQuiz() {
		const email = answers.email?.email ?? '';
		const sss = computeSssScore(answers);
		const fit = computeFitScore(answers);
		const safety = checkSafety(answers);
		const goal = Array.isArray(answers.goal) ? answers.goal : [];
		const results = { uid, email, sss, fit, safety, goal, answers };
		try { localStorage.setItem(RESULTS_KEY, JSON.stringify(results)); } catch {}
		track('quiz_completed', { uid, email, sss, fit_score: fit.score, safety });
		const w = window as any; w.dataLayer = w.dataLayer || []; w.dataLayer.push({ event: 'quiz_complete', user_id: uid, email, sss });
		exitHandled = true; localStorage.removeItem(STORAGE_KEY);
		setTimeout(() => { window.location.href = '/quiz/ibs/results'; }, 240);
	}
	function continueScreen() {
		if (screen.type === 'email') { submitEmail(); return; }
		if (screen.id === 'conversion') { finishQuiz(); return; }
		if (!footEnabled) return; next();
	}
</script>

<svelte:head>
	<title>IBS Quiz — Is the Copables Protocol Right for You?</title>
	<meta name="description" content="A short assessment that works out whether the Copables 14-Day IBS Protocol is right for you." />
	<meta property="og:title" content="IBS Quiz — Copables" />
	<meta property="og:description" content="Find out if the Copables protocol fits your profile." />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<!-- Illustration placeholder — sized box, self-documenting, real art drops in here. -->
{#snippet illoBox(illo: { t: string; d: string })}
	<div class="qillo qillo--{illo.t}">
		<span class="qillo-label">illustration</span>
		<span class="qillo-desc">{illo.d}</span>
	</div>
{/snippet}

<div class="funnel">

	<!-- ── Top bar ─────────────────────────────────────────── -->
	<div class="qtop">
		<div class="qprog"><i style="width:{progress}%"></i></div>
		<div class="qbar">
			<button class="qback" style:visibility={canGoBack ? 'visible' : 'hidden'} onclick={back}>← Back</button>
			<a class="qbrand" href="/quiz/ibs" aria-label="Restart quiz" onclick={(e) => { e.preventDefault(); handleExitAttempt(); }}>
				<img src="/assets/wordmark.webp" alt="copables" />
			</a>
			<span class="qstep">{screen.tag ?? ''}</span>
		</div>
	</div>

	<!-- ── Scrollable stage ─────────────────────────────────── -->
	<main class="qstage">
		{#key idx}
		<div class="qwrap" class:wide={screen.wide}>
			<div class="qscreen" data-dir={direction}>

				<!-- ── SINGLE ─────────────────────────────────── -->
				{#if screen.type === 'single'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					{#if screen.bullets}
						<ul class="qbullets">{#each screen.bullets as b (b)}<li>{b}</li>{/each}</ul>
					{/if}
					<div class="q-options">
						{#each screen.options as opt (opt)}
							{@const chosen = answers[screen.id] === opt}
							<button class="q-opt" class:chosen type="button" onclick={() => chooseSingle(opt)}>
								<span class="lbl">{opt}</span><span class="chev">→</span>
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
							<button class="q-opt" class:selected={sel} type="button" onclick={() => toggleMulti(opt)}>
								<span class="box"><span>✓</span></span><span class="lbl">{opt}</span>
							</button>
						{/each}
					</div>

				<!-- ── SLIDER ─────────────────────────────────── -->
				{:else if screen.type === 'slider'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if screen.hint}<p class="qhint">{screen.hint}</p>{/if}
					<div class="qslider-wrap">
						<div class="qslider-bubble"><span class="reading">{sliderReadout(sliderVal)}</span></div>
						<input type="range" class="qrange" min="0" max={sliderMax} step="1" value={sliderVal} style="--fill:{(sliderVal / sliderMax * 100)}%" oninput={onSlider} />
						<div class="qends"><span>{screen.left}</span><span>{screen.right}</span></div>
						{#if screen.requiresInteraction && !touched[screen.id]}<p class="qslider-hint">Drag the slider to continue</p>{/if}
					</div>

				<!-- ── AGREE SLIDER ───────────────────────────── -->
				{:else if screen.type === 'agree'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh qagree-title">{screen.title}</h1>
					<div class="qsemantic">
						<div class="qsemantic-labels"><span class="sem-left">Not like me</span><span class="sem-right">Exactly like me</span></div>
						<input type="range" class="qrange sem-range" min="0" max="4" step="1" value={semanticVal} style="--fill:{(semanticVal / 4 * 100)}%" oninput={onSemantic} />
						{#if !touched[screen.id]}<p class="qslider-hint">Drag to rate</p>{/if}
					</div>

				<!-- ── MINI-LESSON ────────────────────────────── -->
				{:else if screen.type === 'lesson'}
					{#if screen.kick}<p class="q-kick">{screen.kick}</p>{/if}
					<h1 class="qh">{screen.title}</h1>
					{#if !lessonRevealed}
						<div class="q-options qlesson-opts">
							{#each screen.options as opt, oi (opt)}
								<button class="q-opt" class:chosen={lessonAns === oi} type="button" onclick={() => chooseLesson(oi)}>
									<span class="lbl">{opt}</span><span class="chev">→</span>
								</button>
							{/each}
						</div>
					{:else}
						<div class="qlesson-reveal">
							{#if screen.reveal_title_correct}<p class="qlesson-title">{lessonAns === screen.correct ? screen.reveal_title_correct : screen.reveal_title_wrong}</p>{/if}
							<p class="qlesson-text">{screen.reveal}</p>
						</div>
					{/if}

				<!-- ── PROJECTION ─────────────────────────────── -->
				{:else if screen.type === 'projection'}
					<div class="qinfo">
						{#if screen.illo}{@render illoBox(screen.illo)}{/if}
						{#if screen.sub}<p class="qsub qproj-lead">{interp(screen.sub)}</p>{/if}
						<h1 class="qh">{interp(screen.title)}</h1>
						{#if screen.sub2}<p class="qsub">{interp(screen.sub2)}</p>{/if}
						<div class="qproj-chart">
							{#if screen.type === 'projection'}
							{@const projScore = Math.max(0, sssScore - 50)}
							{@const endY = projY(projScore)}
							{@const midY = projY((sssScore + projScore) / 2)}
							<svg viewBox="0 0 300 160" class="proj-svg" role="img" aria-label="Projected IBS severity score over 14 days">
								<line x1="30" y1="140" x2="280" y2="140" stroke="var(--ink)" stroke-width="2"/>
								<line x1="30" y1="20" x2="30" y2="140" stroke="var(--ink)" stroke-width="2"/>
								<!-- do-nothing baseline (muted, flat) -->
								<line x1="30" y1={projY(sssScore)} x2="280" y2={projY(sssScore)} stroke="var(--ink-soft)" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.4"/>
								<text x="276" y={projY(sssScore) - 6} text-anchor="end" font-size="9" font-weight="700" fill="var(--ink-soft)" opacity="0.7">If nothing changes</text>
								<!-- protocol path (accent, declining) -->
								<path d="M 30 {projY(sssScore)} Q 155 {midY} 280 {endY}" fill="none" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>
								<path d="M 30 {projY(sssScore)} Q 155 {midY} 280 {endY} L 280 140 L 30 140 Z" fill="var(--accent-tint)" opacity="0.35"/>
								<circle cx="30" cy={projY(sssScore)} r="6" fill="var(--ink)"/>
								<circle cx="280" cy={endY} r="6" fill="var(--accent)"/>
								<text x="30" y={projY(sssScore) - 12} text-anchor="middle" font-size="13" font-weight="800" fill="var(--ink)">{sssScore}</text>
								<text x="280" y={endY - 12} text-anchor="middle" font-size="13" font-weight="800" fill="var(--accent-deep)">{projScore}</text>
								<text x="30" y="155" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink-soft)">Today</text>
								<text x="280" y="155" text-anchor="middle" font-size="10" font-weight="700" fill="var(--ink-soft)">Day 14</text>
							</svg>
							{/if}
						</div>
						<p class="qproj-disclaim">Based on published open-label trials; individual results vary and aren't guaranteed.</p>
					</div>

				<!-- ── INFO / REVEAL ──────────────────────────── -->
				{:else if screen.type === 'info'}
					<div class="qinfo">
						{#if screen.scorecard}
							{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
							{#if screen.illo}{@render illoBox(screen.illo)}{/if}
							<h1 class="qh qscore-headline">{interp(screen.title)}</h1>
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
										<div class="score-scale-labels"><span>Mild</span><span>Moderate</span><span>Severe</span></div>
									</div>
									<div class="band-stamp band-{sssBandOut.tone}">{sssBandOut.label}</div>
								</div>
							</div>
							{#if screen.sub}<p class="qsub qscore-sub">{interp(screen.sub)}</p>{/if}
							{#if screen.subhead}<h2 class="qsubhead">{interp(screen.subhead)}</h2>{/if}
							{#if screen.sub2}<p class="qsub qscore-sub">{interp(screen.sub2)}</p>{/if}
						{:else if screen.fitScore}
							{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
							{#if screen.illo}{@render illoBox(screen.illo)}{/if}
							<div class="qfit-score" style="--charge:{chargeColor}">
								<span class="fit-score-num">{fitScoreOut.score}</span>
								<span class="fit-score-of">/ 100 · OLP Fit</span>
							</div>
							<div class="qfit-type">{fitScoreOut.type}</div>
							<h1 class="qh">{interp(screen.title)}</h1>
							{#if screen.sub}<p class="qsub">{interp(screen.sub)}</p>{/if}
						{:else if screen.conversion}
							{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
							{#if screen.illo}{@render illoBox(screen.illo)}{/if}
							{#if safetyFlagged}
								<div class="qsafety-note">
									<p><strong>One thing first:</strong> you mentioned a symptom that warrants a doctor's eyes. Please check in with a clinician before starting this or any new protocol.</p>
								</div>
							{/if}
							<h1 class="qh">{interp(screen.title)}</h1>
							{#if screen.sub}<p class="qsub">{interp(screen.sub)}</p>{/if}
							<div class="qprice">
								<span class="qprice-was">${PRICE_FULL}</span>
								<span class="qprice-main">${PRICE_DISCOUNT}</span>
								<span class="qprice-sub">15% direct-pay discount applied · free shipping</span>
							</div>
							{#if screen.guarantee}<p class="qguarantee">{screen.guarantee}</p>{/if}
						{:else}
							{#if screen.kick}<p class="q-kick qinfo-eyebrow">{interp(screen.kick)}</p>{/if}
							{#if screen.illo}{@render illoBox(screen.illo)}{/if}
							<h1 class="qh">{interp(screen.title)}</h1>
							{#if screen.id === 'discount'}
								<p class="qsub">{discountSub}</p>
							{:else if screen.sub}
								<p class="qsub">{interp(screen.sub)}</p>
							{/if}
							{#if screen.sub2}<p class="qsub" style="margin-top:14px">{interp(screen.sub2)}</p>{/if}
						{/if}

						{#if screen.quote}
							<div class="qquote">
								<span class="qm">"</span>
								<p>{screen.quote.text}</p>
								<div class="by">
									<span class="avatar" style="background:{screen.quote.av[1]}">{screen.quote.av[0]}</span>
									<div><div class="nm">{screen.quote.by}</div><div class="role">{screen.quote.role}</div></div>
								</div>
							</div>
						{/if}

						{#if screen.expand}
							<div class="qcomp">
								{#each screen.expand as c (c.h)}
									<div class="qcomp-item"><span class="ic">{c.ic}</span><div><h3>{c.h}</h3><p>{c.p}</p></div></div>
								{/each}
							</div>
						{/if}

						{#if screen.harvard}<div class="qharvard"><img src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" /></div>{/if}
						{#if screen.cite}
							{#if screen.citeUrl}
								<p class="qcite"><a href={screen.citeUrl} target="_blank" rel="noopener noreferrer">{screen.cite}</a></p>
							{:else}
								<p class="qcite">{screen.cite}</p>
							{/if}
						{/if}
					</div>

				<!-- ── LOADER ─────────────────────────────────── -->
				{:else if screen.type === 'loader'}
					<div class="qloader">
						<div class="loader-dial">
							<svg viewBox="0 0 150 150">
								<circle class="lt" cx="75" cy="75" r="65"/>
								<circle class="lf" cx="75" cy="75" r="65" style="--loaddur:{(screen.id === 'loader_final' ? LOADER_FINAL_MS : LOADER_MS) / 1000}s"/>
							</svg>
							<div class="lpct">{loaderPct}%</div>
						</div>
						<p class="q-kick qinfo-eyebrow" style="justify-content:center">{interp(screen.loaderTitle ?? 'Building your result')}</p>
						{#if screen.loaderSubTitle}<p class="qsub" style="text-align:center;margin-bottom:18px">{interp(screen.loaderSubTitle)}</p>{/if}
						<div class="loader-lines">
							{#each (screen.lines || []) as line, k (k)}
								<div class="loader-line" class:active={loaderStates[k]==='active'} class:done={loaderStates[k]==='done'}>
									<span class="lck">✓</span><span>{line}</span>
								</div>
							{/each}
						</div>
						{#if screen.harvard_loader}<div class="qharvard" style="margin-top:24px"><img src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" /></div>{/if}
						{#if screen.loaderSub}
							<p class="qcite" style="text-align:center;margin-top:8px">
								{#if screen.harvardLoaderUrl}<a href={screen.harvardLoaderUrl} target="_blank" rel="noopener noreferrer">{screen.loaderSub}</a>{:else}{screen.loaderSub}{/if}
							</p>
						{/if}
					</div>

				<!-- ── EMAIL ──────────────────────────────────── -->
				{:else if screen.type === 'email'}
					<div class="qemail">
						{#if screen.kick}<p class="q-kick qinfo-eyebrow">{screen.kick}</p>{/if}
						<h1 class="qh">{interp(screen.title)}</h1>
						<p class="qsub">{interp(screen.sub)}</p>
						<div class="qemail-form">
							<input class="qfield qfield-name" type="text" autocomplete="given-name" placeholder="Your first name" bind:value={nameVal} />
							<input class="qfield" type="email" inputmode="email" autocomplete="email" placeholder="you@email.com" bind:value={emailVal} />
							<label class="qconsent">
								<input type="checkbox" bind:checked={consentVal} />
								<span>I agree to receive my results and understand my answers (including symptom info) are handled per the <a href="/privacy">Privacy Policy</a>.</span>
							</label>
						</div>
						<div class="qlock">No spam. Your assessment stays private.</div>
					</div>
				{/if}

			</div>
		</div>
		{/key}
	</main>

	<!-- ── Footer CTA ──────────────────────────────────────── -->
	{#if screen.type !== 'single' && screen.type !== 'loader'}
		<footer class="qfoot">
			<div class="qfoot-inner">
				<button class="btn btn--primary btn--lg qcontinue" disabled={!footEnabled || submitLoading} onclick={continueScreen}>
					{submitLoading ? 'Unlocking…' : (screen.cta ?? 'Continue')} {submitLoading ? '' : '→'}
				</button>
			</div>
		</footer>
	{/if}

</div>

<!-- ── Exit-intent modal ─────────────────────────────────────── -->
{#if showExitModal}
<div class="qmodal-overlay" role="dialog" aria-modal="true">
	<div class="qmodal">
		<h2 class="qmodal-title">Leave your assessment?</h2>
		<p class="qmodal-body">You're partway through. Your answers and your IBS Severity Score won't be saved if you go now.</p>
		<div class="qmodal-actions">
			<button class="btn btn--primary" onclick={keepGoing}>Keep going</button>
			<button class="qmodal-leave" onclick={leaveNow}>Leave</button>
		</div>
	</div>
</div>
{/if}

<style>
.funnel { position: fixed; inset: 0; display: grid; grid-template-rows: auto 1fr auto; background: var(--paper); color: var(--ink); font-family: var(--ff); }
.qtop { position: relative; z-index: 5; }
.qprog { height: 5px; background: rgba(20,19,15,.10); width: 100%; overflow: hidden; }
.qprog > i { display:block; height:100%; width:0%; background:var(--accent); border-radius:0 99px 99px 0; transition:width .55s cubic-bezier(.2,.8,.2,1); }
.qbar { display:flex; align-items:center; justify-content:space-between; gap:14px; height:60px; padding:0 clamp(16px,4vw,30px); max-width:1100px; margin:0 auto; width:100%; }
.qback { appearance:none; border:0; background:none; cursor:pointer; font-family:var(--ff); display:inline-flex; align-items:center; gap:7px; font-weight:800; font-size:14.5px; color:inherit; opacity:.62; padding:8px 6px; transition:opacity .15s, transform .15s; }
.qback:hover { opacity:1; transform:translateX(-2px); }
.qbrand { display:inline-flex; align-items:center; gap:9px; }
.qbrand img { height:19px; width:auto; display:block; }
.qstep { font-size:11px; font-weight:800; letter-spacing:.08em; text-transform:uppercase; opacity:.55; text-align:right; line-height:1.25; max-width:46%; }

.qstage { overflow-y:auto; overflow-x:hidden; -webkit-overflow-scrolling:touch; display:flex; }
.qstage::-webkit-scrollbar { width:0; }
.qwrap { width:100%; max-width:600px; margin:auto; padding:clamp(22px,5vw,48px) clamp(18px,4vw,30px) 28px; }
.qwrap.wide { max-width:720px; }

@media (prefers-reduced-motion:no-preference) {
	.qscreen { animation:qin .32s cubic-bezier(.2,.8,.2,1); }
	@keyframes qin { from { transform:translateX(var(--dir,16px)); opacity:0; } to { transform:none; opacity:1; } }
	.qscreen[data-dir="back"] { --dir:-16px; }
	.qscore .band-stamp { animation:stampIn .5s cubic-bezier(.2,.8,.2,1) .3s both; }
	@keyframes stampIn { from { transform:rotate(-1.5deg) scale(1.3); opacity:0; } to { transform:rotate(-1.5deg) scale(1); opacity:1; } }
	.proj-svg path { stroke-dasharray:400; stroke-dashoffset:400; animation:drawIn 1s cubic-bezier(.2,.8,.2,1) .2s forwards; }
	@keyframes drawIn { to { stroke-dashoffset:0; } }
	.q-opt:active { transform:scale(.97); }
}
@media (prefers-reduced-motion:reduce) {
	.qscreen { animation:fade .15s ease-out; }
	@keyframes fade { from { opacity:0; } to { opacity:1; } }
	.proj-svg path { stroke-dasharray:none; stroke-dashoffset:0; }
}

.q-kick { font-size:12.5px; font-weight:800; letter-spacing:.14em; text-transform:uppercase; color:var(--accent-deep); margin:0 0 14px; display:inline-flex; align-items:center; gap:9px; }
.q-kick::before { content:""; width:22px; height:2px; background:currentColor; display:inline-block; }
.qh { font-size:clamp(26px,4.2vw,38px); font-weight:800; line-height:1.05; letter-spacing:-0.025em; margin:0; }
.qsub { font-size:clamp(16px,1.7vw,18px); color:var(--ink-soft); line-height:1.5; margin:14px 0 0; }
.qhint { font-size:13px; font-weight:700; color:var(--ink-soft); margin:10px 0 0; opacity:.85; }

.qbullets { list-style:none; margin:18px 0 0; padding:0; display:grid; gap:10px; }
.qbullets li { position:relative; padding-left:22px; font-size:14.5px; color:var(--ink-soft); line-height:1.45; }
.qbullets li::before { content:"•"; position:absolute; left:0; color:var(--accent); font-weight:900; font-size:18px; line-height:1; }

.q-options { display:grid; gap:11px; margin-top:26px; }
.q-opt { display:flex; align-items:center; gap:14px; width:100%; text-align:left; cursor:pointer; background:#fff; border:2px solid var(--line); border-radius:15px; padding:16px 18px; font-family:var(--ff); font-size:16.5px; font-weight:700; color:var(--ink); transition:border-color .15s, background .15s, transform .08s, box-shadow .15s; }
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

.scale-list { display:grid; gap:14px; margin-top:26px; }
.scale-row { background:#fff; border:2px solid var(--line); border-radius:16px; padding:16px 18px 14px; transition:border-color .2s; }
.scale-row.answered { border-color:var(--accent); }
.scale-stmt { font-size:16.5px; font-weight:700; line-height:1.35; margin:0 0 13px; color:var(--ink); }
.scale-segs { display:grid; grid-template-columns:repeat(4,1fr); gap:7px; }
.scale-seg { appearance:none; cursor:pointer; font-family:var(--ff); font-weight:800; font-size:12.5px; border:1.5px solid var(--line); background:var(--paper); color:var(--ink-soft); border-radius:10px; padding:10px 4px; line-height:1.15; text-align:center; transition:.12s; }
.scale-seg:hover { border-color:var(--accent); color:var(--ink); }
.scale-seg.on { background:var(--accent); border-color:var(--accent); color:#fff; }

.qslider-wrap { margin-top:34px; }
.qslider-bubble { text-align:center; margin-bottom:22px; }
.reading { display:inline-block; font-weight:800; font-size:15px; letter-spacing:-0.01em; background:var(--accent-tint); color:var(--accent-deep); border-radius:999px; padding:9px 20px; min-width:140px; }
.qrange { -webkit-appearance:none; appearance:none; width:100%; height:10px; border-radius:999px; background:linear-gradient(90deg, var(--accent) var(--fill,50%), var(--line) var(--fill,50%)); outline:none; cursor:pointer; }
.qrange::-webkit-slider-thumb { -webkit-appearance:none; appearance:none; width:34px; height:34px; border-radius:50%; background:#fff; border:4px solid var(--accent); box-shadow:var(--shadow-md); cursor:grab; }
.qrange::-moz-range-thumb { width:34px; height:34px; border-radius:50%; background:#fff; border:4px solid var(--accent); box-shadow:var(--shadow-md); cursor:grab; }
.qends { display:flex; justify-content:space-between; gap:16px; margin-top:16px; }
.qends span { font-size:13.5px; font-weight:700; color:var(--ink-soft); max-width:44%; line-height:1.3; }
.qends span:last-child { text-align:right; }
.qslider-hint { text-align:center; font-size:12.5px; font-weight:700; color:var(--accent-deep); margin:14px 0 0; }

.qfoot { padding:14px clamp(16px,4vw,30px) calc(18px + env(safe-area-inset-bottom)); }
.qfoot-inner { max-width:600px; margin:0 auto; }
.qcontinue { width:100%; }
.qcontinue:disabled { opacity:.4; cursor:not-allowed; box-shadow:0 6px 0 var(--accent-deep); transform:none; }
.btn { display:inline-flex; align-items:center; justify-content:center; gap:10px; font-family:var(--ff); font-weight:800; font-size:17px; letter-spacing:-0.01em; padding:17px 30px; border-radius:999px; border:0; cursor:pointer; text-decoration:none; transition:transform .14s ease, box-shadow .2s ease; line-height:1; }
.btn--primary { background:var(--accent); color:#fff; box-shadow:0 6px 0 var(--accent-deep); }
.btn--primary:hover:not(:disabled) { transform:translateY(-2px); box-shadow:0 8px 0 var(--accent-deep); }
.btn--primary:active:not(:disabled) { transform:translateY(2px); box-shadow:0 3px 0 var(--accent-deep); }
.btn--lg { font-size:19px; padding:21px 40px; }

.qinfo-eyebrow { justify-content:center; }
.qinfo { text-align:center; }
.qinfo .qh { font-size:clamp(28px,4.6vw,42px); }
.qinfo .qsub { margin-left:auto; margin-right:auto; max-width:46ch; }

/* ── Illustration placeholders (§3b) ────────────────────── */
.qillo { border:2px dashed var(--ink-soft); border-radius:14px; background:rgba(20,19,15,.025); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:10px; text-align:center; padding:18px; margin:0 auto 22px; color:var(--ink-soft); }
.qillo--scene { width:100%; max-width:440px; min-height:200px; }
.qillo--spot { width:160px; min-height:140px; padding:14px; }
.qillo-label { font-size:9.5px; font-weight:800; letter-spacing:.18em; text-transform:uppercase; opacity:.7; border:1px solid var(--ink-soft); border-radius:99px; padding:3px 11px; }
.qillo-desc { font-size:12px; line-height:1.45; font-weight:600; max-width:36ch; opacity:.82; }
.qillo--spot .qillo-desc { font-size:10.5px; line-height:1.35; }

.qscore { margin-top:18px; }
.score-card { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); box-shadow: var(--frame-shadow); padding: clamp(24px,5vw,36px) clamp(20px,4vw,32px) clamp(22px,4vw,30px); text-align: center; }
.qscore .score-num { display:block; font-family: var(--ff); font-size: clamp(78px,18vw,116px); font-weight: 900; letter-spacing: -0.05em; line-height: .9; color: var(--ink); font-variant-numeric: tabular-nums; }
.qscore .score-of { display:block; font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-soft); margin-top:6px; }
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
.qscore .band-stamp { display:inline-block; margin:18px auto 0; font-size:13px; font-weight:900; letter-spacing:.14em; text-transform:uppercase; padding:8px 18px; border:2px solid var(--ink); border-radius:6px; transform:rotate(-1.5deg); box-shadow:3px 3px 0 var(--frame-ink); }
.qscore .band-stamp.band-mild { color:#1f5c3e; background:#e3f1e9; border-color:#1f5c3e; box-shadow:3px 3px 0 #1f5c3e; }
.qscore .band-stamp.band-moderate { color:var(--orange-deep); background:var(--orange-tint); border-color:var(--orange-deep); box-shadow:3px 3px 0 var(--orange-deep); }
.qscore .band-stamp.band-severe { color:var(--wine); background:#f4dde1; border-color:var(--wine); box-shadow:3px 3px 0 var(--wine); }
.qinfo .qscore-headline { font-size:clamp(24px,3.6vw,32px); margin:0; }
.qscore-sub { margin:18px auto 0; max-width:44ch; }
.qsubhead { font-size:clamp(18px,2.6vw,23px); font-weight:800; line-height:1.25; letter-spacing:-0.015em; margin:26px auto 0; max-width:30ch; }

.qfit-score { margin:10px auto 8px; }
.fit-score-num { font-size:clamp(64px,14vw,96px); font-weight:900; letter-spacing:-0.05em; line-height:.9; color:var(--charge, var(--accent)); font-variant-numeric:tabular-nums; }
.fit-score-of { display:block; font-size:13px; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--ink-soft); margin-top:6px; }
.qfit-type { display:inline-block; margin:6px auto 18px; font-size:13px; font-weight:900; letter-spacing:.1em; text-transform:uppercase; padding:8px 18px; border:2px solid var(--ink); border-radius:6px; transform:rotate(-1.5deg); box-shadow:3px 3px 0 var(--frame-ink); background:var(--paper-2); }

.qharvard { margin:18px auto 4px; max-width:220px; }
.qharvard img { width:100%; height:auto; display:block; opacity:.82; }
.qcite { font-size:12px; font-weight:700; color:var(--ink-soft); margin:16px 0 0; }
.qcite a { color:var(--ink); text-decoration:none; border-bottom:1.5px solid var(--accent); }
.qcite a:hover { color:var(--accent-deep); }

.qquote { text-align:left; background:var(--card); border:1px solid var(--line-2); border-radius:var(--radius-lg); padding:clamp(22px,3vw,30px); box-shadow:var(--shadow-sm); margin-top:26px; }
.qquote .qm { font-size:46px; line-height:0; height:22px; color:var(--accent); font-weight:900; display:block; }
.qquote p { font-size:17px; line-height:1.55; color:var(--ink-2); margin:16px 0 18px; font-weight:500; }
.qquote .by { display:flex; align-items:center; gap:12px; }
.nm { font-weight:800; font-size:15px; }
.role { font-size:12.5px; color:var(--ink-soft); font-weight:600; }
.avatar { width:42px; height:42px; border-radius:50%; display:grid; place-items:center; color:#fff; font-weight:800; font-size:14px; flex:none; }

.qcomp { display:grid; gap:12px; margin:24px 0 4px; text-align:left; }
.qcomp-item { display:grid; grid-template-columns:46px 1fr; gap:15px; align-items:start; background:var(--card); border:1px solid var(--line-2); border-radius:14px; padding:17px 18px; box-shadow:var(--shadow-sm); }
.qcomp-item .ic { width:46px; height:46px; border-radius:13px; background:var(--accent-tint); color:var(--accent-deep); display:grid; place-items:center; font-size:22px; font-weight:900; }
.qcomp-item h3 { font-size:17px; margin:0 0 4px; }
.qcomp-item p { font-size:14.5px; line-height:1.45; color:var(--ink-soft); margin:0; }

.qagree-title { font-size:clamp(22px,3.6vw,30px); line-height:1.3; }
.qsemantic { margin-top:34px; }
.qsemantic-labels { display:flex; justify-content:space-between; gap:16px; margin-bottom:14px; }
.qsemantic-labels span { font-size:14.5px; font-weight:700; line-height:1.3; max-width:46%; }
.qsemantic-labels .sem-left { text-align:left; color:var(--ink); }
.qsemantic-labels .sem-right { text-align:right; color:var(--ink-soft); }
.sem-range { margin-bottom:8px; }

.qlesson-opts { margin-top:24px; }
.qlesson-reveal { background:var(--accent-tint); border-radius:var(--radius); padding:22px 24px; margin-top:24px; text-align:left; }
.qlesson-title { font-weight:800; font-size:17px; color:var(--accent-deep); margin:0 0 10px; }
.qlesson-text { font-size:16px; line-height:1.55; color:var(--ink-2); margin:0; }

.qproj-lead { margin-top:0; }
.qinfo .qproj-lead { max-width:46ch; }
.qproj-chart { margin:24px auto; max-width:340px; }
.proj-svg { width:100%; height:auto; display:block; }
.qproj-disclaim { font-size:11.5px; font-weight:600; color:var(--ink-soft); line-height:1.45; margin:14px auto 0; opacity:.75; max-width:42ch; }

.qemail { text-align:center; }
.qemail-form { margin-top:28px; text-align:left; display:grid; gap:12px; }
.qfield { width:100%; font-family:var(--ff); font-size:17px; font-weight:600; color:var(--ink); background:#fff; border:2px solid var(--line); border-radius:14px; padding:17px 18px; outline:none; transition:border-color .15s, box-shadow .15s; }
.qfield::placeholder { color:#a59c89; }
.qfield:focus { border-color:var(--accent); box-shadow:0 0 0 4px var(--accent-tint); }
.qconsent { display:flex; align-items:flex-start; gap:11px; margin:16px 0 4px; cursor:pointer; }
.qconsent input { margin-top:3px; width:18px; height:18px; accent-color:var(--accent); flex:none; cursor:pointer; }
.qconsent span { font-size:13px; line-height:1.5; color:var(--ink-soft); font-weight:500; }
.qconsent a { color:var(--accent-deep); text-decoration:underline; text-underline-offset:2px; }
.qlock { display:inline-flex; align-items:center; gap:7px; font-size:12.5px; font-weight:700; color:var(--ink-soft); margin-top:16px; justify-content:center; }

.qsafety-note { background:rgba(242,144,30,.12); border:1.5px solid var(--orange); border-radius:var(--radius); padding:18px 20px; margin-bottom:18px; text-align:left; }
.qsafety-note p { margin:0; font-size:15px; line-height:1.5; color:var(--ink-2); }
.qsafety-note strong { color:var(--orange-deep); }

.qprice { margin:22px auto 16px; }
.qprice-was { font-size:22px; font-weight:800; letter-spacing:-0.02em; color:var(--ink-soft); text-decoration:line-through; margin-right:12px; vertical-align:middle; }
.qprice-main { font-size:clamp(40px,7vw,52px); font-weight:900; letter-spacing:-0.03em; color:var(--ink); vertical-align:middle; }
.qprice-sub { display:block; font-size:14px; font-weight:700; color:var(--ink-soft); margin-top:4px; }
.qguarantee { font-size:14px; font-weight:600; color:var(--ink-soft); line-height:1.5; margin:16px auto 0; max-width:40ch; font-style:italic; }

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

/* ── Exit modal ───────────────────────────────────────── */
.qmodal-overlay { position:fixed; inset:0; z-index:100; background:rgba(20,19,15,.5); display:grid; place-items:center; padding:24px; }
.qmodal { background:var(--paper); border:2px solid var(--ink); border-radius:var(--frame-radius-lg); box-shadow:var(--frame-shadow); padding:clamp(28px,5vw,40px); max-width:380px; text-align:center; }
.qmodal-title { font-size:clamp(22px,3.5vw,28px); font-weight:800; line-height:1.15; letter-spacing:-0.02em; margin:0 0 12px; }
.qmodal-body { font-size:16px; line-height:1.5; color:var(--ink-soft); margin:0 0 24px; }
.qmodal-actions { display:grid; gap:12px; }
.qmodal-leave { appearance:none; border:0; background:none; cursor:pointer; font-family:var(--ff); font-weight:700; font-size:14px; color:var(--ink-soft); padding:8px; }
.qmodal-leave:hover { color:var(--ink); }

@supports (height: 100dvh) { .funnel { height: 100dvh; } }
</style>
