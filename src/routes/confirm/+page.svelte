<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import { formatPrice } from '$lib/utils/formatters.js';
	import { BanknoteArrowDown, CircleArrowRight, Loader, ShieldCheck } from '@lucide/svelte';
	import { DiscountType } from '@prisma/client';
	import type { PageProps } from './$types';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Badge from '$lib/components/ui/badge/badge.svelte';

	const { data }: PageProps = $props();

	let isEnteringCoupon = $state(false);
	let coupon = $state('');
	let invalidCoupon = $state(false);
	let validCoupon = $state(false);
	let discountAmount = $state(0);

	let subTotalAmount = $state(0);
	let totalItems = $state(0);

	if (data.cart) {
		subTotalAmount = data.cart.CartItem.reduce((acc, val) => {
			acc += val.product.price * val.quantity;
			return acc;
		}, 0);

		totalItems = data.cart.CartItem.reduce((acc, val) => {
			acc += val.quantity;
			return acc;
		}, 0);
	}

	let totalAmount = $derived(subTotalAmount);

	const handleValidateCoupon = async (event: Event) => {
		isLoading['coupon'] = true;
		event.preventDefault();

		try {
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
				coupon = '';
				validCoupon = false;
				setTimeout(() => {
					invalidCoupon = false;
				}, 2000);
				return;
			}

			if (data.discountType === 'PERCENTAGE') {
				discountAmount = -subTotalAmount * (data.discountValue / 100);
				totalAmount = totalAmount + discountAmount;
				isEnteringCoupon = false;
				validCoupon = true;
				return;
			}

			if (data.discountType === 'FIXED_AMOUNT') {
				discountAmount = -data.discountValue;
				totalAmount = totalAmount + discountAmount;
				isEnteringCoupon = false;
				validCoupon = true;
				return;
			}
		} catch (error) {
			console.log(error);
		} finally {
			isLoading['coupon'] = false;
		}
	};

	let isLoading = $state<Record<string, boolean>>({});
	// let isLoadingCoupon = $state(false)
	// let isLoading = $state(false);
	// let isLoadingTransfer = $state(false);

	const cardImages = [
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530294/neworld/bi9h6g5y4e6rrivxr4v2.png',
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530294/neworld/rbomwkdph2keho8d6cea.png',
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530295/neworld/bmjoudlku1fsix3dw9hl.png',
		'https://res.cloudinary.com/difikt7so/image/upload/v1748530294/neworld/x90kfrmov6dr1al4cr9u.png'
	];
</script>

<div
	class="absolute w-full py-0.5 flex flex-row gap-2 justify-center items-center bg-primary mt-14"
>
	<p class="font-semibold text-xs">COMPRA SEGURA</p>
	<ShieldCheck />
	<p class="text-xs">100% PROTEGIDO</p>
</div>
<div class="page-container mt-24">
	<h1 class="text-lg font-semibold">Confirmar Orden</h1>
	<a href="/checkout" class="underline text-sm font-light"> Volver </a>

	<div class="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 md:mt-5 items-start">
		<div class="flex flex-col gap-2 h-fit">
			<div class="flex flex-col">
				<div class="flex flex-row justify-between items-center">
					<p class="text-sm">Subtotal:</p>
					<span class="text-sm font-semibold">
						{formatPrice(subTotalAmount)}
					</span>
				</div>
				{#if validCoupon}
					<div class="flex flex-row justify-between items-center">
						<p class="text-sm">Cupón de descuento:</p>
						<span class="text-sm font-semibold"> {formatPrice(discountAmount)} </span>
					</div>
				{/if}
				<div class="flex flex-row justify-between items-center">
					<p class="text-sm">Costo de envío:</p>
					<span class="text-sm font-semibold">
						Gratis
						<!-- {data.shippingPrice === 0 ? 'Gratis' : formatPrice(data.shippingPrice * totalItems)} -->
					</span>
				</div>
				<div class="flex flex-row justify-between items-center">
					<p class="text-sm">Total:</p>
					<span class="text-sm font-semibold">
						{formatPrice(totalAmount)}
					</span>
				</div>
				<div class="w-full mt-2">
					<Button
						type="button"
						onclick={() => {
							isEnteringCoupon = !isEnteringCoupon;
						}}
						class="w-full cursor-pointer border border-primary"
						variant="secondary"
						aria-label="cupon de descuento"
						hidden={isEnteringCoupon || validCoupon}
					>
						Agregar cupón de descuento
					</Button>
					<form
						class="flex flex-row gap-2"
						hidden={!isEnteringCoupon}
						onsubmit={handleValidateCoupon}
					>
						<Input
							type="text"
							name="coupon"
							placeholder="Ingrese el cupon"
							bind:value={coupon}
							class="w-full text-sm"
						/>
						<Button type="submit" aria-label="validar cupon">
							{#if isLoading['coupon']}
								<Loader class="animate-spin" />
							{:else}
								<CircleArrowRight />
							{/if}
						</Button>
					</form>
					{#if invalidCoupon}
						<Badge variant="destructive" class="w-full mt-1">Cupón invalido</Badge>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-4 h-fit">
				{#each data.cart!.CartItem as item (item.productId)}
					<div
						class="flex flex-row gap-2 md:gap-4 p-1 items-center rounded-lg shadow bg-primary/20"
					>
						<img
							src={item.product.images[0]}
							alt={item.product.description}
							class="w-[120px] h-auto aspect-square rounded-md"
						/>
						<div class="flex flex-col gap-1">
							<h3 class="text-sm font-medium">{item.product.name}</h3>
							<p class="font-semibold text-xs">
								{formatPrice(+item.product.price * item.quantity)}
							</p>

							<div class="flex flex-row gap-2 items-center">
								<p class="text-xs">
									{item.quantity}
									{#if item.quantity > 1}
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
			<div class="rounded-t-lg py-2 bg-primary/30">
				<p class="text-center text-sm font-semibold">Información de envío</p>
			</div>
			<div class="gap-4 rounded-b-lg shadow-md bg-primary/5 px-2 py-1">
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Nombre:</p>
					<p class="text-sm font-light">{data.userInfo?.name}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Apellidos:</p>
					<p class="text-sm font-light">{data.userInfo?.lastname}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Email:</p>
					<p class="text-sm font-light">{data.userInfo?.email}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Telefono:</p>
					<p class="text-sm font-light">{data.userInfo?.phone}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Direccion:</p>
					<p class="text-sm font-light">{data.userInfo?.address}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Provincia:</p>
					<p class="text-sm font-light">{data.userInfo?.province}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">Localidad:</p>
					<p class="text-sm font-light">{data.userInfo?.locality}</p>
				</div>
				<div class="flex flex-row gap-1">
					<p class="text-sm font-semibold w-20 sm:w-24">CP:</p>
					<p class="text-sm font-light">{data.userInfo?.zipCode}</p>
				</div>
			</div>
		</div>
	</div>

	<div class="w-full flex flex-col md:flex-row gap-2 items-start justify-center mt-4">
		<form
			method="POST"
			action="?/createOrderByTransfer"
			class="w-full"
			use:enhance={({ formData }) => {
				if (validCoupon && coupon.length > 0) {
					formData.append('coupon', coupon);
				}
				isLoading['order-transfer'] = true;
				return async ({ result, update }) => {
					isLoading['order-transfer'] = false;
					if (result.type === 'success') {
						const data = result.data as { location: string };
						await update({ invalidateAll: true, reset: false });
						goto(data.location, { replaceState: true });
					}
				};
			}}
		>
			<Button type="submit" class="w-full cursor-pointer" disabled={isLoading['order-transfer']}>
				{#if isLoading['order-transfer']}
					<Loader class="animate-spin" />
				{:else}
					<BanknoteArrowDown class="" />
					<div class="flex flex-row items-center gap-1">
						<p>Por transferencia</p>
						<span class="text-xs font-medium pt-0.5">(5% de descuento)</span>
					</div>
				{/if}
			</Button>
		</form>

		<div class="flex flex-col w-full">
			<form
				method="POST"
				action="?/createOrder"
				use:enhance={({ formData }) => {
					if (validCoupon && coupon.length > 0) {
						formData.append('coupon', coupon);
					}
					isLoading['order'] = true;
					return async ({ result }) => {
						isLoading['order'] = false;
						if (result.type === 'success') {
							const data = result.data as { orderId: string; initPoint: string };
							const initPoint = data.initPoint;
							window.location.href = initPoint;
						}
					};
				}}
			>
				<button
					type="submit"
					class={`rounded-lg justify-center flex flex-row items-center py-1 w-full border-1 
				 ${isLoading['order'] ? 'bg-yellow-400 opacity-50' : 'bg-yellow-400 hover:cursor-pointer hover:bg-yellow-300'} shadow-md  hover:shadow-lg`}
					disabled={isLoading['order']}
				>
					{#if isLoading['order']}
						<Loader class="animate-spin" />
					{:else}
						<img
							src="/images/logo/mercado-pago-logo.png"
							alt="mercado-pago-logo"
							class="w-[100px] h-auto"
						/>
					{/if}
				</button>
			</form>

			<div class="w-full flex flex-row justify-center items-center gap-2 mt-3">
				{#each cardImages as imageUrl, image}
					<img src={imageUrl} alt="" class="w-10 h-auto rounded-md shadow-md" />
				{/each}
			</div>
		</div>
	</div>
</div>
