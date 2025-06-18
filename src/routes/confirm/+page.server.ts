import prisma from '$lib/prisma';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	try {
		const shippingPrice = await prisma.config.findFirst({
			where: {
				configKey: 'standard_shipping_price'
			}
		});

		if (!shippingPrice) {
			return {
				shippingPrice: 0
			};
		}

		if (shippingPrice.type === 'number') {
			return {
				shippingPrice: Number(shippingPrice.value)
			};
		}

		return {
			shippingPrice: 0
		};
	} catch (error) {
		console.log(error);
		return {
			shippingPrice: 0
		};
	}
};
