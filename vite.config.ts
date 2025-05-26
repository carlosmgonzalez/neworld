import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// allowedHosts: ['8f1d-2800-810-478-24ed-d52a-5712-68f2-c9ac.ngrok-free.app']
	}
});
