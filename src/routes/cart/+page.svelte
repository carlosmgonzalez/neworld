<script lang="ts">
	import { invalidate } from '$app/navigation';
	import { cartStore } from '@/store/cart.store';
	import { Minus, Plus, X } from '@lucide/svelte';

	const { data } = $props();
</script>

{#if data.error}
	<p>Error to load products</p>
{/if}

<div class="page-container">
	<h1 class="text-2xl font-semibold">Carrito</h1>
	<a href="/" class="underline text-neutral-500"> Seguir comprando </a>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
		{#if data.detailedCartItems.length === 0}
			<p>No hay productos en el carrito</p>
		{:else}
			<div
				class="flex flex-col md:col-span-2 bg-blue-200/50 backdrop-blur-3xl shadow-md rounded-lg p-4 gap-4 h-fit"
			>
				{#each data.detailedCartItems as product}
					<div class="flex flex-row rounded-lg gap-4 items-center">
						<img
							src={product.images[0]}
							alt={product.smallDescription}
							class="w-[150px] h-auto aspect-square rounded-xl shadow-md"
						/>
						<div class="w-full flex flex-col justify-between gap-2 md:flex-row md:gap-4">
							<div class="flex flex-col gap-2 md:gap-4">
								<h3 class="font-semibold">{product?.name}</h3>
								<p class="text-xs font-light text-neutral-600">
									{product.smallDescription}
								</p>
								<p class="font-light text-sm text-neutral-600">
									${+product.price * product.quantity}
								</p>
							</div>
							<div class="flex flex-row gap-2 items-center">
								<div
									class="flex justify-center items-center gap-2 shadow-md bg-white rounded-lg px-2 py-1 h-fit"
								>
									<button
										class="cursor-pointer"
										onclick={() => {
											cartStore.removeOne(product.id);
											invalidate('app:cart');
										}}
									>
										<Minus size={16} />
									</button>
									<span
										class="flex justify-center items-center px-2 bg-neutral-200/80 backdrop-blur-3xl rounded-lg"
										>{product.quantity}</span
									>
									<button
										class="cursor-pointer"
										onclick={() => {
											cartStore.addOne(product.id);
											invalidate('app:cart');
										}}
									>
										<Plus size={16} />
									</button>
								</div>
								<button
									class="rounded-lg cursor-pointer text-red-700"
									onclick={() => {
										cartStore.removeItem(product.id);
										invalidate('app:cart');
									}}
								>
									<X size={20} />
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-col rounded-lg shadow-md p-4 bg-neutral-200/50 gap-2 h-fit">
				<h3 class="font-bold text-lg">Resumen de compra</h3>
				<div class="flex justify-between items-center">
					<p class="font-light text-sm">Total:</p>
					<p class="font-semibold text-sm">
						${data.detailedCartItems.reduce(
							(acc, product) => acc + +product.price * product.quantity,
							0
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
