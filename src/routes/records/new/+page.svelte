<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import StudyRecordForm from '$lib/components/StudyRecordForm.svelte';
	import type { ActionData, PageProps } from './$types';

	let { data, form }: PageProps & { form: ActionData } = $props();
</script>

<div class="page-grid">
	<PageHero
		eyebrow="New Record"
		title="Add a focused study task without the clutter"
		copy="This dedicated route keeps the creation flow clean so you can log a study task quickly without list noise or analytics getting in the way."
		primaryHref="/records"
		primaryLabel="Back to records"
		secondaryHref="/analytics"
		secondaryLabel="See analytics"
	/>

	<StudyRecordForm
		subjects={data.subjects}
		values={form?.values}
		errors={form?.errors}
		action="?/upsert"
		cancelHref="/records"
	/>
</div>
