import { redirect } from '@sveltejs/kit';
import { logout } from '$lib/server/auth';

export async function POST({ cookies }) {
	logout(cookies);
	throw redirect(303, '/');
}
