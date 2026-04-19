<script lang="ts">
	import { resolve } from '$app/paths';
	import LineChart from '$lib/components/LineChart.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import { formatLongDate, formatMinutes, toPercentage } from '$lib/utils/format';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page-grid">
	<PageHero
		eyebrow="Dashboard"
		title="Understand study progress at a glance"
		copy="Use the dashboard for a quick overview: totals, today's progress, streak momentum, and the most recent study activity."
		primaryHref="/records/new"
		primaryLabel="Add a new record"
		secondaryHref="/analytics"
		secondaryLabel="Explore analytics"
	/>

	<section class="metric-grid">
		<SummaryCard
			label="Total tasks"
			value={data.summary.totalTasks}
			trend="All recorded study tasks"
		/>
		<SummaryCard
			label="Completed tasks"
			value={data.summary.completedTasks}
			trend={`${toPercentage(data.summary.completionRate)} completion rate`}
		/>
		<SummaryCard
			label="Total study time"
			value={`${data.summary.totalHours}h`}
			trend={`${formatMinutes(data.summary.totalMinutes)} logged`}
		/>
		<SummaryCard
			label="Today"
			value={data.summary.todayCount}
			trend={`${formatMinutes(data.summary.todayMinutes)} studied today`}
		/>
	</section>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>Weekly momentum</h2>
				<p class="section-copy">
					A quick trend line for how much study time you have logged across the last 7 days.
				</p>
			</div>
		</div>
		<LineChart data={data.weekly} />
	</section>

	<section class="callout info">
		<h3>Keep the momentum going</h3>
		<p>
			Add another study session today to strengthen your streak and keep the dashboard moving
			forward.
		</p>
		<div class="cta-row">
			<a class="button" href={resolve('/records/new')}>Add record</a>
			<a class="ghost-button" href={resolve('/analytics')}>Open deeper analytics</a>
		</div>
	</section>

	<section class="table-card">
		<div class="section-heading">
			<div>
				<h2>Recent study activity</h2>
				<p class="section-copy">
					The latest sessions added to the system, shown here for fast review.
				</p>
			</div>
		</div>

		<div class="record-list">
			{#each data.recentRecords as record (record.id)}
				<article class="record-item">
					<div class="record-header">
						<div>
							<h3 class="record-title">{record.title}</h3>
							<div class="record-meta">
								<span class="pill">{record.subject}</span>
								<span class="pill">{formatMinutes(record.durationMinutes)}</span>
								<span class="pill">{formatLongDate(record.date)}</span>
							</div>
						</div>
						<span
							class:complete={record.completed}
							class:pending={!record.completed}
							class="status-badge"
						>
							{record.completed ? 'Completed' : 'In progress'}
						</span>
					</div>
					{#if record.notes}
						<p class="muted">{record.notes}</p>
					{/if}
				</article>
			{/each}
		</div>
	</section>
</div>
