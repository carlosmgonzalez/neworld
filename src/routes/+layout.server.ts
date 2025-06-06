import prisma from '$lib/prisma/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const whatsappNumber = await prisma.config.findUnique({
		where: {
			configKey: 'whatsapp_number'
		}
	});

	return {
		whatsappNumber: Number(whatsappNumber ?? '1164708561')
	};
};
