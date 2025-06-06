<script lang="ts">
	import WhatsAppButton from '@/components/ui/WhatsAppButton.svelte';
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';
	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();
</script>

<main class="min-h-screen flex flex-col justify-between">
	<Navbar />
	{@render children()}
	<WhatsAppButton whatsappNumber={data.whatsappNumber} />
	<Footer />
</main>
