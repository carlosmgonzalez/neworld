import { auth } from '@/lib/auth/auth';
import type { Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = ({ event, resolve }) => {
	return svelteKitHandler({ event, resolve, auth });
};
