import { getOrderById } from '@/lib/server/services/orders.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const orderId = params.slug;

	try {
		const response = await getOrderById(orderId);
		return response;
	} catch (err) {
		console.log(err);
		return {
			ok: false,
			order: null
		};
	}
};
