<script lang="ts">
	import type { SubjectBreakdown } from '$lib/types';
	import { formatMinutes } from '$lib/utils/format';

	let { data }: { data: SubjectBreakdown[] } = $props();
	const maxValue = $derived(Math.max(...data.map((item) => item.totalMinutes), 1));
</script>

<div class="chart-card">
	<div class="section-heading">
		<div>
			<h3>Study hours by subject</h3>
			<p class="section-copy">Compare effort across each course or topic.</p>
		</div>
	</div>

	{#if data.length === 0}
		<div class="empty-state">Add records to see subject-based study hours.</div>
	{:else}
		<div class="chart-frame">
			<div class="bar-chart">
				{#each data as item (item.subject)}
					<div class="bar-column">
						<div class="bar-visual">
							<div class="bar-track">
								<div
									class="bar-fill"
									style={`height: ${Math.max((item.totalMinutes / maxValue) * 100, 8)}%; background: linear-gradient(180deg, ${item.color}, ${item.color}99);`}
								></div>
							</div>
						</div>
						<strong class="bar-value">{formatMinutes(item.totalMinutes)}</strong>
						<span class="bar-label">{item.subject}</span>
					</div>
				{/each}
			</div>
		</div>
	{/if}
</div>
