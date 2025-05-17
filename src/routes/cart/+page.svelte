<script lang="ts">
	import { cartStore } from '../../store/cart.store';
	import { products } from '../../lib/database/products';
	import { Minus, Plus, Trash } from '@lucide/svelte';

	type ProductInCart = {
		id: string;
		title: string;
		price: string;
		description: string;
		imagesUrl: string[];
		quantity: number;
	};

	let quantity = $state(0);

	let productsInCart: ProductInCart[] = $state([]);

	cartStore.subscribe((cart) => {
		productsInCart = cart.map((item) => {
			const product = products.find((p) => p.id === item.productId);

			return {
				id: item.productId,
				title: product!.title,
				price: product!.price,
				description: product!.description,
				imagesUrl: product!.imagesUrl,
				quantity: item.quantity
			};
		});
	});
</script>

<div class="h-28 bg-linear-to-t from-white to-blue-300"></div>
<!-- <div class="h-28"></div> -->
<h1 class="text-2xl font-bold">Carrito</h1>
<div class="grid grid-cols-1 md:grid-cols-2 px-4 md:px-10 lg:px-36 py-5 gap-4">
	{#if productsInCart.length > 0}
		<div class="flex flex-col bg-blue-200/30 backdrop-blur-3xl rounded-lg px-4 py-2 gap-4">
			{#each productsInCart as product}
				<div class="flex rounded-lg px-2 py-1 gap-4">
					<img
						src={`/${product.imagesUrl[0]}`}
						alt={product.description}
						class="w-[200px] h-auto aspect-square rounded-xl"
					/>
					<div>
						<h3 class="font-bold text-lg">{product.title}</h3>
						<div class="flex gap-2 items-center">
							<p class="font-light text-sm">Precio:</p>
							<p class="font-semibold text-sm">${product.price}</p>
						</div>
						<div class="flex gap-2">
							<p class="font-light text-sm">Cantidad:</p>
							<p class="font-semibold text-sm">{product.quantity}</p>
						</div>
						<div class="flex justify-between items-center bg-white rounded-lg px-4 py-1 mt-2">
							<div class="flex justify-center items-center gap-1">
								<button
									class="cursor-pointer"
									onclick={() => {
										if (quantity > 1) {
											quantity -= 1;
										}
									}}
								>
									<Minus size={16} />
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
									<Plus size={16} />
								</button>
							</div>
							<button
								class="rounded-lg cursor-pointer text-red-700"
								onclick={() => {
									cartStore.removeItem(product.id);
								}}
							>
								<Trash size={20} />
							</button>
						</div>
						<!-- <div class="flex flex-col justify-center items-center">
            </div> -->
					</div>
				</div>
			{/each}
		</div>
		<div class="flex justify-between items-center bg-white rounded-lg px-2 py-1 w-fit gap-5 mt-4">
			<button
				class="cursor-pointer"
				onclick={() => {
					cartStore.clear();
				}}
			>
				Limpiar carrito
			</button>
			<button
				class="cursor-pointer"
				onclick={() => {
					alert('Compra realizada');
					cartStore.clear();
				}}
			>
				Comprar
			</button>
		</div>
	{:else}
		<p>No products in cart</p>
	{/if}
</div>
