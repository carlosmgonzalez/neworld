<script lang="ts">
	import { formatPrice } from '@/lib/utils/formatters.js';
	import { cartStore } from '@/store/cart.store';
	import { userInfoStore } from '@/store/user-info.store';
	import { Loader, ShieldCheck, TicketCheck } from '@lucide/svelte';
	import { DiscountType } from '@prisma/client';
	import { get } from 'svelte/store';

	const { data } = $props();

	const cart = get(cartStore);
	const { department, address, ...userInfo } = get(userInfoStore);

	let isEnteringCoupon = $state(false);
	let coupon = $state('');
	let invalidCoupon = $state(false);
	let validCoupon = $state(false);
	let discountAmount = $state(0);

	let subTotalAmount: number = data.detailedCartItems.reduce((acc, val) => {
		acc += val.price * val.quantity;
		return acc;
	}, 0);

	let totalAmount = $derived(subTotalAmount);

	const handleValidateCoupon = async (event: Event) => {
		event.preventDefault();

		const response = await fetch('api/validate-coupon', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ code: coupon })
		});

		const data: { valid: boolean; discountValue: number; discountType: DiscountType } =
			await response.json();

		if (!data.valid) {
			invalidCoupon = true;
			setTimeout(() => {
				invalidCoupon = false;
			}, 2000);
			return;
		}

		if (data.discountType === 'PERCENTAGE') {
			discountAmount = -totalAmount * (data.discountValue / 100);
			totalAmount = totalAmount + discountAmount;
			isEnteringCoupon = false;
			validCoupon = true;
			return;
		}
	};

	let order = $state({
		items: cart,
		...userInfo,
		address: address + ' ' + department,
		coupon: ''
	});

	$effect(() => {
		if (validCoupon) {
			order.coupon = coupon;
		}
	});

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
	class="absolute w-full py-0.5 flex flex-row gap-2 justify-center items-center bg-emerald-500/80 mt-14"
>
	<p class="font-semibold text-xs">COMPRA SEGURA</p>
	<ShieldCheck class="text-emerald-800" />
	<p class="text-xs">100% PROTEGIDO</p>
</div>
<div class="page-container mt-24">
	<h1 class="text-lg font-semibold">Confirmar Orden</h1>
	<a href="/checkout" class="underline text-sm text-neutral-600"> Volver </a>

	<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 md:mt-5 items-start">
		<div class="flex flex-col gap-2 h-fit">
			<div class="flex flex-col">
				<div class="flex flex-row justify-between items-center">
					<p class="text-sm">Subtotal:</p>
					<span class="text-sm">
						{formatPrice(subTotalAmount)}
					</span>
				</div>
				{#if validCoupon}
					<div class="flex flex-row justify-between items-center">
						<p class="text-sm">Cupón de descuento:</p>
						<span class="text-sm"> {formatPrice(discountAmount)} </span>
					</div>
				{/if}
				<div class="flex flex-row justify-between items-center">
					<p class="text-sm">Costo de envío:</p>
					<span class="text-sm"> Gratis </span>
				</div>
				<div class="flex flex-row justify-between items-center">
					<p class="text-sm">Total:</p>
					<span class="text-sm">
						{formatPrice(totalAmount)}
					</span>
				</div>
				<button
					type="button"
					onclick={() => {
						isEnteringCoupon = !isEnteringCoupon;
					}}
					class="rounded-md py-1 border-1 shadow-md border-neutral-300 underline text-center text-sm bg-white mt-2 hover:cursor-pointer"
					aria-label="cupon de descuento"
					hidden={isEnteringCoupon || validCoupon}
				>
					Agregar cupón de descuento
				</button>
				<form
					class="flex flex-row gap-2 mt-2"
					hidden={!isEnteringCoupon}
					onsubmit={handleValidateCoupon}
				>
					<input
						type="text"
						name="coupon"
						placeholder="Ingrese el cupon"
						bind:value={coupon}
						class="w-full input-outline-blue text-sm"
					/>
					<button
						type="submit"
						aria-label="validar cupon"
						class="bg-blue-500 flex justify-center items-center px-2 rounded-md shadow-md hover:cursor-pointer"
					>
						<TicketCheck class="text-white" />
					</button>
				</form>
				{#if invalidCoupon}
					<span class="text-red-700 bg-red-200 w-ful mt-1 text-center text-sm rounded-md">
						Cupón invalido
					</span>
				{/if}
			</div>
			<div class="flex flex-col gap-4 h-fit">
				{#each data.detailedCartItems as product}
					<div
						class="flex flex-row gap-2 md:gap-4 pr-1 items-center rounded-lg shadow bg-blue-200/50"
					>
						<img
							src={product.images[0]}
							alt={product.description}
							class="w-[120px] h-auto aspect-square rounded-l-lg"
						/>
						<div class="flex flex-col gap-1">
							<h3 class="text-sm font-semibold">{product?.name}</h3>
							<!-- <p class="text-xs font-light">
								{product.smallDescription}
							</p> -->
							<p class="font-extralight text-xs">
								{formatPrice(+product.price * product.quantity)}
							</p>

							<div class="flex flex-row gap-2 items-center">
								<p class="text-xs">
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
			<div class="grid grid-cols-4 gap-4 rounded-b-lg shadow-md bg-white px-2 py-1">
				<div class="flex flex-col gap-1">
					<p class="text-sm font-black">Nombre:</p>
					<p class="text-sm font-black">Apellidos:</p>
					<p class="text-sm font-black">Email:</p>
					<p class="text-sm font-black">Telefono:</p>
					<p class="text-sm font-black">Direccion:</p>
					<p class="text-sm font-black">Dpt:</p>
					<p class="text-sm font-black">Provincia:</p>
					<p class="text-sm font-black">Localidad:</p>
					<p class="text-sm font-black">CP:</p>
				</div>
				<div class="col-span-3 flex flex-col gap-1">
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
						{address}
					</p>
					<p class="text-sm font-light text-neutral-800">
						{department}
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
