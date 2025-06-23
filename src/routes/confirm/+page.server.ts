import prisma from '$lib/prisma';
import { error, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async () => {
	try {
		const shippingPrice = await prisma.config.findFirst({
			where: {
				configKey: 'standard_shipping_price'
			}
		});

		if (shippingPrice && shippingPrice.type === 'number') {
			return {
				shippingPrice: Number(shippingPrice.value)
			};
		}

		return {
			shippingPrice: 0
		};
	} catch (error) {
		console.log(error);
		return {
			shippingPrice: 0
		};
	}
};

export const actions = {
	createOrder: async ({ locals }) => {
		const session = locals.session;

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
				const cartItems = sessionInfo.Cart.CartItem;

				await prisma.order.create({
					data: {
						...userInfo,
						totalItems: 0,
						totalPrice: 0,
						byTransfer: false,
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
			}
		} catch (e) {
			console.log(e);
			return error(400, {
				message: 'Ocurrio un error al crear la orden'
			});
		}
	}
} satisfies Actions;
