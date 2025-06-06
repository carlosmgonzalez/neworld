import prisma from '@/lib/prisma/prisma';

export const getOrderById = async (id: string) => {
	try {
		const order = await prisma.order.findUnique({
			where: {
				id
			},
			include: {
				OrderItem: true
			}
		});

		// if (!order) return json({ msg: `Order with id ${id} not found` }, { status: 401 });
		if (!order)
			return {
				ok: false,
				order: null
			};

		const products = await prisma.product.findMany({
			where: {
				id: {
					in: order.OrderItem.map((item) => item.productId)
				}
			}
		});

		return {
			ok: true,
			order: {
				...order,
				OrderItem: order.OrderItem.map((item) => {
					const product = products.find((p) => p.id === item.productId);

					return {
						...item,
						name: product!.name,
						images: product!.images
					};
				})
			}
		};
	} catch (err) {
		console.log(err);
		return {
			ok: false,
			order: null
		};
	}
};
