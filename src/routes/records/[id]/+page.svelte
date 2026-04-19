<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import StudyRecordForm from '$lib/components/StudyRecordForm.svelte';
	import type { ActionData, PageProps } from './$types';

	let { data, form }: PageProps & { form: ActionData } = $props();
</script>

<div class="page-grid">
	<PageHero
		eyebrow="Edit Record"
		title="Update one study record in a dedicated editing view"
		copy="Use this focused editing view to update one record cleanly, without losing your place in the broader records workspace."
		primaryHref="/records"
		primaryLabel="Back to records"
		secondaryHref="/dashboard"
		secondaryLabel="View dashboard"
	/>

	<StudyRecordForm
		record={data.record}
		subjects={data.subjects}
		values={form?.values}
		errors={form?.errors}
		action="?/upsert"
		cancelHref="/records"
	/>
</div>
