import { getProducts } from '@/lib/server/services/products.service';
import { type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	return getProducts({ url });
};

// export const POST: RequestHandler = async ({ request }) => {
// 	return createProduct({ request });
// };
