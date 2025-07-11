import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const products = await prisma.product.findMany({
		orderBy: {
			priority: 'asc'
		}
	});

	return {
		products: products ?? []
	};
};
