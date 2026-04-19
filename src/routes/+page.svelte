<script lang="ts">
	import PageHero from '$lib/components/PageHero.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<div class="page-grid">
	<PageHero
		eyebrow="Study Analytics"
		title="Study smarter, not harder"
		copy="Track study sessions, analyze progress, and build better learning habits through a calm dashboard, focused record workflow, and clear analytics."
		primaryHref={data.user ? '/dashboard' : '/auth/register'}
		primaryLabel={data.user ? 'Open dashboard' : 'Create account'}
		secondaryHref={data.user ? '/records/new' : '/auth/login'}
		secondaryLabel={data.user ? 'Add record' : 'Sign in'}
	/>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>Product highlights</h2>
				<p class="section-copy">
					The experience is designed around the everyday jobs a study tracker should do well.
				</p>
			</div>
		</div>

		<div class="feature-grid">
			<article class="feature-card">
				<h3>Track study time</h3>
				<p class="muted">
					Log sessions, subjects, dates, and notes without clutter or extra steps.
				</p>
			</article>

			<article class="feature-card">
				<h3>Visualize progress</h3>
				<p class="muted">
					See completion, weekly momentum, and total effort through cards and charts.
				</p>
			</article>

			<article class="feature-card">
				<h3>Stay consistent</h3>
				<p class="muted">
					Use streaks, recent activity, and fast task updates to keep momentum visible.
				</p>
			</article>

			<article class="feature-card">
				<h3>Identify strengths</h3>
				<p class="muted">
					Compare subjects and time distribution to see where your learning effort is going.
				</p>
			</article>
		</div>
	</section>

	<section class="panel">
		<div class="section-heading">
			<div>
				<h2>What you can do right now</h2>
				<p class="section-copy">
					The quickest path is to start tracking, review your totals, and then explore patterns.
				</p>
			</div>
		</div>

		<div class="feature-grid">
			<article class="feature-card">
				<h3>Add study records</h3>
				<p class="muted">Log a task, course, duration, date, and notes in a focused workflow.</p>
			</article>

			<article class="feature-card">
				<h3>Review progress</h3>
				<p class="muted">
					See task totals, completion rate, study time, and recent activity at a glance.
				</p>
			</article>

			<article class="feature-card">
				<h3>Explore analytics</h3>
				<p class="muted">Use charts and filters to compare subjects and understand study trends.</p>
			</article>

			<article class="feature-card">
				<h3>Keep momentum visible</h3>
				<p class="muted">
					Turn everyday sessions into patterns you can actually notice and improve.
				</p>
			</article>
		</div>
	</section>
</div>
