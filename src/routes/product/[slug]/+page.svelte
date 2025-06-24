<script lang="ts">
	import { Loader, Minus, Plus } from '@lucide/svelte';
	import type { PageProps } from './$types';
	import Carousel from '@/components/ui/Carousel.svelte';
	import { formatPrice } from '@/lib/utils/formatters';
	import { PUBLIC_BASE_URL } from '$env/static/public';
	import Separator from '@/lib/components/ui/separator/separator.svelte';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';
	import { marked } from 'marked';
	import ToastSuccessfullyCart from '@/components/ui/toast/toast-successfully-cart.svelte';
	import { enhance } from '$app/forms';
	import ReviewsCard from '@/components/ui/ReviewsCard.svelte';

	const { data }: PageProps = $props();

	let quantity = $state(1);
	let isLoading = $state(false);
</script>

<svelte:head>
	<title>Neworld - {data.product?.name}</title>
	<meta name="title" content="Neworld - {data.product?.name}" />
	<meta name="description" content={data.product?.smallDescription} />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={`${PUBLIC_BASE_URL}/product/${data.product?.id}`} />
	<meta property="og:title" content="Neworld - {data.product?.name}" />
	<meta property="og:description" content={data.product?.smallDescription} />
	<meta property="og:image" content={data.product?.images[0]} />
	<meta property="og:image:alt" content={data.product?.name} />
	<meta property="og:site_name" content="Neworld" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content={`${PUBLIC_BASE_URL}/product/${data.product?.id}`} />
	<meta property="twitter:title" content="Neworld - {data.product?.name}" />
	<meta property="twitter:description" content={data.product?.smallDescription} />
	<meta property="twitter:image" content={data.product?.images[0]} />
	<meta property="twitter:image:alt" content={data.product?.name} />
	<!-- <meta property="twitter:creator" content="@neworld" /> -->
</svelte:head>

<div class="page-container">
	{#if data.ok && data.product}
		<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-2 py-2">
			<Carousel
				images={[...data.product.images, ...data.product.ProductImages.map((i) => i.url)]}
			/>
			<div class="w-full h-full flex flex-col justify-center items-center">
				<div
					class="w-full flex flex-col px-8 py-4 rounded-lg shadow-lg bg-blue-200/50 backdrop-blur-3xl md:self-start"
				>
					<div class="flex flex-col md:flex-row justify-between items-start w-full">
						<h3 class="font-semibold text-xl md:text-2xl">{data.product.name}</h3>
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
									if (quantity < data.product!.stock) {
										quantity += 1;
									}
								}}
							>
								<Plus />
							</button>
						</div>
						<div class="flex flex-col sm:flex-row justify-between items-start gap-2 mt-4">
							<div class="flex flex-col w-full">
								<form
									method="POST"
									action="?/addProduct"
									use:enhance={() => {
										isLoading = true;
										return async ({ update, result }) => {
											if (result.type === 'success') {
												await update({ invalidateAll: true, reset: false });
												toast.success(ToastSuccessfullyCart, {
													position: 'top-center',
													componentProps: { description: data.product!.name },
													action: {
														label: 'Ir al carrito',
														onClick: () => goto('/cart')
													},
													actionButtonStyle: 'background-color: #2b7fff;'
												});
											}
											isLoading = false;
											quantity = 1;
										};
									}}
								>
									<input type="text" name="productId" value={data.product.id} hidden />
									<input type="text" name="quantity" bind:value={quantity} hidden />
									<button
										type="submit"
										class="bg-blue-500 flex flex-row justify-center w-full text-white font-semibold px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-colors duration-300"
										disabled={isLoading}
									>
										{#if isLoading}
											<Loader size={20} class="animate-spin" />
										{:else}
											Agregar al carrito
										{/if}
									</button>
								</form>
								<p class="font-light text-center">
									Precio final
									<span class="font-semibold">{formatPrice(data.product.price)} </span>
									(Envío gratis)
								</p>
							</div>
							<Separator class="sm:hidden bg-neutral-300 my-1" />
							{#if data.product.linkML}
								<div class="flex flex-col w-full">
									<a
										href={data.product.linkML}
										type="button"
										class="flex itmes-center justify-center bg-yellow-400 w-full text-white font-semibold px-4 py-1.5 rounded-lg cursor-pointer hover:bg-yellow-500 transition-colors duration-300"
										target="_blank"
										rel="noopener noreferrer"
									>
										<img
											alt="mercado-libre"
											src="/images/logo/mercado-libre-logo.png"
											class="w-30 h-auto"
										/>
									</a>
									{#if data.product.priceML}
										<p class="font-light text-center">
											Precio final
											<span class="font-semibold">{formatPrice(data.product.priceML)} </span>
											en 6 cuotas (Envío gratis)
										</p>
									{/if}
								</div>
							{/if}
						</div>
					{:else}
						<p class="font-semibold text-sm text-red-900">Sin stock</p>
					{/if}
					<div class="h-[1px] w-full bg-neutral-200"></div>
				</div>
			</div>
		</div>
		<div class="flex flex-col gap-1.5 rounded-lg">
			<div class="markdown-preview">
				{@html marked(data.product.description)}
			</div>
		</div>
		<div class="w-full flex flex-row flex-wrap items-start justify-center mt-10 gap-3">
			{#each data.product.infoImages as imageUrl}
				<img src={imageUrl} alt="" class="w-[300px] h-auto rounded-lg shadow-md" />
			{/each}
			{#each data.product.ProductInfoImages as image}
				<img src={image.url} alt="" class="w-[300px] h-auto rounded-lg shadow-md" />
			{/each}
		</div>
		<ul class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-10">
			{#each data.product.Review as review (review.id)}
				<ReviewsCard {review} />
			{/each}
		</ul>
	{/if}
</div>
