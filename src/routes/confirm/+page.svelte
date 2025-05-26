<script lang="ts">
	import { goto } from '$app/navigation';
	import { cartStore } from '@/store/cart.store';
	import { userInfoStore } from '@/store/user-info.store';
	import { get } from 'svelte/store';

	const { data } = $props();

	const userInfo = get(userInfoStore);
	const cart = get(cartStore);

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
				console.log('Order created successfully:', data);
				console.log(data);
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
	<p class="text-gray-500">Por favor confirma que los detalles de la orden sean correctos:</p>
	<a href="/checkout" class="underline"> Volver </a>

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
								{product.description}
							</p>
							<p class="font-light text-sm">
								${+product.price * product.quantity}
							</p>

							<div class="flex flex-row gap-2 items-center">
								<p class="text-md font-light">
									{product.quantity} unidades
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
				<p class="text-sm font-black">Ciudad:</p>
				<p class="text-sm font-black">Codigo postal:</p>
			</div>
			<div class="col-span-2 flex flex-col gap-1">
				<p class="text-sm font-light text-neutral-800">
					{userInfo.name}
				</p>
				<p class="text-sm font-light text-neutral-800">
					{userInfo.lastname}
				</p>
				<p class="text-sm font-light text-neutral-800">
					{userInfo.email}
				</p>
				<p class="text-sm font-light text-neutral-800">
					{userInfo.phone}
				</p>
				<p class="text-sm font-light text-neutral-800">
					{userInfo.address}
				</p>
				<p class="text-sm font-light text-neutral-800">
					{userInfo.province}
				</p>
				<p class="text-sm font-light text-neutral-800">
					{userInfo.zipCode}
				</p>
			</div>
		</div>
	</div>

	<button
		type="button"
		class="mt-4 rounded-lg justify-center flex flex-row items-center py-1 w-full border-1 bg-yellow-400 shadow-md hover:bg-yellow-500 hover:shadow-lg hover:cursor-pointer"
		onclick={handlerSubmit}
	>
		<img
			src="/images/logo/mercado-pago-logo.png"
			alt="mercado-pago-logo"
			class="w-[110px] h-auto"
		/>
	</button>
</div>
