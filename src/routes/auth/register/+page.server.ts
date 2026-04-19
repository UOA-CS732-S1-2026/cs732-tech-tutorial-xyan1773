import { fail, redirect } from '@sveltejs/kit';
import { registerUser } from '$lib/server/auth';
import type { Actions } from './$types';

export async function load({ locals }) {
	if (locals.user) {
		throw redirect(303, '/dashboard');
	}
}

export const actions: Actions = {
	default: async ({ cookies, request }) => {
		const formData = await request.formData();
		const email = String(formData.get('email') ?? '').trim();
		const password = String(formData.get('password') ?? '');
		const confirmPassword = String(formData.get('confirmPassword') ?? '');

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required.',
				values: { email }
			});
		}

		if (password.length < 8) {
			return fail(400, {
				error: 'Password must be at least 8 characters.',
				values: { email }
			});
		}

		if (password !== confirmPassword) {
			return fail(400, {
				error: 'Passwords do not match.',
				values: { email }
			});
		}

		const result = registerUser(email, password, cookies);
		if (!result.ok) {
			return fail(400, {
				error: result.message,
				values: { email }
			});
		}

		throw redirect(303, '/dashboard');
	}
};
