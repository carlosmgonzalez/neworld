<script lang="ts">
	import { ShoppingCart } from '@lucide/svelte';
	import type { Cart, CartItem, Product } from '@prisma/client';
	import Badge from '../ui/badge/badge.svelte';
	import SunIcon from '@lucide/svelte/icons/sun';
	import MoonIcon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import { Button } from '$lib/components/ui/button/index.js';

	interface Props {
		cart: (Cart & { CartItem: CartItem[] & { product: Product }[] }) | null;
	}

	const { cart }: Props = $props();

	let totalItems = $derived(cart ? cart.CartItem.reduce((acc, item) => acc + item.quantity, 0) : 0);
</script>

<nav
	class="fixed z-50 right-0 left-0 top-0 bg-primary/15 flex justify-between items-center h-14 shadow-md backdrop-blur-xl"
>
	<div class="max-w-[1200px] mx-auto w-full pl-4 pr-5 flex justify-between items-center gap-1">
		<h1 class="font-semibold text-xl flex items-center justify-center">
			<img src="/images/logo/logo.png" alt="logo" class="aspect-square w-[45px] h-auto" />
			<a href="/"> Neworld </a>
		</h1>
		<div class="hidden md:flex gap-2"></div>
		<div class="flex justify-center items-center gap-4">
			<Button onclick={toggleMode} variant="ghost" size="icon">
				<SunIcon
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 !transition-all dark:-rotate-90 dark:scale-0"
				/>
				<MoonIcon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 !transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
			<a href="/cart" class="relative p-1">
				<Badge
					class="absolute top-0 right-0 h-4.5 min-w-4.5 rounded-full px-1 font-mono tabular-nums"
					variant="default"
				>
					{#if totalItems > 0}
						{totalItems}
					{:else}
						0
					{/if}
				</Badge>
				<ShoppingCart />
			</a>
		</div>
	</div>
</nav>
