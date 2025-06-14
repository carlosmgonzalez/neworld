<script lang="ts">
	import { formatPrice } from '@/lib/utils/formatters';
	import type { PageProps } from './$types';
	import {
		BanknoteArrowDown,
		Handshake,
		Package,
		PackageSearch,
		SearchX,
		Truck
	} from '@lucide/svelte';

	const { data }: PageProps = $props();
</script>

<div class="page-container">
	{#if data.ok}
		<div class="mx-auto flex flex-row items-center gap-1">
			<div class="flex flex-col items-center md:flex-row md:items-end gap-1">
				<p class="text-xl">Gracias por tu compra</p>
				<p class="text-2xl font-semibold">{data.order!.name}</p>
			</div>
		</div>

		{#if data.order!.byTransfer && data.order!.status === 'PENDING'}
			<div class="flex flex-col bg-neutral-200 rounded-md shadow-md mt-5">
				<p class="font-semibold text-center w-full bg-blue-300 rounded-t-md py-1">
					Información de transferencia
				</p>
				<div class="flex flex-col px-3 py-1">
					<p class="text-sm text-neutral-600">
						Recuerda que debes transferir el monto total a la cuenta bancaria indicada.
					</p>
					<p class="text-sm text-neutral-600">
						Una vez realizado el pago, envíanos el comprobante a nuestro whatsapp
					</p>
					<div class="w-full h-[1px] bg-neutral-300 my-2"></div>
					<p class="font-semibold text-sm">
						Alias:
						<span class="font-medium text-neutral-700">diego.a.gonzalez.c</span>
					</p>
					<p class="font-semibold text-sm">
						Nombre:
						<span class="font-medium text-neutral-700">Diego Alejandro Gonzalez</span>
					</p>
					<p class="font-semibold text-sm">
						Banco:
						<span class="font-medium text-neutral-700">Mercado Pago</span>
					</p>
				</div>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2 mt-5">
			<div class="bg-white rounded-lg shadow-lg">
				<p class="font-semibold text-center w-full bg-blue-300 rounded-t-md py-1">Productos</p>
				{#each data.order!.OrderItem as product}
					<div class="flex flex-row gap-2 p-2 items-center">
						<img src={product.images[0]} alt="" class="w-[130px] h-auto rounded-lg shadow-md" />
						<div class="flex flex-col">
							<p>{product.name}</p>
							<p class="text-sm font-semibold">{formatPrice(product.price)}</p>
							<p class="text-sm font-light">
								{product.quantity}
								{#if product.quantity > 1}
									unidades
								{:else}
									unidad
								{/if}
							</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="bg-white shadow-md rounded-md pb-2">
				<p class="font-semibold mb-2 text-center w-full rounded-t-md py-1 bg-blue-300">
					Información de envío
				</p>
				<div class="flex flex-col gap-0.5 px-3">
					<p>{data.order!.name} {data.order!.lastname}</p>
					<p>{data.order!.email}</p>
					<p>{data.order!.phone}</p>
					<p>{data.order!.province}</p>
					<p>{data.order!.locality}</p>
					<p>{data.order!.address}</p>
					<p>{data.order!.zipCode}</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row gap-2 mt-2">
			<div
				class="w-full bg-green-300 rounded-lg p-3 shadow-md flex flex-row gap-1 items-center justify-center"
			>
				{#if data.order!.byTransfer && data.order!.paid}
					<p>Total pagado</p>
					<span class="font-semibold">{formatPrice(data.order!.totalPrice)}</span>
					<BanknoteArrowDown class="text-green-800" />
				{:else if data.order!.byTransfer && !data.order!.paid}
					<p class="font-light">Total a transferir</p>
					<span class="font-semibold">{formatPrice(data.order!.totalPrice)}</span>
					<BanknoteArrowDown class="text-green-800" />
				{:else}
					<p class="font-light">Total pagado</p>
					<span class="font-semibold">{formatPrice(data.order!.totalPrice)}</span>
					<BanknoteArrowDown class="text-green-800" />
				{/if}
			</div>
			<div class="w-full bg-blue-300 rounded-lg p-3 shadow-md flex flex-row gap-1 justify-center">
				<p>Estado del envío</p>
				{#if data.order!.status === 'PAID'}
					<span class="font-semibold">en proceso</span>
					<PackageSearch class="text-blue-800" />
				{:else if data.order!.status === 'PACKING'}
					<span class="font-semibold">empacando</span>
					<Package class="text-blue-800" />
				{:else if data.order!.status === 'SHIPPED'}
					<span class="font-semibold">en camino</span>
					<Truck class="text-blue-800" />
				{:else if data.order!.status === 'DELIVERED'}
					<span class="font-semibold">entregado</span>
					<Handshake class="text-blue-800" />
				{:else if data.order!.status === 'PENDING'}
					<span class="font-semibold">con transferencia pendiente</span>
				{/if}
			</div>
		</div>
		<span class=" text-sm font-light text-center mt-5">
			Te enviaremos un correo cuando se actualice el envió
		</span>
	{:else}
		<div class="w-full h-full justify-center items-center">
			<p class="text-xl font-semibold">Orden no encontrada</p>
			<SearchX size={60} />
		</div>
	{/if}
</div>
