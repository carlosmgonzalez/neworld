import prisma from '$lib/prisma';
import ProductSchema from '@/lib/schemas/product.schema';
import QuerySchema from '@/lib/schemas/query.schema';
import { error, json } from '@sveltejs/kit';
import { z } from 'zod';

export const createProduct = async ({ request }: { request: Request }) => {
	try {
		const body = await request.json();
		const productSchema = await ProductSchema.parseAsync(body);

		const product = await prisma.product.create({
			data: productSchema
		});

		return json(product);
	} catch (err) {
		console.log(err);
		if (err instanceof z.ZodError) {
			return json({ issues: err.issues }, { status: 400 });
		}
		return error(400, {
			message: 'Something went wrong whit create product'
		});
	}
};

export const getProducts = async ({ url }: { url: URL }) => {
	const limit = url.searchParams.get('limit') ?? '10';
	const offset = url.searchParams.get('offset') ?? '0';

	try {
		const { limit: take = 10, offset: skip = 0 } = await QuerySchema.parseAsync({ limit, offset });

		const products = await prisma.product.findMany({
			take,
			skip
		});

		return json(products);
	} catch (err) {
		console.log(err);
		if (err instanceof z.ZodError) {
			return json({ issues: err.issues }, { status: 400 });
		}
		return error(400, {
			message: 'Something went wrong with find products'
		});
	}
};

export const getProductById = async ({ params }: { params: Partial<Record<string, string>> }) => {
	try {
		const id = await z.string().uuid().parseAsync(params.id);

		const product = await prisma.product.findUnique({
			where: {
				id
			},
			include: {
				Review: true
			}
		});

		if (!product) {
			return json({ message: `Product with id ${id} not found` }, { status: 404 });
		}

		return json(product);
	} catch (err) {
		console.log(err);

		if (err instanceof z.ZodError) {
			return json({ issues: err.issues }, { status: 400 });
		}

		return error(400, {
			message: 'Something went wrong with find products'
		});
	}
};
