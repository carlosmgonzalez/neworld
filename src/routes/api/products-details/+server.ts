import prisma from '$lib/prisma';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const IdsSchema = z.array(z.string().uuid());

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const ids = await IdsSchema.parseAsync(body);

		const products = await prisma.product.findMany({
			where: {
				id: {
					in: ids
				},
				isActive: true
			}
		});

		return json(products);
	} catch (err) {
		console.log(err);
		return error(500, 'Something went wrong while get products');
	}
};
