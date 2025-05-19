<script lang="ts">
	import { Menubar } from 'bits-ui';
	import { Check, ChevronRight, Menu, ShoppingCart } from '@lucide/svelte';
	import { cartStore } from '../store/cart.store';

	let totalItems = $state(0);
	cartStore.subscribe((cart) => {
		totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
	});

	let selectedView = $state('table');
	let selectedProfile = $state('pavel');

	const profiles = [
		{
			value: 'hunter',
			label: 'Hunter'
		},
		{
			value: 'pavel',
			label: 'Pavel'
		},
		{
			value: 'adrian',
			label: 'Adrian'
		}
	];

	const views = [
		{
			value: 'table',
			label: 'Table'
		},
		{
			value: 'board',
			label: 'Board'
		},
		{
			value: 'gallery',
			label: 'Gallery'
		}
	];
</script>

<Menubar.Root class={`fixed z-50 right-0 left-0 top-8 flex h-12 justify-between items-center px-4`}>
	<div
		class="max-w-[1200px] mx-auto w-full px-6 flex h-12 border border-dark-10 justify-between items-center gap-1 rounded-xl bg-white/30 backdrop-blur-lg"
	>
		<h1 class="font-bold text-xl">
			<a href="/"> Neworld </a>
		</h1>
		<div class="hidden md:flex gap-2">
			<!-- <Menubar.Menu>
				<Menubar.Trigger
					class="rounded-9px data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center px-3 text-sm font-medium focus-visible:outline-none"
				>
					Productos
				</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content
						class="focus-override border-muted bg-background  shadow-popover focus-visible:outline-hidden z-50 w-fit rounded-xl border px-1 py-1.5"
						align="start"
						sideOffset={3}
					>
						<Menubar.RadioGroup bind:value={selectedView}>
							{#each views as view}
								<Menubar.RadioItem
									value={view.value}
									class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center gap-2 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
								>
									{#snippet children({ checked })}
										{view.label}
										<div class="ml-auto size-5">
											{#if checked}
												<Check class="size-5" />
											{/if}
										</div>
									{/snippet}
								</Menubar.RadioItem>
							{/each}
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu> -->

			<!-- <Menubar.Menu>
				<Menubar.Trigger
					class="data-highlighted:bg-muted data-[state=open]:bg-muted inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
				>
					Edit
				</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content
						class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full rounded-xl border px-1 py-1.5"
						align="start"
						sideOffset={3}
					>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Undo
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 min-w-[130px] select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Redo
						</Menubar.Item>
						<Menubar.Separator />
						<Menubar.Sub>
							<Menubar.SubTrigger
								class="rounded-button data-highlighted:bg-muted data-[state=open]:bg-muted flex h-10 select-none items-center gap-3 py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
							>
								Find
								<div class="ml-auto flex items-center">
									<ChevronRight class="text-foreground-alt h-4 w-4" />
								</div>
							</Menubar.SubTrigger>
							<Menubar.SubContent
								class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden w-full max-w-[209px] rounded-xl border px-1 py-1.5"
							>
								<Menubar.Item
									class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
								>
									Search the web
								</Menubar.Item>
								<Menubar.Separator />
								<Menubar.Item
									class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
								>
									Find...
								</Menubar.Item>
								<Menubar.Item
									class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
								>
									Find Next
								</Menubar.Item>
								<Menubar.Item
									class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
								>
									Find Previous
								</Menubar.Item>
							</Menubar.SubContent>
						</Menubar.Sub>
						<Menubar.Separator />
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Cut
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Copy
						</Menubar.Item>
						<Menubar.Item
							class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
						>
							Paste
						</Menubar.Item>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu> -->

			<!-- <Menubar.Menu>
				<Menubar.Trigger
					class="data-highlighted:bg-muted data-[state=open]:bg-muted mr-[20px] inline-flex h-10 cursor-default items-center justify-center rounded-[9px] px-3 text-sm font-medium focus-visible:outline-none"
				>
					Profiles
				</Menubar.Trigger>
				<Menubar.Portal>
					<Menubar.Content
						class="focus-override border-muted bg-background shadow-popover focus-visible:outline-hidden z-50 w-full max-w-[220px] rounded-xl border px-1 py-1.5"
						align="start"
						sideOffset={3}
					>
						<Menubar.RadioGroup bind:value={selectedProfile}>
							{#each profiles as profile}
								<Menubar.RadioItem
									class="rounded-button data-highlighted:bg-muted flex h-10 select-none items-center py-3 pl-3 pr-1.5 text-sm font-medium focus-visible:outline-none"
									value={profile.value}
								>
									{#snippet children({ checked })}
										{profile.label}
										<div class="ml-auto flex items-center">
											{#if checked}
												<Check class="size-5" />
											{/if}
										</div>
									{/snippet}
								</Menubar.RadioItem>
							{/each}
						</Menubar.RadioGroup>
					</Menubar.Content>
				</Menubar.Portal>
			</Menubar.Menu> -->
		</div>
		<div class="flex justify-center items-center gap-4">
			<a href="/cart" class="relative p-1">
				<span
					class="absolute top-0 right-0 flex justify-center items-center p-[1px] w-[16px] h-[16px] rounded-full bg-blue-500 text-white text-xs font-bold"
				>
					{#if totalItems > 0}
						{totalItems}
					{:else}
						0
					{/if}
				</span>
				<ShoppingCart />
			</a>
			<!-- <Menu /> -->
		</div>
	</div>
</Menubar.Root>
