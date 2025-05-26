import z from 'zod';

const ProductSchema = z.object({
	name: z.string(),
	description: z.string(),
	smallDescription: z.string(),
	price: z.number(),
	stock: z.number().positive(),
	images: z.array(z.string()),
	infoImages: z.array(z.string())
});

export default ProductSchema;
