<script lang="ts">
	import { Minus, Plus, Star } from '@lucide/svelte';
	import { cartStore } from '@/store/cart.store';
	import type { PageProps } from './$types';
	import Carousel from '@/components/ui/Carousel.svelte';
	import { formatPrice } from '@/lib/utils/formatters';

	const { data }: PageProps = $props();

	let isShowAlert = $state(false);

	const showAlert = () => {
		isShowAlert = true;
		setTimeout(() => {
			isShowAlert = false;
		}, 2000);
	};

	let quantity = $state(1);
</script>

<div class="page-container">
	{#if data.ok && data.product}
		<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
			<Carousel images={data.product.images} />
			<div class="w-full h-full flex flex-col justify-center items-center">
				<div
					class="w-full flex flex-col px-8 py-4 rounded-lg shadow-lg bg-blue-200/50 backdrop-blur-3xl md:self-start"
				>
					<div class="flex flex-col md:flex-row justify-between items-start w-full">
						<h3 class="font-semibold text-xl md:text-2xl">{data.product.name}</h3>
						<p class="text-lg mt-1">{formatPrice(data.product.price)}</p>
					</div>
					<p class="text-sm font-light">{data.product.smallDescription}</p>
					{#if data.product!.stock > 0}
						<p class="text-sm font-semibold text-blue-900">En stock</p>

						<div
							class="flex justify-between items-center bg-white rounded-lg px-2 py-1 w-fit gap-5 mt-4"
						>
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
									if (quantity < data.product.stock) {
										quantity += 1;
									}
								}}
							>
								<Plus />
							</button>
						</div>

						<button
							type="button"
							class="bg-blue-500 w-full text-white font-semibold px-4 py-2 rounded-lg mt-4 cursor-pointer hover:bg-blue-600 transition-colors duration-300"
							onclick={() => {
								if (!data.product) return;
								cartStore.addItem({ productId: data.product.id, quantity });
								showAlert();
								quantity = 1; // Reset quantity after adding to cart
							}}
						>
							Agregar al carrito
						</button>
					{:else}
						<p class="font-semibold text-sm text-red-900">Sin stock</p>
					{/if}
					{#if isShowAlert}
						<div class="w-full">
							<p class="text-center text-sm font-light my-3">Producto agregado</p>
						</div>
					{/if}
					<div class="h-[1px] w-full bg-neutral-200"></div>
				</div>
			</div>
		</div>
		<div class="w-full h-[1px] bg-neutral-200 mt-3 mb-5"></div>
		<div class="flex flex-col gap-1.5 rounded-lg">
			<h2 class="font-semibold text-lg">Description</h2>
			<div class="flex flex-col gap-2">
				{@html data.product.description}
			</div>
		</div>
		<div class="w-full flex flex-col flex-wrap md:flex-row items-center justify-center mt-10 gap-3">
			{#each data.product.infoImages as imageUrl}
				<img src={imageUrl} alt="" class="w-[400px] h-auto rounded-lg shadow-md" />
			{/each}
		</div>
		<ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
			{#each data.product.Review as review}
				<li class="bg-white shadow-md rounded-lg p-4 flex flex-col">
					<div class="flex justify-between items-center">
						<p>{review.name}</p>
						<div class="flex items-center mb-2">
							{#each Array(review.rating) as _, i}
								<Star class="text-yellow-400" />
							{/each}
						</div>
					</div>
					<p class="text-sm text-neutral-700">
						{review.comment}
					</p>
				</li>
			{/each}
		</ul>
	{/if}
</div>
