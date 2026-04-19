import { randomUUID, scryptSync, timingSafeEqual } from 'node:crypto';
import type { Cookies, RequestEvent } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import type { AuthUser, SessionRecord } from '$lib/types';

const SESSION_COOKIE = 'study_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;

type DbUser = {
	id: string;
	email: string;
	password_hash: string;
	created_at: string;
};

function toAuthUser(user: DbUser): AuthUser {
	return {
		id: user.id,
		email: user.email,
		createdAt: user.created_at
	};
}

function hashPassword(password: string) {
	const salt = randomUUID();
	const hash = scryptSync(password, salt, 64).toString('hex');
	return `${salt}:${hash}`;
}

function verifyPassword(password: string, stored: string) {
	const [salt, originalHash] = stored.split(':');
	if (!salt || !originalHash) return false;

	const candidateHash = scryptSync(password, salt, 64);
	const originalBuffer = Buffer.from(originalHash, 'hex');

	if (candidateHash.length !== originalBuffer.length) return false;
	return timingSafeEqual(candidateHash, originalBuffer);
}

function setSessionCookie(cookies: Cookies, sessionId: string, expiresAt: Date) {
	cookies.set(SESSION_COOKIE, sessionId, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: false,
		expires: expiresAt
	});
}

export function clearSessionCookie(cookies: Cookies) {
	cookies.delete(SESSION_COOKIE, { path: '/' });
}

export function createSession(userId: string, cookies: Cookies) {
	const sessionId = randomUUID();
	const createdAt = new Date();
	const expiresAt = new Date(createdAt.getTime() + SESSION_TTL_MS);

	db.prepare(
		`INSERT INTO sessions (id, user_id, expires_at, created_at)
		 VALUES (@id, @userId, @expiresAt, @createdAt)`
	).run({
		id: sessionId,
		userId,
		expiresAt: expiresAt.toISOString(),
		createdAt: createdAt.toISOString()
	});

	setSessionCookie(cookies, sessionId, expiresAt);
	return sessionId;
}

export function deleteSession(sessionId: string) {
	db.prepare('DELETE FROM sessions WHERE id = ?').run(sessionId);
}

export function logout(cookies: Cookies) {
	const sessionId = cookies.get(SESSION_COOKIE);
	if (sessionId) {
		deleteSession(sessionId);
	}
	clearSessionCookie(cookies);
}

export function getSessionFromCookies(cookies: Cookies) {
	const sessionId = cookies.get(SESSION_COOKIE);
	if (!sessionId) return null;

	const session = db
		.prepare(
			`SELECT sessions.id, sessions.user_id, sessions.expires_at, sessions.created_at,
			        users.id as user_id_value, users.email, users.created_at as user_created_at, users.password_hash
			 FROM sessions
			 JOIN users ON users.id = sessions.user_id
			 WHERE sessions.id = ?`
		)
		.get(sessionId) as
		| (SessionRecord & {
				expires_at: string;
				created_at: string;
				user_id: string;
				user_id_value: string;
				email: string;
				user_created_at: string;
				password_hash: string;
		  })
		| undefined;

	if (!session) return null;

	if (new Date(session.expires_at) <= new Date()) {
		deleteSession(sessionId);
		clearSessionCookie(cookies);
		return null;
	}

	return {
		session: {
			id: session.id,
			userId: session.user_id,
			expiresAt: session.expires_at,
			createdAt: session.created_at
		},
		user: {
			id: session.user_id_value,
			email: session.email,
			createdAt: session.user_created_at
		} satisfies AuthUser
	};
}

export function requireUser(event: RequestEvent) {
	if (!event.locals.user) {
		throw redirect(303, '/auth/login');
	}

	return event.locals.user;
}

export function registerUser(email: string, password: string, cookies: Cookies) {
	const normalizedEmail = email.trim().toLowerCase();
	const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(normalizedEmail);
	if (existing) {
		return { ok: false as const, message: 'An account with that email already exists.' };
	}

	const userId = randomUUID();
	const createdAt = new Date().toISOString();

	db.prepare(
		`INSERT INTO users (id, email, password_hash, created_at)
		 VALUES (@id, @email, @passwordHash, @createdAt)`
	).run({
		id: userId,
		email: normalizedEmail,
		passwordHash: hashPassword(password),
		createdAt
	});

	createSession(userId, cookies);

	return {
		ok: true as const,
		user: {
			id: userId,
			email: normalizedEmail,
			createdAt
		} satisfies AuthUser
	};
}

export function loginUser(email: string, password: string, cookies: Cookies) {
	const normalizedEmail = email.trim().toLowerCase();
	const user = db.prepare('SELECT * FROM users WHERE email = ?').get(normalizedEmail) as
		| DbUser
		| undefined;

	if (!user || !verifyPassword(password, user.password_hash)) {
		return { ok: false as const, message: 'Invalid email or password.' };
	}

	createSession(user.id, cookies);
	return { ok: true as const, user: toAuthUser(user) };
}
