<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	let { form } = $props();
</script>

<div class="page-grid auth-shell">
	<section class="panel auth-card">
		<span class="eyebrow">Welcome back</span>
		<h1 class="auth-title">Sign in to your study dashboard</h1>
		<p class="section-copy">Access your personal study records, analytics, and progress history.</p>

		<form class="form-grid" method="POST" use:enhance>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" name="email" type="email" value={form?.values?.email ?? ''} required />
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input id="password" name="password" type="password" required />
			</div>

			{#if form?.error}
				<div class="field-error">{form.error}</div>
			{/if}

			<button class="button" type="submit">Sign in</button>
		</form>

		<p class="footer-note">
			New here? <a href={resolve('/auth/register')}>Create an account</a>
		</p>
	</section>
</div>
