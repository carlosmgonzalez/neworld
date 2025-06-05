import prisma from '$lib/prisma/prisma';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	const shippingPrice = await prisma.config.findFirst({
		where: {
			configKey: 'standard_shipping_price'
		}
	});

	if (!shippingPrice) return;

	if (shippingPrice.type === 'number') {
		return {
			shippingPrice: Number(shippingPrice.value)
		};
	}
};
