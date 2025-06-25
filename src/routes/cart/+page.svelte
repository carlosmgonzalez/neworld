<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { formatPrice } from '$lib/utils/formatters.js';
	import Button, { buttonVariants } from '$lib/components/ui/button/button.svelte';
	import { Loader, Minus, Plus, ShoppingCart, X } from '@lucide/svelte';

	const { data } = $props();
	let isLoading = $state<Record<string, boolean>>({});
</script>

<div class="page-container">
	<h1 class="text-lg font-semibold">Carrito</h1>
	<a href="/" class="underline text-sm font-light"> Seguir comprando </a>
	<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
		{#if data.cart?.CartItem.length === 0 || !data.cart}
			<div class="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
				<div class="flex flex-col items-center">
					<ShoppingCart size={70} />
					<p class="font-light text-center">No hay productos en el carrito</p>
				</div>
			</div>
		{:else}
			<div class="flex flex-col md:col-span-2 gap-4 h-fit">
				{#each data.cart!.CartItem as item (item.productId)}
					<div class="flex flex-row bg-primary/20 rounded-lg gap-2 items-center p-1">
						<img
							src={item.product.images[0]}
							alt={item.product.smallDescription}
							class="w-[160px] h-auto aspect-square rounded-md"
						/>
						<div class="w-full flex flex-col justify-between gap-1 pr-2 md:flex-row md:gap-4">
							<div class="flex flex-col gap-1 md:gap-4">
								<a href={`/product/${item.product.id}`} class="font-semibold underline"
									>{item.product?.name}</a
								>
								<p class="text-sm font-light hidden sm:block">
									{item.product.smallDescription}
								</p>
								<p class="text-sm font-semibold">
									{formatPrice(+item.product.price * item.quantity)}
								</p>
							</div>
							<div class="flex flex-row gap-2 items-center">
								<div
									class="flex justify-center items-center gap-2 shadow-md bg-primary/30 rounded-lg h-fit"
								>
									<form
										method="POST"
										action="?/removeOne"
										use:enhance={() => {
											isLoading[item.productId] = true;
											return async ({ update, result }) => {
												await update({ invalidateAll: true, reset: false });
												await applyAction(result);
												isLoading[item.productId] = false;
											};
										}}
									>
										<input type="text" name="productId" value={item.productId} hidden />
										<Button
											type="submit"
											class="cursor-pointer w-8 h-auto"
											variant="ghost"
											disabled={isLoading[item.productId]}
										>
											<Minus size={16} />
										</Button>
									</form>
									<span
										class="flex justify-center items-center px-2 bg-primary/40 backdrop-blur-3xl rounded-lg"
										>{item.quantity}</span
									>
									<form
										method="POST"
										action="?/addOne"
										use:enhance={() => {
											isLoading[item.productId] = true;
											return async ({ update, result }) => {
												if (result.type === 'success') {
													await update({ invalidateAll: true, reset: false });
													isLoading[item.productId] = false;
												}
											};
										}}
									>
										<input type="text" name="productId" value={item.productId} hidden />
										<Button
											type="submit"
											class="cursor-pointer w-8 h-auto"
											variant="ghost"
											disabled={isLoading[item.productId]}
										>
											<Plus size={16} />
										</Button>
									</form>
								</div>
								<form
									method="POST"
									action="?/removeAll"
									use:enhance={() => {
										isLoading[item.productId] = true;
										return async ({ update }) => {
											await update({ invalidateAll: true, reset: false });
											isLoading[item.productId] = false;
										};
									}}
								>
									<input type="text" name="productId" value={item.productId} hidden />
									<Button
										type="submit"
										class="cursor-pointer w-8 h-auto"
										variant="ghost"
										disabled={isLoading[item.productId]}
									>
										{#if isLoading[item.productId]}
											<Loader size={20} class="animate-spin text-destructive" />
										{:else}
											<X size={20} class="text-destructive" />
										{/if}
									</Button>
								</form>
							</div>
						</div>
					</div>
				{/each}
			</div>
			<div class="flex flex-col rounded-lg shadow-md bg-primary/5 p-4 gap-2 h-fit">
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
				<a href="/checkout" class={buttonVariants({ variant: 'default' })}> Iniciar compra </a>
			</div>
		{/if}
	</div>
</div>
