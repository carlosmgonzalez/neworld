import { error, json } from '@sveltejs/kit';
import { Preference, MercadoPagoConfig } from 'mercadopago';
import { ACCESS_TOKEN_MP } from '$env/static/private';
import { PUBLIC_BASE_URL } from '$env/static/public';

import { z } from 'zod';
import prisma from '@/lib/prisma/prisma';
import { OrderSchema } from '@/lib/schemas/order.schema';

const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN_MP });
const preference = new Preference(client);

export const createOrder = async ({ request }: { request: Request }) => {
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

		await Promise.all(
			orderData.items.map((item) => {
				return prisma.product.update({
					where: {
						id: item.productId
					},
					data: {
						stock: {
							decrement: item.quantity
						}
					}
				});
			})
		);

		let totalPrice = orderData.items.reduce((acc, item) => {
			const price = products.find((pr) => pr.id === item.productId)!.price;

			acc += price * item.quantity;

			return acc;
		}, 0);

		const totalItems = orderData.items.reduce((acc, item) => acc + item.quantity, 0);

		const shippingPrice = await prisma.config.findFirst({
			where: {
				configKey: 'standard_shipping_price'
			}
		});

		if (shippingPrice && shippingPrice.type === 'number') {
			totalPrice += Number(shippingPrice.value) * totalItems;
		}

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

		const order = await prisma.order.create({
			data: {
				totalPrice,
				totalItems,
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

		let items = order.OrderItem.map((item) => ({
			id: item.productId,
			title: products.find((p) => p.id === item.productId)!.name,
			quantity: item.quantity,
			unit_price: item.price,
			picture_url: products.find((p) => p.id === item.productId)!.images[0]
		}));

		if (shippingPrice && shippingPrice.type === 'number') {
			items = items.map((item) => ({
				...item,
				unit_price: item.unit_price + Number(shippingPrice.value)
			}));
		}

		if (existCoupon) {
			if (existCoupon.discountType === 'PERCENTAGE') {
				items = items.map((item) => ({
					...item,
					unit_price: item.unit_price * ((100 - Number(existCoupon.discountValue)) / 100)
				}));
			}
		}

		const payment = await preference.create({
			body: {
				items: items,
				notification_url: `${PUBLIC_BASE_URL}/api/orders/webhook`,
				back_urls: {
					success: `${PUBLIC_BASE_URL}/order/${order.id}`,
					failure: `${PUBLIC_BASE_URL}`,
					pending: `${PUBLIC_BASE_URL}`
				},
				metadata: {
					order_id: order.id,
					user_email: order.email
				}
			}
		});

		return json({ order, payment });
	} catch (err) {
		console.log(err);
		if (err instanceof z.ZodError) {
			return json({ issues: err.issues }, { status: 400 });
		}
		return error(400, 'Something went wrong while creating the order');
	}
};

export const getOrders = async () => {
	try {
		const orders = await prisma.order.findMany();
		return json(orders);
	} catch (err) {
		console.log(err);
		return error(400, 'Something went wrong while get all orders');
	}
};

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
