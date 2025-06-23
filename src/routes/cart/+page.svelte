<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import { formatPrice } from '@/lib/utils/formatters.js';
	import { cartStore } from '@/store/cart.store';
	import { Minus, Plus, ShoppingCart, X } from '@lucide/svelte';

	const { data } = $props();
</script>

<!-- {#if data.error}
	<div class="page-container">
		<p>Error to load products</p>
	</div>
{/if} -->

<div class="page-container">
	<h1 class="text-lg font-semibold">Carrito</h1>
	<a href="/" class="underline text-sm font-light"> Seguir comprando </a>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
		{#if data.cart?.CartItem.length === 0}
			<div class="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
				<div class="flex flex-col items-center">
					<ShoppingCart size={70} />
					<p class="font-light text-center">No hay productos en el carrito</p>
				</div>
			</div>
		{:else}
			<div class="flex flex-col md:col-span-2 gap-4 h-fit">
				{#each data.cart!.CartItem as item (item.product.id)}
					<div class="flex flex-row bg-blue-200/50 rounded-lg gap-2 items-center">
						<img
							src={item.product.images[0]}
							alt={item.product.smallDescription}
							class="w-[160px] h-auto aspect-square rounded-l-lg"
						/>
						<div class="w-full flex flex-col justify-between gap-1 pr-2 md:flex-row md:gap-4">
							<div class="flex flex-col gap-1 md:gap-4">
								<a href={`/product/${item.product.id}`}>{item.product?.name}</a>
								<p class="text-sm font-light hidden sm:block">
									{item.product.smallDescription}
								</p>
								<p class="text-sm font-semibold">
									{formatPrice(+item.product.price * item.quantity)}
								</p>
							</div>
							<div class="flex flex-row gap-2 items-center">
								<div
									class="flex justify-center items-center gap-2 shadow-md bg-white rounded-lg px-2 py-1 h-fit"
								>
									<form method="POST" action="?/removeOne" use:enhance>
										<button type="submit" class="cursor-pointer">
											<input type="text" name="productId" value={item.productId} hidden />
											<Minus size={16} />
										</button>
									</form>
									<span
										class="flex justify-center items-center px-2 bg-neutral-200/80 backdrop-blur-3xl rounded-lg"
										>{item.quantity}</span
									>
									<form method="POST" action="?/addOne" use:enhance>
										<button type="submit" class="cursor-pointer">
											<input type="text" name="productId" value={item.productId} hidden />
											<Plus size={16} />
										</button>
									</form>
								</div>
								<!-- <button
									class="cursor-pointer text-red-700"
									onclick={() => {
										cartStore.removeItem(item.product.id);
										invalidate('app:cart');
									}}
								>
									<X size={20} />
								</button> -->
								<form method="POST" action="?/removeAll" use:enhance>
									<button type="submit" class="cursor-pointer text-red-700">
										<input type="text" name="productId" value={item.productId} hidden />
										<X size={16} />
									</button>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-col rounded-lg shadow-md p-4 bg-white gap-2 h-fit">
				<h3 class="font-medium">Resumen de compra</h3>
				<div class="flex justify-between items-center">
					<p class="font-light">Total:</p>
					<p class="font-semibold">
						{formatPrice(
							data.cart!.CartItem.reduce(
								(acc, item) => acc + item.product.price * +item.quantity,
								0
							)
						)}
					</p>
				</div>
				<a
					href="/checkout"
					class="bg-blue-500 rounded-lg text-white text-center px-4 py-2 mt-2 hover:bg-blue-600 transition-colors duration-300"
				>
					Iniciar compra
				</a>
			</div>
		{/if}
	</div>
</div>
