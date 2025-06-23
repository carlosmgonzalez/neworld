import prisma from '$lib/prisma';
import { error, type Actions } from '@sveltejs/kit';
import preference from '@/lib/mercadopago';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Coupon } from '@prisma/client';

export type CreateOrderActionData = {
	orderId: string;
	initPoint: string;
};

export const actions = {
	createOrder: async ({ locals, request }) => {
		const session = locals.session;
		const form = await request.formData();
		const couponCode = form.get('coupon') as string | null;

		try {
			const sessionInfo = await prisma.session.findUnique({
				where: {
					id: session.id
				},
				include: {
					Cart: {
						include: {
							CartItem: {
								include: {
									product: true
								}
							}
						}
					},
					UserInfo: {
						omit: {
							sessionId: true
						}
					}
				}
			});

			if (sessionInfo && sessionInfo.Cart && sessionInfo.UserInfo) {
				const userInfo = sessionInfo.UserInfo;
				let cartItems = sessionInfo.Cart.CartItem;

				const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
				let totalPrice = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);

				let coupon: Coupon | null = null;

				if (couponCode) {
					coupon = await prisma.coupon.findUnique({
						where: {
							code: couponCode
						}
					});

					if (coupon) {
						totalPrice = totalPrice - Number(coupon.discountValue);
						cartItems = cartItems.map((item) => ({
							...item,
							product: {
								...item.product,
								price: item.product.price - Number(coupon!.discountValue)
							}
						}));
					}
				}

				const order = await prisma.order.create({
					data: {
						name: userInfo.name,
						lastname: userInfo.lastname,
						email: userInfo.email,
						address: userInfo.address,
						locality: userInfo.locality,
						province: userInfo.province,
						zipCode: userInfo.zipCode,
						phone: userInfo.phone,
						dni: userInfo.dni,
						totalItems,
						totalPrice,
						couponId: coupon ? coupon.id : null,
						OrderItem: {
							createMany: {
								data: cartItems.map((item) => ({
									price: item.product.price,
									quantity: item.quantity,
									productId: item.productId
								}))
							}
						}
					}
				});

				const payment = await preference.create({
					body: {
						items: cartItems.map((item) => ({
							id: item.productId,
							title: item.product.name,
							quantity: item.quantity,
							unit_price: item.product.price,
							picture_url: item.product.images[0]
						})),
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

				return {
					orderId: order.id,
					initPoint: payment.init_point
				};
			}
		} catch (e) {
			console.log(e);
			return error(400, {
				message: 'Ocurrio un error al crear la orden'
			});
		}
	},
	createOrderWithTransfer: async ({ locals, request }) => {
		const session = locals.session;
		const form = await request.formData();
		const couponCode = form.get('coupon') as string | null;

		console.log('create order with transfer');

		try {
			const sessionInfo = await prisma.session.findUnique({
				where: {
					id: session.id
				},
				include: {
					Cart: {
						include: {
							CartItem: {
								include: {
									product: true
								}
							}
						}
					},
					UserInfo: {
						omit: {
							sessionId: true
						}
					}
				}
			});
			if (sessionInfo && sessionInfo.Cart && sessionInfo.UserInfo) {
				const userInfo = sessionInfo.UserInfo;
				let cartItems = sessionInfo.Cart.CartItem;
				const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
				let totalPrice = cartItems.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
				let coupon: Coupon | null = null;
				if (couponCode) {
					coupon = await prisma.coupon.findUnique({
						where: {
							code: couponCode
						}
					});
					if (coupon) {
						totalPrice = totalPrice - Number(coupon.discountValue);
						cartItems = cartItems.map((item) => ({
							...item,
							product: {
								...item.product,
								price: item.product.price - Number(coupon!.discountValue)
							}
						}));
					}
				}
				const order = await prisma.order.create({
					data: {
						name: userInfo.name,
						lastname: userInfo.lastname,
						email: userInfo.email,
						address: userInfo.address,
						locality: userInfo.locality,
						province: userInfo.province,
						zipCode: userInfo.zipCode,
						phone: userInfo.phone,
						dni: userInfo.dni,
						totalItems,
						totalPrice,
						byTransfer: true,
						couponId: coupon ? coupon.id : null,
						OrderItem: {
							createMany: {
								data: cartItems.map((item) => ({
									price: item.product.price,
									quantity: item.quantity,
									productId: item.productId
								}))
							}
						}
					}
				});

				return {
					location: `/order/${order.id}`
				};
			}
		} catch (e) {
			console.log(e);
			return error(400, {
				message: 'Ocurrio un error al crear la orden'
			});
		}
	}
} satisfies Actions;
