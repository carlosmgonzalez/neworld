import prisma from '@/lib/prisma/prisma';
import { json } from '@sveltejs/kit';

export const validCoupon = async (code: string) => {
	const couponExists = await prisma.coupon.findUnique({
		where: {
			code,
			active: true
		}
	});

	if (!couponExists)
		return json(
			{
				valid: false
			},
			{ status: 406 }
		);

	return json({
		valid: true,
		discountValue: couponExists.discountValue,
		discountType: couponExists.discountType
	});
};
