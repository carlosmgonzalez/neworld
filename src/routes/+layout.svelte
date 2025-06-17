<script lang="ts">
	import { injectAnalytics } from '@vercel/analytics/sveltekit';
	import { injectSpeedInsights } from '@vercel/speed-insights/sveltekit';

	import WhatsAppButton from '@/components/ui/WhatsAppButton.svelte';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';

	import '../app.css';
	import type { LayoutProps } from './$types';
	import { Toaster } from '@/lib/components/ui/sonner';

	injectSpeedInsights();
	injectAnalytics();

	let { children, data }: LayoutProps = $props();
</script>

<Navbar />
<main class="min-h-screen flex flex-col justify-between">
	<Toaster />
	{@render children()}
	<WhatsAppButton whatsappNumber={data.whatsappNumber} />
	<Footer />
</main>
