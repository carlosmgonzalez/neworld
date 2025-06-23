import prisma from '@/lib/prisma';
import type { Actions } from '@sveltejs/kit';

export const actions = {
	removeOne: async ({ request, locals }) => {
		const form = await request.formData();
		const productId = form.get('productId') as string;

		const session = locals.session;

		console.log('remove one');

		try {
			const cart = await prisma.cart.findUnique({
				where: {
					sessionId: session.id
				}
			});

			if (cart) {
				const cartItem = await prisma.cartItem.findFirst({
					where: {
						cartId: cart.id,
						productId
					}
				});

				if (cartItem && cartItem.quantity > 1) {
					await prisma.cartItem.updateMany({
						where: {
							cartId: cart.id,
							productId
						},
						data: {
							quantity: {
								decrement: 1
							}
						}
					});
				} else {
					await prisma.cartItem.deleteMany({
						where: {
							cartId: cart.id,
							productId
						}
					});
				}
			}
		} catch (error) {
			console.log(error);
		}
	},
	addOne: async ({ request, locals }) => {
		const form = await request.formData();
		const productId = form.get('productId') as string;

		const session = locals.session;

		const cart = await prisma.cart.findUnique({
			where: {
				sessionId: session.id
			}
		});

		if (cart) {
			const cartItem = await prisma.cartItem.findFirst({
				where: {
					cartId: cart.id,
					productId
				},
				include: {
					product: true
				}
			});

			if (cartItem && cartItem.product.stock > 1) {
				await prisma.cartItem.updateMany({
					where: {
						cartId: cart.id,
						productId
					},
					data: {
						quantity: {
							increment: 1
						}
					}
				});
			}
		}
	},
	removeAll: async ({ locals, request }) => {
		const form = await request.formData();
		const productId = form.get('productId') as string;

		const session = locals.session;

		const cart = await prisma.cart.findUnique({
			where: {
				sessionId: session.id
			}
		});

		if (cart) {
			await prisma.cartItem.deleteMany({
				where: {
					cartId: cart.id,
					productId
				}
			});
		}
	}
} satisfies Actions;
