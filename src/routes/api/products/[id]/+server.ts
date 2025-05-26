import { getProductById } from '@/lib/server/services/products.service';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
	return getProductById({ params });
};
