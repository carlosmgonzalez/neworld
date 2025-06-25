<script lang="ts">
	import type { Product } from '@prisma/client';
	import { formatPrice } from '$lib/utils/formatters';
	import * as Card from '$lib/components/ui/card/index';
	import Button from '$lib/components/ui/button/button.svelte';

	interface Props {
		product: Product;
	}
	const { product }: Props = $props();
</script>

<Card.Root class="w-full p-1">
	<Card.Content class="p-1">
		<a href={`/product/${product.id}`}>
			<div class="w-full aspect-square overflow-hidden rounded-md bg-gray-100">
				<img
					src={product.images[0]}
					alt={product.name}
					class="w-full h-full object-cover object-center transition-transform hover:scale-105"
				/>
			</div>
		</a>
	</Card.Content>
	<Card.Footer class="flex flex-col p-0">
		<Card.Title class="flex self-start text-sm sm:text-base">
			{product.name}
		</Card.Title>
		<Card.Description class="w-full flex justify-between items-center mt-2">
			{#if product.stock > 0}
				<p class="text-xs sm:text-sm font-light text-emerald-600">En stock</p>
			{:else}
				<p class="text-xs sm:text-sm font-light text-destructive">Sin stock</p>
			{/if}
			<div class="flex flex-col items-center">
				<p class="text-xs sm:text-sm font-semibold">
					{formatPrice(product.price)}
				</p>
				{#if product.higherPrice}
					<p class="text-xs line-through text-destructive">
						{formatPrice(product.higherPrice)}
					</p>
				{/if}
			</div>
		</Card.Description>
	</Card.Footer>
</Card.Root>
