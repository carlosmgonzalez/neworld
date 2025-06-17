<script lang="ts">
	import { goto } from '$app/navigation';
	import { Check } from '@lucide/svelte';

	interface Props {
		description: string;
	}

	const { description }: Props = $props();
</script>

<div class="flex flex-col">
	<p class="font-semibold">Producto agregado</p>
	<p>{description}</p>
</div>
