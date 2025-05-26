<script lang="ts">
	import WhatsAppButton from '@/components/ui/WhatsAppButton.svelte';
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Navbar from '../components/Navbar.svelte';

	let { children } = $props();
</script>

<main class="min-h-screen flex flex-col justify-between">
	<Navbar />
	{@render children()}
	<!-- <div class="w-full px-4 mt-2">
		<Footer />
	</div> -->
	<WhatsAppButton />
	<Footer />
</main>
