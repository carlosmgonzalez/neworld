<script lang="ts">
	import type { Product } from '@prisma/client';
	export let products: Product[];
	import ProductCard from './ui/ProductCard.svelte';
</script>

<section>
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
		{#each products as product (product.id)}
			{#if product.id !== 'f81d4fae-7dec-11d0-a765-00a0c91e6bf6'}
				<ProductCard {product} />
			{/if}
		{/each}
	</div>
</section>
