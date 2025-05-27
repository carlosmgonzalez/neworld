import prisma from '@/lib/prisma/prisma';
import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const ParamsSchema = z.string().transform((val, ctx) => {
	const num = Number(val);
	if (isNaN(num)) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: 'provinceId must be a number'
		});
		return z.NEVER;
	}
	return num;
});

export const GET: RequestHandler = async ({ params }) => {
	try {
		const id = params.id;

		const result = ParamsSchema.safeParse(id);

		if (!result.success)
			return json(
				{
					ok: false,
					error: result.error.issues
				},
				{ status: 400 }
			);

		const province = await prisma.province.findUnique({
			where: {
				id: result.data
			}
		});

		if (!province)
			return json(
				{
					ok: false,
					error: `Province with id ${id} not found`
				},
				{ status: 404 }
			);

		return json({
			province
		});
	} catch (err) {
		console.log(err);
		let errorMessage = 'Unknown error';
		if (err instanceof Error) {
			errorMessage = err.message;
		}
		return json({
			ok: false,
			error: errorMessage
		});
	}
};
