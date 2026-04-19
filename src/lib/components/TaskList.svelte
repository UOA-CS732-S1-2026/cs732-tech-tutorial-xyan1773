<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { StudyRecord } from '$lib/types';
	import { formatLongDate, formatMinutes } from '$lib/utils/format';

	let {
		records,
		pendingIds = [],
		onToggle
	}: {
		records: StudyRecord[];
		pendingIds?: string[];
		onToggle: (record: StudyRecord) => void;
	} = $props();
</script>

<section class="table-card">
	<div class="section-heading">
		<div>
			<h2>Study records</h2>
			<p class="section-copy">
				Review recent tasks, toggle completion, edit details, or delete records.
			</p>
		</div>
		<span class="pill">{records.length} visible tasks</span>
	</div>

	{#if records.length === 0}
		<div class="empty-state">No study records match the current filters.</div>
	{:else}
		<div class="record-list">
			{#each records as record (record.id)}
				<article class="record-item">
					<div class="record-header">
						<div class="record-title-row">
							<button
								class:checked={record.completed}
								class:pending={pendingIds.includes(record.id)}
								class="check-toggle"
								type="button"
								aria-label={record.completed ? 'Mark incomplete' : 'Mark complete'}
								title={record.completed ? 'Mark incomplete' : 'Mark complete'}
								onclick={() => onToggle(record)}
							>
								<span class="check-toggle-dot">✓</span>
							</button>

							<div>
								<h3 class:completed={record.completed} class="record-title">{record.title}</h3>
								<div class="record-meta">
									<span class="pill">{record.subject}</span>
									<span class="pill">{formatMinutes(record.durationMinutes)}</span>
									<span class="pill">{formatLongDate(record.date)}</span>
								</div>
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

					<div class="record-actions">
						<div class="inline-form-row">
							<a class="ghost-button" href={resolve('/records/[id]', { id: record.id })}>Edit</a>

							<form method="POST" action="?/delete" use:enhance>
								<input type="hidden" name="id" value={record.id} />
								<button
									class="ghost-button"
									type="submit"
									onclick={(event) => {
										if (!confirm(`Delete "${record.title}"? This cannot be undone.`)) {
											event.preventDefault();
										}
									}}
								>
									Delete
								</button>
							</form>
						</div>
					</div>
				</article>
			{/each}
		</div>
	{/if}
</section>
