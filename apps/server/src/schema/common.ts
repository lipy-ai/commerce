import { parsePhoneNumber } from "libphonenumber-js/max";
import Mailchecker from "mailchecker";
import { z } from "zod";

export const listZodSchema = z.object({
	limit: z.coerce.number().max(100),
	page: z.coerce.number().min(1),
	q: z.string().optional(),
});

export const emailSchema = z
	.string()
	.email()
	.refine((e) => Mailchecker.isValid(e), {
		message: "Invalid Email!",
	});

export const phoneSchema = z
	.string()
	.transform((input) => {
		try {
			return {
				data: parsePhoneNumber(input, { defaultCountry: "IN" }).number || null,
				err: null,
			};
		} catch (e: any) {
			return { data: null, err: e?.message || "Invalid phone number!" };
		}
	})
	.superRefine((parsed, ctx) => {
		if (!parsed.data || parsed.err) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: parsed.err,
			});
			return;
		}
	})
	.transform((t) => t.data);

export const timeSchema = z
	.string()
	.regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Must be in HH:MM 24-hour format");
