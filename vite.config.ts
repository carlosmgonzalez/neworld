import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// allowedHosts: ['9f12-2800-810-478-24ed-9d7f-e4b0-add6-4fe6.ngrok-free.app']
	}
});
