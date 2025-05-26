import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Product, Review } from '@prisma/client';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const id = params.slug;

	try {
		const res = await fetch(`/api/products/${id}`);

		if (!res.ok) {
			throw error(res.status, `Something went wrong while get products ${res.statusText}`);
		}

		const product: Product & { Review: Review[] } = await res.json();

		return {
			product
		};
	} catch (err) {
		console.log(err);
	}
};
