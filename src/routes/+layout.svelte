<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { track } from '$lib/analytics';
	import NavBar from '$components/NavBar.svelte';
	import Footer from '$components/Footer.svelte';

	let { children } = $props();

	const hiddenPrefixes = ['/prelander', '/quiz'];

	let isHidden = $derived(hiddenPrefixes.some((p) => page.url.pathname.startsWith(p)));
	let isScience = $derived(page.url.pathname.startsWith('/science'));
	let isBlog = $derived(page.url.pathname.startsWith('/blog'));
	let isHome = $derived(page.url.pathname === '/');
	let isQuiz = $derived(page.url.pathname.startsWith('/quiz'));
	// individual product pages (PDPs) render their own full-bleed chrome
	let isProduct = $derived(/^\/shop\/(ibs|anxiety|pms|fatigue|low-mood)\/?$/.test(page.url.pathname));
	let isOwnChrome = $derived(isHidden || isScience || isBlog || isHome || isProduct);

	let activeNav = $derived(
		isScience ? 'science' :
		isBlog ? 'blog' :
		''
	);

	$effect(() => {
		track('page_view', { page: page.url.pathname });
		if (!isHidden) {
			document.body.classList.add('has-nav');
		} else {
			document.body.classList.remove('has-nav');
		}
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta name="theme-color" content="#FBF6EA" />
	<link rel="canonical" href="https://copables.com{page.url.pathname}" />
	{#if isHidden}
		<meta name="robots" content="noindex, nofollow" />
	{:else}
		<meta name="robots" content="index, follow" />
	{/if}
	<!-- Global OG defaults (pages override per-page) -->
	<meta property="og:site_name" content="Copables" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://copables.com{page.url.pathname}" />
	<meta property="og:image" content="https://copables.com/assets/lineup.webp" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:site" content="@copables" />
	<script defer src="https://us-assets.i.posthog.com/static/array.js"></script>
	<script defer>
		window.posthog = window.posthog || [];
		window.posthog.init('YOUR_POSTHOG_KEY', { api_host: 'https://us.i.posthog.com' });
	</script>
	<script defer>
		(function(w,d,s,l,i){
			w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
			var f=d.getElementsByTagName(s)[0], j=d.createElement(s), dl=l!='dataLayer'?'&l='+l:'';
			j.async=true; j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
			f.parentNode.insertBefore(j,f);
		})(window,document,'script','dataLayer','GTM-XXXXXXX');
	</script>
</svelte:head>

{#if !isHidden}
	<NavBar active={activeNav} />
{/if}

<main class:bare={isOwnChrome}>
	{@render children()}
</main>

{#if !isQuiz}
	<Footer />
{/if}

<style>
	:global(body.has-nav) {
		padding-top: 72px;
	}
	main {
		padding: 2rem;
	}
	main.bare {
		padding: 0;
	}
	@media (max-width: 900px) {
		main { padding: 1.5rem; }
	}
	@media (max-width: 540px) {
		main { padding: 1rem; }
	}
</style>
