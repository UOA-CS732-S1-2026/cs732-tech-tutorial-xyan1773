<script lang="ts">
	import { enhance } from '$app/forms';
	import { resolve } from '$app/paths';
	let { form } = $props();
</script>

<div class="page-grid auth-shell">
	<section class="panel auth-card">
		<span class="eyebrow">Create account</span>
		<h1 class="auth-title">Start your personal study workspace</h1>
		<p class="section-copy">
			Register once and keep your study records, charts, and progress history attached to your own
			account.
		</p>

		<form class="form-grid" method="POST" use:enhance>
			<div class="field">
				<label for="email">Email</label>
				<input id="email" name="email" type="email" value={form?.values?.email ?? ''} required />
			</div>

			<div class="field">
				<label for="password">Password</label>
				<input id="password" name="password" type="password" required />
			</div>

			<div class="field">
				<label for="confirmPassword">Confirm password</label>
				<input id="confirmPassword" name="confirmPassword" type="password" required />
			</div>

			{#if form?.error}
				<div class="field-error">{form.error}</div>
			{/if}

			<button class="button" type="submit">Create account</button>
		</form>

		<p class="footer-note">
			Already have an account? <a href={resolve('/auth/login')}>Sign in</a>
		</p>
	</section>
</div>
