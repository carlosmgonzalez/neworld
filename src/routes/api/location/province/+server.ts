import prisma from '@/lib/prisma/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const SearchParamsSchema = z
	.object({
		search: z.string()
	})
	.strict();

export const GET: RequestHandler = async ({ url }) => {
	const searchQuery = url.searchParams.get('search')?.toLowerCase();

	const result = SearchParamsSchema.safeParse({ search: searchQuery });

	if (!result.success) {
		return json(
			{
				ok: false,
				error: result.error.errors
			},
			{ status: 400 }
		);
	}

	try {
		const data = await prisma.province.findMany({
			where: {
				province: {
					startsWith: result.data.search,
					mode: 'insensitive'
				}
			}
		});

		if (!data) {
			return json(
				{
					ok: false,
					data: []
				},
				{ status: 404 }
			);
		}

		return json({
			ok: true,
			data
		});
	} catch (err) {
		console.log(err);
		return json(
			{
				ok: false,
				data: [],
				message: 'Something went wrong while find the provinces'
			},
			{ status: 500 }
		);
	}
};
