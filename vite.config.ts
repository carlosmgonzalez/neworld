import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		// allowedHosts: ['32c2-2800-810-478-24ed-a5a9-6190-74b2-b87b.ngrok-free.app']
	}
});
