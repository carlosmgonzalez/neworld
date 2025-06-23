import prisma from '$lib/prisma';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Session } from '@prisma/client';

export const load: PageServerLoad = async ({ params }) => {
	const id = params.slug;

	try {
		const product = await prisma.product.findUnique({
			where: {
				id
			},
			include: {
				ProductImages: true,
				Review: true,
				ProductInfoImages: true
			}
		});

		return {
			ok: true,
			product
		};
	} catch (err) {
		console.log(err);
		return {
			ok: false,
			product: null
		};
	}
};

export const actions = {
	addProduct: async ({ locals, request }) => {
		const form = await request.formData();
		const productId = form.get('productId') as string;
		const quantity = form.get('quantity') as string;

		const session = locals.session as Session;

		const cart = await prisma.cart.findFirst({
			where: {
				sessionId: session.id
			}
		});

		if (cart) {
			const cartItem = await prisma.cartItem.findFirst({
				where: {
					cartId: cart.id,
					productId: productId
				}
			});

			if (cartItem) {
				await prisma.cartItem.updateMany({
					where: {
						cartId: cart.id,
						productId
					},
					data: {
						quantity: {
							increment: +quantity
						}
					}
				});
			} else {
				await prisma.cartItem.create({
					data: {
						cartId: cart.id,
						productId,
						quantity: +quantity
					}
				});
			}
		} else {
			await prisma.cart.create({
				data: {
					sessionId: session.id,
					CartItem: {
						create: {
							productId,
							quantity: +quantity
						}
					}
				}
			});
		}
	}
} satisfies Actions;
