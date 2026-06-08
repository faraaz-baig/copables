<script lang="ts">
	import { page } from '$app/state';
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Terms of Service — Copables</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="Copables Terms of Service." />
</svelte:head>

<main class="wrap legal-page">
	<h1>Terms of Service</h1>
	<p class="lead">Last updated: January {year}</p>

	<section>
		<h2>1. About Copables</h2>
		<p>
			Copables provides self-guided wellness protocols and educational content. Our products are not
			medical treatments and have not been evaluated by the FDA.
		</p>
	</section>

	<section>
		<h2>2. Not Medical Advice</h2>
		<p>
			Nothing on this site constitutes medical advice, diagnosis, or treatment. Always consult a
			qualified healthcare provider before changing any medication or treatment plan.
		</p>
	</section>

	<section>
		<h2>3. Use of Protocols</h2>
		<p>
			Our 14-day open-label placebo protocols are designed for self-management and wellness. Individual
			results may vary.
		</p>
	</section>

	<section>
		<h2>4. Intellectual Property</h2>
		<p>
			All content, branding, and materials on this site are the property of Copables Ltd and are
			protected by applicable copyright and trademark laws.
		</p>
	</section>

	<section>
		<h2>5. Limitation of Liability</h2>
		<p>
			Copables is not liable for any damages arising from the use or inability to use our protocols or
			website.
		</p>
	</section>

	<section>
		<h2>6. Contact</h2>
		<p>For questions about these terms, please contact us at hello@copables.com.</p>
	</section>
</main>

<style>
	.legal-page {
		max-width: 720px;
		margin: 0 auto;
		padding: clamp(48px, 6vw, 96px) 24px;
		font-family: var(--ff);
		color: var(--ink, #14130f);
	}
	.legal-page h1 {
		font-size: clamp(32px, 4vw, 48px);
		letter-spacing: -0.03em;
		font-weight: 800;
		margin: 0 0 12px;
	}
	.legal-page .lead {
		color: var(--ink-soft, #6b6861);
		margin: 0 0 48px;
		font-size: 16px;
	}
	.legal-page section {
		padding: 32px 0;
		border-top: 1.5px solid var(--frame-ink, #14130f);
	}
	.legal-page section:first-of-type {
		border-top: 0;
		padding-top: 4px;
	}
	.legal-page h2 {
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.02em;
		margin: 0 0 10px;
	}
	.legal-page p {
		font-size: 16px;
		line-height: 1.6;
		color: var(--ink-soft, #6b6861);
		margin: 0;
	}
</style>
