<script lang="ts">
	import type { WeeklyPoint } from '$lib/types';
	import { formatMinutes } from '$lib/utils/format';

	let { data }: { data: WeeklyPoint[] } = $props();

	const chartWidth = 640;
	const chartHeight = 260;
	const padding = 24;
	const maxValue = $derived(Math.max(...data.map((item) => item.totalMinutes), 60));
	const points = $derived.by(() =>
		data.map((item, index) => {
			const x = padding + (index * (chartWidth - padding * 2)) / Math.max(data.length - 1, 1);
			const y =
				chartHeight - padding - (item.totalMinutes / maxValue) * (chartHeight - padding * 2);

			return { ...item, x, y };
		})
	);
	const pointString = $derived(points.map((point) => `${point.x},${point.y}`).join(' '));
	const areaString = $derived(
		`${padding},${chartHeight - padding} ${points.map((point) => `${point.x},${point.y}`).join(' ')} ${
			chartWidth - padding
		},${chartHeight - padding}`
	);
</script>

<div class="chart-card">
	<div class="section-heading">
		<div>
			<h3>Last 7 days</h3>
			<p class="section-copy">Track how study time rises or dips throughout the week.</p>
		</div>
	</div>

	{#if data.length === 0}
		<div class="empty-state">No weekly activity yet.</div>
	{:else}
		<div class="chart-frame">
			<svg
				class="line-chart"
				viewBox={`0 0 ${chartWidth} ${chartHeight}`}
				role="img"
				aria-label="Weekly study time"
			>
				<g class="line-grid">
					{#each [0, 0.25, 0.5, 0.75, 1] as ratio (ratio)}
						<line
							x1={padding}
							x2={chartWidth - padding}
							y1={chartHeight - padding - ratio * (chartHeight - padding * 2)}
							y2={chartHeight - padding - ratio * (chartHeight - padding * 2)}
						/>
					{/each}
				</g>

				<polyline class="line-area" points={areaString} />
				<polyline class="line-path" points={pointString} />

				{#each points as point (point.date)}
					<circle class="line-point" cx={point.x} cy={point.y} r="6" />
					<text x={point.x} y={chartHeight - 4} text-anchor="middle" fill="#5f7069" font-size="12">
						{point.label}
					</text>
					<text x={point.x} y={point.y - 12} text-anchor="middle" fill="#21312b" font-size="12">
						{formatMinutes(point.totalMinutes)}
					</text>
				{/each}
			</svg>
		</div>
	{/if}
</div>
