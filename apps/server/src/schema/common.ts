import { z } from "zod";

export const listZodSchema = z.object({
	limit: z.coerce.number().max(50),
	page: z.coerce.number().min(1),
	q: z.string().optional(),
});
