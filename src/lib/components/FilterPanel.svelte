<script lang="ts">
	let {
		subjects,
		search = $bindable(''),
		subject = $bindable('all'),
		status = $bindable('all'),
		date = $bindable('')
	}: {
		subjects: string[];
		search?: string;
		subject?: string;
		status?: string;
		date?: string;
	} = $props();

	function clearFilters() {
		search = '';
		subject = 'all';
		status = 'all';
		date = '';
	}
</script>

<section class="panel filter-panel">
	<div class="section-heading">
		<div>
			<h3>Filter and Search</h3>
			<p class="section-copy">Slice records by subject, date, completion status, or keyword.</p>
		</div>
		<button class="ghost-button" type="button" onclick={clearFilters}>Clear filters</button>
	</div>

	<div class="filter-row">
		<div class="field">
			<label for="search">Search task</label>
			<input id="search" bind:value={search} placeholder="Search by title" />
		</div>

		<div class="field">
			<label for="subject">Subject</label>
			<select id="subject" bind:value={subject}>
				<option value="all">All subjects</option>
				{#each subjects as item (item)}
					<option value={item}>{item}</option>
				{/each}
			</select>
		</div>

		<div class="field">
			<label for="status">Status</label>
			<select id="status" bind:value={status}>
				<option value="all">All tasks</option>
				<option value="completed">Completed</option>
				<option value="incomplete">Incomplete</option>
			</select>
		</div>

		<div class="field">
			<label for="date">Date</label>
			<input id="date" type="date" bind:value={date} />
		</div>
	</div>
</section>
