<script lang="ts">
	import { goto } from '$app/navigation';
	import { provincesDb } from '$lib/database/provinces.db';
	import { localidadesDb } from '$lib/database/localities.db';
	import Selector from '$lib/components/common/selector.svelte';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';
	import { Loader } from '@lucide/svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Button from '$lib/components/ui/button/button.svelte';

	const { data }: PageProps = $props();
	let error = $state(false);
	let isLoading = $state(false);

	let name = $derived(data.userInfo?.name || '');
	let lastname = $derived(data.userInfo?.lastname || '');
	let dni = $derived(data.userInfo?.dni || '');
	let email = $derived(data.userInfo?.email || '');
	let phone = $derived(data.userInfo?.phone || '');
	let address = $derived(data.userInfo?.address.split('-')[0] || '');
	let department = $derived(data.userInfo?.address.split('-')[1] || '');
	let zipCode = $derived(data.userInfo?.zipCode || '');
	let province = $derived(data.userInfo?.province || '');
	let locality = $state(data.userInfo?.locality || '');

	let provinces = $state(provincesDb.map((p) => ({ label: p.nombre, value: p.nombre })));
	let localities = $derived(
		province.length > 0
			? localidadesDb
					.filter((locality) => locality.provincia.nombre === province)
					.map((l) => ({ label: l.nombre, value: l.nombre }))
			: []
	);
</script>

<div class="page-container">
	<h1 class="text-lg font-semibold">Informacion de envio</h1>
	<a href="/cart" class="underline text-sm font-light"> Volver al carrito </a>
	<form
		method="POST"
		use:enhance={({ formData }) => {
			isLoading = true;
			formData.append('province', province);
			formData.append('locality', locality);

			return async ({ result, update }) => {
				isLoading = false;

				if (result.type === 'success') {
					await update({ invalidateAll: true, reset: false });
					goto('/confirm');
				}

				if (result.type === 'error') {
					error = true;
					setTimeout(() => {
						error = false;
					}, 3000);
				}
			};
		}}
	>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
			<div class="flex flex-col gap-2 h-fit">
				<p>Datos personales:</p>
				<div class="flex flex-col w-full">
					<label for="name" class="text-xs text-neutral-600"> Nombre </label>
					<Input
						type="text"
						name="name"
						id="name"
						bind:value={name}
						placeholder="Nombre"
						required
					/>
				</div>

				<div class="flex flex-col w-full">
					<label for="lastname" class="text-xs text-neutral-600"> Apellido </label>
					<Input
						type="text"
						name="lastname"
						id="lastname"
						bind:value={lastname}
						placeholder="Apellido"
						required
					/>
				</div>

				<div class="flex flex-col w-full">
					<label for="email" class="text-xs text-neutral-600"> Email </label>
					<Input
						type="email"
						name="email"
						id="email"
						bind:value={email}
						placeholder="Correo electrónico"
						required
					/>
				</div>

				<div class="flex flex-row justify-between items-center">
					<div class="flex flex-col w-[49%]">
						<label for="phone" class="text-xs text-neutral-600"> Teléfono </label>
						<Input
							type="tel"
							name="phone"
							id="phone"
							bind:value={phone}
							placeholder="011-47029302"
							required
						/>
					</div>

					<div class="flex flex-col w-[49%]">
						<label for="dni" class="text-xs text-neutral-600"> DNI </label>
						<Input type="tel" name="dni" id="dni" bind:value={dni} placeholder="DNI" required />
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2 h-fit">
				<p>Dirección de envío:</p>

				<div class="grid grid-cols-4 gap-2">
					<div class="flex flex-col w-full col-span-3">
						<label for="addrress" class="text-xs text-neutral-600"> Dirección </label>
						<Input
							type="text"
							name="address"
							id="address"
							bind:value={address}
							placeholder="Dirección completa"
							required
						/>
					</div>
					<div class="flex flex-col w-full">
						<label for="department" class="text-xs text-neutral-600"> Dpt </label>
						<Input
							type="text"
							name="department"
							id="department"
							bind:value={department}
							placeholder="2B"
						/>
					</div>
				</div>

				<div class="flex flex-col md:flex-row gap-2 w-full justify-between items-center">
					<div class="flex flex-col w-full">
						<label for="province" class="text-xs text-neutral-600"> Provincia </label>
						<Selector options={provinces} bind:value={province} name="provincia" />
					</div>
					<div class="flex flex-col w-full">
						<label for="locality" class="text-xs text-neutral-600"> Localidad </label>
						<Selector options={localities} bind:value={locality} name="localidad" />
					</div>
				</div>

				<div class="flex flex-col w-full">
					<label for="zipCode" class="text-xs text-neutral-600"> Codigo Postal </label>
					<Input
						type="text"
						name="zipCode"
						id="zipCode"
						bind:value={zipCode}
						placeholder="Código postal"
						required
					/>
				</div>
			</div>
		</div>
		{#if error}
			<p class="text-red-700 text-center font-light mt-3">
				Debes ingresar todos los datos necesarios
			</p>
		{/if}
		<Button type="submit" class="cursor-pointer w-full mt-5" disabled={isLoading}>
			{#if isLoading}
				<Loader size={20} class="animate-spin" />
			{:else}
				Finalizar el pedido
			{/if}
		</Button>
	</form>
</div>
