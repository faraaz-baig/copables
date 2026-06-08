<script lang="ts">
	import FigureCard from '$components/FigureCard.svelte';

	const data = [
		{ year: 2010, count: 3,  label: 'Kaptchuk et al., 2010' },
		{ year: 2012, count: 5,  label: '' },
		{ year: 2014, count: 8,  label: '' },
		{ year: 2016, count: 16, label: '' },
		{ year: 2018, count: 26, label: '' },
		{ year: 2020, count: 48, label: '' },
		{ year: 2022, count: 137, label: '' },
		{ year: 2024, count: 272, label: '' }
	];

	const W = 520;
	const H = 300;
	const padL = 46;
	const padR = 20;
	const padT = 20;
	const padB = 50;
	const plotW = W - padL - padR;
	const plotH = H - padT - padB;
	const yMax = 300;

	function x(i: number) {
		return padL + (i / (data.length - 1)) * plotW;
	}
	function y(count: number) {
		return padT + plotH - (count / yMax) * plotH;
	}

	const calloutTop = Math.max(y(272) - 52, 8);

	const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${x(i)},${y(d.count)}`).join(' ');
	const areaPath = `${linePath} L${x(data.length - 1)},${padT + plotH} L${padL},${padT + plotH} Z`;

	let hovered: number | null = $state(null);
	let lineLen = $state(1200);
	let pathEl: SVGPathElement | null = $state(null);

	$effect(() => {
		if (pathEl) {
			lineLen = pathEl.getTotalLength();
		}
	});
</script>

<FigureCard
	figure="Figure 1"
	source="PubMed"
	legend="2010 — 2024"
	yLabel="PubMed Publications · Year"
	footLabel="Annual OLP publications"
	accent="#DE541E"
>
	{#snippet foot()}3 → <b>272</b> · <strong>~90×</strong> in 14 yrs{/snippet}
	<svg viewBox="0 0 {W} {H}" role="img" aria-label="Annual OLP publications in PubMed, 2010 to 2024 — from 3 to 272 a year">
		<defs>
			<linearGradient id="olpChartFade" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stop-color="#2F95F2" stop-opacity=".22" />
				<stop offset="1" stop-color="#2F95F2" stop-opacity="0" />
			</linearGradient>
		</defs>

		<!-- gridlines -->
		<g stroke="rgba(20,19,15,.08)" stroke-width="1">
			<line x1={padL} y1={y(300)} x2={W - padR} y2={y(300)} />
			<line x1={padL} y1={y(200)} x2={W - padR} y2={y(200)} />
			<line x1={padL} y1={y(100)} x2={W - padR} y2={y(100)} />
			<line x1={padL} y1={y(0)} x2={W - padR} y2={y(0)} />
		</g>

		<!-- y-axis values -->
		<g class="axis-labels" text-anchor="end">
			<text x={padL - 8} y={y(300) + 4}>300</text>
			<text x={padL - 8} y={y(200) + 4}>200</text>
			<text x={padL - 8} y={y(100) + 4}>100</text>
			<text x={padL - 8} y={y(0) + 4}>0</text>
		</g>

		<!-- area fill -->
		<path d={areaPath} fill="url(#olpChartFade)" class="area" />

		<!-- trend line (hidden ref for measuring) -->
		<path bind:this={pathEl} d={linePath} fill="none" stroke="none" />

		<!-- animated trend line -->
		<path d={linePath} fill="none" stroke="#14130F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="trend-line" style="--path-len:{lineLen}px" />

		<!-- interactive data points -->
		{#each data as d, i}
			{@const cx = x(i)}
			{@const cy = y(d.count)}
			{@const isEnd = i === data.length - 1}
			<g class="point-group" class:active={hovered === i}>
				<!-- invisible hit target -->
				<circle {cx} {cy} r="18" fill="transparent" cursor="pointer" role="img"
					onmouseenter={() => (hovered = i)} onmouseleave={() => (hovered = null)} />
				<!-- visible dot -->
				<circle class="pt" {cx} {cy} r={isEnd ? 0 : 3.6} fill="#14130F" />
				<!-- glow ring on hover -->
				{#if hovered === i}
					<circle class="glow" {cx} {cy} r="10" fill="none" stroke="#DE541E" stroke-width="2" />
				{/if}
			</g>
		{/each}

		<!-- endpoint (vermilion) -->
		<circle cx={x(data.length - 1)} cy={y(272)} r="11" fill="none" stroke="#DE541E" stroke-opacity=".35" stroke-width="2" />
		<circle cx={x(data.length - 1)} cy={y(272)} r="6" fill="#DE541E" />

		<!-- tooltip -->
		{#if hovered !== null}
			{@const d = data[hovered]}
			{@const tx = x(hovered)}
			{@const ty = y(d.count)}
			<g class="tooltip" transform="translate({tx}, {ty})">
				<rect x="-50" y="-50" width="100" height="36" rx="8" fill="#14130F" />
				<text text-anchor="middle" y="-32" fill="#fff" font-size="13" font-weight="800">{d.count} pubs</text>
				<text text-anchor="middle" y="-20" fill="rgba(251,246,234,.65)" font-size="10" font-weight="700" letter-spacing="0.04em">{d.year}</text>
				<polygon points="-6, -14 6, -14 0, -8" fill="#14130F" />
			</g>
		{/if}

		<!-- x-axis years -->
		<g class="axis-labels" text-anchor="middle">
			{#each data as d, i}
				<text x={x(i)} y={H - 18} class:dim={hovered !== null && hovered !== i}>{d.year}</text>
			{/each}
		</g>

		<!-- seminal-study annotation -->
		<text x={padL + 12} y={y(300) + 36} font-size="11" font-weight="700" fill="#DE541E">Kaptchuk et al., 2010</text>
		<text x={padL + 12} y={y(300) + 49} font-size="10" font-weight="400" fill="#9a8f78">Seminal Harvard OLP study (IBS)</text>

		<!-- endpoint callout -->
		<line x1={x(data.length - 1) - 32} y1={calloutTop + 44} x2={x(data.length - 1) - 3} y2={y(272) - 3} stroke="#14130F" stroke-width="1.2" />
		<rect x={x(data.length - 1) - 144} y={calloutTop} width="112" height="46" rx="9" fill="#FFFFFF" stroke="#14130F" stroke-width="1.5" />
		<text x={x(data.length - 1) - 88} y={calloutTop + 27} text-anchor="middle" font-size="25" font-weight="800" fill="#14130F">272</text>
		<text x={x(data.length - 1) - 88} y={calloutTop + 40} text-anchor="middle" font-size="8.5" font-weight="700" letter-spacing=".08em" fill="#6f6755">PUBS · 2024</text>
	</svg>
</FigureCard>

<style>
	svg { font-family: 'Sawton Circular', system-ui, sans-serif; }

	/* line draw animation — plays once on mount */
	.trend-line {
		stroke-dasharray: var(--path-len);
		stroke-dashoffset: var(--path-len);
		animation: drawLine 1.8s cubic-bezier(.2,.8,.2,1) forwards;
	}
	@keyframes drawLine {
		to { stroke-dashoffset: 0; }
	}

	/* area fade in */
	.area {
		opacity: 0;
		animation: fadeIn 1s ease 1s forwards;
	}
	@keyframes fadeIn {
		to { opacity: 1; }
	}

	/* data points */
	.pt { transition: r 0.2s ease, fill 0.2s ease; }
	.point-group:hover .pt { r: 6; fill: var(--accent, #DE541E); }
	.point-group.active .pt { r: 6; fill: var(--accent, #DE541E); }

	/* glow ring */
	.glow {
		animation: glowPulse 1.4s ease-in-out infinite;
	}
	@keyframes glowPulse {
		0%, 100% { r: 8; stroke-opacity: 0.35; }
		50% { r: 14; stroke-opacity: 0.1; }
	}

	/* tooltip */
	.tooltip { opacity: 0; animation: tipIn 0.25s ease forwards; pointer-events: none; }
	@keyframes tipIn {
		from { opacity: 0; transform: translate(var(--tx, 0), calc(var(--ty, 0) + 6px)); }
		to   { opacity: 1; transform: translate(var(--tx, 0), calc(var(--ty, 0))); }
	}

	/* axis labels */
	.axis-labels text { font-size: 11px; font-weight: 700; fill: #9a8f78; transition: fill 0.2s ease; }
	.axis-labels text.dim { fill: rgba(154,143,120,.35); }
</style>
