<script lang="ts">
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Cookie Policy — Copables</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="Copables Cookie Policy." />
</svelte:head>

<main class="wrap legal-page">
	<h1>Cookie Policy</h1>
	<p class="lead">Last updated: January {year}</p>

	<section>
		<h2>1. What Are Cookies</h2>
		<p>
			Cookies are small text files stored on your device that help websites function and improve user
			experience.
		</p>
	</section>

	<section>
		<h2>2. How We Use Cookies</h2>
		<p>
			We use essential cookies for site functionality and analytics cookies through PostHog and Google
			Tag Manager to understand how visitors use our site.
		</p>
	</section>

	<section>
		<h2>3. Managing Cookies</h2>
		<p>
			You can control or disable cookies through your browser settings. Note that disabling cookies may
			affect site functionality.
		</p>
	</section>

	<section>
		<h2>4. Contact</h2>
		<p>For questions about our cookie usage, please contact us at hello@copables.com.</p>
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
