<script>
	let { data } = $props();

	/** @type {Record<string, any>} */
	const posts = {
		'can-honest-placebos-really-work': {
			title: 'Can honest placebos really work?',
			author: 'Colin Siu',
			date: '11 October 2025',
			readTime: '5 min read',
			excerpt: 'The Paradox of Honest Placebos: How Sugar Pills Work Even When Patients Know They\'re Fake',
			content: [
				{ type: 'p', text: 'In 2012, a group of researchers at Massachusetts General Hospital did something that should have been impossible. They walked into a room full of people suffering from major depression and said, essentially, "We\'re going to give you pills that contain absolutely nothing—no active ingredients, no chemicals, just sugar and starch. And they might help you feel better."' },
				{ type: 'p', text: 'What happened next defied everything we thought we knew about medicine.' },
				{ type: 'p', text: 'The patients—twenty adults with moderate to severe depression—not only agreed to take the clearly labeled "placebo pills," but after four weeks, their depression scores dropped by 3.25 points on the Hamilton Depression Scale. That might not sound dramatic, but in the world of psychiatric medicine, it was extraordinary. The study, led by researcher Irving Kirsch, recruited patients faster than any depression trial in the hospital\'s history—4.13 patients per month compared to the usual 2.55. People were literally lining up to take fake medicine.' },
				{ type: 'p', text: 'This wasn\'t supposed to work. The placebo effect, as we\'ve understood it for decades, depends on a kind of benevolent deception. Patients improve because they believe they\'re receiving real treatment. Remove the belief—tell them it\'s just a sugar pill—and the magic should disappear.' },
				{ type: 'p', text: 'But that\'s not what happened.' },
				{ type: 'p', text: 'Consider what unfolded in Austria ten years later. Researcher Anne Schienle took sixty patients receiving cognitive behavioral therapy for depression and split them into two groups. Half received standard CBT. The other half got CBT plus daily drops of clearly labeled placebo oil before their relaxation homework. The group taking the honest placebos showed a 44% greater reduction in depression symptoms—a difference of 2.4 points on depression scales. Even more striking, they practiced their homework 23% more often than the therapy-only group.' },
				{ type: 'p', text: 'Or take the German study that found when healthy women were told they were receiving an inert nasal spray before being exposed to sadness-inducing stimuli, their emotional distress was reduced by nearly 0.8 standard deviations compared to controls—a large effect that happened immediately after just one dose.' },
				{ type: 'p', text: 'The pattern is unmistakable, but how do we explain it?' },
				{ type: 'p', text: 'The answer lies in a fundamental misunderstanding about the nature of belief itself. We\'ve been thinking about placebo effects all wrong. It\'s not that patients need to believe the treatment is real—it\'s that they need to believe in the possibility of feeling better.' },
				{ type: 'p', text: 'When Ted Kaptchuk, the Harvard researcher who pioneered much of this work, explains open-label placebos to patients, he doesn\'t lie about their contents. Instead, he shares a different kind of truth: that placebo effects are real, measurable, and can be triggered even when you know what\'s happening. He tells them that taking pills creates rituals and expectations, that the mind-body connection is powerful, and that simply participating in their own healing can create physiological changes.' },
				{ type: 'p', text: 'This reframes the entire transaction. Instead of "fooling" patients, doctors are inviting them into a partnership. The pill becomes a symbol—not of deception, but of agency. The act of taking it twice daily becomes a commitment to healing rather than passive consumption of medicine.' },
				{ type: 'p', text: 'What\'s most remarkable is how readily people accept this invitation. In Schienle\'s study, 70% of patients rated their placebo treatment as at least "quite effective". They weren\'t deluded; they were activated.' },
				{ type: 'p', text: 'This points to something profound about human psychology: we are not passive recipients of medical treatment but active participants in our own healing. The open-label placebo works because it acknowledges this partnership explicitly. It says, "Your mind has healing power, and this ritual will help you access it."' },
				{ type: 'p', text: 'Perhaps the most revolutionary implication isn\'t that sugar pills can work without deception—it\'s that healing isn\'t something done to us by medicine, but something we do with medicine. The pill doesn\'t cure; the taking of it does. The treatment isn\'t in the capsule; it\'s in the choosing to believe that feeling better is possible.' },
				{ type: 'p', text: 'In the end, the greatest placebo effect might be our own capacity for hope.' }
			],
			sources: [
				{ url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9228278/', text: 'PMC9228278' },
				{ url: 'https://pubmed.ncbi.nlm.nih.gov/35181385/', text: 'PubMed 35181385' },
				{ url: 'https://programinplacebostudies.org/wp-content/uploads/2018/10/Kaptchuk-Miller-BMJ-OLP-2018.pdf', text: 'Kaptchuk & Miller, BMJ 2018' }
			]
		},
		'why-do-honest-placebos-work': {
			title: 'Inside the paradox: why belief without deception is reshaping healthcare.',
			author: 'Colin Siu',
			date: '11 October 2025',
			readTime: '5 min read',
			excerpt: 'Inside the paradox: why belief without deception is reshaping healthcare.',
			content: [
				{ type: 'p', text: 'Dr. Anja Hahn had a problem. She wanted to test whether placebos could protect people from sadness, but there was one hitch: her research ethics board wouldn\'t let her lie to participants. So in 2022, she did something that seemed destined to fail. She handed 84 healthy women a nasal spray, told them it contained absolutely nothing therapeutic, explained exactly how placebos might work anyway, and then tried to make them sad with depressing music and negative self-talk.' },
				{ type: 'p', text: 'Amazingly, the women who\'d received the honest fake treatment experienced 50% less increase in sadness than those who got nothing at all.' },
				{ type: 'p', text: 'For over a century, the placebo effect has been medicine\'s most elegant deception: patients improve because they believe they\'re receiving real treatment. Strip away the deception, conventional wisdom said, and you strip away the power. Yet Hahn\'s study joined a growing body of evidence suggesting the opposite: transparency doesn\'t kill the placebo effect. It transforms it into something even more remarkable.' },
				{ type: 'p', text: 'Irving Kirsch, a psychologist studying depression in 2012, faced his own ethical dilemma. Instead of deceiving patients, he decided to try radical honesty. He recruited twenty people with major depression and told them: "You\'re getting placebo pills, they contain no active medication. But research shows placebos can be 80% as effective as antidepressants through psychological and physiological processes."' },
				{ type: 'p', text: 'After four weeks, participants\' depression scores dropped by 3.25 points on standard scales, enough to move from moderate-severe to mild-moderate depression. More telling was the recruitment rate: patients signed up faster than for any previous depression study at the hospital. People weren\'t just willing to take known placebos; they were eager to because there\'s no dependencies, no chemicals and no side effects.' },
				{ type: 'p', text: 'The key insight emerged from studying what happens in the brain during open-label placebo treatment. Unlike traditional placebos, which work through expectation and conditioning, honest placebos seem to activate something different: conscious participation in healing. When patients knowingly take a placebo, they\'re not being tricked into wellness. They\'re choosing to engage with their body\'s capacity for self-repair.' },
				{ type: 'p', text: 'This distinction matters profoundly. Traditional placebos create what researchers call "response expectancy", a passive hope that something external will provide relief. Open-label placebos generate what might be called "agency expectancy", an active belief in one\'s own power to influence outcomes. The pill becomes less important than the taking of it; the ritual matters more than the substance.' },
				{ type: 'p', text: 'The language researchers use with open-label placebo patients is absolutely crucial. Instead of "This will help you," they say "This might help you access your body\'s own healing mechanisms." Instead of promising a cure, they invite participation into healing. The difference is subtle but transformative; it shifts patients from consumers of medicine to collaborators in treatment.' },
				{ type: 'p', text: 'This collaborative model helps explain why open-label placebos work particularly well as add-ons to existing treatments like CBT. In Schienle\'s study, the placebo didn\'t compete with therapy; it enhanced it by increasing engagement and practice. The fake treatment became a real commitment device, a daily reminder to invest in healing.' },
				{ type: 'p', text: 'The implications stretch far beyond individual patients. In an era when medical costs soar and side effects multiply, open-label placebos offer something remarkable: treatments that are simultaneously effective, safe, and affordable. They work not by adding chemicals to the body but by adding intention to the healing process.' },
				{ type: 'p', text: 'Perhaps most importantly, honest placebos restore something medicine has gradually lost: the recognition that healing is fundamentally a partnership. Traditional medicine positions doctors as active agents and patients as passive recipients. Open-label placebos acknowledge what humans instinctively have long known: the patient\'s mind is not just along for the ride; it\'s driving.' },
				{ type: 'p', text: 'The question "Can placebos work when you know they\'re placebos?" misses the deeper point. Knowing they\'re placebos isn\'t what limits their power; it\'s what unlocks it. When we stop trying to trick the mind into healing and start inviting it to participate, we discover that consciousness itself might be medicine\'s most under-utilised drug.' },
				{ type: 'p', text: 'The future of healthcare may depend not on better deceptions, but on more honest collaborations between healthcare experts, patients, and the capacity for self-healing that lies within us all.' }
			],
			sources: [
				{ url: 'https://pubmed.ncbi.nlm.nih.gov/35181385/', text: 'PubMed 35181385' },
				{ url: 'https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/images/88529894/4c574a69-6e2d-486b-833c-12c8e31aa510/image.jpg', text: 'Study image reference' },
				{ url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9228278/', text: 'PMC9228278' }
			]
		},
		'unstuck-your-brain': {
			title: 'How to unstuck your brain from harmful, painful feedback loops',
			author: 'Colin Siu',
			date: '11 October 2025',
			readTime: '3 min read',
			excerpt: 'Learn how CBT and placebo rituals interrupt the body\'s stress cycles and teach your nervous system to reset instead of react.',
			content: [
				{ type: 'p', text: 'On a sweltering July afternoon, engineer Marcus Lee found himself trapped in a relentless mental loop. A critical email at work triggered a surge of anxiety, which led him to replay worst-case scenarios on a loop through the evening. His heart pounded, muscles tensed, and sleep evaporated. By morning, he felt exhausted—and even more on edge.' },
				{ type: 'p', text: 'Marcus\'s story isn\'t unique. Our brains are wired to learn from experience, but when negative thoughts and emotions take hold, they can spiral into self-reinforcing cycles. A single stressful event can echo through our nervous system, amplifying pain, anxiety, or depression long after the trigger has passed. Breaking these loops feels impossible: thinking about stress causes stress, which causes more worrying thoughts.' },
				{ type: 'p', text: 'Enter cognitive behavioral therapy (CBT) and the surprising power of placebo rituals. Both offer practical ways to "reset" your nervous system, replacing reaction with regulation. The key lies in interrupting the feedback loops that keep you stuck—and teaching your brain a new pattern: noting your stress, pausing, then choosing a calmer response.' },
				{ type: 'p', text: 'CBT does this through deliberate reframing. Imagine Marcus sits down each evening to track his anxious thoughts: "I\'m going to fail," "People will judge me." CBT teaches him to challenge these beliefs with evidence: "Last year I handled a worse project and succeeded," or "My teammates have praised my work." By practicing this reframing, Marcus begins to notice the pattern: stress leads to negative thoughts, which fuel more stress. Over weeks, rerouting that pattern lowers his baseline anxiety by an average of 30% in clinical trials.' },
				{ type: 'p', text: 'But reframing only goes so far if your body isn\'t able to exit fight-or-flight mode. That\'s where placebo rituals can help. In Austrian research, patients added honest placebo to their CBT homework. The act of taking the placebo, paired with a brief breathing exercise, became a ritual cue that signaling "time to shift" the nervous system. Remarkably, these patients experienced 44% greater symptom reduction versus CBT alone.' },
				{ type: 'p', text: 'Why does it work? Neuroscience shows that rituals (repeated, meaningful actions) activate the brain\'s "safety circuitry," dampening stress responses in the amygdala and boosting prefrontal regions that govern self-control. Taking a placebo with intention becomes a conditioning cue: your body learns that when you perform this ritual, it\'s safe to relax.' },
				{ type: 'p', text: 'Over time, your brain associates the ritual with reduced arousal, helping you break free from rumination loops.' },
				{ type: 'p', text: 'Another crucial technique is exposure and response prevention, borrowed from CBT. If Marcus fears criticism, he might deliberately send a draft email labeled "feedback welcome" and observe his anxiety peak, then choose not to edit obsessively. Each time he resists the urge to ruminate, he trains his nervous system to tolerate uncertainty and resets the feedback loop.' },
				{ type: 'p', text: 'Finally, build "reset anchors" into daily life. At set times—perhaps morning coffee or the end of work—pause for your ritual and a quick check-in: rate your stress on a 1–10 scale, then perform your ritual. This regular interruption prevents stress from accumulating unnoticed, keeping your brain flexible instead of stuck.' },
				{ type: 'p', text: 'In the end, breaking painful feedback loops isn\'t about eliminating stress; it\'s about teaching your brain a new pattern. CBT provides the reframing tools to challenge harmful thoughts, while placebo rituals offer a powerful cue to shift your nervous system from reaction to regulation. Together, they transform stress from a trap into a teachable moment—proving that even the most entrenched mental habits can be rewired with intention, practice, and a little paradoxical honesty.' }
			],
			sources: [
				{ url: 'https://iaap-journals.onlinelibrary.wiley.com/doi/full/10.1111/aphw.12444', text: 'Applied Psychology: Health and Well-Being' },
				{ url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9228278/', text: 'PMC9228278' }
			]
		}
	};

	let post = $derived(posts[data.slug] || { title: 'Blog Post', author: '', date: '', readTime: '', excerpt: '', content: [], sources: [] });
</script>

<svelte:head>
	<title>{post.title} — Copables Blog</title>
	<meta name="description" content={post.excerpt} />
	<meta property="og:title" content={post.title} />
	<meta property="og:description" content={post.excerpt} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content="https://copables.com/blog/{data.slug}" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta property="article:author" content={post.author} />
	<meta property="article:published_time" content={post.date} />
	<meta name="twitter:title" content={post.title} />
	<meta name="twitter:description" content={post.excerpt} />
	<meta name="twitter:image" content="https://copables.com/assets/lineup.webp" />
	{@html `<script type="application/ld+json">{"@context":"https://schema.org","@type":"BlogPosting","headline":"${post.title.replace(/"/g,'\\"')}","description":"${post.excerpt.replace(/"/g,'\\"')}","author":{"@type":"Person","name":"${post.author.replace(/"/g,'\\"')}"},"publisher":{"@type":"Organization","name":"Copables","logo":{"@type":"ImageObject","url":"https://copables.com/assets/wordmark.webp"}},"datePublished":"${post.date}","image":"https://copables.com/assets/lineup.webp","url":"https://copables.com/blog/${data.slug}"}</script>`}
</svelte:head>

<div class="blog">
	<!-- ── Back nav ───────────────────────────────────────────── -->
	<div class="blog-back">
		<div class="blog-inner">
			<a href="/blog" class="back">← All posts</a>
		</div>
	</div>

	<!-- ── Article ──────────────────────────────────────────── -->
	<article class="blog-article">
		<div class="blog-inner blog-article__inner">
			<header class="post-header">
				<div class="post-kicker">{post.readTime}</div>
				<h1 class="post-h1">{post.excerpt || post.title}</h1>
				<div class="post-byline">
					<span class="post-author">{post.author}</span>
					<span class="post-dot">·</span>
					<span class="post-date">{post.date}</span>
				</div>
			</header>

			<div class="post-body">
				{#each post.content as block}
					{#if block.type === 'p'}
						<p class="post-p">{block.text}</p>
					{/if}
				{/each}
			</div>

			{#if post.sources.length > 0}
				<div class="post-sources">
					<h3 class="sources-h">Sources</h3>
					<ul class="sources-list">
						{#each post.sources as s}
							<li><a href={s.url} target="_blank" rel="noopener noreferrer">{s.text}</a></li>
						{/each}
					</ul>
				</div>
			{/if}
		</div>
	</article>

	<!-- ── Try It Yourself CTA ──────────────────────────────── -->
	<section class="blog-cta">
		<div class="blog-inner">
			<p class="blog-cta__label">Try it yourself</p>
			<h2 class="blog-cta__head">Turn what you just read into <span class="blog-cta__accent">action.</span></h2>
			<p class="blog-cta__body">You now know how open-label placebos work. The next step is finding out if you're a good candidate — and which protocol fits your symptoms best.</p>
			<hr class="blog-cta__rule" />
			<p class="blog-cta__sub">Take a 2-minute assessment</p>
			<div class="blog-cta__grid">
				{#each [
					{ name: 'IBS Protocol', bg: '#2D1B2E', fg: '#fff', icon: 'ibs', href: '/quiz/ibs' },
					{ name: 'Depression Protocol', bg: '#5B9CF0', fg: '#0A2747', icon: 'mood', href: '/quiz/ibs' },
					{ name: 'PMS Protocol', bg: '#E2A8D5', fg: '#5A1D3A', icon: 'pms', href: '/quiz/ibs' },
					{ name: 'Anxiety Protocol', bg: '#C04A22', fg: '#FFEDD9', icon: 'anx', href: '/quiz/ibs' },
					{ name: 'Fatigue Protocol', bg: '#E5B83A', fg: '#4A2E00', icon: 'fat', href: '/quiz/ibs' }
				] as card}
					<a class="blog-cta__card" href={card.href} style="background:{card.bg}; color:{card.fg}">
						<div class="blog-cta__icon" aria-hidden="true">
							{#if card.icon === 'ibs'}
								<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="18" cy="16" r="9"/><circle cx="30" cy="32" r="9"/><path d="M12 22c-4 3-4 8 0 10"/><path d="M36 28c4 3 4 8 0 10"/></svg>
							{:else if card.icon === 'mood'}
								<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M10 38a14 14 0 0 1 28 0" fill="currentColor" fill-opacity="0.10"/><line x1="24" y1="10" x2="24" y2="5"/><line x1="12" y1="12" x2="8" y2="8"/><line x1="36" y1="12" x2="40" y2="8"/></svg>
							{:else if card.icon === 'pms'}
								<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="24" cy="24" r="12"/><path d="M30 14a10 10 0 0 0-10 16 10 10 0 0 1 10-16Z" fill="currentColor" fill-opacity="0.15"/></svg>
							{:else if card.icon === 'anx'}
								<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="24" cy="24" r="11"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="2" fill="currentColor"/></svg>
							{:else if card.icon === 'fat'}
								<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 30c12-10 22-10 32 0s14-8 18-12"/><circle cx="16" cy="22" r="3" fill="currentColor" fill-opacity="0.15"/><circle cx="32" cy="28" r="3" fill="currentColor" fill-opacity="0.15"/></svg>
							{/if}
						</div>
						<span class="blog-cta__name">{card.name}</span>
						<span class="blog-cta__btn">TAKE ASSESSMENT <span aria-hidden="true">→</span></span>
					</a>
				{/each}
			</div>
		</div>
	</section>

</div>

<style>
	.blog { background: #FFFDF7; color: #000; font-family: var(--ff); }
	.blog :global(*) { box-sizing: border-box; }
	.blog-inner { max-width: 1160px; margin: 0 auto; }
	.blog-inner--wide { max-width: 1200px; }
	.blog-kicker { font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #DE541E; margin-bottom: 18px; }
	.blog-h2 { font-size: clamp(36px, 5.2vw, 64px); font-weight: 700; letter-spacing: -0.03em; line-height: 0.98; margin: 0; }
	.blog-accent-blue { color: #1E6FD9; }
	.blog-sec { border-bottom: 3px solid #000; padding: 120px 48px; }

	/* ── Back nav ─────────────────────────────────────────── */
	.blog-back {
		border-bottom: 1px solid rgba(0,0,0,0.12);
		padding: 24px 48px;
	}
	.back {
		font-size: 14px;
		font-weight: 700;
		color: #000;
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border-bottom: 1.5px solid #000;
		padding-bottom: 2px;
	}
	.back:hover { opacity: 0.6; }

	/* ── Article ──────────────────────────────────────────── */
	.blog-article {
		border-bottom: 3px solid #000;
		padding: 80px 48px 120px;
	}
	.blog-article__inner {
		max-width: 720px;
		margin: 0 auto;
	}
	.post-header {
		margin-bottom: 56px;
	}
	.post-kicker {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: #DE541E;
		margin-bottom: 24px;
	}
	.post-h1 {
		font-size: clamp(36px, 4.6vw, 56px);
		font-weight: 700;
		letter-spacing: -0.03em;
		line-height: 1;
		margin: 0 0 22px;
	}
	.post-byline {
		font-size: 14px;
		color: #1B1C1C;
		font-weight: 400;
	}
	.post-author { font-weight: 700; }
	.post-dot { margin: 0 6px; opacity: 0.5; }
	.post-date { color: #52525C; }

	.post-body {
		display: flex;
		flex-direction: column;
		gap: 22px;
	}
	.post-p {
		font-size: 17px;
		font-weight: 300;
		line-height: 1.65;
		color: #1B1C1C;
		margin: 0;
	}

	.post-sources {
		margin-top: 72px;
		padding-top: 48px;
		border-top: 1px solid rgba(0,0,0,0.18);
	}
	.sources-h {
		font-size: 18px;
		font-weight: 700;
		color: #000;
		margin: 0 0 20px;
	}
	.sources-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 12px;
	}
	.sources-list a {
		font-size: 14px;
		font-weight: 500;
		color: #000;
		text-decoration: none;
		border-bottom: 1px solid #000;
		padding-bottom: 1px;
		word-break: break-all;
	}
	.sources-list a:hover { opacity: 0.6; }

	/* ── CTA ──────────────────────────────────────────────── */
	.blog-cta { border-bottom: 3px solid #000; padding: 100px 48px; background: #FFFDF7; }
	.blog-cta__label { font-size: 11px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; color: #1E6FD9; margin-bottom: 18px; }
	.blog-cta__head { font-size: clamp(36px, 5.2vw, 64px); font-weight: 700; letter-spacing: -0.03em; line-height: 0.98; margin: 0 0 22px; max-width: 18ch; }
	.blog-cta__accent { color: #1E6FD9; }
	.blog-cta__body { font-size: 17px; line-height: 1.6; color: #1B1C1C; max-width: 54ch; margin: 0 0 32px; }
	.blog-cta__rule { border: 0; height: 1px; background: rgba(0,0,0,0.12); margin: 0 0 24px; }
	.blog-cta__sub { font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: #000; margin-bottom: 18px; }
	.blog-cta__grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 14px; }
	.blog-cta__card { display: flex; flex-direction: column; justify-content: space-between; min-height: 170px; border-radius: 16px; padding: 18px 18px 16px; text-decoration: none; transition: transform 0.14s ease, box-shadow 0.2s ease; box-shadow: 0 4px 0 rgba(0,0,0,0.08); }
	.blog-cta__card:hover { transform: translateY(-3px); box-shadow: 0 7px 0 rgba(0,0,0,0.1); }
	.blog-cta__icon { width: 84px; height: 84px; margin-bottom: 10px; }
	.blog-cta__icon svg { width: 100%; height: 100%; }
	.blog-cta__name { font-size: 15px; font-weight: 700; letter-spacing: -0.01em; line-height: 1.25; margin-bottom: 32px; }
	.blog-cta__btn { display: inline-flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; padding: 9px 13px; border-radius: 999px; background: rgba(0,0,0,0.12); color: inherit; }
	.blog-cta__card:hover .blog-cta__btn { background: rgba(0,0,0,0.2); }

	/* ── Responsive ───────────────────────────────────────── */
	@media (max-width: 1024px) {
		.blog-back { padding: 20px 40px; }
		.blog-article { padding: 64px 40px 96px; }
		.blog-sec { padding: 96px 40px; }
		.blog-foot { padding: 72px 40px 36px; }
		.blog-cta { padding: 80px 40px; }
		.blog-cta__grid { grid-template-columns: repeat(3, 1fr); }
	}
	@media (max-width: 900px) {
		.blog-back { padding: 18px 32px; }
		.blog-article { padding: 56px 32px 80px; }
		.blog-sec { padding: 80px 32px; }
		.blog-foot { padding: 64px 32px 32px; }
		.blog-cta { padding: 64px 32px; }
		.blog-cta__grid { grid-template-columns: repeat(2, 1fr); }
		.blog-foot__grid { grid-template-columns: 1fr 1fr; gap: 32px; }
		.blog-foot__bottom { flex-direction: column; gap: 8px; }
	}
	@media (max-width: 540px) {
		.blog-back { padding: 16px 20px; }
		.blog-article { padding: 40px 20px 64px; }
		.blog-sec { padding: 64px 20px; }
		.blog-foot { padding: 48px 20px 28px; }
		.blog-cta { padding: 48px 20px; }
		.blog-cta__grid { grid-template-columns: 1fr; }
		.blog-h2 { font-size: clamp(32px, 9vw, 48px); }
		.post-h1 { font-size: clamp(32px, 8vw, 44px); }
		.post-p { font-size: 16px; }
		.blog-foot__grid { grid-template-columns: 1fr; }
	}
</style>
