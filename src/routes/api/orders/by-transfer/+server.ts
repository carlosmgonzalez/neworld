import { PUBLIC_BASE_URL } from '$env/static/public';
import prisma from '@/lib/prisma/prisma';
import { resend } from '@/lib/resend';
import { OrderSchema } from '@/lib/schemas/order.schema';
import { error, json, type RequestHandler } from '@sveltejs/kit';
import { z } from 'zod';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const body = await request.json();
		const orderData = await OrderSchema.parseAsync(body);
		const productsIds = orderData.items.map((i) => i.productId);

		const products = await prisma.product.findMany({
			where: {
				id: {
					in: productsIds
				}
			}
		});

		if (productsIds.length > products.length) {
			return json({
				message: `Some or all of the products with these ids ${productsIds} were not found`
			});
		}

		await Promise.all(
			orderData.items.map((item) => {
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

		let totalPrice = orderData.items.reduce((acc, item) => {
			const price = products.find((pr) => pr.id === item.productId)!.price;
			acc += price * item.quantity;
			return acc;
		}, 0);

		const totalItems = orderData.items.reduce((acc, item) => acc + item.quantity, 0);

		const existCoupon = await prisma.coupon.findUnique({
			where: {
				code: orderData.coupon,
				active: true
			}
		});

		if (existCoupon) {
			if (existCoupon.discountType === 'PERCENTAGE') {
				totalPrice = totalPrice * ((100 - Number(existCoupon.discountValue)) / 100);
			}
		}

		const shippingPrice = await prisma.config.findFirst({
			where: {
				configKey: 'standard_shipping_price'
			}
		});

		if (shippingPrice && shippingPrice.type === 'number') {
			totalPrice += Number(shippingPrice.value) * totalItems;
		}

		const order = await prisma.order.create({
			data: {
				totalPrice: totalPrice * 0.95,
				totalItems,
				byTransfer: true,
				name: orderData.name,
				lastname: orderData.lastname,
				email: orderData.email,
				phone: orderData.phone,
				dni: orderData.dni,
				province: orderData.province,
				locality: orderData.locality,
				address: orderData.address,
				zipCode: orderData.zipCode,
				couponId: existCoupon ? existCoupon.id : null,
				OrderItem: {
					createMany: {
						data: orderData.items.map(({ productId, quantity }) => {
							return {
								productId,
								quantity,
								price: products.find((p) => p.id === productId)!.price
							};
						})
					}
				}
			},
			include: {
				OrderItem: {
					select: {
						productId: true,
						price: true,
						quantity: true
					}
				}
			}
		});

		await resend.emails.send({
			from: 'Neworld <diegogonzalez@neworld.com.ar>',
			to: [orderData.email],
			bcc: ['carlosmgonzalez1998@gmail.com', 'diegoalejandrogonzalezcardona@gmail.com'],
			subject: 'Neworld - Información de compra',
			html: `
				<div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px 0;">
					<div style="max-width: 480px; margin: 0 auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); padding: 32px; text-align: center;">
						<h1 style="color: #1a202c; margin-bottom: 16px;">¡Gracias por tu compra!</h1>
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

		return json({ order });
	} catch (err) {
		console.log(err);
		if (err instanceof z.ZodError) {
			return json({ issues: err.issues }, { status: 400 });
		}
		return error(400, 'Something went wrong while creating the order');
	}
};
