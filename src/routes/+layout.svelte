<script lang="ts">
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';
	import { ModeWatcher } from 'mode-watcher';

	import WhatsAppButton from '$lib/components/layout/whatsapp-button.svelte';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/navbar.svelte';

	import '../app.css';
	import type { LayoutProps } from './$types';
	import { Toaster } from '$lib/components/ui/sonner';

	injectSpeedInsights();
	injectAnalytics();

	let { children, data }: LayoutProps = $props();
</script>

<Toaster />
<main class="min-h-screen flex flex-col justify-between">
	<Navbar cart={data.cart} />
	<ModeWatcher />
	{@render children()}
	<WhatsAppButton whatsappNumber={data.whatsappNumber} />
	<Footer />
</main>
