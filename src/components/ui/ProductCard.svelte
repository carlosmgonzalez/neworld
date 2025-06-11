<script lang="ts">
	import type { Product } from '@prisma/client';
	import { formatPrice } from '@/lib/utils/formatters';

	export let product: Product;
</script>

<a
	href={`/product/${product.id}`}
	class="bg-blue-200/50 shadow-lg rounded-xl flex flex-col items-center justify-start gap-1 hover:opacity-80 transition-opacity"
>
	<div
		class="w-full aspect-square overflow-hidden rounded-t-xl
	bg-gray-100"
	>
		<img
			src={product.images[0]}
			alt={product.name}
			class="w-full h-full object-cover object-center
		transition-transform hover:scale-105"
		/>
	</div>

	<div class="flex flex-col px-2 pb-2 w-full">
		<h3 class="">
			{product.name}
		</h3>
		<p class="text-sm font-light">
			{product.smallDescription}
		</p>
		<div class="flex justify-between items-center mt-2">
			{#if product.stock > 0}
				<p class="text-sm text-emerald-600">En stock</p>
			{:else}
				<p class="text-sm text-red-600">Sin stock</p>
			{/if}
			<p class="text-sm font-semibold">
				{formatPrice(product.price)}
			</p>
		</div>
	</div>
</a>
