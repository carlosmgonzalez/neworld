import prisma from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.slug;

	try {
		const product = await prisma.product.findUnique({
			where: {
				id
			},
			include: {
				ProductImages: true,
				Review: true,
				ProductInfoImages: true
			}
		});

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
