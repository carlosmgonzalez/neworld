import { error, json, type RequestHandler } from '@sveltejs/kit';
import { PUBLIC_BASE_URL } from '$env/static/public';
import { ACCESS_TOKEN_MP, SECRET_KEY_MP } from '$env/static/private';
import prisma from '$lib/prisma';
import type { PaymentData } from '$lib/interfaces/payment-data.interface';
import { sendNewEmail } from '$lib/resend/send-new-mail';
import crypto from 'node:crypto';

export const POST: RequestHandler = async ({ url, request }) => {
	const body = await request.json();
	const dataID = url.searchParams.get('data.id');
	const xSignature = request.headers.get('x-signature');
	const xRequestId = request.headers.get('x-request-id');

	if (!xSignature || !xRequestId) return error(404, { message: 'No autorizado' });

	const parts = xSignature.split(',');
	let ts;
	let hash;

	parts.forEach((part) => {
		const [key, value] = part.split('=');
		if (key && value) {
			const trimmedKey = key.trim();
			const trimmedValue = value.trim();

			if (trimmedKey === 'ts') {
				ts = trimmedValue;
			} else if (trimmedKey === 'v1') {
				hash = trimmedValue;
			}
		}
	});

	const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;

	const hmac = crypto.createHmac('sha256', SECRET_KEY_MP);
	hmac.update(manifest);
	const sha = hmac.digest('hex');

	if (sha !== hash) return error(404, { message: 'No autorizado' });

	if (body.type === 'payment') {
		const res = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${ACCESS_TOKEN_MP}`
			}
		});

		const paymentData: PaymentData = await res.json();

		if (paymentData.status === 'approved' && paymentData.status_detail === 'accredited') {
			const orderId = paymentData.metadata.order_id;
			const userEmail = paymentData.metadata.user_email;
			const sessionId = paymentData.metadata.session_id;

			// Actualizar el estado de la orden a "PAID" y ademas marcar la orden como pagada
			await prisma.order.update({
				where: {
					id: orderId
				},
				data: {
					status: 'PAID',
					paid: true,
					paidAt: new Date()
				}
			});

			// Eliminar los productos vendidos del stock:
			const orderData = await prisma.order.findUnique({
				where: {
					id: orderId
				},
				include: {
					OrderItem: true
				}
			});

			if (orderData) {
				await Promise.all(
					orderData.OrderItem.map((item) => {
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
			}

			//Eliminar el carrito de compras
			await prisma.cart.delete({
				where: {
					sessionId
				}
			});

			//Enviar el mail al comprador y a nosotros sobre la compra
			await sendNewEmail({
				to: [userEmail],
				subject: 'Neworld - Información de compra',
				html: `
					<div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
						<div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 32px; text-align: center;">
							<h1 style="color: #1a202c; margin-bottom: 16px;">¡Gracias por tu compra!</h1>
							<p style="color: #333; font-size: 16px; margin-bottom: 24px;">
								Puedes ver la información de tu compra haciendo clic en el siguiente enlace:
							</p>
							<a href="${PUBLIC_BASE_URL}/order/${orderId}" style="display: inline-block; padding: 12px 28px; background: #0070f3; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">
								Ver información de la compra
							</a>
							<p style="color: #888; font-size: 13px; margin-top: 32px;">
								Si el botón no te redirige a la página este es el url<br>
								${PUBLIC_BASE_URL}/order/${orderId}
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
		}
	}

	return json({ oK: true }, { status: 200 });
};
