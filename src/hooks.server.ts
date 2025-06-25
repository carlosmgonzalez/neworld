import { auth } from '$lib/auth/auth';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import prisma from './lib/prisma';
import { env } from '$env/dynamic/private';

const createSession = async (event: RequestEvent) => {
	const session = await prisma.session.create({
		data: {
			token: crypto.randomUUID(),
			expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days
			ipAddress: event.getClientAddress(),
			userAgent: event.request.headers.get('user-agent') || ''
		}
	});

	return session;
};

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('sessionToken');
	let session = null;

	if (sessionToken) {
		session = await prisma.session.findUnique({
			where: {
				token: sessionToken
			}
		});

		if (!session) {
			console.warn('Invalid session token found in cookie, creating new session.');
			session = await createSession(event);
		}
	} else {
		session = await createSession(event);
	}

	event.cookies.set('sessionToken', session!.token, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
		path: '/'
	});

	event.locals.session = session;

	return svelteKitHandler({ event, resolve, auth });
};
