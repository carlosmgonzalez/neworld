import prisma from '$lib/prisma';
import { error, type Actions } from '@sveltejs/kit';
import { z } from 'zod/v4';

const formSchema = z.object({
	name: z.string().min(2, { error: 'El nombre debe tener al menos 2 caracteres' }),
	lastname: z.string().min(2, { error: 'El apellido debe tener al menos 2 caracteres' }),
	email: z.email({ error: 'El email debe ser válido' }),
	phone: z.string().min(8, { error: 'El teléfono debe tener al menos 8 caracteres' }),
	address: z.string().min(5, { error: 'La dirección debe tener al menos 5 caracteres' }),
	department: z.string().optional(),
	province: z.string().min(1, { error: 'La provincia debe tener al menos 2 caracteres' }),
	locality: z.string().min(1, { error: 'La localidad no se encuentra en esa provincia' }),
	zipCode: z.string().min(4, { error: 'El código postal debe ser valido' }),
	dni: z
		.string()
		.min(8, { error: 'El DNI debe ser valido' })
		.max(8, { error: 'El DNI debe ser valido' })
});

export const actions = {
	default: async ({ request, locals }) => {
		const session = locals.session;

		const form = await request.formData();

		// Opción 1: Convertir todo el FormData a un objeto (más simple)
		const formData = Object.fromEntries(form.entries());

		const { data, success, error: err } = formSchema.safeParse(formData);

		if (!success) {
			return error(400, {
				message: `Un campo esta vacio, ${err.message}`
			});
		}

		try {
			const userInfo = await prisma.userInfo.findUnique({
				where: {
					sessionId: session.id
				}
			});

			// Remover el campo department ya que no existe en el modelo UserInfo
			const { department, ...userData } = data;

			if (userInfo) {
				await prisma.userInfo.update({
					where: {
						sessionId: session.id
					},
					data: {
						...userData,
						address: userData.address + '-' + department
					}
				});
			} else {
				await prisma.userInfo.create({
					data: {
						...userData,
						address: userData.address + '-' + department,
						sessionId: session.id
					}
				});
			}
		} catch (e) {
			console.log(e);
			return error(500, {
				message: 'Algo salio mal al guardar la informacion del usuario'
			});
		}
	}
} satisfies Actions;
