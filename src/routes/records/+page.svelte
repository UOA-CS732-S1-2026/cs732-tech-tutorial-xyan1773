<script lang="ts">
	import { enhance } from '$app/forms';
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import FilterPanel from '$lib/components/FilterPanel.svelte';
	import PageHero from '$lib/components/PageHero.svelte';
	import SummaryCard from '$lib/components/SummaryCard.svelte';
	import TaskList from '$lib/components/TaskList.svelte';
	import type { StudyRecord } from '$lib/types';
	import { formatMinutes, toPercentage } from '$lib/utils/format';
	import { getSummaryMetrics } from '$lib/utils/study-analytics';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const storageKey = 'study-record-filter-state';
	let hydrated = false;
	let search = $state('');
	let subject = $state('all');
	let status = $state('all');
	let date = $state('');
	let sort = $state('newest');
	let records = $state<StudyRecord[]>([]);
	let pendingToggleIds = $state<string[]>([]);

	$effect(() => {
		records = data.records;
	});

	$effect(() => {
		if (!browser || hydrated) return;

		const saved = localStorage.getItem(storageKey);
		if (saved) {
			const parsed = JSON.parse(saved) as {
				search?: string;
				subject?: string;
				status?: string;
				date?: string;
				sort?: string;
			};

			search = parsed.search ?? '';
			subject = parsed.subject ?? 'all';
			status = parsed.status ?? 'all';
			date = parsed.date ?? '';
			sort = parsed.sort ?? 'newest';
		}

		hydrated = true;
	});

	$effect(() => {
		if (!browser || !hydrated) return;

		localStorage.setItem(storageKey, JSON.stringify({ search, subject, status, date, sort }));
	});

	const filteredRecords = $derived.by(() =>
		records
			.filter((record) => {
				const matchesSearch = record.title.toLowerCase().includes(search.toLowerCase().trim());
				const matchesSubject = subject === 'all' || record.subject === subject;
				const matchesStatus =
					status === 'all' ||
					(status === 'completed' && record.completed) ||
					(status === 'incomplete' && !record.completed);
				const matchesDate = !date || record.date === date;

				return matchesSearch && matchesSubject && matchesStatus && matchesDate;
			})
			.sort((a, b) => {
				if (sort === 'oldest')
					return `${a.date}${a.updatedAt}`.localeCompare(`${b.date}${b.updatedAt}`);
				if (sort === 'duration') return b.durationMinutes - a.durationMinutes;
				if (sort === 'title') return a.title.localeCompare(b.title);
				return `${b.date}${b.updatedAt}`.localeCompare(`${a.date}${a.updatedAt}`);
			})
	);

	const filteredSummary = $derived(getSummaryMetrics(filteredRecords));
	const totalSummary = $derived(getSummaryMetrics(records));
	const hasActiveFilters = $derived(
		Boolean(search.trim()) || subject !== 'all' || status !== 'all' || Boolean(date)
	);
	const activeFilterLabels = $derived.by(() => {
		const labels: string[] = [];
		if (search.trim()) labels.push(`Search: ${search.trim()}`);
		if (subject !== 'all') labels.push(`Subject: ${subject}`);
		if (status !== 'all') labels.push(`Status: ${status}`);
		if (date) labels.push(`Date: ${date}`);
		return labels;
	});

	function clearAllFilters() {
		search = '';
		subject = 'all';
		status = 'all';
		date = '';
	}

	async function toggleRecord(record: StudyRecord) {
		const previousRecords = records;
		pendingToggleIds = [...pendingToggleIds, record.id];
		records = records.map((item) =>
			item.id === record.id
				? {
						...item,
						completed: !item.completed,
						updatedAt: new Date().toISOString()
					}
				: item
		);

		try {
			const formData = new FormData();
			formData.set('id', record.id);

			const response = await fetch('?/toggle', {
				method: 'POST',
				body: formData
			});

			if (!response.ok) {
				throw new Error('Toggle failed');
			}
		} catch {
			records = previousRecords;
		} finally {
			pendingToggleIds = pendingToggleIds.filter((id) => id !== record.id);
		}
	}
</script>

<div class="page-grid">
	<PageHero
		eyebrow="Records"
		title="Manage study tasks in one reliable workspace"
		copy="Browse, filter, sort, complete, and maintain your study records with clear system feedback and focused create/edit flows."
		primaryHref="/records/new"
		primaryLabel="Add new task"
		secondaryHref="/analytics"
		secondaryLabel="View analytics"
	/>

	<section class="metric-grid">
		<SummaryCard
			label="All records"
			value={totalSummary.totalTasks}
			trend={`${formatMinutes(totalSummary.totalMinutes)} in the full dataset`}
		/>
		<SummaryCard
			label="Visible tasks"
			value={filteredSummary.totalTasks}
			trend={hasActiveFilters ? 'Based on active filters' : 'Showing all records'}
		/>
		<SummaryCard
			label="Completed"
			value={filteredSummary.completedTasks}
			trend={toPercentage(filteredSummary.completionRate)}
		/>
		<SummaryCard
			label="Visible study time"
			value={formatMinutes(filteredSummary.totalMinutes)}
			trend={hasActiveFilters
				? `${filteredSummary.totalHours}h in filtered view`
				: `${filteredSummary.totalHours}h total`}
		/>
	</section>

	{#if hasActiveFilters}
		<section class="callout info">
			<h3>Filtered results are active</h3>
			<p>
				Showing {filteredSummary.totalTasks} of {totalSummary.totalTasks} records. Saved filters stay
				active so you can return to your last view without starting over.
			</p>
			<div class="record-meta">
				{#each activeFilterLabels as label (label)}
					<span class="pill">{label}</span>
				{/each}
			</div>
			<div class="cta-row">
				<button class="ghost-button" type="button" onclick={clearAllFilters}>Reset filters</button>
			</div>
		</section>
	{/if}

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>Controls</h2>
				<p class="section-copy">
					Use these controls to reorder the list or reload a richer sample dataset for demos and
					testing.
				</p>
			</div>
		</div>

		<div class="filter-row">
			<div class="field">
				<label for="sort">Sort records</label>
				<select id="sort" bind:value={sort}>
					<option value="newest">Newest first</option>
					<option value="oldest">Oldest first</option>
					<option value="duration">Longest duration</option>
					<option value="title">Title A-Z</option>
				</select>
			</div>

			<form method="POST" action="?/reset" use:enhance>
				<button
					class="ghost-button"
					type="submit"
					onclick={(event) => {
						if (!confirm('Load the sample dataset again and replace the current records?')) {
							event.preventDefault();
						}
					}}
				>
					Load sample data
				</button>
			</form>
		</div>
	</section>

	<FilterPanel bind:search bind:subject bind:status bind:date subjects={data.subjects} />

	{#if filteredRecords.length === 0 && hasActiveFilters}
		<section class="callout info">
			<h3>No results for the current filters</h3>
			<p>Your study records still exist, but none match the active filters shown above.</p>
			<div class="cta-row">
				<button class="ghost-button" type="button" onclick={clearAllFilters}>Reset filters</button>
			</div>
		</section>
	{:else if filteredRecords.length === 0}
		<section class="callout info">
			<h3>No study records yet</h3>
			<p>
				Start tracking your learning journey and the dashboard will fill itself in automatically.
			</p>
			<div class="cta-row">
				<a class="button" href={resolve('/records/new')}>Create your first task</a>
			</div>
		</section>
	{/if}

	<TaskList records={filteredRecords} pendingIds={pendingToggleIds} onToggle={toggleRecord} />
</div>
