<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';
	import { track } from '$lib/analytics';
	import NavBar from '$components/NavBar.svelte';

	let { children } = $props();

	const hiddenPrefixes = ['/prelander', '/quiz'];

	let isHidden = $derived(hiddenPrefixes.some((p) => page.url.pathname.startsWith(p)));
	let isScience = $derived(page.url.pathname.startsWith('/science'));
	let isBlog = $derived(page.url.pathname.startsWith('/blog'));
	let isHome = $derived(page.url.pathname === '/');
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
	{#if isHidden}
		<meta name="robots" content="noindex, nofollow" />
	{/if}
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
