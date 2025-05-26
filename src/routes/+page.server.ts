import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product } from '@prisma/client';

export const load: PageServerLoad = async ({ fetch }) => {
	const res = await fetch('/api/products');

	if (!res.ok) {
		throw error(res.status, `Something went wrong while get products ${res.statusText}`);
	}

	const products: Product[] = await res.json();

	return {
		products
	};
};
