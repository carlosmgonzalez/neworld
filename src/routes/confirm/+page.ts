import { cartStore, type CartItem } from '@/store/cart.store';
import { browser } from '$app/environment';
import { get } from 'svelte/store';
import type { Product } from '@prisma/client';
import type { PageLoad } from './$types';
import { userInfoStore, type UserInfo } from '@/store/user-info.store';

export const load: PageLoad = async ({ fetch, depends }) => {
	// `depends` se usa para decirle a SvelteKit que esta función `load`
	// depende de ciertos datos. Si esos datos se invalidan (por ejemplo,
	// llamando a `invalidate('app:cart')`), SvelteKit re-ejecutará `load`.
	depends('app:cart'); // 'app:cart' es un identificador arbitrario que puedes usar

	let currentCartItems: CartItem[] = [];
	let currentUserInfo: UserInfo = {
		address: '',
		dni: '',
		email: '',
		lastname: '',
		locality: '',
		name: '',
		phone: '',
		province: '',
		zipCode: ''
	};

	if (browser) {
		// Solo accedemos al store (que podría depender de localStorage) si estamos en el navegador
		currentCartItems = get(cartStore);
		currentUserInfo = get(userInfoStore);
	}

	if (!currentCartItems || currentCartItems.length === 0) {
		return {
			detailedCartItems: [],
			error: null
		};
	}

	const productsIds = currentCartItems.map((item) => item.productId);

	try {
		const res = await fetch('/api/products-details', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(productsIds)
		});

		const responseProvince = await fetch(`/api/location/province/${currentUserInfo.province}`);
		const dataProvince = await responseProvince.json();

		const responseLocality = await fetch(`/api/location/locality/${currentUserInfo.locality}`);
		const dataLocality = await responseLocality.json();

		currentUserInfo = {
			...currentUserInfo,
			province: dataProvince.province.province,
			locality: dataLocality.locality.locality
		};

		if (!res.ok) {
			console.log('Api error en load');
			return {
				detailedCartItems: [],
				error: 'Error to get the products'
			};
		}

		const products: Product[] = await res.json();

		const detailedCartItems = products.map((product) => ({
			...product,
			quantity: currentCartItems.find((i) => i.productId === product.id)!.quantity
		}));

		console.log(currentUserInfo);

		return {
			detailedCartItems,
			currentUserInfo,
			error: null
		};
	} catch (err) {
		console.log('Error while get products details in load:', err);
		return {
			detailedCartItems: [],
			error: 'Something went wrong while get products'
		};
	}
};
