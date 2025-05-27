import type { PageServerLoad } from './$types';
import type { Product, Review } from '@prisma/client';

export const load: PageServerLoad = async ({ fetch, params }) => {
	const id = params.slug;

	try {
		const res = await fetch(`/api/products/${id}`);

		if (!res.ok) {
			return {
				ok: false,
				product: null
			};
		}

		const product: Product & { Review: Review[] } = await res.json();

		return {
			ok: true,
			product
		};
	} catch (err) {
		console.log(err);
		return {
			ok: false,
			product: null
		};
	}
};
