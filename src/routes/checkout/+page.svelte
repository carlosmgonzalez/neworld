<script lang="ts">
	import { goto } from '$app/navigation';
	import { userInfoStore } from '@/store/user-info.store';
	import { get } from 'svelte/store';
	import { z } from 'zod/v4';
	import { provincesDb } from '@/lib/database/provinces.db';
	import { localidadesDb } from '@/lib/database/localities.db';
	import Selector from '@/components/ui/Selector.svelte';

	const userInfo = get(userInfoStore);

	const formSchema = z.object({
		name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }),
		lastname: z.string().min(2, { error: 'El apellido debe tener al menos 2 caracteres' }),
		email: z.email(),
		phone: z.string().min(8, { error: 'El teléfono debe tener al menos 8 caracteres' }),
		address: z.string().min(5, { error: 'La dirección debe tener al menos 5 caracteres' }),
		department: z.string().optional(),
		province: z.string().min(1, { error: 'La provincia debe tener al menos 2 caracteres' }),
		locality: z.string().min(1, { error: 'La localidad no se encuentra en esa provincia' }),
		zipCode: z.string().min(4, { error: 'El código postal debe ser valido' }),
		dni: z
			.string()
			.min(8, { error: 'El DNI debe ser valido' })
			.max(8, { error: 'El DNI debe ser valido' })
	});

	let formErrors = $state<Record<string, { errors: string[] }> | null>(null);

	let name = $state(userInfo.name || '');
	let lastname = $state(userInfo.lastname || '');
	let dni = $state(userInfo.dni || '');
	let email = $state(userInfo.email || '');
	let phone = $state(userInfo.phone || '');
	let address = $state(userInfo.address || '');
	let department = $state(userInfo.department || '');
	let zipCode = $state(userInfo.zipCode || '');

	let province = $state('');
	let locality = $state('');

	let provinces = $state(provincesDb.map((p) => ({ label: p.nombre, value: p.nombre })));
	let localities = $derived(
		province.length > 0
			? localidadesDb
					.filter((locality) => locality.provincia.nombre === province)
					.map((l) => ({ label: l.nombre, value: l.nombre }))
			: []
	);

	const handleSubmit = async (event: Event) => {
		formErrors = null;
		event.preventDefault();

		const form = {
			name,
			lastname,
			dni,
			email,
			phone,
			address,
			department,
			province,
			locality,
			zipCode
		};

		const validateForm = formSchema.safeParse(form);

		if (!validateForm.success) {
			formErrors = z.treeifyError(validateForm.error).properties ?? null;
			setTimeout(() => {
				formErrors = null;
			}, 3000);
			const prettyError = z.prettifyError(validateForm.error);
			console.error('Validation failed:', prettyError);
			return;
		}

		userInfoStore.save(validateForm.data);

		goto('/confirm');
	};
</script>

<div class="page-container">
	<h1 class="text-lg font-semibold">Informacion de envio</h1>
	<a href="/cart" class="underline text-sm font-light"> Volver al carrito </a>
	<form onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
			<div class="flex flex-col gap-2 h-fit">
				<p>Datos personales:</p>
				<div class="flex flex-col w-full">
					<label for="name" class="text-xs text-neutral-600"> Nombre </label>
					<input
						type="text"
						name="name"
						id="name"
						bind:value={name}
						placeholder="Nombre"
						class="input-outline"
						required
					/>
					{#if formErrors?.name && formErrors.name.errors.length > 0}
						<p class="text-error">
							{formErrors.name.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<label for="lastname" class="text-xs text-neutral-600"> Apellido </label>
					<input
						type="text"
						name="lastname"
						id="lastname"
						bind:value={lastname}
						placeholder="Apellido"
						class="input-outline"
						required
					/>
					{#if formErrors?.lastname && formErrors.lastname.errors.length > 0}
						<p class="text-error">
							{formErrors.lastname.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<label for="email" class="text-xs text-neutral-600"> Email </label>
					<input
						type="email"
						name="email"
						id="email"
						bind:value={email}
						placeholder="Correo electrónico"
						class="input-outline"
						required
					/>
					{#if formErrors?.dni && formErrors.dni.errors.length > 0}
						<p class="text-error">
							{formErrors.email.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-row justify-between items-center">
					<div class="flex flex-col w-[49%]">
						<label for="phone" class="text-xs text-neutral-600"> Teléfono </label>
						<input
							type="tel"
							name="phone"
							id="phone"
							bind:value={phone}
							placeholder="011-47029302"
							class="input-outline"
							required
						/>
						{#if formErrors?.phone && formErrors.phone.errors.length > 0}
							<p class="text-error">
								{formErrors.phone.errors[0]}
							</p>
						{/if}
					</div>

					<div class="flex flex-col w-[49%]">
						<label for="dni" class="text-xs text-neutral-600"> DNI </label>
						<input
							type="tel"
							name="dni"
							id="dni"
							bind:value={dni}
							placeholder="DNI"
							class="input-outline"
							required
						/>
						{#if formErrors?.dni && formErrors.dni.errors.length > 0}
							<p class="text-error">
								{formErrors.dni.errors[0]}
							</p>
						{/if}
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-2 h-fit">
				<p>Dirección de envío:</p>

				<div class="grid grid-cols-4 gap-2">
					<div class="flex flex-col w-full col-span-3">
						<label for="addrress" class="text-xs text-neutral-600"> Dirección </label>
						<input
							type="text"
							name="address"
							id="address"
							bind:value={address}
							placeholder="Dirección completa"
							class="input-outline"
							required
						/>
						{#if formErrors?.address && formErrors.address.errors.length > 0}
							<p class="text-error">
								{formErrors.address.errors[0]}
							</p>
						{/if}
					</div>
					<div class="flex flex-col w-full">
						<label for="department" class="text-xs text-neutral-600"> Dpt </label>
						<input
							type="text"
							name="department"
							id="department"
							bind:value={department}
							placeholder="2B"
							class="input-outline"
						/>
						{#if formErrors?.address && formErrors.address.errors.length > 0}
							<p class="text-error">
								{formErrors.address.errors[0]}
							</p>
						{/if}
					</div>
				</div>

				<div class="flex flex-col md:flex-row gap-2 w-full justify-between items-center">
					<div class="flex flex-col w-full">
						<label for="province" class="text-xs text-neutral-600"> Provincia </label>
						<Selector options={provinces} bind:value={province} name="provincia" />
						{#if formErrors?.province && formErrors.province.errors.length > 0}
							<p class="text-error">
								{formErrors.province.errors[0]}
							</p>
						{/if}
					</div>
					<div class="flex flex-col w-full">
						<label for="locality" class="text-xs text-neutral-600"> Localidad </label>
						<Selector options={localities} bind:value={locality} name="localidad" />
						{#if formErrors?.locality && formErrors.locality.errors.length > 0}
							<p class="text-error">
								{formErrors.locality.errors[0]}
							</p>
						{/if}
					</div>
				</div>

				<div class="flex flex-col w-full">
					<label for="zipCode" class="text-xs text-neutral-600"> Codigo Postal </label>
					<input
						type="text"
						name="zipCode"
						id="zipCode"
						bind:value={zipCode}
						placeholder="Código postal"
						class="input-outline"
						required
					/>
					{#if formErrors?.zipCode && formErrors.zipCode.errors.length > 0}
						<p class="text-error">
							{formErrors.zipCode.errors[0]}
						</p>
					{/if}
				</div>
			</div>
		</div>
		<button
			type="submit"
			class="bg-blue-500 w-full mt-4 text-white rounded-lg px-4 py-2 shadow hover:shadow-md hover:bg-blue-600 hover:cursor-pointer"
		>
			Finalizar el pedido
		</button>
	</form>
</div>
