<script lang="ts">
	import type { PageProps } from './$types';

	const { data }: PageProps = $props();
</script>

<div class="page-container">
	{#if data.ok}
		<div class="mx-auto flex flex-row items-center gap-1">
			<span class="text-5xl">🎊</span>
			<div class="flex flex-col md:flex-row items-center gap-1">
				<p>Gracias por tu compra</p>
				<p class="text-2xl font-semibold">{data.order!.name}</p>
			</div>
			<span class="text-5xl">🎊</span>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5">
			<div class="bg-blue-200/50 rounded-lg p-2 shadow-lg h-fit">
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
							<p>${product.price}</p>
						</div>
					</div>
				{/each}
			</div>

			<div class="bg-neutral-200 shadow-lg p-2 rounded-md h-fit">
				<p class="font-thin">{data.order!.name}</p>
				<p>{data.order!.email}</p>
				<p>{data.order!.phone}</p>
				<p>{data.order!.totalPrice}</p>
				<p>{data.order!.province}</p>
				<p>{data.order!.address}</p>
				<p>{data.order!.zipCode}</p>
			</div>
		</div>
	{/if}
</div>
