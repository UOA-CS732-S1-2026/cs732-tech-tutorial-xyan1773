<script lang="ts">
	let {
		label,
		value,
		trend
	}: {
		label: string;
		value: string | number;
		trend?: string;
	} = $props();
</script>

<article class="metric-card">
	<span class="metric-label">{label}</span>
	<strong class="metric-value">{value}</strong>
	{#if trend}
		<span class="metric-trend">{trend}</span>
	{/if}
</article>
