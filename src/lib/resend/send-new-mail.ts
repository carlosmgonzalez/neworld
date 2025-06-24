import { resend } from '.';

interface Props {
	to: string[];
	html: string;
	subject: string;
}

export const sendNewEmail = async ({ to, html, subject }: Props) => {
	await resend.emails.send({
		from: 'Neworld <no-responder@neworld.com.ar>',
		to,
		bcc: ['consultasneworld@gmail.com'],
		subject,
		html
	});
};
