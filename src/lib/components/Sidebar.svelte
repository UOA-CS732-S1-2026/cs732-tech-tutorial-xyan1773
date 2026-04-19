<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import type { AuthUser } from '$lib/types';

	type TopLevelHref = '/' | '/dashboard' | '/records' | '/analytics';
	type NestedHref = '/records' | '/records/new';

	type MenuItem = {
		label: string;
		href: TopLevelHref;
		badge?: string;
		subItems?: Array<{ label: string; href: NestedHref }>;
	};

	const menuItems: MenuItem[] = [
		{ label: 'Home', href: '/' },
		{ label: 'Overview', href: '/dashboard' },
		{
			label: 'Study Records',
			href: '/records',
			badge: 'Core',
			subItems: [
				{ label: 'All Tasks', href: '/records' },
				{ label: 'Add New', href: '/records/new' }
			]
		},
		{ label: 'Analytics', href: '/analytics' }
	];

	let expanded = $state<Record<string, boolean>>({
		'/records': true
	});
	let { user }: { user: AuthUser } = $props();

	function isActive(path: string) {
		return page.url.pathname === path;
	}

	function isSectionActive(item: MenuItem) {
		return page.url.pathname === item.href || page.url.pathname.startsWith(`${item.href}/`);
	}

	function toggleSection(href: string) {
		expanded[href] = !expanded[href];
	}
</script>

<aside class="sidebar-shell">
	<a class="sidebar-brand" href={resolve('/')}>
		<span class="brand-mark display-font">SA</span>
		<span>
			<strong class="display-font">Study Analytics</strong><br />
			<small class="muted">Personal learning dashboard</small>
		</span>
	</a>

	<nav class="sidebar-nav">
		{#each menuItems as item (item.href)}
			<div class="sidebar-group">
				<div class="sidebar-row">
					<a class:active={isSectionActive(item)} class="sidebar-link" href={resolve(item.href)}>
						<span>{item.label}</span>
						{#if item.badge}
							<span class="sidebar-badge">{item.badge}</span>
						{/if}
					</a>

					{#if item.subItems}
						<button
							class="sidebar-toggle"
							type="button"
							aria-label={`Toggle ${item.label}`}
							onclick={() => toggleSection(item.href)}
						>
							{expanded[item.href] ? '-' : '+'}
						</button>
					{/if}
				</div>

				{#if item.subItems && expanded[item.href]}
					<div class="sidebar-subnav">
						{#each item.subItems as subItem (subItem.href)}
							<a
								class:active={isActive(subItem.href)}
								class="sidebar-sublink"
								href={resolve(subItem.href)}
							>
								{subItem.label}
							</a>
						{/each}
					</div>
				{/if}
			</div>
		{/each}
	</nav>

	<section class="sidebar-card">
		<span class="eyebrow">Quick note</span>
		<h3>{user.email}</h3>
		<p class="muted">
			Your records, analytics, and saved workflow now live in a personal SQLite-backed workspace.
		</p>
		<form method="POST" action={resolve('/auth/logout')}>
			<button class="ghost-button full-width" type="submit">Sign out</button>
		</form>
	</section>
</aside>
