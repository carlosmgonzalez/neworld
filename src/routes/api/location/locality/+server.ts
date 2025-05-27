import prisma from '@/lib/prisma/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const SearchParamsSchema = z
	.object({
		search: z.string(),
		provinceId: z.string().transform((val, ctx) => {
			const num = Number(val);
			if (isNaN(num)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'provinceId must be a number'
				});
				return z.NEVER;
			}
			return num;
		})
	})
	.strict();

export const GET: RequestHandler = async ({ url }) => {
	const search = url.searchParams.get('search')?.toLowerCase();
	const provinceId = url.searchParams.get('provinceId')?.toLowerCase();

	const result = SearchParamsSchema.safeParse({ search, provinceId });

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
		const data = await prisma.locality.findMany({
			where: {
				id_province: result.data.provinceId,
				locality: {
					startsWith: result.data.search,
					mode: 'insensitive'
				}
			}
		});

		if (!data) {
			return json(
				{
					ok: false,
					errors: 'Locality not found'
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
				erros: 'Something went wrong while find the provinces'
			},
			{ status: 500 }
		);
	}
};
