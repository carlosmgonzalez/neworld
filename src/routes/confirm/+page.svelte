<script lang="ts">
	import { formatPrice } from '@/lib/utils/formatters.js';
	import { cartStore } from '@/store/cart.store';
	import { userInfoStore } from '@/store/user-info.store';
	import { Loader } from '@lucide/svelte';
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
</script>

<div class="page-container">
	<h1 class="text-2xl font-bold">Confirmar Orden</h1>
	<a href="/checkout" class="underline text-neutral-600"> Volver </a>

	<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 items-start">
		<div class="flex flex-col gap-2 h-fit">
			<div class="flex flex-col gap-4 h-fit rounded-lg shadow bg-blue-200/50 p-4">
				{#each data.detailedCartItems as product}
					<div class="flex flex-row gap-4 items-center">
						<img
							src={product.images[0]}
							alt={product.description}
							class="w-[160px] h-auto aspect-square rounded-lg"
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
		<div class="grid grid-cols-3 gap-4 rounded-lg p-4 shadow-md bg-neutral-200/50">
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
</div>
