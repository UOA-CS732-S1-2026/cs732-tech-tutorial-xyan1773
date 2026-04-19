<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import AppHeader from '$lib/components/AppHeader.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import ToastHost from '$lib/components/ToastHost.svelte';
	import type { LayoutProps } from './$types';

	let { data, children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Study Analytics Dashboard</title>
	<meta
		name="description"
		content="A SvelteKit study analytics dashboard for recording study sessions, tracking tasks, and visualising learning progress."
	/>
</svelte:head>

<ToastHost />

{#if data.user}
	<div class="app-shell">
		<Sidebar user={data.user} />
		<div class="app-main">
			<AppHeader user={data.user} />
			<main class="page-shell">
				{@render children()}
			</main>
		</div>
	</div>
{:else}
	<div class="public-shell">
		<main class="page-shell public-page-shell">
			{@render children()}
		</main>
	</div>
{/if}
