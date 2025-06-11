<script lang="ts">
	import { Menubar } from 'bits-ui';
	import { ShoppingCart } from '@lucide/svelte';
	import { cartStore } from '@/store/cart.store';
	import type { Product } from '@prisma/client';

	const getProductFromDb = (ids: string[]) => {
		return fetch(`/api/products-details`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(ids)
		})
			.then((res) => res.json())
			.catch((err) => {
				console.error('Error fetching product:', err);
				return null;
			});
	};

	let totalItems = $state(0);

	$effect(() => {
		cartStore.subscribe((cart) => {
			const ids = cart.map((item) => item.productId);
			getProductFromDb(ids).then((products: Product[]) => {
				if (products) {
					totalItems = products.reduce((acc, product) => {
						const cartItem = cart.find((item) => item.productId === product.id);
						return acc + (cartItem ? cartItem.quantity : 0);
					}, 0);
				} else {
					totalItems = 0;
				}
			});
		});
	});
</script>

<nav
	class="fixed z-50 right-0 left-0 top-0 flex justify-between items-center h-14 shadow-md bg-white/80 backdrop-blur-lg"
>
	<div class="max-w-[1200px] mx-auto w-full pl-4 pr-5 flex justify-between items-center gap-1">
		<h1 class="font-semibold text-xl flex items-center justify-center">
			<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[45px] h-auto" />
			<a href="/"> Neworld </a>
		</h1>
		<div class="hidden md:flex gap-2"></div>
		<div class="flex justify-center items-center gap-4">
			<a href="/cart" class="relative p-1">
				<span
					class="absolute top-0 right-0 flex justify-center items-center p-[1px] w-[16px] h-[16px] rounded-full bg-blue-500 text-white text-xs font-bold"
				>
					{#if totalItems > 0}
						{totalItems}
					{:else}
						0
					{/if}
				</span>
				<ShoppingCart />
			</a>
		</div>
	</div>
</nav>
