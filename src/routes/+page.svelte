<script lang="ts">
	import { track } from '$lib/analytics';
	import OlpChart from '$components/OlpChart.svelte';
	import Disclaimer from '$components/Disclaimer.svelte';

	function trackCTA(label: string) {
		track('cta_click', { label, page: 'home' });
	}

	// protocol pipeline — links to the real PDPs. Each card is colour-coded and
	// gets its own condition-relatable chalk illustration.
	const ILL = {
		// IBS — gut–brain loop (two linked organs)
		ibs: '<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><circle cx="100" cy="62" r="30"/><circle cx="100" cy="138" r="30"/><path d="M64 78 C 40 95, 40 120, 60 134"/><path d="M136 122 C 160 105, 160 80, 140 66"/><path d="M60 134 l 10 -2 m -10 2 l 2 -11"/><path d="M140 66 l -10 2 m 10 -2 l -2 11"/></g></svg>',
		// Anxiety — ripples radiating from a centre (alarm calming)
		anx: '<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)"><g fill="none" stroke="currentColor" stroke-width="3"><circle cx="100" cy="100" r="22"/><circle cx="100" cy="100" r="44"/><circle cx="100" cy="100" r="66"/><circle cx="100" cy="100" r="88"/></g><circle fill="currentColor" cx="100" cy="100" r="7"/></g></svg>',
		// Low Mood — sun rising over a horizon
		mood: '<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path fill="currentColor" stroke="none" d="M62 140 A38 38 0 0 1 138 140 Z"/><line x1="26" y1="140" x2="174" y2="140"/><line x1="100" y1="92" x2="100" y2="72"/><line x1="66" y1="100" x2="52" y2="88"/><line x1="134" y1="100" x2="148" y2="88"/><line x1="80" y1="94" x2="70" y2="80"/><line x1="120" y1="94" x2="130" y2="80"/></g></svg>',
		// PMS — moon + cycle markers
		pms: '<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)"><circle fill="none" stroke="currentColor" stroke-width="3" cx="100" cy="100" r="60"/><path fill="currentColor" d="M104 64 a36 36 0 1 0 0 72 a26 36 0 1 1 0 -72 Z"/><circle fill="currentColor" cx="100" cy="30" r="6"/><circle fill="currentColor" cx="170" cy="100" r="6"/><circle fill="currentColor" cx="100" cy="170" r="6"/></g></svg>',
		// Fatigue — energy wave settling
		fat: '<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" d="M20 118 C 50 70, 78 70, 100 104 S 150 150, 180 96"/><g fill="currentColor"><circle cx="48" cy="86" r="6"/><circle cx="100" cy="104" r="6"/><circle cx="156" cy="118" r="6"/></g></g></svg>'
	};
	const protocols = [
		{ name: 'IBS', href: '/shop/ibs', cat: 'Gut–brain axis', desc: 'A 14-day gut–brain protocol. Harvard RCT validated.', bg: '#F0D9DD', ink: '#7E2230', ill: ILL.ibs, flagship: true },
		{ name: 'Anxiety', href: '/shop/anxiety', cat: 'Nervous system', desc: "Daily ritual plus CBT to settle the body's alarm.", bg: '#F6DDD5', ink: '#B23C29', ill: ILL.anx },
		{ name: 'Low Mood', href: '/shop/low-mood', cat: 'Neurochemical', desc: 'Rebalancing low mood — without medication.', bg: '#DCE7F6', ink: '#25548F', ill: ILL.mood },
		{ name: 'PMS', href: '/shop/pms', cat: 'Cycle-aware', desc: 'Hormonal symptom management, tuned to your cycle.', bg: '#F7DBE9', ink: '#AF3675', ill: ILL.pms },
		{ name: 'Fatigue', href: '/shop/fatigue', cat: 'Energy reset', desc: 'Energy regulation through a nervous-system reset.', bg: '#FAE6C6', ink: '#A86A09', ill: ILL.fat }
	];

	$effect(() => {
		const io = new IntersectionObserver(
			(entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
			{ threshold: 0.1, rootMargin: '0px 0px -7% 0px' }
		);
		document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
		return () => io.disconnect();
	});
</script>

<svelte:head>
	<title>copables — Five evidence-based protocols for your own pharmacy</title>
	<meta
		name="description"
		content="Copables is a platform of clinically-backed 14-day open-label placebo protocols that unlock your brain's own pharmacy — for IBS, anxiety, low mood, PMS, and fatigue."
	/>
</svelte:head>

<div class="homepage" id="top">
	<!-- chalk roughen filter (document-wide) -->
	<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
		<filter id="chalk" x="-20%" y="-20%" width="140%" height="140%">
			<feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="2" seed="7" result="n" />
			<feDisplacementMap in="SourceGraphic" in2="n" scale="3.4" xChannelSelector="R" yChannelSelector="G" />
		</filter>
	</defs></svg>

	<!-- ===================== HERO ===================== -->
	<header class="home-hero">
		<div class="wrap">
			<div class="home-hero__grid">
				<div class="reveal">
					<div class="wavebar" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>
					<span class="hero-pill"><span class="dt"></span> Open-label placebos · Mind over medicine</span>
					<h1>Placebos can help even when <span class="squig">you know<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M3 8 C 40 2, 70 12, 100 6 S 165 2, 197 7" filter="url(#chalk)" /></svg></span>.</h1>
					<p class="lead">Five evidence-based protocols that harness your brain's own pharmacy to improve your condition.</p>
					<div class="hero-actions">
						<a class="btn btn--primary btn--lg" href="#protocols" onclick={() => trackCTA('hero_view_protocols')}>View All Protocols <span class="arrow">→</span></a>
					</div>
				</div>

				<div class="hero-art reveal">
					<div class="hero-art__frame"><img src="/assets/kit.webp" alt="The Copables kit — capsules, ritual cards, welcome guide and 14-day accountability tracker" width="1200" height="800" fetchpriority="high" decoding="async" /></div>
					<div class="hero-chip tl"><span class="ic" aria-hidden="true">14</span><span>14-day protocol<small>Analog + digital ritual</small></span></div>
					<div class="hero-chip br"><span class="ic" aria-hidden="true">✓</span><span>Harvard RCT<small>Peer-reviewed evidence</small></span></div>
				</div>
			</div>

			<div class="insts reveal">
				<p class="insts__lbl">Endorsed using research from the world's leading institutions</p>
				<div class="insts__row">
					<img class="inst-logo" src="/assets/science/logo-harvard.webp" alt="Harvard Medical School" loading="lazy" decoding="async" />
					<img class="inst-logo" src="/assets/science/logo-columbia.webp" alt="Columbia University" loading="lazy" decoding="async" />
					<img class="inst-logo" src="/assets/science/logo-danafarber.webp" alt="Dana-Farber Cancer Institute" loading="lazy" decoding="async" />
					<img class="inst-logo" src="/assets/science/logo-mdanderson.webp" alt="MD Anderson Cancer Center" loading="lazy" decoding="async" />
					<img class="inst-logo" src="/assets/science/logo-maryland.webp" alt="University of Maryland" loading="lazy" decoding="async" />
				</div>
			</div>
		</div>
	</header>

	<main>
		<!-- ===================== 01 · PROBLEM ===================== -->
		<section class="section band paper2">
			<div class="wrap">
				<p class="snum reveal"><span class="n">01</span> The problem <span class="rule"></span></p>
				<div class="prob-intro reveal">
					<h2 class="dhead dhead--lg measure-h">Where conventional care runs out.</h2>
					<p>You've done every test. Bloodwork, ultrasound, stool samples — all clear. And yet, it isn't. For millions, the diagnosis is one of exclusion, and the treatment never quite resolves.</p>
				</div>

				<div class="prob-grid">
					<div class="qcard tint-grey reveal">
						<div class="qcard__art">
							<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="100" cy="85" r="45"/>
								<path d="M100 130 v35"/>
								<path d="M85 160 h30"/>
								<rect x="82" y="82" width="36" height="20" rx="10" transform="rotate(-35 100 92)"/>
								<line x1="100" y1="82" x2="100" y2="102" transform="rotate(-35 100 92)"/>
							</g></svg>
						</div>
						<h3>Treated, not resolved.</h3>
						<p>Medication manages the symptom. On first-line drugs, most patients still miss the responder threshold — the cycle continues.</p>
					</div>

					<div class="qcard tint-blue reveal">
						<div class="qcard__art">
							<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<circle cx="72" cy="100" r="24"/>
								<path d="M38 80 l16 10 M36 100 l18 0 M38 120 l16 -10 M48 68 l12 14"/>
								<line x1="96" y1="100" x2="156" y2="100"/>
								<path d="M156 100 l-14 -8 M156 100 l-14 8"/>
							</g></svg>
						</div>
						<h3>Neural, not chemical.</h3>
						<p>Brain–gut–immune signalling is how the body creates symptoms. Most drugs simply don't speak that language.</p>
					</div>

					<div class="qcard tint-rose reveal">
						<div class="qcard__art">
							<svg class="ill" viewBox="0 0 200 200" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<path d="M70 155 L70 122 C 55 114, 50 88, 66 73 C 84 57, 118 57, 136 75 C 150 89, 147 111, 132 121 L 132 155"/>
								<path d="M100 90 l6 18 l18 5 l-18 5 l-6 18 l-6 -18 l-18 -5 l18 -5 Z"/>
							</g></svg>
						</div>
						<h3>A different substrate.</h3>
						<p>Your nervous system responds to expectation, ritual and belief. It always has — Copables is built on that substrate.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== 02 · SCIENCE ===================== -->
		<section class="section band" id="science">
			<div class="wrap">
				<p class="snum reveal"><span class="n">02</span> Inside-out <span class="rule"></span></p>
				<div class="edit reveal">
					<div class="edit__body">
						<h2 class="dhead dhead--lg">Your brain has its own pharmacy. It just needs to be unlocked.</h2>
						<p>Studies have shown that non-deceptive placebos can cause your brain to produce the very same symptom-relieving chemicals present in real pharmacology.</p>
						<a class="btn btn--primary" href="/science" onclick={() => trackCTA('science_evidence')}>See the Science <span class="arrow">→</span></a>
					</div>
					<div class="edit__media" style="background:#FBF6EA; display:grid; place-items:center;">
						<svg viewBox="0 0 240 240" class="science-chalk" aria-hidden="true" style="width:80%; height:auto;">
							<g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<!-- Minimal brain outline -->
								<path d="M120 35 C 95 35, 75 50, 70 72 C 55 68, 42 78, 38 98 C 22 105, 18 125, 28 142 C 24 158, 38 175, 55 180 C 65 195, 88 202, 110 198 C 120 205, 135 205, 145 198 C 168 202, 190 195, 200 180 C 218 175, 230 158, 226 142 C 236 125, 230 105, 214 98 C 210 78, 196 68, 180 72 C 175 50, 155 35, 130 35 Z"/>
								<!-- Simple fold lines -->
								<path d="M85 85 Q 100 95, 105 115"/>
								<path d="M155 85 Q 140 95, 135 115"/>
								<path d="M120 95 L 120 165"/>
								<!-- Keyhole -->
								<circle cx="120" cy="135" r="10"/>
								<path d="M120 142 L 120 158 L 114 158 L 114 148 L 114 142 Z" fill="#8A2433" stroke="none"/>
								<!-- Floating capsule -->
								<g transform="translate(175, 65) rotate(30)">
									<rect x="0" y="0" width="14" height="26" rx="7"/>
									<line x1="0" y1="13" x2="14" y2="13"/>
								</g>
								<!-- Small round pill -->
								<circle cx="55" cy="75" r="7"/>
								<line x1="55" y1="70" x2="55" y2="80"/>
							</g>
						</svg>
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== 04 · A NEW FIELD + CHART ===================== -->
		<section class="section band paper2" id="field">
			<div class="wrap">
				<p class="snum reveal"><span class="n">03</span> A new field <span class="rule"></span></p>
				<div class="edit reveal">
					<div class="edit__body">
						<h2 class="dhead dhead--lg">Placebos are one of the most underutilized tools in modern medicine.</h2>
						<p>Open Label Placebos are an emerging field of research whose benefits lie locked away in research labs. Until now.</p>
						<a class="link-arrow" href="/science" onclick={() => trackCTA('pubmed_link')}>View 272 OLP publications in PubMed <span aria-hidden="true">→</span></a>
					</div>
					<div class="edit__media edit__media--bare">
						<OlpChart />
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== 03 · ANALOG · DIGITAL ===================== -->
		<section class="section band" id="how">
			<div class="wrap">
				<p class="snum reveal"><span class="n">04</span> Analog · Digital <span class="rule"></span></p>
				<div class="edit reveal" style="margin-bottom:44px;">
					<div class="edit__media"><img src="/assets/ritual-cards.webp" alt="Copables welcome guide and ritual cards — the analog layer of the protocol" loading="lazy" decoding="async" /></div>
					<div class="edit__body">
						<h2 class="dhead dhead--lg">Copables is a 14-day protocol that leverages the power of the analog world and the digital world.</h2>
						<p>A physical kit arrives at your door — capsules, ritual cards and a welcome guide. Scan each day's card with the app for personalised CBT coaching and validated symptom tracking you can measure week over week.</p>
						<a class="btn btn--primary" href="/quiz/ibs" onclick={() => trackCTA('how_start')}>Start your protocol <span class="arrow">→</span></a>
					</div>
				</div>

				<div class="steps-row reveal">
					<div class="stepc">
						<div class="step-ill">
							<svg viewBox="0 0 120 120" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<rect x="28" y="42" width="64" height="48" rx="8"/>
								<path d="M28 54 h64"/>
								<path d="M52 42 v-10 c0 -5, 4 -8, 8 -8 s8 3, 8 8 v10"/>
								<rect x="44" y="66" width="32" height="6" rx="3"/>
								<circle cx="46" cy="86" r="5"/>
								<circle cx="62" cy="86" r="5"/>
								<circle cx="78" cy="86" r="5"/>
							</g></svg>
						</div>
						<h3>Receive your kit</h3><p>Capsules, ritual cards and a welcome guide, shipped to your door.</p>
					</div>
					<div class="stepc">
						<div class="step-ill">
							<svg viewBox="0 0 120 120" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="#25548F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<rect x="42" y="28" width="36" height="56" rx="10"/>
								<rect x="48" y="22" width="24" height="10" rx="5"/>
								<line x1="60" y1="38" x2="60" y2="50"/>
								<circle cx="60" cy="64" r="12"/>
								<path d="M54 64 l4 4 l8 -8"/>
								<rect x="50" y="82" width="20" height="6" rx="3"/>
							</g></svg>
						</div>
						<h3>Begin the ritual</h3><p>Take your capsules and follow the day's card prompt — ten minutes a day.</p>
					</div>
					<div class="stepc">
						<div class="step-ill">
							<svg viewBox="0 0 120 120" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="#D9760A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<rect x="38" y="18" width="44" height="72" rx="10"/>
								<circle cx="60" cy="78" r="5"/>
								<rect x="46" y="32" width="28" height="22" rx="4"/>
								<path d="M52 42 l4 4 l8 -8"/>
								<path d="M32 54 l-8 8 M32 54 l8 8"/>
								<circle cx="26" cy="58" r="4"/>
							</g></svg>
						</div>
						<h3>Scan for coaching</h3><p>Scan each card with the app for personalised CBT exercises.</p>
					</div>
					<div class="stepc">
						<div class="step-ill">
							<svg viewBox="0 0 120 120" aria-hidden="true"><g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
								<rect x="20" y="28" width="80" height="64" rx="8"/>
								<line x1="20" y1="44" x2="100" y2="44"/>
								<line x1="32" y1="84" x2="32" y2="56"/>
								<rect x="40" y="60" width="12" height="24" rx="2"/>
								<rect x="56" y="52" width="12" height="32" rx="2"/>
								<rect x="72" y="40" width="12" height="44" rx="2"/>
								<path d="M36 56 l8 -6 l8 4 l8 -10 l8 6"/>
								<circle cx="76" cy="34" r="4"/>
							</g></svg>
						</div>
						<h3>Track outcomes</h3><p>Validated symptom tracking shows what changes, week over week.</p>
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== 05 · THE PROMISE ===================== -->
		<section class="section band paper2 statement-l">
			<div class="wrap promise-wrap">
				<div class="promise-body reveal">
					<p class="snum"><span class="n">05</span> The promise <span class="rule"></span></p>
					<h2>No meds. <span class="w-o">No huge costs.</span> <span class="w-b">No doctor's office.</span></h2>
					<p class="s-sub">A clinically-grounded protocol you run from home in fourteen days — built on the same neurochemistry your prescriptions rely on.</p>
				</div>
				<div class="promise-media reveal" aria-hidden="true">
					<svg viewBox="0 0 320 280" class="promise-chalk">
						<!-- Pill bottle (top-left, crossed out) — blue tinted circle -->
						<g transform="translate(18, 18)">
							<circle cx="26" cy="42" r="38" fill="#DCE7F6" stroke="#8A2433" stroke-width="2"/>
							<g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<rect x="10" y="22" width="32" height="48" rx="5"/>
								<rect x="12" y="10" width="28" height="14" rx="3"/>
								<path d="M4 16 L48 76 M48 16 L4 76" stroke-width="3"/>
							</g>
						</g>

						<!-- Hospital / doctor (top-right, crossed out) — green tinted circle -->
						<g transform="translate(232, 18)">
							<circle cx="26" cy="42" r="38" fill="#D6F5E3" stroke="#8A2433" stroke-width="2"/>
							<g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<rect x="5" y="26" width="42" height="48" rx="4"/>
								<path d="M20 14 v12 h-6 v6 h6 v6 h6 v-6 h6 v-6 h-6 v-12 Z"/>
								<path d="M0 20 L52 80 M52 20 L0 80" stroke-width="3"/>
							</g>
						</g>

						<!-- Money / coins (bottom-left, crossed out) — orange tinted circle -->
						<g transform="translate(18, 178)">
							<circle cx="20" cy="30" r="38" fill="#FBE8CE" stroke="#8A2433" stroke-width="2"/>
							<g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<ellipse cx="20" cy="36" rx="18" ry="7"/>
								<ellipse cx="20" cy="28" rx="18" ry="7"/>
								<ellipse cx="20" cy="20" rx="18" ry="7"/>
								<path d="M0 6 L40 50 M40 6 L0 50" stroke-width="3"/>
							</g>
						</g>

						<!-- Home with heart (center, emphasized) — larger cream circle with blue rim -->
						<g transform="translate(100, 90)">
							<circle cx="55" cy="60" r="54" fill="#FBF6EA" stroke="#25548F" stroke-width="2.5"/>
							<g filter="url(#chalk)" fill="none" stroke="#8A2433" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
								<rect x="10" y="35" width="90" height="65" rx="5"/>
								<path d="M5 35 L55 8 L105 35"/>
								<rect x="75" y="12" width="12" height="18" rx="2"/>
								<rect x="40" y="65" width="22" height="35" rx="3"/>
								<rect x="18" y="55" width="16" height="16" rx="2"/>
								<line x1="26" y1="55" x2="26" y2="71"/>
								<line x1="18" y1="63" x2="34" y2="63"/>
								<path d="M55 48 C55 43 50 39 46 39 C42 39 39 43 39 48 C39 55 55 64 55 64 C55 64 71 55 71 48 C71 43 68 39 64 39 C60 39 55 43 55 48 Z"/>
							</g>
						</g>
					</svg>
				</div>
			</div>
		</section>

		<!-- ===================== ANAGRAM ===================== -->
		<section class="section band anagram-vibrant">
			<div class="wrap">
				<div class="edit edit--flip reveal">
					<div class="edit__body">
						<h2 class="dhead dhead--lg"><span class="wordmark-o">Copables</span> is an anagram of the word <span class="ital">"placebos."</span></h2>
						<div class="scramble" aria-hidden="true">
							<span class="tile hot">C</span><span class="tile hot">O</span><span class="tile">P</span><span class="tile">A</span><span class="tile">B</span><span class="tile">L</span><span class="tile">E</span><span class="tile">S</span>
						</div>
					</div>
					<div class="edit__media"><img src="/assets/lineup.webp" alt="The five Copables OLP protocols, lined up" loading="lazy" decoding="async" /></div>
				</div>
			</div>
		</section>

		<!-- ===================== REVIEWS ===================== -->
		<section class="section band reviews-section">
			<div class="wrap">
				<p class="snum reveal"><span class="n">℞</span> What members say <span class="rule"></span></p>
				<h2 class="dhead dhead--lg measure-h reveal">"I genuinely rolled my eyes ordering this. I'm on day 19 and my flare-ups have gone from daily to maybe twice."</h2>
				<div class="reviews-grid">
					<div class="review-card reveal">
						<div class="review-card__stars">★★★★★</div>
						<p class="review-card__body">"Three years, four gastros, every diet on the internet. I genuinely rolled my eyes ordering this. I'm on day 19 and my flare-ups have gone from daily to maybe twice. I don't fully understand it and I don't care."</p>
						<div class="review-card__meta">
							<span class="review-card__init" style="background:#F0D9DD; color:#7E2230">MK</span>
							<div><b>Maya K.</b><span>IBS Protocol</span></div>
						</div>
					</div>
					<div class="review-card reveal">
						<div class="review-card__stars">★★★★★</div>
						<p class="review-card__body">"I know it's 'only' a placebo. I do not care that it's working. The 5am dread spiral is just… quieter. I don't need to understand it to keep doing it."</p>
						<div class="review-card__meta">
							<span class="review-card__init" style="background:#F6DDD5; color:#B23C29">AR</span>
							<div><b>Aria R.</b><span>Anxiety Protocol</span></div>
						</div>
					</div>
					<div class="review-card reveal">
						<div class="review-card__stars">★★★★★</div>
						<p class="review-card__body">"The week before my period used to flatten me. Two cycles on the protocol and the crash is a slope, not a cliff. I know how it works and I still find it a little magic."</p>
						<div class="review-card__meta">
							<span class="review-card__init" style="background:#F7DBE9; color:#AF3675">NV</span>
							<div><b>Nadia V.</b><span>PMS Protocol</span></div>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- ===================== 06 · PROTOCOLS ===================== -->
		<section class="section band paper2" id="protocols">
			<div class="wrap">
				<p class="snum reveal"><span class="n">06</span> The protocols <span class="rule"></span></p>
				<div class="pipe-head reveal">
					<h2 class="dhead dhead--lg measure-h">Learn more about our Protocols.</h2>
					<p>Each protocol is purpose-built for one condition on the same evidence-based foundation — the same 14-day system, shaped to you.</p>
				</div>

				<div class="pipeline">
					{#each protocols as p (p.name)}
						<a class="icard reveal" class:flagship={p.flagship} href={p.href} style="--bg:{p.bg}; --ink-c:{p.ink};" onclick={() => trackCTA(`protocol_${p.name.toLowerCase()}`)}>
							{#if p.flagship}<span class="icard__badge">Flagship</span>{/if}
							<div class="icard__top"><span class="icard__name">{p.name}</span><span class="icard__avail">Available</span></div>
							<div class="icard__art">{@html p.ill}</div>
							<div class="icard__cat">{p.cat}</div>
							<p class="icard__desc">{p.desc}</p>
							<span class="icard__arrow" aria-hidden="true">↗</span>
						</a>
					{/each}

					<a class="icard icard--soon reveal" href="/quiz/ibs">
						<div>
							<div class="plus" aria-hidden="true">+</div>
							<h3>Coming soon</h3>
							<p>The pipeline is expanding. Sign up to be notified.</p>
						</div>
					</a>
				</div>

				<div class="pipe-foot reveal">
					<p>Not sure which protocol fits? Take the 2-minute assessment.</p>
					<a class="btn btn--ink" href="/quiz/ibs" onclick={() => trackCTA('pipeline_quiz')}>Find your protocol <span class="arrow">→</span></a>
				</div>
			</div>
		</section>

		<!-- ===================== FOOTER ===================== -->
		<footer class="home-foot">
			<div class="wrap">
				<div class="home-foot__grid">
					<div class="home-foot__brand">
						<img src="/assets/wordmark.webp" alt="copables" />
						<p>Five evidence-based protocols for your own pharmacy. Where belief meets biology — mind over medicine.</p>
						<div class="socials"><a href="/" aria-label="Instagram">IG</a><a href="/" aria-label="X">X</a><a href="/" aria-label="TikTok">TT</a></div>
					</div>
					<div class="fcol"><h4>Protocols</h4><ul><li><a href="/shop/ibs">IBS</a></li><li><a href="/shop/anxiety">Anxiety</a></li><li><a href="/shop/low-mood">Low Mood</a></li><li><a href="/shop/pms">PMS</a></li><li><a href="/shop/fatigue">Fatigue</a></li></ul></div>
					<div class="fcol"><h4>Company</h4><ul><li><a href="#how">How it works</a></li><li><a href="/science">The Science</a></li><li><a href="/blog">Our Blog</a></li><li><a href="#top">About</a></li></ul></div>
					<div class="fcol"><h4>Legal</h4><ul><li><a href="/terms">Terms</a></li><li><a href="/privacy">Privacy</a></li><li><a href="/cookies">Cookies</a></li></ul></div>
				</div>
				<div class="home-foot__disc"><Disclaimer /></div>
				<div class="home-foot__legal">
					<p>© 2026 Copables Ltd. All rights reserved.</p>
					<p>Mind over medicine.</p>
				</div>
			</div>
		</footer>
	</main>
</div>

<style>
	.homepage { background: var(--paper); color: var(--ink); font-family: var(--ff); }
	.homepage :global(*) { box-sizing: border-box; }
	.wrap { width: 100%; max-width: var(--maxw-home, 1180px); margin: 0 auto; padding: 0 24px; }
	.section { padding: clamp(64px, 8vw, 112px) 0; }
	.band { border-top: var(--section-divider); }
	.band.paper2 { background: var(--paper-2); }

	h1, h2, h3, h4 { margin: 0; }
	.dhead { font-weight: 800; letter-spacing: -0.03em; line-height: 1; }
	.dhead--xl { font-size: clamp(38px, 5.6vw, 74px); line-height: 0.98; }
	.dhead--lg { font-size: clamp(32px, 4.4vw, 56px); }
	.measure-h { max-width: 15ch; }

	.snum { display: flex; align-items: center; gap: 14px; margin: 0 0 22px; font-size: 12.5px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--ink-soft); }
	.snum .n { font-variant-numeric: tabular-nums; color: var(--orange-deep); border: 1.5px solid currentColor; border-radius: 999px; padding: 3px 10px; font-size: 11px; }
	.snum .rule { flex: 1 1 auto; height: 1px; background: var(--line); max-width: 80px; }

	.squig { position: relative; white-space: nowrap; }
	.squig svg { position: absolute; left: -2%; bottom: -0.34em; width: 104%; height: 0.42em; overflow: visible; }
	.squig svg path { fill: none; stroke: var(--orange); stroke-width: 5; stroke-linecap: round; }

	/* buttons */
	.btn { display: inline-flex; align-items: center; justify-content: center; gap: 10px; font-family: var(--ff); font-weight: 800; font-size: 16px; letter-spacing: -0.01em; padding: 15px 26px; border-radius: 999px; border: 0; cursor: pointer; text-decoration: none; line-height: 1; white-space: nowrap; transition: transform 0.14s ease, box-shadow 0.2s ease; }
	.btn--primary { background: var(--blue); color: #fff; box-shadow: 0 6px 0 var(--blue-deep); }
	.btn--primary:hover { transform: translateY(-2px); box-shadow: 0 8px 0 var(--blue-deep); }
	.btn--ink { background: var(--ink); color: var(--paper); box-shadow: 0 6px 0 #000; }
	.btn--ink:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #000; }
	.btn--primary:active, .btn--ink:active { transform: translateY(2px); box-shadow: 0 3px 0 var(--blue-deep); }
	.btn--lg { font-size: 18px; padding: 19px 36px; }
	.arrow { font-size: 1.1em; line-height: 0; }
	.link-arrow { display: inline-flex; align-items: center; gap: 8px; font-weight: 800; color: var(--ink); text-decoration: none; border-bottom: 2px solid var(--orange); padding-bottom: 2px; white-space: nowrap; }
	.link-arrow:hover { opacity: 0.7; }

	/* hero */
	.home-hero { position: relative; overflow: hidden; }
	.home-hero::before { content: ''; position: absolute; inset: 0; z-index: 0; opacity: 0.5; background-image: radial-gradient(rgba(20, 19, 15, 0.05) 1px, transparent 1.4px); background-size: 22px 22px; -webkit-mask: radial-gradient(120% 90% at 80% 0%, #000, transparent 70%); mask: radial-gradient(120% 90% at 80% 0%, #000, transparent 70%); }
	.home-hero .wrap { position: relative; z-index: 2; }
	.home-hero__grid { display: grid; grid-template-columns: 1fr; gap: 44px; align-items: center; padding: clamp(40px, 6vw, 78px) 0 clamp(48px, 6vw, 72px); }
	@media (min-width: 940px) { .home-hero__grid { grid-template-columns: 1.08fr 0.92fr; gap: 60px; } }
	.hero-pill { display: inline-flex; align-items: center; gap: 10px; margin: 0 0 26px; font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink); background: #fff; border: 1px solid var(--line); padding: 8px 15px; border-radius: 999px; box-shadow: var(--shadow-sm); }
	.hero-pill .dt { width: 5px; height: 5px; border-radius: 50%; background: var(--orange); }
	.home-hero h1 { font-size: clamp(42px, 6.2vw, 78px); line-height: 1; letter-spacing: -0.035em; font-weight: 800; margin: 0 0 26px; }
	.home-hero .lead { max-width: 40ch; font-size: clamp(18px, 1.5vw, 21px); color: var(--ink-soft); }
	.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; align-items: center; margin: 32px 0 0; }
	.hero-art { position: relative; }
	.hero-art__frame { position: relative; border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); overflow: hidden; box-shadow: var(--frame-shadow); aspect-ratio: 4/3.6; background: var(--paper-2); }
	.hero-art__frame img { width: 100%; height: 100%; object-fit: cover; }
	.hero-chip { position: absolute; background: #fff; border: var(--frame-bw) solid var(--frame-ink); border-radius: 14px; padding: 12px 15px; box-shadow: var(--frame-shadow-sm); font-weight: 800; font-size: 13.5px; display: flex; align-items: center; gap: 10px; z-index: 3; }
	.hero-chip small { display: block; font-weight: 700; color: var(--ink-soft); font-size: 11px; letter-spacing: 0.03em; }
	.hero-chip .ic { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; background: var(--blue-tint); color: var(--blue-deep); }
	.hero-chip.tl { top: 16px; left: -14px; }
	.hero-chip.br { bottom: 18px; right: -14px; }

	.wavebar { height: 8px; display: flex; border-radius: 999px; overflow: hidden; max-width: 220px; margin: 0 0 28px; }
	.wavebar i { flex: 1; }
	.wavebar i:nth-child(3n + 1) { background: var(--orange); }
	.wavebar i:nth-child(3n + 2) { background: var(--blue); }
	.wavebar i:nth-child(3n) { background: var(--wine); }

	.insts { margin-top: 8px; padding-bottom: clamp(48px, 6vw, 84px); }
	.insts__lbl { font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-soft); margin: 0 0 16px; }
	.insts__row { display: flex; flex-wrap: wrap; align-items: center; gap: clamp(22px, 4vw, 48px); }
	.insts__row { gap: clamp(28px, 5vw, 56px); }
	.inst-logo { height: clamp(28px, 3vw, 40px); width: auto; max-width: 160px; object-fit: contain; opacity: 0.66; transition: opacity 0.2s ease; }
	.inst-logo:hover { opacity: 1; }

	/* line-art */
	.ill { display: block; width: 100%; height: auto; }
	.ill .s { fill: none; stroke-linecap: round; stroke-linejoin: round; }
	.ill .d { stroke: none; }
	.qcard__art { color: var(--ink); }
	.qcard.tint-blue .qcard__art { color: #25548F; }
	.qcard.tint-rose .qcard__art { color: #7E2230; }

	/* problem cards */
	.prob-intro { display: grid; grid-template-columns: 1fr; gap: 30px; align-items: end; margin-bottom: 46px; }
	@media (min-width: 880px) { .prob-intro { grid-template-columns: 1.1fr 0.9fr; gap: 56px; } }
	.prob-intro p { margin: 0; color: var(--ink-soft); font-size: clamp(17px, 1.4vw, 19px); }
	.prob-grid { display: grid; grid-template-columns: 1fr; gap: 18px; }
	@media (min-width: 700px) { .prob-grid { grid-template-columns: repeat(3, 1fr); } }
	.qcard { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); padding: 30px 28px; display: flex; flex-direction: column; min-height: 300px; box-shadow: var(--frame-shadow-sm); }
	.qcard.tint-grey { background: #ede7da; }
	.qcard.tint-blue { background: #DCE7F6; }
	.qcard.tint-rose { background: #F0D9DD; }
	.qcard__art { flex: 1 1 auto; display: grid; place-items: center; padding: 14px 0 22px; }
	.qcard__art .ill { max-width: 150px; }
	.qcard h3 { font-size: 21px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 8px; }
	.qcard p { margin: 0; font-size: 14.5px; line-height: 1.5; color: var(--ink-soft); }

	/* statement */
	.statement-l .wrap { padding: clamp(72px, 10vw, 128px) 24px; }
	.statement-l h2 { font-size: clamp(46px, 8.4vw, 116px); line-height: 0.94; letter-spacing: -0.04em; font-weight: 800; max-width: 15ch; text-wrap: balance; }
	.statement-l .w-o { color: var(--orange-deep); }
	.statement-l .w-b { color: var(--blue-deep); }
	.statement-l .s-sub { margin-top: 30px; max-width: 46ch; color: var(--ink-soft); font-size: clamp(17px, 1.5vw, 21px); }

	.promise-wrap { display: grid; grid-template-columns: 1fr; gap: 48px; align-items: center; }
	.promise-media { display: grid; place-items: center; }
	.promise-chalk { width: 100%; max-width: 420px; height: auto; }
	@media (min-width: 900px) {
		.promise-wrap { grid-template-columns: 1.1fr 1fr; gap: clamp(40px, 5vw, 80px); }
		.promise-chalk { max-width: 460px; }
	}

	/* editorial two-col */
	.edit { display: grid; grid-template-columns: 1fr; gap: 40px; align-items: center; }
	@media (min-width: 900px) { .edit { grid-template-columns: 1fr 1fr; gap: clamp(48px, 6vw, 84px); } }
	.edit--flip .edit__media { order: -1; }
	@media (min-width: 900px) { .edit--flip .edit__media { order: 0; } }
	.edit__body h2 { margin-bottom: 22px; text-wrap: balance; }
	.edit__body p { color: var(--ink-soft); font-size: clamp(17px, 1.4vw, 19px); margin: 0 0 26px; max-width: 42ch; }
	.edit__media { border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); overflow: hidden; box-shadow: var(--frame-shadow); aspect-ratio: 4/3.4; background: #e7ddc8; }
	.edit__media img { width: 100%; height: 100%; object-fit: cover; }
	/* chart wrapper: FigureCard brings its own frame */
	.edit__media--bare { border: 0; border-radius: 0; overflow: visible; box-shadow: none; aspect-ratio: auto; background: transparent; }

	/* anagram — warm wine breakout section */
	.anagram-vibrant {
		background: #8A2433;
		color: #FBF6EA;
		position: relative;
		overflow: hidden;
	}
	.anagram-vibrant::before {
		content: '';
		position: absolute;
		inset: 0;
		background: radial-gradient(120% 100% at 80% 0%, rgba(242, 144, 30, 0.15), transparent 55%);
		pointer-events: none;
	}
	.anagram-vibrant .wrap { position: relative; z-index: 2; }
	.anagram-vibrant h2 { color: #FBF6EA; }
	.anagram-vibrant h2 .wordmark-o { color: #F2901E; }
	.anagram-vibrant h2 .ital { font-style: italic; color: #F4DDE1; }
	.anagram-vibrant .edit__body p { color: rgba(251, 246, 234, 0.82); }
	.scramble { margin-top: 28px; display: flex; gap: 9px; flex-wrap: wrap; }
	.tile { width: 46px; height: 46px; border-radius: 11px; display: grid; place-items: center; font-weight: 900; font-size: 22px; background: #FBF6EA; border: 2px solid #14130F; box-shadow: 4px 4px 0 0 rgba(20, 19, 15, 0.18); color: #14130F; }
	.tile.hot { background: #F2901E; color: #14130F; }

	/* reviews */
	.reviews-section { background: var(--paper); }
	.reviews-section h2 { font-size: clamp(26px, 3.8vw, 44px); font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 48px; max-width: 30ch; }
	.reviews-grid { display: grid; grid-template-columns: 1fr; gap: 22px; }
	@media (min-width: 720px) { .reviews-grid { grid-template-columns: repeat(3, 1fr); } }
	.review-card { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); padding: 28px 26px 24px; box-shadow: var(--frame-shadow-sm); display: flex; flex-direction: column; min-height: 320px; transition: transform 0.16s ease, box-shadow 0.2s ease; }
	.review-card:hover { transform: translateY(-4px); box-shadow: var(--frame-shadow-hover); }
	.review-card__stars { color: #F0BE38; font-size: 18px; letter-spacing: 2px; margin-bottom: 16px; }
	.review-card__body { margin: 0; font-size: 15.5px; line-height: 1.6; color: var(--ink); flex: 1 1 auto; font-style: italic; }
	.review-card__meta { display: flex; align-items: center; gap: 12px; margin-top: 22px; padding-top: 18px; border-top: 1px solid var(--line); }
	.review-card__init { width: 38px; height: 38px; border-radius: 50%; display: inline-block; text-align: center; line-height: 38px; font-weight: 800; font-size: 13px; letter-spacing: 0.04em; flex: none; vertical-align: middle; }
	.review-card__meta b { font-size: 14.5px; font-weight: 800; color: var(--ink); }
	.review-card__meta span { display: block; font-size: 13px; color: var(--ink-soft); margin-top: 2px; }

	/* pipeline */
	.pipe-head { display: grid; grid-template-columns: 1fr; gap: 26px; align-items: end; margin-bottom: 44px; }
	@media (min-width: 880px) { .pipe-head { grid-template-columns: 1.1fr 0.9fr; gap: 56px; } }
	.pipe-head p { margin: 0; color: var(--ink-soft); font-size: clamp(17px, 1.4vw, 19px); max-width: 44ch; }
	.pipeline { display: grid; grid-template-columns: 1fr; gap: 18px; }
	@media (min-width: 620px) { .pipeline { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1000px) { .pipeline { grid-template-columns: repeat(3, 1fr); } }
	.icard { position: relative; display: flex; flex-direction: column; text-decoration: none; color: var(--ink); background: var(--bg); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius-lg); padding: 26px 26px 24px; overflow: hidden; min-height: 420px; transition: transform 0.18s ease, box-shadow 0.2s ease; box-shadow: var(--frame-shadow-sm); }
	.icard:hover { transform: translateY(-5px); box-shadow: var(--frame-shadow-hover); }
	.icard__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
	.icard__name { font-size: 30px; font-weight: 800; letter-spacing: -0.025em; line-height: 1; color: var(--ink-c); }
	.icard__avail { font-size: 10.5px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-c); border: 1.5px solid currentColor; border-radius: 999px; padding: 5px 11px; opacity: 0.8; }
	.icard__art { flex: 1 1 auto; display: grid; place-items: center; padding: 24px 0; color: var(--ink-c); }
	/* illustrations are injected via {@html}, so target them globally */
	.icard__art :global(svg) { width: 100%; max-width: 190px; height: auto; display: block; }
	.icard__cat { font-size: 11px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-c); opacity: 0.72; margin-bottom: 8px; }
	.icard__desc { font-size: 14.5px; line-height: 1.5; color: var(--ink); opacity: 0.8; margin: 0 0 18px; }
	.icard__arrow { width: 42px; height: 42px; border-radius: 50%; border: 1.5px solid var(--ink-c); display: grid; place-items: center; color: var(--ink-c); font-size: 17px; transition: background 0.15s, color 0.15s; }
	.icard:hover .icard__arrow { background: var(--ink-c); color: var(--bg); }
	.icard.flagship { outline: 3px solid var(--ink-c); outline-offset: -3px; }
	/* flagship card already carries the corner tab — drop the duplicate "Available" pill so they don't collide */
	.icard.flagship .icard__avail { display: none; }
	/* flagship badge — tilted pill, fully inside the card */
	.icard__badge { position: absolute; top: 14px; right: 14px; display: inline-flex; align-items: center; gap: 5px; background: var(--orange); color: #1a1407; font-size: 10.5px; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; padding: 7px 14px; border-radius: 999px; box-shadow: 2px 3px 0 rgba(20, 19, 15, 0.18); transform: rotate(2deg); z-index: 2; }
	.icard__badge::before { content: '★'; font-size: 11px; line-height: 1; }
	.icard--soon { background: var(--paper-2); border: 2px dashed var(--frame-ink); align-items: center; justify-content: center; text-align: center; box-shadow: none; }
	.icard--soon:hover { transform: translateY(-5px); box-shadow: var(--frame-shadow-sm); }
	.icard--soon .plus { width: 56px; height: 56px; border-radius: 50%; border: 1.5px dashed var(--ink-soft); display: grid; place-items: center; font-size: 26px; color: var(--ink-soft); margin: 0 auto 16px; font-weight: 300; }
	.icard--soon h3 { font-size: 20px; font-weight: 800; margin: 0 0 7px; }
	.icard--soon p { font-size: 14px; color: var(--ink-soft); margin: 0; max-width: 24ch; }
	.pipe-foot { margin-top: 30px; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; }
	.pipe-foot p { margin: 0; font-weight: 700; font-size: 17px; }

	/* steps */
	.steps-row { display: grid; grid-template-columns: 1fr; gap: 16px; margin-top: 8px; }
	@media (min-width: 720px) { .steps-row { grid-template-columns: repeat(2, 1fr); } }
	@media (min-width: 1000px) { .steps-row { grid-template-columns: repeat(4, 1fr); } }
	.stepc { background: var(--card); border: var(--frame-bw) solid var(--frame-ink); border-radius: var(--frame-radius); padding: 24px 22px; box-shadow: var(--frame-shadow-sm); }
	.step-ill { width: 72px; height: 72px; margin-bottom: 14px; }
	.step-ill svg { width: 100%; height: 100%; display: block; }
	.stepc h3 { font-size: 17px; font-weight: 800; margin: 0 0 6px; }
	.stepc p { margin: 0; font-size: 14px; color: var(--ink-soft); line-height: 1.45; }

	/* final CTA */
	
	/* footer */
	.home-foot { background: var(--ink); color: rgba(251, 246, 234, 0.6); padding: clamp(56px, 8vw, 88px) 0 34px; border-top: var(--section-divider); }
	.home-foot__grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1fr; gap: 40px 28px; padding-bottom: 48px; border-bottom: 1px solid rgba(251, 246, 234, 0.16); }
	@media (max-width: 820px) { .home-foot__grid { grid-template-columns: 1fr 1fr; gap: 36px 24px; } }
	.home-foot__brand img { height: 24px; filter: invert(1) brightness(1.7); margin-bottom: 16px; }
	.home-foot__brand p { font-size: 14px; color: rgba(251, 246, 234, 0.55); max-width: 30ch; margin: 0 0 18px; line-height: 1.5; }
	.socials { display: flex; gap: 10px; }
	.socials a { width: 36px; height: 36px; border-radius: 50%; display: grid; place-items: center; border: 1px solid rgba(251, 246, 234, 0.2); color: rgba(251, 246, 234, 0.7); text-decoration: none; font-weight: 800; font-size: 13px; transition: 0.15s; }
	.socials a:hover { background: rgba(251, 246, 234, 0.1); color: #fff; }
	.fcol h4 { font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; color: rgba(251, 246, 234, 0.45); margin: 0 0 16px; }
	.fcol ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 11px; }
	.fcol a { text-decoration: none; font-size: 14.5px; font-weight: 600; color: rgba(251, 246, 234, 0.78); }
	.fcol a:hover { color: #fff; }
	.home-foot__disc { margin-top: 36px; color: rgba(251, 246, 234, 0.5); }
	.home-foot__legal { margin-top: 24px; padding-top: 24px; border-top: 1px solid rgba(251, 246, 234, 0.12); display: flex; flex-wrap: wrap; justify-content: space-between; gap: 14px; font-size: 12px; color: rgba(251, 246, 234, 0.45); }
	.home-foot__legal p { margin: 0; }

	@media (prefers-reduced-motion: no-preference) {
		.reveal { opacity: 0; transform: translateY(22px); transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1); }
		:global(.reveal.in) { opacity: 1; transform: none; }
	}
</style>
