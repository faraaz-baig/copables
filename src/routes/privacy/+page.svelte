<script lang="ts">
	import { page } from '$app/state';
	const year = new Date().getFullYear();
</script>

<svelte:head>
	<title>Privacy Policy — Copables</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main class="wrap legal-page">
	<h1>Privacy Policy</h1>
	<p class="lead">Last updated: January {year}</p>

	<section>
		<h2>1. Information We Collect</h2>
		<p>
			We collect information you provide directly, such as email addresses and quiz responses, as well
			as usage data through analytics tools like PostHog and Google Tag Manager.
		</p>
	</section>

	<section>
		<h2>2. How We Use Information</h2>
		<p>
			We use your information to improve our protocols, personalize your experience, and communicate
			updates about Copables.
		</p>
	</section>

	<section>
		<h2>3. Data Sharing</h2>
		<p>
			We do not sell your personal data. We share data only with trusted service providers necessary to
			operate our platform.
		</p>
	</section>

	<section>
		<h2>4. Cookies & Tracking</h2>
		<p>
			We use cookies and similar technologies for analytics and to understand how visitors interact with
			our site.
		</p>
	</section>

	<section>
		<h2>5. Your Rights</h2>
		<p>
			You may request access to, correction of, or deletion of your personal data by contacting us at
			hello@copables.com.
		</p>
	</section>

	<section>
		<h2>6. Contact</h2>
		<p>For privacy-related questions, please contact us at hello@copables.com.</p>
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
