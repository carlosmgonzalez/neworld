import { writable } from 'svelte/store';

interface CartItem {
	productId: string;
	quantity: number;
}

function createCart() {
	const initialCart: CartItem[] = (() => {
		if (typeof window !== 'undefined' && window.localStorage) {
			const stored = localStorage.getItem('cart');
			try {
				return stored ? JSON.parse(stored) : [];
			} catch {
				return [];
			}
		}
		return [];
	})();

	const { subscribe, set, update } = writable<CartItem[]>(initialCart);

	return {
		subscribe,
		addItem: (item: CartItem) =>
			update((cart) => {
				// Si el producto ya existe, suma la cantidad
				const newCart = cart.some((i) => i.productId === item.productId)
					? cart.map((i) =>
							i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
						)
					: [...cart, item];

				localStorage.setItem('cart', JSON.stringify(newCart));
				return newCart;
			}),
		removeItem: (productId: string) =>
			update((cart) => {
				const newCart = cart.filter((i) => i.productId !== productId);
				localStorage.setItem('cart', JSON.stringify(newCart));
				return newCart;
			}),
		clear: () =>
			update(() => {
				localStorage.setItem('cart', '[]');
				return [];
			}),
		set // Permite reemplazar el carrito completo si es necesario
	};
}

export const cartStore = createCart();
