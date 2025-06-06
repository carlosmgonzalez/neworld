<script lang="ts">
	import '@splidejs/svelte-splide/css';
	import type { Product } from '@prisma/client';
	import { formatPrice } from '@/lib/utils/formatters';

	export let product: Product;
</script>

<a
	href={`/product/${product.id}`}
	class="bg-blue-200/50 shadow-lg rounded-xl flex flex-col items-center justify-start gap-1 hover:opacity-80 transition-opacity"
>
	<img
		src={product.images[0]}
		alt={product.name}
		class="w-full h-auto rounded-t-xl aspect-square object-contain"
	/>
	<div class="flex flex-col px-2 pb-2 w-full">
		<h3 class="font-medium text-xs md:text-sm">{product.name}</h3>
		<p class="text-xxs md:text-xs text-neutral-600 self-start">{product.smallDescription}</p>
		<div class="flex flex-row justify-between items-center">
			{#if product.stock > 0}
				<p class="text-xs text-emerald-600">En stock</p>
			{:else}
				<p class="text-xs text-red-600">Sin stock</p>
			{/if}
			<p class="text-xs md:text-sm font-semibold mt-2">{formatPrice(product.price)}</p>
		</div>
	</div>
</a>
