import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// allowedHosts: ['29e1-2800-810-478-24ed-912-a2c1-da41-8669.ngrok-free.app']
	}
});
