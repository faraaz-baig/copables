<script lang="ts">
	import type { Snippet } from 'svelte';

	// Branded figure/chart frame — the single house style for every graph on
	// the site. Wrap any <svg> plot in <FigureCard> and it inherits the
	// black border + soft lifted shadow, the ℞ badge, full-bleed dividers,
	// the rotated marker-yellow axis caption, and the stat footer bar.
	interface Props {
		/** bold part of the figure id, e.g. "Figure 1" */
		figure: string;
		/** source shown after the figure id, e.g. "PubMed" */
		source: string;
		/** small legend on the top-right, e.g. "2010 — 2024" */
		legend?: string;
		/** rotated, marker-highlighted caption running up the left of the plot */
		yLabel?: string;
		/** footer caption on the left, e.g. "Annual OLP publications" */
		footLabel?: string;
		/** accent colour for the legend dot (defaults to brand orange) */
		accent?: string;
		/** the plot itself — typically an <svg> */
		children: Snippet;
		/** rich footer value on the right; bolded text renders in accent */
		foot?: Snippet;
	}

	let {
		figure,
		source,
		legend,
		yLabel,
		footLabel,
		accent = 'var(--orange)',
		children,
		foot
	}: Props = $props();
</script>

<figure class="fig" style="--fig-accent:{accent}">
	<header class="fig__top">
		<span class="fig__id">
			<span class="fig__rx" aria-hidden="true">℞</span>
			<span class="fig__label"><b>{figure}</b> · {source}</span>
		</span>
		{#if legend}
			<span class="fig__legend">
				<span class="fig__dot" style:background={accent}></span>{legend}
			</span>
		{/if}
	</header>

	<div class="fig__plot">
		{#if yLabel}
			<span class="fig__ylabel">{yLabel}</span>
		{/if}
		<div class="fig__canvas">
			{@render children()}
		</div>
	</div>

	{#if footLabel || foot}
		<footer class="fig__foot">
			{#if footLabel}<span class="fig__foot-label">{footLabel}</span>{/if}
			<span class="fig__rule"></span>
			{#if foot}<span class="fig__foot-val">{@render foot()}</span>{/if}
		</footer>
	{/if}
</figure>

<style>
	.fig {
		margin: 0;
		background: var(--paper);
		border: var(--frame-bw) solid var(--frame-ink);
		border-radius: var(--frame-radius-lg);
		box-shadow: var(--frame-shadow);
		overflow: hidden;
		width: 100%;
		font-family: var(--ff);
	}

	/* ── top bar ─────────────────────────────────────────── */
	.fig__top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 16px;
		padding: clamp(16px, 2.4vw, 22px) clamp(18px, 3vw, 28px);
		border-bottom: var(--frame-bw) solid var(--frame-ink);
	}
	.fig__id {
		display: inline-flex;
		align-items: center;
		gap: 14px;
	}
	.fig__rx {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 38px;
		height: 38px;
		flex: 0 0 auto;
		border: 2px solid var(--frame-ink);
		border-radius: 9px;
		font-size: 19px;
		font-weight: 700;
		line-height: 1;
	}
	.fig__label {
		font-size: 12px;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink-soft);
	}
	.fig__label b {
		color: var(--ink);
		font-weight: 800;
	}
	.fig__legend {
		display: inline-flex;
		align-items: center;
		gap: 9px;
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--ink-soft);
		white-space: nowrap;
	}
	.fig__dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		flex: 0 0 auto;
	}

	/* ── plot ────────────────────────────────────────────── */
	.fig__plot {
		position: relative;
		padding: clamp(20px, 3vw, 30px) clamp(18px, 3vw, 28px) clamp(16px, 2.4vw, 22px);
		padding-left: clamp(40px, 5vw, 56px);
	}
	.fig__ylabel {
		position: absolute;
		left: clamp(12px, 1.6vw, 18px);
		top: 50%;
		transform: translateY(-50%);
		writing-mode: vertical-rl;
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--ink-soft);
		line-height: 1;
		opacity: 0.75;
	}
	.fig__canvas {
		width: 100%;
	}
	.fig__canvas :global(svg) {
		width: 100%;
		height: auto;
		display: block;
	}

	/* ── footer stat bar ─────────────────────────────────── */
	.fig__foot {
		display: flex;
		align-items: center;
		gap: 16px;
		padding: clamp(14px, 2vw, 18px) clamp(18px, 3vw, 28px);
		border-top: var(--frame-bw) solid var(--frame-ink);
		background: rgba(242, 144, 30, 0.06);
	}
	.fig__foot-label {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--ink);
		white-space: nowrap;
	}
	.fig__rule {
		flex: 1 1 auto;
		height: 1px;
		background: var(--line);
		min-width: 12px;
	}
	.fig__foot-val {
		font-size: 14px;
		font-weight: 700;
		color: var(--ink);
		white-space: nowrap;
	}
	.fig__foot-val :global(b) {
		color: var(--fig-accent, var(--orange-deep));
		font-weight: 800;
	}
	/* a <strong> stays ink-black bold (e.g. the "~90×" multiplier) */
	.fig__foot-val :global(strong) {
		color: var(--ink);
		font-weight: 800;
	}

	@media (max-width: 540px) {
		.fig__foot {
			flex-wrap: wrap;
			gap: 8px;
		}
		.fig__rule {
			display: none;
		}
		.fig__foot-val {
			white-space: normal;
		}
	}
</style>
