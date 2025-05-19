<script lang="ts">
	import { products } from '@/database/products';
	import type { PageProps } from './$types';
	import { Minus, Plus } from '@lucide/svelte';
	import ProductCard from '../../../components/ui/ProductCard.svelte';
	import { reviews } from '@/database/reviews';
	import ReviewsCard from '../../../components/ui/ReviewsCard.svelte';
	import { cartStore } from '../../../store/cart.store';

	const { data }: PageProps = $props();

	let id = $derived(data.slug);

	let product = $derived(products.find((p) => p.id === id));
	let otherProducts = $derived(products.filter((p) => p.id !== id));
	let productReviews = $derived(reviews.filter((r) => r.productId === id));

	let quantity = $state(1);
</script>

<div class="absolute h-24 w-full bg-linear-to-t from-transparent to-blue-300"></div>
<div
	class="w-full max-w-[1200px] m-auto grid grid-cols-1 md:grid-cols-2 justify-center md:items-start gap-2 pb-5 pt-26 px-4 md:px-6 lg:px-26 rounded-b-2xl items-center"
>
	<div class="w-full flex justify-center items-center mb-6 md:mb-0">
		<img
			src={`/${product?.imagesUrl[0]}`}
			alt={product?.description}
			class="w-[75%] h-auto aspect-square rounded-lg"
			loading="lazy"
		/>
	</div>
	<div
		class="w-full flex flex-col px-8 py-4 rounded-lg shadow-lg bg-blue-200/30 backdrop-blur-3xl md:self-start"
	>
		<div class="flex justify-between items-center w-full">
			<h3 class="font-bold text-3xl">{product?.title}</h3>
			<p class="font-light text-xl">${product?.price}</p>
		</div>
		<p class="text-xs text-gray-500">{product?.description}</p>
		<div class="flex justify-between items-center bg-white rounded-lg px-2 py-1 w-fit gap-5 mt-4">
			<button
				class="cursor-pointer"
				onclick={() => {
					if (quantity > 1) {
						quantity -= 1;
					}
				}}
			>
				<Minus />
			</button>
			<span
				class="flex justify-center items-center px-2 bg-neutral-200/80 backdrop-blur-3xl rounded-lg"
				>{quantity}</span
			>
			<button
				class="cursor-pointer"
				onclick={() => {
					if (quantity < 10) {
						quantity += 1;
					}
				}}
			>
				<Plus />
			</button>
		</div>
		<div class="flex justify-center items-center w-full mt-4">
			<button
				type="button"
				class="bg-blue-500 w-full text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-300"
				onclick={() => {
					if (!product) return;
					cartStore.addItem({ productId: product.id, quantity });
				}}
			>
				Add to Cart
			</button>
		</div>
		<div class="h-[1px] w-full bg-neutral-200"></div>
		<p class="text-xs text-gray-500 mt-2">
			After purchasing a similar adapter online and being very disappointed, I was pleased to
			discover that Nomad’s Apple Watch adapter ticks all the boxes and more: - An Apple Watch
			charger that is actually made for the Apple Watch - 65 watts on top of the AW charging puck
			which is plenty for my MBA and phone/tablet
		</p>
	</div>
</div>
<div class="flex-1 flex flex-col px-4 md:px-6 m-auto mt-8 w-full max-w-[1200px]">
	<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
		{#each otherProducts as product}
			<ProductCard {product} />
		{/each}
	</div>
	<!-- <div class="h-[1px] w-full bg-neutral-300"></div> -->
	<h3 class="font-bold text-xl text-center mt-5 mb-2">Reviews</h3>
	{#if productReviews.length > 0}
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
			{#each productReviews as review}
				<ReviewsCard {review} />
			{/each}
		</div>
	{:else}
		<p class="text-gray-500">No reviews available for this product.</p>
	{/if}
</div>
