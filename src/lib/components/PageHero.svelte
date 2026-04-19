<script lang="ts">
	import { resolve } from '$app/paths';

	type InternalHref =
		| '/'
		| '/dashboard'
		| '/records'
		| '/records/new'
		| '/analytics'
		| '/auth/login'
		| '/auth/register';

	let {
		eyebrow,
		title,
		copy,
		primaryHref,
		primaryLabel,
		secondaryHref,
		secondaryLabel
	}: {
		eyebrow: string;
		title: string;
		copy: string;
		primaryHref?: InternalHref;
		primaryLabel?: string;
		secondaryHref?: InternalHref;
		secondaryLabel?: string;
	} = $props();
</script>

<section class="hero-card">
	<span class="eyebrow">{eyebrow}</span>
	<h1 class="hero-title">{title}</h1>
	<p class="hero-copy">{copy}</p>

	<div class="cta-row">
		{#if primaryHref && primaryLabel}
			<a class="button" href={resolve(primaryHref)}>{primaryLabel}</a>
		{/if}

		{#if secondaryHref && secondaryLabel}
			<a class="ghost-button" href={resolve(secondaryHref)}>{secondaryLabel}</a>
		{/if}
	</div>
</section>
