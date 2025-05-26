import prisma from '$lib/prisma/prisma';
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
				}
			}
		});

		// if (products.length < ids.length)
		// 	return error(404, `Some or all of the products with these ids ${ids} were not found`);

		return json(products);
	} catch (err) {
		console.log(err);
		return error(500, 'Something went wrong while get products');
	}
};
