import prisma from '$lib/prisma';
import type { Session } from '@prisma/client';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const session = locals.session as Session;

	const cart = await prisma.cart.findFirst({
		where: {
			sessionId: session.id
		},
		include: {
			CartItem: {
				include: {
					product: true
				}
			}
		}
	});

	const userInfo = await prisma.userInfo.findFirst({
		where: {
			sessionId: session.id
		}
	});

	const whatsappNumber = await prisma.config.findUnique({
		where: {
			configKey: 'whatsapp_number'
		}
	});

	return {
		whatsappNumber: whatsappNumber ? whatsappNumber.value : '1164708561',
		cart,
		userInfo
	};
};
