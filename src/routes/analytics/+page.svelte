<script lang="ts">
	import BarChart from '$lib/components/BarChart.svelte';
	import DonutChart from '$lib/components/DonutChart.svelte';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import InsightPanel from '$lib/components/InsightPanel.svelte';
	import LineChart from '$lib/components/LineChart.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import { formatMinutes, toPercentage } from '$lib/utils/format';
	import {
		getCompletionSlices,
		getDashboardInsights,
		getSubjectBreakdown,
		getSummaryMetrics,
		getWeeklySeries
	} from '$lib/utils/study-analytics';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let search = $state('');
	let subject = $state('all');
	let status = $state('all');
	let date = $state('');

	const filteredRecords = $derived.by(() =>
		data.records.filter((record) => {
			const matchesSearch = record.title.toLowerCase().includes(search.toLowerCase().trim());
			const matchesSubject = subject === 'all' || record.subject === subject;
			const matchesStatus =
				status === 'all' ||
				(status === 'completed' && record.completed) ||
				(status === 'incomplete' && !record.completed);
			const matchesDate = !date || record.date === date;

			return matchesSearch && matchesSubject && matchesStatus && matchesDate;
		})
	);

	const summary = $derived(getSummaryMetrics(filteredRecords));
	const subjectBreakdown = $derived(getSubjectBreakdown(filteredRecords));
	const weeklySeries = $derived(getWeeklySeries(filteredRecords));
	const completionSlices = $derived(getCompletionSlices(filteredRecords));
	const insights = $derived(getDashboardInsights(filteredRecords));
</script>

<div class="page-grid">
	<PageHero
		eyebrow="Analytics"
		title="Turn study records into visual learning insights"
		copy="Use filters and charts to compare subject effort, inspect completion distribution, and analyse study trends in more detail."
		primaryHref="/records"
		primaryLabel="Update study data"
		secondaryHref="/dashboard"
		secondaryLabel="Back to dashboard"
	/>

	<FilterPanel bind:search bind:subject bind:status bind:date subjects={data.subjects} />

	<section class="metric-grid">
		<SummaryCard
			label="Filtered tasks"
			value={summary.totalTasks}
			trend="Analytics update instantly"
		/>
		<SummaryCard
			label="Completion rate"
			value={toPercentage(summary.completionRate)}
			trend="From current filtered view"
		/>
		<SummaryCard
			label="Study time"
			value={formatMinutes(summary.totalMinutes)}
			trend={`${summary.totalHours}h in selected records`}
		/>
		<SummaryCard
			label="Today"
			value={summary.todayCount}
			trend={`${formatMinutes(summary.todayMinutes)} today`}
		/>
	</section>

	<section class="chart-grid">
		<BarChart data={subjectBreakdown} />
		<DonutChart data={completionSlices} />
	</section>

	<InsightPanel title="Filtered insights" items={insights} />

	<LineChart data={weeklySeries} />
</div>
