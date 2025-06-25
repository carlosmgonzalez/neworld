import { validCoupon } from '$lib/server/services/valid-coupon.service';
import { json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

const validateCodeSchema = z.object({
	code: z.string()
});

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const result = await validateCodeSchema.safeParseAsync(body);

	if (!result.success)
		return json(
			{
				valid: false
			},
			{ status: 400 }
		);

	return await validCoupon(result.data.code);
};
