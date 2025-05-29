<script lang="ts">
	import { formatPrice } from '@/lib/utils/formatters.js';
	import { cartStore } from '@/store/cart.store';
	import { userInfoStore } from '@/store/user-info.store';
	import { Loader, ShieldCheck } from '@lucide/svelte';
	import { get } from 'svelte/store';

	const { data } = $props();

	const cart = get(cartStore);
	const userInfo = get(userInfoStore);

	let order = {
		items: cart,
		...userInfo
	};

	let isLoading = $state(false);

	const handlerSubmit = async (event: Event) => {
		isLoading = true;
		event.preventDefault();

		try {
			const response = await fetch('/api/orders', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(order)
			});

			if (response.ok) {
				const data = await response.json();
				window.location = data.payment.init_point;
			} else {
				console.error('Error creating order:', response.statusText);
			}
		} catch (error) {
			console.error('Error creating order:', error);
		} finally {
			isLoading = false;
		}
	};

	const cardImages = [
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530294/neworld/bi9h6g5y4e6rrivxr4v2.png',
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530294/neworld/rbomwkdph2keho8d6cea.png',
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530295/neworld/bmjoudlku1fsix3dw9hl.png',
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530294/neworld/x90kfrmov6dr1al4cr9u.png'
	];
</script>

<div
	class="absolute w-full py-1 flex flex-row gap-2 justify-center items-center bg-emerald-500/80 mt-14"
>
	<p class="font-semibold text-sm">COMPRA SEGURA</p>
	<ShieldCheck class="text-emerald-800" />
	<p class="text-sm">100% PROTEGIDO</p>
</div>
<div class="page-container mt-24">
	<h1 class="text-lg font-semibold">Confirmar Orden</h1>
	<a href="/checkout" class="underline text-sm text-neutral-600"> Volver </a>

	<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 items-start">
		<div class="flex flex-col gap-2 h-fit">
			<div class="flex flex-col gap-4 h-fit">
				{#each data.detailedCartItems as product}
					<div class="flex flex-row gap-4 items-center rounded-lg shadow bg-blue-200/50">
						<img
							src={product.images[0]}
							alt={product.description}
							class="w-[160px] h-auto aspect-square rounded-l-lg"
						/>
						<div class="flex flex-col gap-2">
							<h3 class="font-semibold">{product?.name}</h3>
							<p class="text-xs font-light">
								{product.smallDescription}
							</p>
							<p class="font-light text-sm">
								{formatPrice(+product.price * product.quantity)}
							</p>

							<div class="flex flex-row gap-2 items-center">
								<p class="text-md font-light">
									{product.quantity}
									{#if product.quantity > 1}
										unidades
									{:else}
										unidad
									{/if}
								</p>
							</div>
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div class="flex flex-col">
			<div class="rounded-t-lg py-2 bg-blue-500">
				<p class="text-center text-sm text-white">Información de envío</p>
			</div>
			<div class="grid grid-cols-3 gap-4 rounded-b-lg shadow-md bg-white p-4">
				<div class="flex flex-col gap-1">
					<p class="text-sm font-black">Nombre:</p>
					<p class="text-sm font-black">Apellidos:</p>
					<p class="text-sm font-black">Email:</p>
					<p class="text-sm font-black">Telefono:</p>
					<p class="text-sm font-black">Direccion:</p>
					<p class="text-sm font-black">Provincia:</p>
					<p class="text-sm font-black">Localidad:</p>
					<p class="text-sm font-black">Codigo postal:</p>
				</div>
				<div class="col-span-2 flex flex-col gap-1">
					<p class="text-sm font-light text-neutral-800">
						{order.name}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.lastname}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.email}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.phone}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.address}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.province}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.locality}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{order.zipCode}
					</p>
				</div>
			</div>
		</div>
	</div>

	<button
		type="button"
		class={`mt-4 rounded-lg justify-center flex flex-row items-center py-1 w-full border-1 
		 ${isLoading ? 'bg-yellow-400 opacity-50' : 'bg-yellow-400 hover:cursor-pointer hover:bg-yellow-500'} shadow-md  hover:shadow-lg`}
		onclick={handlerSubmit}
		disabled={isLoading}
	>
		{#if isLoading}
			<Loader class="animate-spin" />
		{:else}
			<img
				src="/images/logo/mercado-pago-logo.png"
				alt="mercado-pago-logo"
				class="w-[110px] h-auto"
			/>
		{/if}
	</button>
	<div class="w-full flex flex-row justify-center items-center gap-2 mt-3">
		{#each cardImages as imageUrl, image}
			<img src={imageUrl} alt="" class="w-10 h-auto rounded-md shadow-md" />
		{/each}
	</div>
</div>
