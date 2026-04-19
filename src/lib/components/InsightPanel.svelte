<script lang="ts">
	import type { DashboardInsight } from '$lib/types';

	let { title = 'Smart insights', items }: { title?: string; items: DashboardInsight[] } = $props();
</script>

<section class="panel">
	<div class="section-heading">
		<div>
			<h2>{title}</h2>
			<p class="section-copy">
				A few higher-level patterns that make the dashboard feel more analytical.
			</p>
		</div>
	</div>

	<div class="feature-grid">
		{#each items as item (item.label)}
			<article class="feature-card">
				<span class="metric-label">{item.label}</span>
				<h3>{item.value}</h3>
				<p class="muted">{item.detail}</p>
			</article>
		{/each}
	</div>
</section>
