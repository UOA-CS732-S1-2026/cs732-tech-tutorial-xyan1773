import { fail, redirect } from '@sveltejs/kit';
import { loginUser } from '$lib/server/auth';
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

		if (!email || !password) {
			return fail(400, {
				error: 'Email and password are required.',
				values: { email }
			});
		}

		const result = loginUser(email, password, cookies);
		if (!result.ok) {
			return fail(400, {
				error: result.message,
				values: { email }
			});
		}

		throw redirect(303, '/dashboard');
	}
};
