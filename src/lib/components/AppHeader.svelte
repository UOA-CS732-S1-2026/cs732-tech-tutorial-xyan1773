<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { AuthUser } from '$lib/types';

	const pageMeta: Record<string, { title: string; detail: string }> = {
		'/': {
			title: 'Project Home',
			detail: 'A product overview with quick entry points into the main workflows.'
		},
		'/dashboard': {
			title: 'Dashboard',
			detail: 'A fast overview of progress, recent activity, and study momentum.'
		},
		'/records': {
			title: 'Study Records',
			detail: 'Search, sort, filter, and manage the task dataset in one place.'
		},
		'/records/new': {
			title: 'Add Study Record',
			detail: 'Capture a new study session in a focused creation flow.'
		},
		'/analytics': {
			title: 'Analytics',
			detail: 'Use filters, charts, and comparisons to explore deeper learning patterns.'
		}
	};

	const currentMeta = $derived.by(() => {
		if (page.url.pathname.startsWith('/records/') && page.url.pathname !== '/records/new') {
			return {
				title: 'Edit Study Record',
				detail: 'Update an existing task in a dedicated editing workspace.'
			};
		}

		return (
			pageMeta[page.url.pathname] ?? {
				title: 'Study Analytics',
				detail: 'Track tasks, progress, and time invested in study sessions.'
			}
		);
	});

	let { user }: { user: AuthUser } = $props();
</script>

<header class="header-shell">
	<div>
		<div class="header-breadcrumbs">
			<a href={resolve('/')}>Home</a>
			<span>/</span>
			<span>{currentMeta.title}</span>
		</div>
		<h1 class="header-title">{currentMeta.title}</h1>
		<p class="section-copy">{currentMeta.detail}</p>
	</div>

	<div class="header-actions">
		<div class="header-user">
			<span class="eyebrow">Signed in</span>
			<strong>{user.email}</strong>
		</div>
		<a class="ghost-button" href={resolve('/records/new')}>New task</a>
		<a class="button" href={resolve('/dashboard')}>Open dashboard</a>
	</div>
</header>
