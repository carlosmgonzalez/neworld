import { z } from 'zod';

export const ItemsSchema = z.array(
	z.object({
		productId: z.string().uuid(),
		quantity: z.number().positive()
	})
);

export const OrderSchema = z
	.object({
		items: ItemsSchema,
		name: z.string(),
		lastname: z.string(),
		email: z.string(),
		address: z.string(),
		province: z.string(),
		locality: z.string(),
		zipCode: z.string(),
		phone: z.string(),
		dni: z.string()
	})
	.strict();
