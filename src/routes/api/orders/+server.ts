import { type RequestHandler } from '@sveltejs/kit';

import { createOrder, getOrders } from '@/lib/server/services/orders.service';

export const POST: RequestHandler = async ({ request }) => {
	return createOrder({ request });
};

export const GET: RequestHandler = async () => {
	return getOrders();
};
