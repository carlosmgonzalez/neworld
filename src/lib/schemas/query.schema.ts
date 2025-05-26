import { z } from 'zod';

const QuerySchema = z.object({
	limit: z.string().transform((val, ctx) => {
		const trimmed = val.trim();
		const parsed = parseInt(trimmed, 10);

		if (isNaN(parsed) || String(parsed) !== val) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Expected a number string, but received an invalid format'
			});
			return z.NEVER;
		}

		return parsed;
	}),
	offset: z.string().transform((val, ctx) => {
		const trimmed = val.trim();
		const parsed = parseInt(trimmed, 10);

		if (isNaN(parsed) || String(parsed) !== val) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Expected a number string, but received an invalid format'
			});
			return z.NEVER;
		}

		return parsed;
	})
});

export default QuerySchema;
