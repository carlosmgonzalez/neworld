<script lang="ts">
	import { cartStore } from '../../store/cart.store';
	import { products } from '../../lib/database/products';
	import { Minus, Plus, Trash } from '@lucide/svelte';
	import { text } from '@sveltejs/kit';

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

<div class="absolute z-10 w-full h-28 bg-linear-to-t from-trasparente to-blue-300"></div>
<div class="w-full max-w-[1200px] mx-auto flex flex-col px-4 md:px-6 mt-28">
	<h1 class="text-2xl font-semibold">Carrito</h1>
	<a href="/" class="underline"> Seguir comprando </a>
	<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
		{#if productsInCart.length > 0}
			<div class="flex flex-col bg-blue-200/30 backdrop-blur-3xl rounded-lg p-4 gap-4 h-fit">
				{#each productsInCart as product}
					<div class="grid grid-cols-2 rounded-lg gap-4">
						<img
							src={`/${product.imagesUrl[0]}`}
							alt={product.description}
							class="h-auto aspect-square rounded-xl"
						/>
						<div>
							<h3 class="font-bold text-lg">{product.title}</h3>
							<div class="flex gap-2 items-center">
								<p class="font-light text-sm">Precio:</p>
								<p class="font-semibold text-sm">${+product.price * product.quantity}</p>
							</div>
							<div class="flex gap-2">
								<p class="font-light text-sm">Cantidad:</p>
								<p class="font-semibold text-sm">{product.quantity}</p>
							</div>
							<divsd
								class="flex justify-between items-center gap-5 bg-white rounded-lg px-2 py-1 mt-2 w-fit"
							>
								<div class="flex justify-center items-center gap-1">
									<button
										class="cursor-pointer"
										onclick={() => {
											cartStore.removeOne(product.id);
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
							</divsd>
							<!-- <div class="flex flex-col justify-center items-center">
							</div> -->
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-col bg-white rounded-lg gap-5">
				<h3 class="font-bold text-lg">Resumen de compra</h3>
				<div class="flex justify-between items-center">
					<p class="font-light text-sm">Subtotal:</p>
					<p class="font-semibold text-sm">
						${productsInCart.reduce((acc, product) => acc + +product.price * product.quantity, 0)}
					</p>
				</div>
				<div class="flex justify-between items-center">
					<p class="font-light text-sm">Impuestos:</p>
					<p class="font-semibold text-sm">
						10%
						<span>
							( ${productsInCart.reduce(
								(acc, product) => acc + +product.price * product.quantity,
								0
							) * 0.1}
							)
						</span>
					</p>
				</div>
				<!-- <div class="flex justify-between items-center">
					<p
						class="font-light text-sm"
					>
						Envío:
					</p>
					<p class="font-semibold text-sm">$0</p>
				</div> -->

				<div class="flex justify-between items-center">
					<p class="font-light text-sm">Total:</p>
					<p class="font-semibold text-sm">
						${productsInCart.reduce((acc, product) => acc + +product.price * product.quantity, 0) +
							productsInCart.reduce((acc, product) => acc + +product.price * product.quantity, 0) *
								0.1}
					</p>
				</div>
				<a
					href="/checkout"
					class="bg-blue-500 rounded-lg text-white text-center px-4 py-2 mt-4 hover:bg-blue-600 transition-colors duration-300"
				>
					Comprar
				</a>
			</div>
		{:else}
			<p>No products in cart</p>
		{/if}
	</div>
</div>
