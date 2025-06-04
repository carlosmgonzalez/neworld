import prisma from '@/lib/prisma/prisma';
import { OrderSchema } from '@/lib/schemas/order.schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const orderData = await OrderSchema.parseAsync(body);
		const productsIds = orderData.items.map((i) => i.productId);

		const products = await prisma.product.findMany({
			where: {
				id: {
					in: productsIds
				}
			}
		});

		if (productsIds.length > products.length) {
			return json({
				message: `Some or all of the products with these ids ${productsIds} were not found`
			});
		}

		let totalPrice = orderData.items.reduce((acc, item) => {
			const price = products.find((pr) => pr.id === item.productId)!.price;

			acc += price * item.quantity;

			return acc;
		}, 0);

		const existCoupon = await prisma.coupon.findUnique({
			where: {
				code: orderData.coupon,
				active: true
			}
		});

		if (existCoupon) {
			if (existCoupon.discountType === 'PERCENTAGE') {
				totalPrice = totalPrice * ((100 - Number(existCoupon.discountValue)) / 100);
			}
		}

		const totalItems = orderData.items.reduce((acc, item) => acc + item.quantity, 0);

		const order = await prisma.order.create({
			data: {
				totalPrice: totalPrice * 0.95,
				totalItems,
				byTransfer: true,
				name: orderData.name,
				lastname: orderData.lastname,
				email: orderData.email,
				phone: orderData.phone,
				dni: orderData.dni,
				province: orderData.province,
				locality: orderData.locality,
				address: orderData.address,
				zipCode: orderData.zipCode,
				couponId: existCoupon ? existCoupon.id : null,
				OrderItem: {
					createMany: {
						data: orderData.items.map(({ productId, quantity }) => {
							return {
								productId,
								quantity,
								price: products.find((p) => p.id === productId)!.price
							};
						})
					}
				}
			},
			include: {
				OrderItem: {
					select: {
						productId: true,
						price: true,
						quantity: true
					}
				}
			}
		});

		return json({ order });
	} catch (err) {
		console.log(err);
		if (err instanceof z.ZodError) {
			return json({ issues: err.issues }, { status: 400 });
		}
		return error(400, 'Something went wrong while creating the order');
	}
};
