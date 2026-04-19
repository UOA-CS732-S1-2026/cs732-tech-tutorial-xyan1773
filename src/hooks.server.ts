import type { Handle } from '@sveltejs/kit';
import { getSessionFromCookies } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
	const sessionData = getSessionFromCookies(event.cookies);
	event.locals.user = sessionData?.user ?? null;
	event.locals.session = sessionData?.session ?? null;

	return resolve(event);
};
