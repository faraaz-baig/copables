<script>
	// ── The Science — faithful port of the Copables science design bundle.
	//    Palette, type, brutalist borders/shadows match the JSX prototypes.
	//    In-app destinations (assessment, shop, science, blog) are wired to
	//    internal routes; study citations + legal stay on copables.com.

	// Three editorial study sections (Origin / Matches / Framing) share one layout.
	const origin = {
		kicker: 'Where it started',
		kickerColor: '#DE541E',
		headline: 'A 2010 Harvard study changed what we knew about placebos.',
		body: `In 2010, a team at Harvard told eighty patients with IBS that the pills they were about to take were sugar pills — no medicine in them, nothing to absorb, nothing to do anything. They were asked to take them anyway, twice a day, for three weeks. After three weeks, the patients on the sugar pills were doing roughly twice as well as the patients who took nothing. They knew the pills were inert. The pills helped anyway.`,
		cite: 'Kaptchuk et al., 2010, PLoS ONE.',
		url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591',
		bg: '#FFFDF7', fg: '#000', citeBorder: 'rgba(0,0,0,0.5)'
	};
	const matches = {
		kicker: 'Honest = Deceptive',
		kickerColor: '#F0BE38',
		headline: 'Honest placebos can match deceptive ones.',
		body: `The double-blind trial — where neither patient nor doctor knows which pill is which — is the standard for proving a drug works. So in 2021, the Harvard group ran the obvious experiment. 262 IBS patients, six weeks, three groups: open-label placebo, double-blind placebo (disguised as either a sugar pill or peppermint oil, the way a real drug trial would run it), or no treatment at all. The two placebo groups improved by the same amount. Statistically, you couldn't tell them apart. Hiding the pill didn't make it work better.`,
		cite: 'Lembo et al., 2021, PAIN.',
		url: 'https://journals.lww.com/pain/Fulltext/2021/09000/Open_label_placebo_vs_double_blind_placebo_for.6.aspx',
		bg: '#422040', fg: '#FFE9F4', citeBorder: 'rgba(255,233,244,0.45)'
	};
	const framing = {
		kicker: 'Framing matters',
		kickerColor: '#DE541E',
		headline: 'How a placebo is framed changes how it works.',
		body: `In 2014, a Harvard team gave 66 migraine sufferers a series of pills to take across multiple migraine attacks. Sometimes the pill was Maxalt, an effective migraine drug. Sometimes it was sugar. And sometimes the labels were swapped — real Maxalt in an envelope marked "placebo," sugar pills in an envelope marked "Maxalt." The same chemical produced different amounts of relief depending on what the envelope said. Maxalt called placebo worked about as well as placebo called Maxalt. And the most striking result of all: a sugar pill honestly labelled "placebo" still produced more than half the pain relief of the real drug. The label is part of the medicine.`,
		cite: 'Kam-Hansen et al., 2014, Science Translational Medicine.',
		url: 'https://www.science.org/doi/10.1126/scitranslmed.3006175',
		bg: '#FFF6EF', fg: '#000', citeBorder: 'rgba(0,0,0,0.5)'
	};

	// Credential strip — real logos only.
	const logos = [
		{ src: '/assets/science/logo-harvard.png', alt: 'Harvard Medical School' },
		{ src: '/assets/science/logo-columbia.png', alt: 'Columbia University Vagelos College of Physicians and Surgeons' },
		{ src: '/assets/science/logo-danafarber.png', alt: 'Dana-Farber Cancer Institute' },
		{ src: '/assets/science/logo-mdanderson.png', alt: 'The University of Texas MD Anderson Cancer Center' }
	];

	const mechanisms = [
		{
			n: '01', title: 'Conditioned Expectation',
			img: '/assets/science/mech-dog-bell.png', imgAlt: 'Sketch of a dog responding to a bell — Pavlovian conditioning',
			body: `Your body has spent a lifetime learning that engaging with pills, rituals, and care often precedes relief — and reading about people like you who have gotten better strengthens that learned response. This creates a new prediction in your brain: this might help me, because it's helped others.`
		},
		{
			n: '02', title: 'Symptom Loop Reset',
			img: '/assets/science/mech-boy-thought.png', imgAlt: 'Sketch of a person with a tangled thought bubble untangling',
			body: `Functional symptoms create noisy feedback loops that amplify themselves — your body senses something off, your brain interprets it as danger, the alarm escalates. An honest placebo protocol can interrupt these loops, giving your nervous system a chance to recalibrate.`
		},
		{
			n: '03', title: 'The Reward of Action',
			img: '/assets/science/mech-girl-present.png', imgAlt: 'Sketch of a person holding a wrapped present',
			body: `Choosing to take action activates reward pathways in the brain. Neuroscience shows that the act of doing something feels measurably better than doing nothing — like when you decide to take a different route due to traffic. You feel better when you have ownership over your life.`
		}
	];

	const conditions = [
		{ name: 'IBS', stat: '90%', desc: 'improvement in IBS severity vs. control. 69% of participants reported clinically meaningful relief.', cite: 'Lembo et al., 2021', url: 'https://journals.lww.com/pain/Fulltext/2021/09000/Open_label_placebo_vs_double_blind_placebo_for.6.aspx', bg: '#422040', fg: '#FFE9F4' },
		{ name: 'Low Mood', stat: '22%', desc: 'reduction in negative emotions vs. control. Brain scans confirmed activation of emotion-regulation circuitry.', cite: 'Schaefer et al., 2022', url: 'https://www.nature.com/articles/s41386-022-01296-3', bg: '#55A8FA', fg: '#0A2747' },
		{ name: 'PMS', stat: '79%', desc: 'reduction in PMS symptoms in a 2025 RCT.', cite: 'Frey Nascimento et al., 2025', url: 'https://ebm.bmj.com/content/early/2025/03/03/bmjebm-2024-112875', bg: '#F2B5D4', fg: '#5A1D3A' },
		{ name: 'Anxiety', stat: '46%', desc: 'reduction in anxiety-induced test failure. Driving-test failure dropped from 53% to 29%.', cite: 'Schaefer & Enge, 2024', url: 'https://www.nature.com/articles/s41598-024-56600-6', bg: '#DE541E', fg: '#FFEDD9' },
		{ name: 'Fatigue', stat: '29%', desc: 'improvement in fatigue severity in cancer survivors. 39% improvement in fatigue-disrupted quality of life.', cite: 'Hoenemeyer et al., 2018', url: 'https://www.nature.com/articles/s41598-018-20993-y', bg: '#F0BE38', fg: '#4A2E00' }
	];

	const responders = [
		{ n: '01', title: 'People who understand the science.', body: `You don't have to believe the protocol will work for you specifically. You just have to find the science behind it credible enough to engage with. People who score the rationale as plausible respond more strongly than those who don't.` },
		{ n: '02', title: 'People who want to take back control.', body: `OLP works best for people in an active stance toward their condition rather than a passive one. Across multiple trials, people who feel they're taking action on their symptoms benefit more than people in a watchful-waiting frame.` },
		{ n: '03', title: 'People who actually show up.', body: `The strongest predictor of OLP response is behavioural adherence — people who do the protocol get the protocol's effects. Belief in whether it will work doesn't predict outcome. Willingness to show up, day after day, does.` }
	];

	const studies = [
		{ journal: 'PLoS ONE', year: '2010', title: 'Placebos can work even when you know.', body: 'Eighty IBS patients were told plainly that their pills were inert sugar pills, and asked to take them anyway — twice a day, for three weeks. After three weeks, they were doing roughly twice as well as the patients who took nothing.', url: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0015591' },
		{ journal: 'Neuropsychopharmacology', year: '2022', title: 'Brain scans show OLPs create legitimately different brain activity.', body: 'In an fMRI study, an honest-placebo group reported less distress to upsetting images — and three brain regions lit up differently, the same regions that quiet down under real anti-anxiety medication. A parallel result showed a 22% reduction in negative emotions versus control.', url: 'https://www.nature.com/articles/s41386-022-01296-3' },
		{ journal: 'Science Translational Medicine', year: '2014', title: 'How the placebo is framed changes how the placebo works.', body: 'Across multiple migraine attacks, the same chemical produced different amounts of relief depending on what the envelope said. A sugar pill honestly labelled "placebo" still produced more than half the pain relief of the real drug. The label is part of the medicine.', url: 'https://www.science.org/doi/10.1126/scitranslmed.3006175' },
		{ journal: 'PAIN', year: '2021', title: 'An honest placebo can match a deceptive one.', body: '262 IBS patients, six weeks, three groups. The open-label placebo group and the double-blind placebo group improved by the same amount — statistically, you couldn\'t tell them apart. Hiding the pill didn\'t make it work better.', url: 'https://journals.lww.com/pain/Fulltext/2021/09000/Open_label_placebo_vs_double_blind_placebo_for.6.aspx' },
		{ journal: 'BMJ Evidence-Based Medicine', year: '2025', title: 'Open-label placebo for premenstrual symptoms.', body: 'A 2025 randomized controlled trial reported a 79% reduction in PMS symptoms.', url: 'https://ebm.bmj.com/content/early/2025/03/03/bmjebm-2024-112875' },
		{ journal: 'Scientific Reports', year: '2024', title: 'Open-label placebo and performance anxiety.', body: 'A 46% reduction in anxiety-induced test failure. Driving-test failure dropped from 53% to 29%.', url: 'https://www.nature.com/articles/s41598-024-56600-6' },
		{ journal: 'Scientific Reports', year: '2018', title: 'Open-label placebo for cancer-related fatigue.', body: '29% improvement in fatigue severity in cancer survivors, and a 39% improvement in fatigue-disrupted quality of life.', url: 'https://www.nature.com/articles/s41598-018-20993-y' },
		{ journal: 'Journal of Affective Disorders', year: '2022', title: 'Cognitive behavioural therapy and lasting remission.', body: 'Across guided CBT trials for depression and anxiety, 52% achieved lasting remission at 12-month follow-up — versus 39% for treatment-as-usual.', url: 'https://www.sciencedirect.com/science/article/pii/S0165032722010217' }
	];

	const ctas = [
		{ name: 'IBS Protocol', bg: '#422040', fg: '#FFE9F4' },
		{ name: 'Depression Protocol', bg: '#55A8FA', fg: '#0A2747' },
		{ name: 'PMS Protocol', bg: '#F2B5D4', fg: '#5A1D3A' },
		{ name: 'Anxiety Protocol', bg: '#DE541E', fg: '#FFEDD9' },
		{ name: 'Fatigue Protocol', bg: '#F0BE38', fg: '#4A2E00' }
	];
</script>

<svelte:head>
	<title>Copables — The Science</title>
	<meta name="description" content="The evidence behind open-label placebos — one of the most fascinating findings in modern medicine. Research-backed results across five conditions." />
</svelte:head>

<!-- Reusable editorial study section (Origin / Matches / Framing) -->
{#snippet studyEditorial(/** @type {any} */ d)}
	<section class="sci-sec sci-study" style="background:{d.bg}; color:{d.fg}">
		<div class="sci-inner study-grid">
			<div>
				<div class="sci-kicker" style="color:{d.kickerColor}">{d.kicker}</div>
				<h2 class="study-h">{d.headline}</h2>
			</div>
			<div>
				<p class="study-body">{d.body}</p>
				<a class="study-cite" href={d.url} target="_blank" rel="noopener noreferrer" style="border-color:{d.citeBorder}; color:{d.fg}">
					{d.cite} — View Study →
				</a>
			</div>
		</div>
	</section>
{/snippet}

<div class="sci">

	<!-- ── Hero ─────────────────────────────────────────────── -->
	<section class="sci-hero">
		<div class="sci-hero__grid">
			<div class="sci-hero__img">
				<!-- stand-in: design uses a five-bottle lineup photo (asset not provided) -->
				<img src="/assets/ibs-bottle.png" alt="A Copables open-label placebo bottle on a soft cream backdrop." />
			</div>
			<div class="sci-hero__text">
				<div class="sci-hero__kicker">The Science</div>
				<h1 class="sci-hero__h1">Yes, <em>honest</em> <span class="sci-accent-blue">placebos</span> can work. Here's how.</h1>
				<p class="sci-hero__sub">The evidence behind one of the most fascinating findings in modern medicine.</p>
			</div>
		</div>
	</section>

	<!-- ── Origin study ─────────────────────────────────────── -->
	{@render studyEditorial(origin)}

	<!-- ── Credential strip ─────────────────────────────────── -->
	<section class="sci-logos">
		<div class="sci-logos__grid">
			<div class="sci-logos__label">Designed from the research of the world's leading scientific institutions</div>
			<div class="sci-logos__list">
				{#each logos as l (l.alt)}
					<img class="sci-uni-logo" src={l.src} alt={l.alt} />
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Mechanisms ───────────────────────────────────────── -->
	<section id="mechanism" class="sci-sec sci-mech">
		<div class="sci-inner">
			<div class="sci-mech__head">
				<div>
					<div class="sci-kicker">The mechanism</div>
					<h2 class="sci-h2">Three distinct mechanisms grounded in <span class="sci-accent-blue">neuroscience.</span></h2>
				</div>
				<p class="sci-mech__sub">Three overlapping responses, each with decades of research behind it.</p>
			</div>
			<div class="sci-mech__grid">
				{#each mechanisms as m (m.n)}
					<div class="sci-mech__cell">
						<div class="sci-mech__row">
							<div class="sci-mech__num">{m.n}</div>
							<h3 class="sci-mech__title">{m.title}</h3>
						</div>
						<div class="sci-mech__art">
							<img class="sci-mech__img" src={m.img} alt={m.imgAlt} />
						</div>
						<p class="sci-mech__body">{m.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Honest = Deceptive (dark) ────────────────────────── -->
	{@render studyEditorial(matches)}

	<!-- ── Framing matters ──────────────────────────────────── -->
	{@render studyEditorial(framing)}

	<!-- ── Evidence by condition ────────────────────────────── -->
	<section id="evidence" class="sci-sec sci-cond">
		<div class="sci-inner sci-inner--wide">
			<div class="sci-cond__head">
				<div class="sci-kicker">The evidence, by condition</div>
				<h2 class="sci-h2">Research-backed results across <span class="sci-accent-blue">five conditions.</span></h2>
			</div>
			<div class="sci-cond__grid">
				{#each conditions as c (c.name)}
					<div class="sci-cond__card" style="background:{c.bg}; color:{c.fg}">
						<div class="sci-cond__name">{c.name}</div>
						<div class="sci-cond__stat">{c.stat}</div>
						<div class="sci-cond__desc">{c.desc}</div>
						<div class="sci-cond__cite">{c.cite}</div>
						<a class="sci-cond__study" href={c.url} target="_blank" rel="noopener noreferrer" style="color:{c.fg}">View Study →</a>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── CBT / handwriting ────────────────────────────────── -->
	<section class="sci-sec sci-cbt">
		<div class="sci-inner">
			<div class="sci-cbt__head">
				<div class="sci-kicker">The other half</div>
				<h2 class="sci-h2 sci-h2--60">Handwriting changes <span class="sci-accent-orange">how you think.</span></h2>
			</div>
			<div class="sci-cbt__grid">
				<a class="sci-cbt__card" href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10853352/" target="_blank" rel="noopener noreferrer">
					<!-- stand-in for the study screenshot (asset not provided) -->
					<div class="sci-cbt__thumb">
						<span class="tg">Frontiers in Psychology</span>
						<span class="tt">Handwriting but not typewriting leads to widespread brain connectivity: a high-density EEG study with implications for the classroom</span>
					</div>
					<div class="sci-cbt__bar">
						<span class="l">Frontiers in Psychology · 2024</span>
						<span class="r">Read the study →</span>
					</div>
				</a>
				<div>
					<p class="sci-cbt__p1">A Copables protocol is designed around <b>physical interaction</b> — in addition to your placebo, you'll complete a daily card by hand, grounded in <b>cognitive behavioural therapy</b>, the most evidence-backed treatment in mental health.</p>
					<p class="sci-cbt__p2">The physical act of writing forces you to process your thoughts more deeply, allowing new patterns to take hold.</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ── Who responds best ────────────────────────────────── -->
	<section class="sci-sec sci-resp">
		<div class="sci-inner">
			<div class="sci-resp__head">
				<div>
					<div class="sci-kicker">Who responds best</div>
					<h2 class="sci-h2 sci-h2--60">Who responds best to <span class="sci-accent-orange">OLPs.</span></h2>
				</div>
				<p class="sci-resp__sub">The OLP responder literature is young, but three predictors have replicated across multiple trials.</p>
			</div>
			<div class="sci-resp__grid">
				{#each responders as r (r.n)}
					<div class="sci-resp__card">
						<div class="sci-resp__n">{r.n}</div>
						<h3 class="sci-resp__title">{r.title}</h3>
						<p class="sci-resp__body">{r.body}</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Peer-reviewed research ─────────────────────────────── -->
	<section id="studies" class="sci-sec sci-studies">
		<div class="sci-inner">
			<div class="sci-studies__grid">
				<!-- Left: sticky header (wrapped in full-height column so sticky has room to travel) -->
				<div class="sci-studies__col">
					<div class="sci-studies__head">
						<div class="sci-studies__kicker">The studies</div>
						<h2 class="sci-studies__h2">Peer-reviewed<br/>research.</h2>
						<p class="sci-studies__lead">Every Copables protocol is designed from the research of the world's leading scientific institutions — the studies that shaped our understanding of Open Label Placebos (OLPs).</p>
						<p class="sci-studies__sub">Each study below answers a question the one before it raises.</p>
					</div>
				</div>

				<!-- Right: scrollable list -->
				<div class="sci-studies__list">
					{#each studies as s, i (s.title)}
						<div class="sci-study-card" class:sci-study-card--last={i === studies.length - 1}>
							<div class="sci-study-card__meta">
								<span class="sci-study-card__journal">{s.journal}</span>
								<span class="sci-study-card__dot">·</span>
								<span class="sci-study-card__year">{s.year}</span>
							</div>
							<h3 class="sci-study-card__title">{s.title}</h3>
							<p class="sci-study-card__body">{s.body}</p>
							<a class="sci-study-card__link" href={s.url} target="_blank" rel="noopener noreferrer">
								Read paper <span class="arr">→</span>
							</a>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</section>

	<!-- ── CTA ──────────────────────────────────────────────── -->
	<section class="sci-sec sci-cta">
		<div class="sci-inner">
			<div class="sci-cta__head">
				<div class="sci-kicker">Why try it</div>
				<h2 class="sci-h2 sci-cta__h2">A sensible place to <span class="sci-accent-orange">start.</span></h2>
				<p class="sci-cta__sub">Open-label placebos don't work for everyone — but they're a low-stakes intervention that might. If you're serious about wanting to feel better, we'd recommend trying this lightweight approach before moving on to more drastic measures.</p>
			</div>
			<div class="sci-cta__divider">Check to see if you're a good candidate for OLP.</div>
			<div class="sci-cta__grid">
				{#each ctas as c (c.name)}
					<a class="sci-cta__card" href="/quiz/ibs" style="background:{c.bg}; color:{c.fg}">
						<div class="sci-cta__name">{c.name}</div>
						<div class="sci-cta__btn">Take Assessment →</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<!-- ── Who this isn't for ───────────────────────────────── -->
	<section class="sci-who">
		<div class="sci-inner sci-who__grid">
			<div class="sci-who__label">Who this isn't for</div>
			<p class="sci-who__p">Open-label placebos aren't the right tool for everyone. This protocol isn't intended for anyone in acute psychiatric crisis, anyone whose symptoms could mask a condition where delayed treatment has structural consequences (inflammatory bowel disease, for example, rather than IBS), or anyone for whom the premise itself feels unacceptable. If any of those describe you, please speak to a clinician before starting.</p>
		</div>
	</section>

	<!-- ── Footer ───────────────────────────────────────────── -->
	<footer class="sci-foot">
		<div class="sci-inner">
			<div class="sci-foot__grid">
				<div>
					<img class="sci-foot__logo" src="/assets/wordmark.png" alt="copables" />
					<p class="sci-foot__blurb">Where belief meets behavior. 14 days to a brighter, healthier you. Mind over medicine.</p>
				</div>
				<div>
					<div class="sci-foot__h">Protocols</div>
					<div class="sci-foot__link"><a href="/shop/low-mood">Low Mood</a></div>
					<div class="sci-foot__link"><a href="/shop/ibs">IBS</a></div>
					<div class="sci-foot__link"><a href="/shop/anxiety">Anxiety</a></div>
					<div class="sci-foot__link"><a href="/shop/pms">PMS</a></div>
					<div class="sci-foot__link"><a href="/shop/fatigue">Fatigue</a></div>
				</div>
				<div>
					<div class="sci-foot__h">Company</div>
					<div class="sci-foot__link"><a href="https://www.copables.com/protocol" target="_blank" rel="noopener noreferrer">How It Works</a></div>
					<div class="sci-foot__link"><a href="/science">The Science</a></div>
					<div class="sci-foot__link"><a href="/blog">Our Blog</a></div>
					<div class="sci-foot__link"><a href="/">Home</a></div>
				</div>
				<div>
					<div class="sci-foot__h">Legal</div>
					<div class="sci-foot__link"><a href="https://www.copables.com/terms" target="_blank" rel="noopener noreferrer">Terms</a></div>
					<div class="sci-foot__link"><a href="https://www.copables.com/privacy" target="_blank" rel="noopener noreferrer">Privacy</a></div>
					<div class="sci-foot__link"><a href="https://www.copables.com/eula" target="_blank" rel="noopener noreferrer">Cookies</a></div>
				</div>
			</div>
			<div class="sci-foot__bottom">
				<span>© 2026 Copables Ltd. All rights reserved.</span>
				<span>Mind over medicine.</span>
			</div>
		</div>
	</footer>

</div>

<style>
	/* ── Wrapper / shared ─────────────────────────────────── */
	.sci { background: #FFFDF7; color: #000; font-family: var(--ff); }
	.sci :global(*) { box-sizing: border-box; }
	.sci-inner { max-width: 1160px; margin: 0 auto; }
	.sci-inner--wide { max-width: 1200px; }

	.sci-sec { border-bottom: 3px solid #000; padding: 120px 48px; }
	.sci-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #DE541E; margin-bottom: 18px; }
	.sci-h2 { font-size: clamp(36px, 5.2vw, 64px); font-weight: 700; letter-spacing: -0.03em; line-height: 0.98; margin: 0; }
	.sci-h2--60 { font-size: clamp(34px, 5vw, 60px); }
	.sci-accent-blue { color: #1E6FD9; }
	.sci-accent-orange { color: #DE541E; }

	/* ── Nav ──────────────────────────────────────────────── */
	/* ── Hero ─────────────────────────────────────────────── */
	.sci-hero { border-bottom: 3px solid #000; }
	.sci-hero__grid { display: grid; grid-template-columns: 1fr 1fr; min-height: min(82vh, 880px); }
	.sci-hero__img { position: relative; background: #EFE9DE; overflow: hidden; display: flex; align-items: center; justify-content: center; }
	.sci-hero__img img { width: auto; height: auto; max-width: 78%; max-height: 78%; object-fit: contain; padding: clamp(24px, 3vw, 48px); }
	.sci-hero__text { background: #FFFDF7; display: flex; flex-direction: column; justify-content: center; padding: 96px clamp(48px, 6vw, 120px); }
	.sci-hero__kicker { font-size: 13px; font-weight: 700; letter-spacing: 0.22em; text-transform: uppercase; color: #DE541E; margin-bottom: 28px; }
	.sci-hero__h1 { font-size: clamp(40px, 4.6vw, 68px); line-height: 1.02; font-weight: 700; letter-spacing: -0.03em; margin: 0; color: #000; text-wrap: balance; }
	.sci-hero__h1 em { font-style: italic; font-weight: 400; }
	.sci-hero__sub { margin: 32px 0 0; font-size: 19px; font-weight: 300; line-height: 1.55; color: #1B1C1C; max-width: 480px; }

	/* ── Study editorial ──────────────────────────────────── */
	.sci-study { padding: 120px 48px; }
	.study-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 100px; align-items: start; }
	.study-h { font-size: clamp(32px, 4.6vw, 56px); font-weight: 700; letter-spacing: -0.03em; line-height: 1; margin: 0; }
	.study-body { font-size: 17px; font-weight: 300; line-height: 1.65; opacity: 0.92; margin: 0; }
	.study-cite { margin-top: 40px; display: inline-flex; align-items: center; gap: 10px; padding: 14px 24px; border-radius: 999px; border: 1.5px solid; text-decoration: none; font-size: 13px; font-weight: 500; }
	.study-cite:hover { opacity: 0.78; }

	/* ── Credential strip ─────────────────────────────────── */
	.sci-logos { background: #fff; border-bottom: 3px solid #000; }
	.sci-logos__grid { max-width: 1160px; margin: 0 auto; padding: 56px 48px; display: grid; grid-template-columns: 260px 1fr; gap: 48px; align-items: center; }
	.sci-logos__label { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; line-height: 1.45; border-right: 1px solid rgba(0, 0, 0, 0.14); padding-right: 32px; }
	.sci-logos__list { display: grid; grid-template-columns: repeat(4, 1fr); column-gap: 40px; row-gap: 28px; align-items: center; justify-items: center; }
	.sci-uni-logo { height: 42px; max-width: 100%; width: auto; object-fit: contain; display: block; }

	/* ── Mechanisms ───────────────────────────────────────── */
	.sci-mech { background: #fff; }
	.sci-mech__head { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: end; margin-bottom: 56px; }
	.sci-mech__sub { font-size: 19px; font-weight: 300; line-height: 1.55; color: rgba(0, 0, 0, 0.72); max-width: 460px; margin: 0; }
	.sci-mech__grid { display: grid; grid-template-columns: repeat(3, 1fr); border-top: 1px solid rgba(0, 0, 0, 0.18); }
	.sci-mech__cell { padding: 36px 28px 8px; border-right: 1px solid rgba(0, 0, 0, 0.18); display: flex; flex-direction: column; gap: 16px; }
	.sci-mech__cell:first-child { padding-left: 0; }
	.sci-mech__cell:last-child { padding-right: 0; border-right: none; }
	.sci-mech__row { display: flex; align-items: center; gap: 16px; }
	.sci-mech__num { width: 48px; height: 48px; border-radius: 999px; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 15px; font-weight: 700; flex: 0 0 auto; }
	.sci-mech__title { font-size: 26px; font-weight: 700; letter-spacing: -0.015em; margin: 0; line-height: 1.1; }
	.sci-mech__art { width: 100%; height: 200px; display: flex; align-items: center; justify-content: center; }
	.sci-mech__img { max-width: 100%; max-height: 100%; width: auto; height: auto; object-fit: contain; display: block; }
	.sci-mech__body { font-size: 16px; font-weight: 300; line-height: 1.55; margin: 0; color: rgba(0, 0, 0, 0.74); }

	/* ── Conditions ───────────────────────────────────────── */
	.sci-cond { background: #FFFDF7; }
	.sci-cond__head { margin-bottom: 48px; max-width: 880px; }
	.sci-cond__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
	.sci-cond__card { padding: 28px 22px 22px; border-radius: 12px; border: 2px solid #000; display: flex; flex-direction: column; min-height: 360px; }
	.sci-cond__name { font-size: 28px; font-weight: 700; letter-spacing: -0.01em; text-transform: uppercase; margin-bottom: 18px; line-height: 1; }
	.sci-cond__stat { font-size: 56px; font-weight: 700; letter-spacing: -0.04em; line-height: 0.92; margin-bottom: 14px; opacity: 0.92; }
	.sci-cond__desc { font-size: 14px; font-weight: 400; line-height: 1.45; flex: 1; }
	.sci-cond__cite { margin-top: 18px; padding-top: 14px; border-top: 1px solid currentColor; font-size: 12px; font-style: italic; line-height: 1.4; }
	.sci-cond__study { margin-top: 8px; font-size: 12px; font-weight: 700; text-decoration: none; border-bottom: 1px solid currentColor; padding-bottom: 1px; align-self: flex-start; }
	.sci-cond__study:hover { opacity: 0.78; }

	/* ── CBT ──────────────────────────────────────────────── */
	.sci-cbt { background: #FFF6EF; }
	.sci-cbt__head { margin-bottom: 56px; max-width: 980px; }
	.sci-cbt__grid { display: grid; grid-template-columns: 0.85fr 1fr; gap: 56px; align-items: start; }
	.sci-cbt__card { display: block; text-decoration: none; border: 2px solid #000; border-radius: 14px; overflow: hidden; background: #fff; box-shadow: 12px 12px 0 0 rgba(0, 0, 0, 0.18); color: #000; }
	.sci-cbt__card:hover { opacity: 1; }
	.sci-cbt__thumb { aspect-ratio: 4 / 3; background: #FFFDF7; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; padding: 32px; text-align: center; }
	.sci-cbt__thumb .tg { font-size: 11px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #DE541E; }
	.sci-cbt__thumb .tt { font-size: 18px; font-weight: 700; line-height: 1.3; color: #1B1C1C; max-width: 360px; }
	.sci-cbt__bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 14px 20px; border-top: 2px solid #000; background: #FFF6EF; }
	.sci-cbt__bar .l { font-size: 13px; font-weight: 500; letter-spacing: 0.04em; text-transform: uppercase; color: #52525C; }
	.sci-cbt__bar .r { font-size: 14px; font-weight: 600; color: #000; }
	.sci-cbt__p1 { font-size: 22px; font-weight: 300; line-height: 1.55; color: #1B1C1C; margin: 0; }
	.sci-cbt__p1 b { font-weight: 700; }
	.sci-cbt__p2 { font-size: 19px; font-weight: 300; line-height: 1.6; color: #1B1C1C; margin: 22px 0 0; }

	/* ── Responders ───────────────────────────────────────── */
	.sci-resp { background: #FFF6EF; }
	.sci-resp__head { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: end; margin-bottom: 56px; }
	.sci-resp__sub { font-size: 19px; font-weight: 300; line-height: 1.55; color: #1B1C1C; max-width: 500px; margin: 0; }
	.sci-resp__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
	.sci-resp__card { background: #FFFDF7; border: 2px solid #000; border-radius: 16px; padding: 28px 26px 30px; display: flex; flex-direction: column; gap: 16px; box-shadow: 8px 8px 0 0 rgba(0, 0, 0, 0.14); }
	.sci-resp__n { font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: #DE541E; }
	.sci-resp__title { font-size: 26px; font-weight: 700; letter-spacing: -0.015em; line-height: 1.15; margin: 0; color: #000; }
	.sci-resp__body { font-size: 16px; font-weight: 300; line-height: 1.55; margin: 0; color: #1B1C1C; }

	/* ── CTA ──────────────────────────────────────────────── */
	.sci-cta { background: #FFFDF7; }
	.sci-cta__head { margin-bottom: 36px; max-width: 820px; }
	.sci-cta__h2 { font-size: clamp(38px, 5.4vw, 64px); }
	.sci-cta__sub { font-size: 22px; font-weight: 300; line-height: 1.5; color: #1B1C1C; margin: 22px 0 0; max-width: 680px; }
	.sci-cta__divider { padding-top: 24px; margin-top: 16px; border-top: 1px solid rgba(0, 0, 0, 0.18); font-size: 13px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #000; }
	.sci-cta__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-top: 18px; }
	.sci-cta__card { padding: 20px 18px 16px; border-radius: 12px; border: 2px solid #000; text-decoration: none; display: flex; flex-direction: column; gap: 14px; min-height: 150px; }
	.sci-cta__card:hover { opacity: 0.92; }
	.sci-cta__name { font-size: 18px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.2; flex: 1; }
	.sci-cta__btn { background: rgba(255, 255, 255, 0.85); color: #000; padding: 8px 10px; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 6px; text-align: center; }

	/* ── Who this isn't for ───────────────────────────────── */
	.sci-who { background: #EDE5D2; border-bottom: 3px solid #000; padding: 120px 48px; }
	.sci-who__grid { display: grid; grid-template-columns: 200px 1fr; gap: 40px; align-items: start; }
	.sci-who__label { font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #000; }
	.sci-who__p { font-size: 16px; font-weight: 300; line-height: 1.65; color: #1B1C1C; margin: 0; max-width: 760px; }

	/* ── Footer ───────────────────────────────────────────── */
	.sci-foot { padding: 80px 48px 40px; background: #000; color: #fff; }
	.sci-foot__grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 48px; padding-bottom: 48px; border-bottom: 1px solid rgba(255, 255, 255, 0.2); }
	.sci-foot__logo { height: 26px; width: auto; filter: invert(1) brightness(1.7); }
	.sci-foot__blurb { margin-top: 20px; font-size: 16px; line-height: 1.5; font-weight: 300; max-width: 320px; color: rgba(255, 255, 255, 0.72); }
	.sci-foot__h { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700; color: rgba(255, 255, 255, 0.5); margin-bottom: 16px; }
	.sci-foot__link { margin-top: 10px; }
	.sci-foot__link a { font-size: 15px; font-weight: 500; color: #fff; text-decoration: none; }
	.sci-foot__link a:hover { opacity: 0.78; }
	.sci-foot__bottom { padding-top: 28px; display: flex; justify-content: space-between; gap: 16px; font-size: 12px; color: rgba(255, 255, 255, 0.5); letter-spacing: 0.04em; }

	/* ── Peer-reviewed studies (sticky left / scrollable right) ─ */
	.sci-studies { background: #fff; padding-top: 0; padding-bottom: 0; }
	.sci-studies__grid {
		display: grid;
		grid-template-columns: 1fr 1.2fr;
		gap: 80px;
	}
	.sci-studies__col {
		padding-top: 120px;
		padding-bottom: 120px;
	}
	.sci-studies__head {
		position: sticky;
		top: 100px;
	}
	.sci-studies__list {
		padding-top: 120px;
		padding-bottom: 120px;
	}
	.sci-studies__kicker {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #DE541E;
		margin-bottom: 24px;
	}
	.sci-studies__h2 {
		font-size: clamp(42px, 5.5vw, 72px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1.02;
		margin: 0 0 28px;
	}
	.sci-studies__lead {
		font-size: 19px;
		font-weight: 300;
		line-height: 1.6;
		color: #1B1C1C;
		margin: 0 0 18px;
		max-width: 420px;
	}
	.sci-studies__sub {
		font-size: 19px;
		font-weight: 300;
		line-height: 1.6;
		color: #1B1C1C;
		margin: 0;
		max-width: 420px;
	}
	.sci-studies__list {
		padding-top: 120px;
		padding-bottom: 120px;
	}
	.sci-study-card {
		border-top: 1px solid rgba(0, 0, 0, 0.14);
		padding: 40px 0;
	}
	.sci-study-card--last {
		border-bottom: 1px solid rgba(0, 0, 0, 0.14);
	}
	.sci-study-card__meta {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: #DE541E;
		margin-bottom: 14px;
	}
	.sci-study-card__dot { margin: 0 6px; opacity: 0.6; }
	.sci-study-card__title {
		font-size: clamp(22px, 2.4vw, 30px);
		font-weight: 700;
		letter-spacing: -0.02em;
		line-height: 1.15;
		margin: 0 0 14px;
		color: #000;
	}
	.sci-study-card__body {
		font-size: 16px;
		font-weight: 300;
		line-height: 1.6;
		color: #1B1C1C;
		margin: 0 0 18px;
	}
	.sci-study-card__link {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 14px;
		font-weight: 700;
		text-decoration: none;
		color: #000;
		border-bottom: 1.5px solid #000;
		padding-bottom: 2px;
	}
	.sci-study-card__link:hover { opacity: 0.6; }
	.sci-study-card__link .arr { font-size: 15px; transition: transform .15s; }
	.sci-study-card__link:hover .arr { transform: translateX(3px); }

	/* ── Credential strip captions ──────────────────────────── */
	/* ── Responsive ───────────────────────────────────────── */
	@media (max-width: 1024px) {
		.sci-sec { padding: 96px 40px; }
		.sci-study { padding: 120px 40px; }
		.sci-logos__grid { padding: 44px 40px; }
		.sci-studies__grid { gap: 60px; }
		.sci-studies__col { padding-top: 96px; padding-bottom: 96px; }
		.sci-studies__list { padding-top: 96px; padding-bottom: 96px; }
		.sci-who { padding: 96px 40px; }
		.sci-foot { padding: 72px 40px 36px; }
	}
	@media (max-width: 900px) {
		.sci-sec { padding: 80px 32px; }
		.sci-study { padding: 120px 32px; }
		.sci-hero__grid { grid-template-columns: 1fr; }
		.sci-hero__img { min-height: 320px; }
		.sci-hero__img img { max-width: 65%; max-height: 65%; padding: 24px; }
		.sci-hero__text { padding: 56px 32px; }
		.study-grid { grid-template-columns: 1fr; gap: 40px; }
		.sci-logos__grid { grid-template-columns: 1fr; gap: 28px; padding: 40px 32px; }
		.sci-logos__label { border-right: none; border-bottom: 1px solid rgba(0, 0, 0, 0.14); padding-right: 0; padding-bottom: 20px; }
		.sci-logos__list { grid-template-columns: repeat(2, 1fr); }
		.sci-mech__head, .sci-resp__head { grid-template-columns: 1fr; gap: 28px; align-items: start; }
		.sci-mech__grid, .sci-resp__grid { grid-template-columns: 1fr; }
		.sci-mech__cell { padding: 28px 0; border-right: none; border-bottom: 1px solid rgba(0, 0, 0, 0.18); }
		.sci-mech__cell:last-child { border-bottom: none; }
		.sci-cbt__grid { grid-template-columns: 1fr; gap: 32px; }
		.sci-cond__grid, .sci-cta__grid { grid-template-columns: repeat(2, 1fr); }
		.sci-studies__grid { grid-template-columns: 1fr; gap: 0; }
		.sci-studies__col { padding-top: 80px; padding-bottom: 32px; }
		.sci-studies__head { position: static; }
		.sci-studies__list { padding-top: 0; padding-bottom: 80px; }
		.sci-who { padding: 80px 32px; }
		.sci-who__grid { grid-template-columns: 1fr; gap: 16px; }
		.sci-foot { padding: 64px 32px 32px; }
		.sci-foot__grid { grid-template-columns: 1fr 1fr; gap: 32px; }
		.sci-foot__bottom { flex-direction: column; gap: 8px; }
	}
	@media (max-width: 640px) {
		.sci-sec { padding: 64px 24px; }
		.sci-study { padding: 120px 24px; }
		.sci-hero__img { min-height: 280px; }
		.sci-hero__img img { max-width: 60%; max-height: 60%; padding: 20px; }
		.sci-hero__text { padding: 40px 24px; }
		.sci-hero__h1 { font-size: clamp(36px, 11vw, 52px); }
		.sci-hero__sub { font-size: 18px; }
		.sci-studies__col { padding-top: 64px; padding-bottom: 24px; }
		.sci-studies__list { padding-top: 0; padding-bottom: 64px; }
		.sci-who { padding: 64px 24px; }
		.sci-foot { padding: 56px 24px 28px; }
	}
	@media (max-width: 540px) {
		.sci-cond__grid, .sci-cta__grid, .sci-logos__list, .sci-foot__grid { grid-template-columns: 1fr; }
		.sci-hero__img { min-height: 240px; }
		.sci-hero__img img { max-width: 55%; max-height: 55%; padding: 16px; }
		.sci-hero__text { padding: 36px 20px; }
		.sci-hero__kicker { font-size: 11px; margin-bottom: 18px; }
		.sci-hero__h1 { font-size: clamp(32px, 10vw, 44px); }
		.sci-hero__sub { font-size: 16px; margin-top: 20px; }
		.sci-sec { padding: 56px 20px; }
		.sci-study { padding: 120px 20px; }
		.sci-studies__col { padding-top: 56px; padding-bottom: 20px; }
		.sci-studies__list { padding-top: 0; padding-bottom: 56px; }
		.sci-studies__h2 { font-size: clamp(36px, 9vw, 48px); }
		.sci-who { padding: 56px 20px; }
		.sci-foot { padding: 48px 20px 28px; }
	}
</style>
