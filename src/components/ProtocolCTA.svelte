<script>
	let {
		eyebrow = 'Why try it',
		title = 'A sensible place to',
		accent = 'start.',
		body = "Open-label placebos don't work for everyone — but they're a low-stakes intervention that might. If you're serious about wanting to feel better, we'd recommend trying this lightweight approach before moving on to more drastic measures.",
		subhead = "Check to see if you're a good candidate for OLP."
	} = $props();

	const protocols = [
		{
			name: 'IBS Protocol',
			bg: '#422040',
			fg: '#FFE9F4',
			btnBg: 'rgba(255, 233, 244, 0.18)',
			btnFg: '#FFE9F4',
			svg: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="82" cy="70" r="32"/><circle cx="118" cy="130" r="32"/><path d="M58 86 C 38 102, 38 124, 56 136"/><path d="M142 114 C 162 98, 162 76, 144 64"/></g><circle fill="currentColor" opacity="0.35" cx="82" cy="70" r="14"/><circle fill="currentColor" opacity="0.35" cx="118" cy="130" r="14"/></svg>`
		},
		{
			name: 'Depression Protocol',
			bg: '#55A8FA',
			fg: '#0A2747',
			btnBg: 'rgba(10, 39, 71, 0.12)',
			btnFg: '#0A2747',
			svg: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="26" y1="140" x2="174" y2="140"/><line x1="100" y1="92" x2="100" y2="72"/><line x1="70" y1="100" x2="56" y2="88"/><line x1="130" y1="100" x2="144" y2="88"/><line x1="82" y1="94" x2="72" y2="80"/><line x1="118" y1="94" x2="128" y2="80"/></g><path fill="currentColor" opacity="0.35" d="M62 140 A38 38 0 0 1 138 140 Z"/><circle fill="currentColor" cx="100" cy="56" r="6"/></svg>`
		},
		{
			name: 'PMS Protocol',
			bg: '#F2B5D4',
			fg: '#5A1D3A',
			btnBg: 'rgba(90, 29, 58, 0.12)',
			btnFg: '#5A1D3A',
			svg: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><circle cx="100" cy="100" r="62"/></g><path fill="currentColor" opacity="0.35" d="M100 70 a30 30 0 1 0 0 60 a22 30 0 1 1 0 -60 Z"/><circle fill="currentColor" cx="100" cy="38" r="6"/><circle fill="currentColor" opacity="0.5" cx="162" cy="100" r="5"/><circle fill="currentColor" opacity="0.5" cx="100" cy="162" r="5"/><circle fill="currentColor" opacity="0.5" cx="38" cy="100" r="5"/></svg>`
		},
		{
			name: 'Anxiety Protocol',
			bg: '#DE541E',
			fg: '#FFEDD9',
			btnBg: 'rgba(255, 237, 217, 0.18)',
			btnFg: '#FFEDD9',
			svg: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3"><circle cx="100" cy="100" r="20"/><circle cx="100" cy="100" r="40"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="80"/></g><circle fill="currentColor" opacity="0.35" cx="100" cy="100" r="16"/><circle fill="currentColor" cx="100" cy="100" r="7"/></svg>`
		},
		{
			name: 'Fatigue Protocol',
			bg: '#F0BE38',
			fg: '#4A2E00',
			btnBg: 'rgba(74, 46, 0, 0.12)',
			btnFg: '#4A2E00',
			svg: `<svg viewBox="0 0 200 200" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 118 C 50 70, 78 70, 100 104 S 150 150, 180 96"/></g><path fill="currentColor" opacity="0.25" d="M20 118 C 50 70, 78 70, 100 104 S 150 150, 180 96 L 180 180 L 20 180 Z"/><circle fill="currentColor" cx="48" cy="86" r="6"/><circle fill="currentColor" cx="100" cy="104" r="6"/><circle fill="currentColor" cx="156" cy="118" r="6"/></svg>`
		}
	];
</script>

<section class="protocol-cta">
	<div class="protocol-cta__inner">
		<p class="protocol-cta__eyebrow">{eyebrow}</p>
		<h2 class="protocol-cta__title">
			{title}{#if accent}{' '}<span class="protocol-cta__accent">{accent}</span>{/if}
		</h2>
		<p class="protocol-cta__body">
			{body}
		</p>

		<hr class="protocol-cta__rule" />

		<p class="protocol-cta__subhead">{subhead}</p>

		<div class="protocol-cta__grid">
			{#each protocols as p (p.name)}
				<div class="protocol-cta__card" style="background: {p.bg}; color: {p.fg}">
					<div class="protocol-cta__ill">{@html p.svg}</div>
					<h3 class="protocol-cta__name">{p.name}</h3>
					<a
						class="protocol-cta__btn"
						href="/quiz/ibs"
						style="background: {p.btnBg}; color: {p.btnFg}"
					>
						Take Assessment <span aria-hidden="true">→</span>
					</a>
				</div>
			{/each}
		</div>
	</div>
</section>

<style>
	.protocol-cta {
		padding: clamp(64px, 8vw, 100px) 24px;
		background: var(--paper, #FBF6EA);
	}
	.protocol-cta__inner {
		max-width: 1100px;
		margin: 0 auto;
	}
	.protocol-cta__eyebrow {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--accent, #DE541E);
		margin: 0 0 14px;
	}
	.protocol-cta__title {
		font-size: clamp(36px, 5vw, 64px);
		font-weight: 800;
		letter-spacing: -0.035em;
		line-height: 1.05;
		color: var(--ink, #14130F);
		margin: 0 0 22px;
		max-width: 18ch;
	}
	.protocol-cta__accent {
		color: var(--accent, #DE541E);
	}
	.protocol-cta__body {
		font-size: clamp(16px, 1.3vw, 19px);
		line-height: 1.6;
		color: var(--ink-soft, #6B6861);
		max-width: 56ch;
		margin: 0 0 32px;
	}
	.protocol-cta__rule {
		border: 0;
		height: 1px;
		background: var(--line, rgba(20,19,15,0.12));
		margin: 0 0 28px;
	}
	.protocol-cta__subhead {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink, #14130F);
		margin: 0 0 20px;
	}
	.protocol-cta__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 14px;
	}
	@media (min-width: 720px) {
		.protocol-cta__grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}
	@media (min-width: 980px) {
		.protocol-cta__grid {
			grid-template-columns: repeat(5, 1fr);
			gap: 16px;
		}
	}
	.protocol-cta__card {
		border-radius: 18px;
		padding: 22px 20px 20px;
		display: flex;
		flex-direction: column;
		gap: 14px;
		min-height: 220px;
	}
	.protocol-cta__ill {
		width: 64px;
		height: 64px;
	}
	.protocol-cta__ill svg {
		width: 100%;
		height: 100%;
		display: block;
	}
	.protocol-cta__name {
		font-size: 17px;
		font-weight: 800;
		letter-spacing: -0.02em;
		margin: 0;
		flex: 1 1 auto;
	}
	.protocol-cta__btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		padding: 12px 16px;
		border-radius: 999px;
		font-size: 13px;
		font-weight: 800;
		letter-spacing: 0.02em;
		text-decoration: none;
		text-transform: uppercase;
		transition: transform 0.12s;
	}
	.protocol-cta__btn:hover {
		transform: translateY(-1px);
	}
	.protocol-cta__btn:active {
		transform: translateY(1px);
	}
</style>
