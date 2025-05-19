<script>
	import { products } from '@/database/products';
	import ProductCard from './ui/ProductCard.svelte';
</script>

<section>
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each products as product}
			<ProductCard {product} />
		{/each}
	</div>
</section>
