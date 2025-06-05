import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// allowedHosts: ['63a2-2800-810-478-24ed-298f-a5c9-e531-e79d.ngrok-free.app']
	}
});
