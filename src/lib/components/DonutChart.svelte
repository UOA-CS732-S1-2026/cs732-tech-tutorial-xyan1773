<script lang="ts">
	import type { CompletionSlice } from '$lib/types';

	let { data }: { data: CompletionSlice[] } = $props();
	const total = $derived(data.reduce((sum, slice) => sum + slice.value, 0));
	const percentage = $derived(total === 0 ? 0 : Math.round(((data[0]?.value ?? 0) / total) * 100));
	const gradient = $derived.by(() => {
		if (total === 0) {
			return 'conic-gradient(#d9e5e1 0deg 360deg)';
		}

		let angle = 0;
		const stops = data.map((slice) => {
			const start = angle;
			angle += (slice.value / total) * 360;
			return `${slice.color} ${start}deg ${angle}deg`;
		});

		return `conic-gradient(${stops.join(', ')})`;
	});
</script>

<div class="chart-card">
	<div class="section-heading">
		<div>
			<h3>Completion ratio</h3>
			<p class="section-copy">See how many tasks are finished versus still pending.</p>
		</div>
	</div>

	<div class="donut-shell">
		<div class="donut" style={`background: ${gradient};`}>
			<div class="donut-center">
				<strong class="metric-value">{percentage}%</strong>
				<span class="metric-label">completed</span>
			</div>
		</div>

		<div class="chart-legend">
			{#each data as item (item.label)}
				<span class="legend-chip">
					<span class="swatch" style={`background: ${item.color};`}></span>
					{item.label}: {item.value}
				</span>
			{/each}
		</div>
	</div>
</div>
