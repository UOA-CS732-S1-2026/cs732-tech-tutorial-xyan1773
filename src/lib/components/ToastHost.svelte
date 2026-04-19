<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';

	type ToastState = {
		title: string;
		message: string;
		tone: 'success' | 'info';
	};

	const toastMap: Record<string, ToastState> = {
		created: {
			title: 'Task created',
			message: 'Study record added successfully.',
			tone: 'success'
		},
		updated: {
			title: 'Task updated',
			message: 'Study record updated successfully.',
			tone: 'success'
		},
		deleted: {
			title: 'Task deleted',
			message: 'Study record deleted successfully.',
			tone: 'success'
		},
		toggled: {
			title: 'Status changed',
			message: 'Study task status updated.',
			tone: 'success'
		},
		reset: {
			title: 'Demo data restored',
			message: 'Sample study records are ready again.',
			tone: 'info'
		}
	};

	let toast = $state<ToastState | null>(null);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	function dismissToast() {
		toast = null;

		if (!browser) return;

		const nextUrl = new URL(page.url);
		nextUrl.searchParams.delete('status');
		window.history.replaceState(window.history.state, '', nextUrl);
	}

	$effect(() => {
		if (!browser) return;

		const status = page.url.searchParams.get('status');
		if (!status || !toastMap[status]) return;

		toast = toastMap[status];

		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			dismissToast();
		}, 3200);

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	});
</script>

{#if toast}
	<div class={`toast ${toast.tone}`}>
		<div>
			<strong>{toast.title}</strong>
			<p>{toast.message}</p>
		</div>
		<button
			type="button"
			class="toast-close"
			aria-label="Dismiss notification"
			onclick={dismissToast}
		>
			×
		</button>
	</div>
{/if}
