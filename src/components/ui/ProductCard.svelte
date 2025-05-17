<script lang="ts">
	import type { Product } from '../../interfaces/product.interface';

	export let product: Product;
</script>

<a
	href={`/product/${product.id}`}
	class="bg-blue-200/30 shadow rounded-xl flex flex-col items-center justify-center gap-2 p-2 hover:opacity-80 transition-opacity"
>
	<img
		src={`/${product.imagesUrl[0]}`}
		alt={product.title}
		class="h-full w-full rounded-xl aspect-square"
	/>
	<div class="flex flex-col px-1 w-full">
		<div class="flex justify-between items-center w-full">
			<h3 class="font-bold">{product.title}</h3>
			<p class="text-xs text-gray-500">${product.price}</p>
		</div>
		<p class="text-xs self-start">{product.description}</p>
	</div>
</a>
