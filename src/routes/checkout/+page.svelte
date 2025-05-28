<script lang="ts">
	import { goto } from '$app/navigation';
	import { userInfoStore } from '@/store/user-info.store';
	import { get } from 'svelte/store';
	import { z } from 'zod/v4';
	const userInfo = get(userInfoStore);

	import { Combobox } from 'bits-ui';
	import { Check, ChevronsDown, ChevronsUp, ChevronsUpDown, Loader } from '@lucide/svelte';
	import { debounce } from '@/lib/utils/debounce';
	import type {
		Localidad,
		LocalityResponse,
		ProvinceResponse,
		Provincia
	} from '@/lib/interfaces/argentina-gob-api-res.interface';

	const formSchema = z.object({
		name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }),
		lastname: z.string().min(2, { error: 'El apellido debe tener al menos 2 caracteres' }),
		email: z.email(),
		phone: z.string().min(8, { error: 'El teléfono debe tener al menos 8 caracteres' }),
		address: z.string().min(5, { error: 'La dirección debe tener al menos 5 caracteres' }),
		province: z.string().min(1, { error: 'La provincia debe tener al menos 2 caracteres' }),
		locality: z.string().min(1, { error: 'La localidad no se encuentra en esa provincia' }),
		zipCode: z.string().min(4, { error: 'El código postal debe ser valido' }),
		dni: z
			.string()
			.min(8, { error: 'El DNI debe ser valido' })
			.max(8, { error: 'El DNI debe ser valido' })
	});

	let name = $state(userInfo.name || '');
	let lastname = $state(userInfo.lastname || '');
	let dni = $state(userInfo.dni || '');
	let email = $state(userInfo.email || '');
	let phone = $state(userInfo.phone || '');
	let address = $state(userInfo.address || '');
	let zipCode = $state(userInfo.zipCode || '');
	let province = $state('');
	let locality = $state('');

	let queryProvince = $state('');
	let listProvinces = $state<Provincia[]>([]);
	let isLoading = false;

	const fetchProvinces = async (query: string) => {
		isLoading = true;

		try {
			const res = await fetch(
				`https://apis.datos.gob.ar/georef/api/provincias?max=100${query.length > 0 ? '&nombre=' + encodeURIComponent(query) : ''}`
			);

			if (!res.ok) {
				throw new Error(`Error ${res.status}: ${res.statusText}`);
			}

			const data: ProvinceResponse = await res.json();

			listProvinces = data.provincias;
		} catch (err) {
			console.error(`Failed to fetch province`, err);
			listProvinces = [];
		} finally {
			isLoading = false;
		}
	};

	// @ts-ignore
	const debouncedFetchProvince = debounce(fetchProvinces, 500);

	let queryLocality = $state('');
	let listLocalities = $state<Localidad[]>([]);

	const fetchLocality = async (query: string) => {
		isLoading = true;

		try {
			const res = await fetch(
				`https://apis.datos.gob.ar/georef/api/localidades?max=1000&provincia=${province}${query.length > 0 ? '&nombre=' + encodeURIComponent(query) : ''}`
			);
			if (!res.ok) {
				throw new Error(`Error ${res.status}: ${res.statusText}`);
			}

			const data: LocalityResponse = await res.json();

			listLocalities = data.localidades;
		} catch (err) {
			console.error(`Failed to fetch province`, err);
			listLocalities = [];
		} finally {
			isLoading = false;
		}
	};

	// @ts-ignore
	const debouncedFetchLocality = debounce(fetchLocality, 500);

	$effect(() => {
		fetchProvinces('');
	});

	const handleInputProvince = (event: Event) => {
		const target = event.target as HTMLInputElement;
		queryProvince = target.value;
		debouncedFetchProvince(queryProvince);
	};

	const handleInputLocality = (event: Event) => {
		const target = event.target as HTMLInputElement;
		queryLocality = target.value;
		debouncedFetchLocality(queryLocality, province);
	};

	let formErrors = $state<Record<string, { errors: string[] }> | null>(null);

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
			province,
			locality,
			zipCode
		};

		console.log(form);

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

		const userInfo = validateForm.data;

		userInfoStore.save(userInfo);

		goto('/confirm');
	};
</script>

<div class="page-container">
	<h1 class="text-2xl font-semibold">Informacion de envio</h1>
	<a href="/cart" class="underline text-neutral-600"> Volver al carrito </a>
	<form onsubmit={handleSubmit}>
		<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
			<div class="flex flex-col gap-2 h-fit">
				<p>Datos personales:</p>
				<div class="flex flex-col w-full">
					<input
						type="text"
						name="name"
						bind:value={name}
						placeholder="Nombre"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.name && formErrors.name.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.name.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<input
						type="text"
						name="lastname"
						bind:value={lastname}
						placeholder="Apellido"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.lastname && formErrors.lastname.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.lastname.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<input
						type="email"
						name="email"
						bind:value={email}
						placeholder="Correo electrónico"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.dni && formErrors.dni.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.email.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<input
						type="text"
						name="phone"
						bind:value={phone}
						placeholder="Teléfono"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.phone && formErrors.phone.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.phone.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<input
						type="text"
						name="dni"
						bind:value={dni}
						placeholder="DNI"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.dni && formErrors.dni.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.dni.errors[0]}
						</p>
					{/if}
				</div>
			</div>
			<div class="flex flex-col gap-2 h-fit">
				<p>Dirección de envío:</p>

				<div class="flex flex-col w-full">
					<input
						type="text"
						name="address"
						bind:value={address}
						placeholder="Dirección completa"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.address && formErrors.address.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.address.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<Combobox.Root
						onValueChange={(e) => {
							province = e;
							locality = '';
							fetchLocality('');
						}}
						value={province}
						type="single"
						name="city"
					>
						<div
							class="flex flex-row justify-between rounded-lg p-2 outline-1 outline-neutral-300 bg-neutral-200/50"
						>
							<Combobox.Input
								oninput={handleInputProvince}
								class="focus:outline-0 w-full"
								placeholder="Buscar provincia"
								aria-label="Buscar provincia"
							/>
							<Combobox.Trigger class="">
								<ChevronsUpDown class="text-muted-foreground size-6" />
							</Combobox.Trigger>
						</div>
						<Combobox.Portal>
							<Combobox.Content
								class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
								sideOffset={10}
							>
								<Combobox.ScrollUpButton class="flex w-full items-center justify-center py-1">
									<ChevronsUp class="size-3" />
								</Combobox.ScrollUpButton>
								<Combobox.Viewport class="p-1">
									{#each listProvinces as province, i (i + province.id)}
										<Combobox.Item
											class="rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
											value={`${province.nombre}`}
											label={province.nombre}
										>
											{#snippet children({ selected })}
												{province.nombre}
												{#if selected}
													<div class="ml-auto">
														<Check />
													</div>
												{/if}
											{/snippet}
										</Combobox.Item>
									{:else}
										<span class="block px-5 py-2 text-sm text-muted-foreground">
											Ningun resultado o sigue escribiendo
										</span>
									{/each}
								</Combobox.Viewport>
								<Combobox.ScrollDownButton class="flex w-full items-center justify-center py-1">
									<ChevronsDown class="size-3" />
								</Combobox.ScrollDownButton>
							</Combobox.Content>
						</Combobox.Portal>
					</Combobox.Root>
					{#if formErrors?.province && formErrors.province.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.province.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<Combobox.Root
						onValueChange={(e) => {
							locality = e;
						}}
						value={locality}
						type="single"
						name="city"
					>
						<div
							class="flex flex-row justify-between rounded-lg p-2 outline-1 outline-neutral-300 bg-neutral-200/50"
						>
							<Combobox.Input
								oninput={handleInputLocality}
								class="focus:outline-0 w-full"
								placeholder="Buscar localidad"
								aria-label="Buscar localidad"
							/>
							<Combobox.Trigger class="">
								<ChevronsUpDown class="text-muted-foreground size-6" />
							</Combobox.Trigger>
						</div>
						<Combobox.Portal>
							<Combobox.Content
								class="focus-override border-muted bg-background shadow-popover data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 outline-hidden z-50 h-96 max-h-[var(--bits-combobox-content-available-height)] w-[var(--bits-combobox-anchor-width)] min-w-[var(--bits-combobox-anchor-width)] select-none rounded-xl border px-1 py-3 data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
								sideOffset={10}
							>
								<Combobox.ScrollUpButton class="flex w-full items-center justify-center py-1">
									<ChevronsUp class="size-3" />
								</Combobox.ScrollUpButton>
								<Combobox.Viewport class="p-1">
									{#each listLocalities as locality, i (i + locality.id)}
										<Combobox.Item
											class="rounded-button data-highlighted:bg-muted outline-hidden flex h-10 w-full select-none items-center py-3 pl-5 pr-1.5 text-sm capitalize"
											value={`${locality.nombre}`}
											label={locality.nombre}
										>
											{#snippet children({ selected })}
												{locality.nombre}
												{#if selected}
													<div class="ml-auto">
														<Check />
													</div>
												{/if}
											{/snippet}
										</Combobox.Item>
									{:else}
										<span class="block px-5 py-2 text-sm text-muted-foreground">
											Ningun resultado o sigue escribiendo
										</span>
									{/each}
								</Combobox.Viewport>
								<Combobox.ScrollDownButton class="flex w-full items-center justify-center py-1">
									<ChevronsDown class="size-3" />
								</Combobox.ScrollDownButton>
							</Combobox.Content>
						</Combobox.Portal>
					</Combobox.Root>
					{#if formErrors?.locality && formErrors.locality.errors.length > 0}
						<p class="text-red-500 text-sm">
							{formErrors.locality.errors[0]}
						</p>
					{/if}
				</div>

				<div class="flex flex-col w-full">
					<input
						type="text"
						name="zipCode"
						bind:value={zipCode}
						placeholder="Código postal"
						class="input-outline-blue"
						required
					/>
					{#if formErrors?.zipCode && formErrors.zipCode.errors.length > 0}
						<p class="text-red-500 text-sm">
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
