<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	import type { RecordFormErrors, RecordFormValues, StudyRecord } from '$lib/types';
	import { getLocalDateKey } from '$lib/utils/format';

	type CancelHref = '/records' | '/records/new' | '/dashboard' | '/analytics' | '/';

	let {
		record,
		subjects,
		values,
		errors = {},
		action = '?/upsert',
		cancelHref
	}: {
		record?: StudyRecord;
		subjects: string[];
		values?: Partial<RecordFormValues>;
		errors?: RecordFormErrors;
		action?: string;
		cancelHref?: CancelHref;
	} = $props();

	let title = $state('');
	let subject = $state('');
	let durationMinutes = $state('');
	let date = $state('');
	let completed = $state(false);
	let notes = $state('');
	let id = $state<string | undefined>(undefined);

	$effect(() => {
		const nextId = values?.id ?? record?.id;
		id = nextId;
		title = values?.title ?? record?.title ?? '';
		subject = values?.subject ?? record?.subject ?? '';
		durationMinutes = values?.durationMinutes ?? (record ? String(record.durationMinutes) : '');
		date = values?.date ?? record?.date ?? (nextId ? '' : getLocalDateKey());
		completed = values?.completed ?? record?.completed ?? false;
		notes = values?.notes ?? record?.notes ?? '';
	});

	const isEditing = $derived(Boolean(id));
	const durationHoursLabel = $derived.by(() => {
		const minutes = Number(durationMinutes);
		if (!Number.isFinite(minutes) || minutes <= 0) return null;
		return `Approximately ${(minutes / 60).toFixed(minutes % 60 === 0 ? 0 : 2)} hours`;
	});
</script>

<section class="panel">
	<div class="section-heading">
		<div>
			<h2>{isEditing ? 'Edit study record' : 'Add study record'}</h2>
			<p class="section-copy">Use a SvelteKit Form Action to submit study tasks with validation.</p>
		</div>

		{#if cancelHref}
			<a class="ghost-button" href={resolve(cancelHref)}>Cancel</a>
		{/if}
	</div>

	<form class="form-grid" method="POST" {action} use:enhance>
		{#if id}
			<input type="hidden" name="id" value={id} />
		{/if}

		<div class="field">
			<label for="title">Task title</label>
			<input
				id="title"
				name="title"
				bind:value={title}
				placeholder="Finish database revision notes"
			/>
			{#if errors.title}
				<span class="field-error">{errors.title}</span>
			{/if}
		</div>

		<div class="field">
			<label for="subject-input">Subject or course</label>
			<input
				id="subject-input"
				name="subject"
				list="subject-options"
				bind:value={subject}
				placeholder="CS732"
			/>
			<datalist id="subject-options">
				{#each subjects as item (item)}
					<option value={item}></option>
				{/each}
			</datalist>
			{#if errors.subject}
				<span class="field-error">{errors.subject}</span>
			{/if}
		</div>

		<div class="inline-form-row">
			<div class="field">
				<label for="duration">Duration (minutes)</label>
				<input
					id="duration"
					name="durationMinutes"
					type="number"
					min="1"
					step="5"
					bind:value={durationMinutes}
					placeholder="90"
				/>
				{#if errors.durationMinutes}
					<span class="field-error">{errors.durationMinutes}</span>
				{:else if durationHoursLabel}
					<span class="footer-note">{durationHoursLabel}</span>
				{/if}
			</div>

			<div class="field">
				<label for="date-input">Study date</label>
				<input id="date-input" name="date" type="date" bind:value={date} />
				{#if errors.date}
					<span class="field-error">{errors.date}</span>
				{/if}
			</div>
		</div>

		<div class="field">
			<label for="notes">Notes</label>
			<textarea
				id="notes"
				name="notes"
				bind:value={notes}
				placeholder="Optional notes, reflection, or study outcomes."
			></textarea>
			{#if errors.notes}
				<span class="field-error">{errors.notes}</span>
			{:else}
				<span class="footer-note">{notes.length}/400 characters</span>
			{/if}
		</div>

		<label class="checkbox-row">
			<input name="completed" type="checkbox" bind:checked={completed} />
			<span>Mark this task as completed</span>
		</label>

		<div class="cta-row">
			<button class="button" type="submit">{isEditing ? 'Update record' : 'Add record'}</button>
			<span class="footer-note">Fields: title, subject, duration, date, completion, notes.</span>
		</div>
	</form>
</section>
