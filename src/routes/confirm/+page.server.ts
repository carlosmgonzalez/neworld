import prisma from '$lib/prisma';
import { error, type Actions } from '@sveltejs/kit';
import preference from '$lib/mercadopago';
import { PUBLIC_BASE_URL } from '$env/static/public';
import type { Coupon } from '@prisma/client';
import { sendNewEmail } from '$lib/resend/send-new-mail';

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
						back_urls: {
							success: `${PUBLIC_BASE_URL}/order/${order.id}`,
							failure: `${PUBLIC_BASE_URL}`,
							pending: `${PUBLIC_BASE_URL}`
						},
						metadata: {
							order_id: order.id,
							user_email: order.email,
							session_id: session.id
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
	createOrderByTransfer: async ({ locals, request }) => {
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

				totalPrice = Math.ceil(totalPrice * 0.95);
				cartItems = cartItems.map((item) => ({
					...item,
					product: {
						...item.product,
						price: Math.ceil(item.product.price * 0.95)
					}
				}));

				if (couponCode) {
					coupon = await prisma.coupon.findUnique({
						where: {
							code: couponCode
						}
					});

					if (coupon) {
						totalPrice = totalPrice - Number(coupon!.discountValue);
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

				await sendNewEmail({
					subject: 'Neworld - Pendiente',
					to: [order.email],
					html: `
						<div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
							<div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 32px; text-align: center;">
								<h1 style="color: #1a202c; margin-bottom: 16px;">¡Gracias, esparamos tu tranferencia!</h1>
								<p style="color: #333; font-size: 16px; margin-bottom: 24px;">
									Puedes ver la información de tu compra haciendo clic en el siguiente enlace:
								</p>
								<a href="${PUBLIC_BASE_URL}/order/${order.id}" style="display: inline-block; padding: 12px 28px; background: #0070f3; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">
									Ver información de la compra
								</a>
								<p style="color: #888; font-size: 13px; margin-top: 32px;">
									Si el botón no te redirige a la página este es el url<br>
									${PUBLIC_BASE_URL}/order/${order.id}
								</p>
								<p style="color: #888; font-size: 13px; margin-top: 32px;">
									¡Gracias por confiar en Neworld!
								</p>
								<p style="color: #b91c1c; font-size: 12px; margin-top: 32px;">
									<strong>Por favor, no respondas a este correo electrónico. Este buzón no es monitoreado.</strong>
								</p>
							</div>
						</div>
					`
				});

				// Eliminar el carrito
				await prisma.cart.delete({
					where: {
						sessionId: session.id
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
