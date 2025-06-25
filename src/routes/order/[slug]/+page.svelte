<script lang="ts">
	import { formatPrice } from '$lib/utils/formatters';
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
		<div
			class="mx-auto flex flex-row items-center justify-center py-2 gap-1 bg-primary/30 w-full rounded-md shadow-md"
		>
			<div class="flex flex-col items-center md:flex-row md:items-end gap-1">
				<p class="text-xl">Gracias por tu compra</p>
				<p class="text-2xl font-semibold">{data.order!.name}</p>
			</div>
		</div>

		{#if data.order!.byTransfer && data.order!.status === 'PENDING'}
			<div class="flex flex-col rounded-md shadow-md mt-5 bg-primary/5">
				<p class="font-semibold text-center w-full bg-primary/30 rounded-t-md py-1">
					Información de transferencia
				</p>
				<div class="flex flex-col px-3 py-1">
					<p class="font-light text-center">
						Debes transferir el monto total a la cuenta bancaria indicada.
					</p>
					<p class="font-light text-center">
						Una vez realizado el pago, envíanos el comprobante a nuestro whatsapp
					</p>
					<div class="w-full h-[1px] bg-neutral-300 my-2"></div>
					<p class="font-semibold">
						Alias:
						<span class="font-light">neworld.mp</span>
					</p>
					<p class="font-semibold">
						CBU:
						<span class="font-light">0000003100079547648013</span>
					</p>
					<p class="font-semibold">
						Nombre:
						<span class="font-light">Diego Alejandro Gonzalez</span>
					</p>
					<p class="font-semibold">
						Banco:
						<span class="font-light">Mercado Pago</span>
					</p>
				</div>
			</div>
		{/if}

		<div class="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-2 mt-5">
			<div class="bg-primary/5 rounded-lg shadow-lg">
				<p class="font-semibold text-center w-full bg-primary/30 rounded-t-md py-1">Productos</p>
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

			<div class="bg-primary/5 shadow-md rounded-md pb-2">
				<p class="font-semibold mb-2 text-center w-full rounded-t-md py-1 bg-primary/30">
					Información de envío
				</p>
				<div class="flex flex-col gap-0.5 px-3">
					<p class="font-light">{data.order!.name} {data.order!.lastname}</p>
					<p class="font-light">{data.order!.email}</p>
					<p class="font-light">{data.order!.phone}</p>
					<p class="font-light">{data.order!.province}</p>
					<p class="font-light">{data.order!.locality}</p>
					<p class="font-light">{data.order!.address}</p>
					<p class="font-light">{data.order!.zipCode}</p>
				</div>
			</div>
		</div>

		<div class="flex flex-col md:flex-row gap-2 mt-2">
			<div
				class="w-full bg-green-300 dark:bg-green-800 rounded-lg p-3 shadow-md flex flex-row gap-1 items-center justify-center"
			>
				{#if data.order!.byTransfer && data.order!.paid}
					<p class="font-light">Total pagado</p>
				{:else if data.order!.byTransfer && data.order!.status === 'PENDING'}
					<p class="font-light">Total a transferir</p>
				{:else if !data.order!.byTransfer && data.order!.status === 'PENDING'}
					<p class="font-light">Total sin pagar</p>
				{:else}
					<p class="font-light">Total pagado</p>
				{/if}
				<span class="font-semibold">{formatPrice(data.order!.totalPrice)}</span>
				<BanknoteArrowDown />
			</div>
			<div
				class="w-full bg-primary rounded-lg p-3 shadow-md flex flex-col sm:flex-row gap-1 items-center justify-center"
			>
				<p class="font-light">Estado del envío</p>
				<div class="flex flex-row gap-2">
					{#if data.order!.status === 'PAID'}
						<span class="font-semibold">EN PROCESO</span>
						<PackageSearch />
					{:else if data.order!.status === 'PACKING'}
						<span class="font-semibold">EMPACANDO</span>
						<Package />
					{:else if data.order!.status === 'SHIPPED'}
						<span class="font-semibold">EN CAMINO</span>
						<Truck />
					{:else if data.order!.status === 'DELIVERED'}
						<span class="font-semibold">ENTREGADO</span>
						<Handshake />
					{:else if data.order!.status === 'PENDING' && data.order!.byTransfer}
						<span class="font-semibold">TRANSFERENCIA PENDIENTE</span>
					{:else if data.order!.status === 'PENDING'}
						<span class="font-semibold">ORDEN NO PAGADA</span>
					{/if}
				</div>
			</div>
		</div>
		<span class=" font-light text-center mt-5">
			Te enviaremos un correo cuando se actualice el envió
		</span>
	{:else}
		<div class="w-full h-full justify-center items-center">
			<p class="text-xl font-semibold">Orden no encontrada</p>
			<SearchX size={60} />
		</div>
	{/if}
</div>
