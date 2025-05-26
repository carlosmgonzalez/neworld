<script lang="ts">
	import '@splidejs/svelte-splide/css';
	import type { Product } from '@prisma/client';

	export let product: Product;
</script>

<a
	href={`/product/${product.id}`}
	class="bg-blue-200/50 shadow-lg rounded-xl flex flex-col items-center justify-center gap-1 hover:opacity-80 transition-opacity"
>
	<img
		src={product.images[0]}
		alt={product.name}
		class="h-full w-full rounded-t-xl aspect-square"
	/>
	<div class="flex flex-col px-2 pb-2 w-full">
		<div class="flex justify-between items-center w-full">
			<h3 class="font-bold">{product.name}</h3>
			<p class="text-xs text-gray-500">${product.price}</p>
		</div>
		<p class="text-xs self-start">{product.smallDescription}</p>
	</div>
</a>
