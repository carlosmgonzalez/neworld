<script lang="ts">
	import { formatPrice } from '@/lib/utils/formatters';
	import type { PageProps } from './$types';
	import {
		BanknoteArrowDown,
		FileUser,
		Handshake,
		Package,
		PackageSearch,
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

		<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
			<div class="bg-blue-200/50 rounded-lg p-3 shadow-lg">
				<p class="font-semibold mb-2 text-center w-full bg-blue-400/50 rounded-md py-1">
					Productos
				</p>
				{#each data.order!.OrderItem as product}
					<div class="flex flex-row gap-2">
						<img src={product.images[0]} alt="" class="w-[150px] h-auto rounded-lg shadow-md" />
						<div class="flex flex-col gap-2">
							<p class="font-medium">{product.name}</p>
							<p>
								{product.quantity}
								{#if product.quantity > 1}
									unidades
								{:else}
									unidad
								{/if}
							</p>
							<p>{formatPrice(product.price)}</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="bg-neutral-200 shadow-lg p-3 rounded-md">
				<p class="font-semibold mb-2 text-center w-full bg-neutral-400/50 rounded-md py-1">
					Información de envío
				</p>
				<p class="font-thin">{data.order!.name} {data.order!.lastname}</p>
				<p>{data.order!.email}</p>
				<p>{data.order!.phone}</p>
				<p>{data.order!.province}</p>
				<p>{data.order!.locality}</p>
				<p>{data.order!.address}</p>
				<p>{data.order!.zipCode}</p>
			</div>
		</div>

		<div class="flex flex-col md:flex-row gap-2 mt-2">
			<div
				class="w-full bg-green-300 rounded-lg p-3 shadow-md flex flex-row gap-1 items-center justify-center"
			>
				<p class="font-thin">Total pagado</p>
				<span class="font-semibold">{formatPrice(data.order!.totalPrice)}</span>
				<BanknoteArrowDown class="text-green-800" />
			</div>
			<div class="w-full bg-blue-300 rounded-lg p-3 shadow-md flex flex-row gap-1 justify-center">
				<p>Estado del envío</p>
				{#if data.order!.status === 'PAID'}
					<span class="font-semibold">En proceso</span>
					<PackageSearch class="text-blue-900" />
				{:else if data.order!.status === 'PACKING'}
					<span class="font-semibold">Empacando</span>
					<Package class="text-blue-900" />
				{:else if data.order!.status === 'SHIPPED'}
					<span class="font-semibold">En camino</span>
					<Truck class="text-blue-900" />
				{:else if data.order!.status === 'DELIVERED'}
					<span class="font-semibold">Entregado</span>
					<Handshake class="text-blue-900" />
				{/if}
			</div>
		</div>
		<span class="text-neutral-600 font-light text-sm text-center mt-5">
			Te enviaremos un correo cuando se actualice el envió
		</span>
	{/if}
</div>
