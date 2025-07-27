import { db } from "@/db";
import env from "@/env";
import { updateSession } from "@/helpers/session";
import { getStore } from "@/helpers/store";
import { ERR_CODES, HTTPError } from "@/lib/exception";
import { STORE_ROLES } from "@/middlewares/auth";
import { zValidator } from "@/middlewares/validator";
import { emailSchema, phoneSchema, timeSchema } from "@/schema/common";
import { sendTransactionalEmail } from "@/services/ses";
import type { ServerContext } from "@/types";
import { addSeconds } from "date-fns";
import { Hono } from "hono";
import { z } from "zod";
import { coreAddressSchema } from "../loggedRoutes/address";

export const storeSchema = z.object({
	name: z.string(),
	email: emailSchema,
	phone: phoneSchema,
	image: z.string().optional(),
	address: coreAddressSchema,
	payments: z
		.object({
			upiIds: z.array(z.object({ name: z.string(), id: z.string() })).min(1),
		})
		.optional(),
	bio: z.string(),
	handle: z.string(),
	openingHour: timeSchema,
	closingHour: timeSchema,
	deliveryDistance: z.number().int().min(0).max(100),
	freeDeliveryDistance: z.number().int().min(0).max(100),
	deliveryChargePerKm: z.number().int().min(0).max(50),
	refunds: z.object({
		enabled: z.boolean(),
		content: z.string(),
	}),
	replacements: z.object({
		enabled: z.boolean(),
		content: z.string(),
	}),
	gstTax: z
		.enum(["0", "5", "12", "18", "27"])
		.transform((val) => Number.parseInt(val)),
});

const route = new Hono<ServerContext>()
	.get("/", async (c) => {
		const session = c.get("session");

		if (!session?.activeStoreId) {
			throw new HTTPError(401, { code: ERR_CODES.NO_ACTIVE_STORE });
		}

		const result = await db
			.selectFrom("store")
			.where("id", "=", session?.activeStoreId!)
			.selectAll()
			.executeTakeFirst();

		if (!result) {
			throw new HTTPError(401, { code: ERR_CODES.NO_ACTIVE_STORE });
		}

		return c.json(result);
	})
	.patch("/", zValidator("json", storeSchema.partial()), async (c) => {
		const session = c.get("session");
		const values = c.req.valid("json");

		if (Object.keys(values).length === 0) {
			throw new HTTPError(400, { message: "Empty params!" });
		}

		await db
			.updateTable("store")
			.where("id", "=", session?.activeStoreId!)
			.set(values)
			.execute();

		return c.json({ success: true });
	})
	.get("/members", async (c) => {
		const session = c.get("session");
		const [members, invitations] = await Promise.all([
			await db
				.selectFrom("storeMember as m")
				.where("storeId", "=", session?.activeStoreId!)
				.leftJoin("user", "m.userId", "user.id")
				.selectAll(["m"])
				.select([
					"user.name",
					"user.email",
					"user.phoneNumber",
					"user.image",
					"user.id as userId",
				])
				.execute(),
			await db
				.selectFrom("storeInvitation")
				.where("storeId", "=", session?.activeStoreId!)
				.selectAll()
				.execute(),
		]);

		return c.json({ members, invitations });
	})
	.delete(
		"/member/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const { id } = c.req.valid("param");
			const sess = c.get("session");
			const user = c.get("user");

			const member = await db
				.selectFrom("storeMember")
				.where("id", "=", id)
				.where("storeId", "=", sess?.activeStoreId!)
				.selectAll()
				.executeTakeFirst();

			console.log(sess?.activeStoreId, id);

			if (!member) {
				throw new HTTPError(404, { message: "Member not found!" });
			}

			if (member.userId === sess?.userId) {
				throw new HTTPError(400, { message: "You can remove yourself!" });
			}
			if (
				!(["owner", "admin"] satisfies (typeof STORE_ROLES)[number][]).includes(
					sess?.activeStoreRole! as any,
				)
			) {
				throw new HTTPError(401, {
					message:
						"Only members with admin or owner role can remove members form store.",
				});
			}

			if (sess?.activeStoreRole === "admin" && member.role === "owner") {
				throw new HTTPError(401, {
					message: "Admins can't remove owners!",
				});
			}

			const list = await db
				.selectFrom("storeMember")
				.where("storeId", "=", sess?.activeStoreId!)
				.select((eb) => [eb.fn.count<number>("id").as("count")])
				.executeTakeFirst();

			if (!list) {
				throw new HTTPError(401, {
					message: "Unable to count remaining members!",
				});
			}

			if (list.count <= 1) {
				throw new HTTPError(401, {
					message: "You are the only last one left!",
				});
			}

			await db.deleteFrom("storeMember").where("id", "=", id).execute();
			await updateSession(c, {
				session: {
					...(sess as any),
					activeStoreId: null,
					activeStoreRole: null,
				},
				user,
			});
			return c.json({ success: true });
		},
	)
	.post(
		"/invite",
		zValidator(
			"json",
			z.object({ role: z.enum(STORE_ROLES), email: emailSchema }),
		),
		async (c) => {
			const session = c.get("session");
			const user = c.get("user");

			const { role, email } = c.req.valid("json");

			if (email === user!.email) {
				throw new HTTPError(400, { message: "You can't invite yourself!" });
			}

			const defaultExpiration = 60 * 60 * 48; // 48 hours in seconds

			let data = await db
				.selectFrom("storeInvitation")
				.where("email", "=", email)
				.where("storeId", "=", session?.activeStoreId!)
				.selectAll()
				.executeTakeFirst();

			if (!data) {
				const expiresAt = addSeconds(new Date(), defaultExpiration);
				data = await db
					.insertInto("storeInvitation")
					.values({
						id: crypto.randomUUID(),
						status: "pending",
						expiresAt,
						inviterId: session?.userId!,
						role,
						email,
						storeId: session?.activeStoreId!,
					})
					.returningAll()
					.executeTakeFirst();
			}

			if (!data) {
				throw new HTTPError(400, { message: "Failed to create invitation." });
			}

			const inviteLink = `${env.VITE_MERCHANT_URL}/accept-invitation/${data.id}`;

			const store = await getStore(data?.storeId);

			await sendTransactionalEmail({
				to: data.email,
				subject: `Invitation to join ${store.name}`,
				body: `You have been invited to join ${store.name} as ${data.role}. Click the link to join: ${inviteLink}, invitation will expire in 48 hrs.`,
			});

			return c.json({ success: true });
		},
	)
	.get(
		"/invitation/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const { id } = c.req.valid("param");

			const inv = await db
				.selectFrom("storeInvitation as si")
				.where("si.id", "=", id)
				.leftJoin("store as s", "s.id", "si.storeId")
				.selectAll(["si"])
				.select(["s.image as storeImage", "s.name as storeName"])
				.executeTakeFirst();

			if (!inv) {
				throw new HTTPError(404, { message: "No invitation found!" });
			}

			return c.json(inv);
		},
	)
	.delete(
		"/invitation/:id",
		zValidator("param", z.object({ id: z.string().uuid() })),
		async (c) => {
			const { id } = c.req.valid("param");

			await db.deleteFrom("storeInvitation").where("id", "=", id).execute();
			return c.json({ success: true });
		},
	);

export { route as merchantStoreRoute };
