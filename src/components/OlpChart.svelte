<script lang="ts">
	// The one canonical Copables graph — the OLP-publications growth chart in
	// the branded FigureCard frame. Used everywhere a graph appears so every
	// chart on the site is identical in style.
	import FigureCard from '$components/FigureCard.svelte';
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
	<svg viewBox="0 0 520 300" role="img" aria-label="Annual OLP publications in PubMed, 2010 to 2024 — from 3 to 272 a year">
		<!-- gridlines -->
		<g stroke="rgba(20,19,15,.08)" stroke-width="1">
			<line x1="46" y1="50" x2="500" y2="50" /><line x1="46" y1="117" x2="500" y2="117" />
			<line x1="46" y1="184" x2="500" y2="184" /><line x1="46" y1="251" x2="500" y2="251" />
		</g>
		<!-- y-axis values -->
		<g font-family="Sawton Circular, sans-serif" font-size="11" font-weight="700" fill="#9a8f78" text-anchor="end">
			<text x="38" y="54">300</text><text x="38" y="121">200</text><text x="38" y="188">100</text><text x="38" y="255">0</text>
		</g>
		<!-- area fill (blue) -->
		<path d="M46,251 L46,249 L111,247 L176,244 L241,236 L306,226 L371,204 L436,164 L500,69 L500,251 Z" fill="url(#olpChartFade)" />
		<!-- trend line (black) -->
		<path d="M46,249 L111,247 L176,244 L241,236 L306,226 L371,204 L436,164 L500,69" fill="none" stroke="#14130F" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
		<!-- data points -->
		<g fill="#14130F">
			<circle cx="46" cy="249" r="3.6" /><circle cx="111" cy="247" r="3.6" /><circle cx="176" cy="244" r="3.6" /><circle cx="241" cy="236" r="3.6" /><circle cx="306" cy="226" r="3.6" /><circle cx="371" cy="204" r="3.6" /><circle cx="436" cy="164" r="3.6" />
		</g>
		<!-- endpoint (vermilion) -->
		<circle cx="500" cy="69" r="11" fill="none" stroke="#DE541E" stroke-opacity=".35" stroke-width="2" />
		<circle cx="500" cy="69" r="6" fill="#DE541E" />
		<defs><linearGradient id="olpChartFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F95F2" stop-opacity=".22" /><stop offset="1" stop-color="#2F95F2" stop-opacity="0" /></linearGradient></defs>
		<!-- x-axis years -->
		<g font-family="Sawton Circular, sans-serif" font-size="11" font-weight="700" fill="#9a8f78" text-anchor="middle">
			<text x="46" y="273">2010</text><text x="111" y="273">2012</text><text x="176" y="273">2014</text><text x="241" y="273">2016</text><text x="306" y="273">2018</text><text x="371" y="273">2020</text><text x="436" y="273">2022</text><text x="500" y="273">2024</text>
		</g>
		<!-- seminal-study annotation -->
		<text x="58" y="86" font-family="Sawton Circular, sans-serif" font-size="11" font-weight="700" fill="#DE541E">Kaptchuk et al., 2010</text>
		<text x="58" y="99" font-family="Sawton Circular, sans-serif" font-size="10" font-weight="400" fill="#9a8f78">Seminal Harvard OLP study (IBS)</text>
		<!-- endpoint callout -->
		<line x1="468" y1="52" x2="497" y2="66" stroke="#14130F" stroke-width="1.2" />
		<rect x="356" y="8" width="112" height="46" rx="9" fill="#FFFFFF" stroke="#14130F" stroke-width="1.5" />
		<text x="412" y="35" text-anchor="middle" font-family="Sawton Circular, sans-serif" font-size="25" font-weight="800" fill="#14130F">272</text>
		<text x="412" y="48" text-anchor="middle" font-family="Sawton Circular, sans-serif" font-size="8.5" font-weight="700" letter-spacing=".08em" fill="#6f6755">PUBS · 2024</text>
	</svg>
</FigureCard>
