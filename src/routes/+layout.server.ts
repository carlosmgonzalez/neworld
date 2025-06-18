import prisma from '$lib/prisma';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	const whatsappNumber = await prisma.config.findUnique({
		where: {
			configKey: 'whatsapp_number'
		}
	});

	return {
		whatsappNumber: whatsappNumber ? whatsappNumber.value : '1164708561'
	};
};
