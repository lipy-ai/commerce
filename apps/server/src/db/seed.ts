import { idGenerate } from "@/lib/generateId";
import { logger } from "@/lib/logger";
import { faker } from "@faker-js/faker";
import { sql } from "kysely";
import { type DBTypes, db, dbClient } from ".";
import { ORDER_STATUS, PRODUCT_TYPE } from "./schema";

const create = async (user: DBTypes["user"]) => {
	let org = await db
		.selectFrom("store as s")
		.leftJoin("storeMember as m", "m.storeId", "s.id")
		.where("m.userId", "=", user.id)
		.selectAll(["s"])
		.executeTakeFirst();
	if (!org) {
		const [newOrg] = await db
			.insertInto("store")
			.values({
				id: crypto.randomUUID(),
				name: faker.company.name(),
				handle: faker.lorem.slug(),
				image: faker.image.urlPicsumPhotos(), // Simulated logo URL
				createdAt: sql`now()`,
				active: true,
			})
			.returningAll()
			.execute();
		if (!newOrg) throw new Error("Failed to create store");

		org = newOrg;

		await db
			.insertInto("storeMember")
			.values({
				id: crypto.randomUUID(),
				storeId: org.id!,
				userId: user.id,
				role: "owner",
				createdAt: sql`now()`,
			})
			.execute();
	}

	const users = await db
		.insertInto("user")
		.values(
			Array.from({ length: faker.number.int({ min: 1, max: 100 }) }).map(
				() => ({
					id: crypto.randomUUID(),
					name: faker.person.fullName(),
					phoneNumber: faker.phone.number({ style: "international" }),
					email: faker.internet.email(),
					phoneNumberVerified: false,
					emailVerified: false,
					createdAt: sql`now()`,
					updatedAt: sql`now()`,
				}),
			),
		)
		.returning("id")
		.execute();

	const customers = users.map((u) => ({
		userId: u.id,
		storeId: org.id,
	}));

	await db.insertInto("customer").values(customers).execute();

	const categories = await db
		.insertInto("category")
		.values(
			Array.from({ length: 5 }).map(() => ({
				id: crypto.randomUUID(),
				title: faker.commerce.department(),
				summary: faker.commerce.productDescription(),
				slug: faker.lorem.slug(),
			})),
		)
		.returningAll()
		.execute();

	const catIds = categories.map((c) => c.id);

	const products = await db
		.insertInto("product")
		.values(
			Array.from({ length: faker.number.int({ min: 0, max: 100 }) }).map(
				() => ({
					id: crypto.randomUUID(),
					title: faker.commerce.productName(),
					type: faker.helpers.arrayElement(PRODUCT_TYPE),
					summary: faker.commerce.productDescription(),
					price: Number(faker.commerce.price()),
					maxPrice: Number(faker.commerce.price()),
					category: faker.helpers.arrayElement(catIds),
					thumbnail: faker.image.urlPicsumPhotos(),
					highlights: Array.from({ length: 5 }, () => ({
						label: faker.commerce.productAdjective(),
						value: faker.commerce.productAdjective(),
					})),
					information: Array.from({ length: 5 }, () => ({
						label: faker.commerce.productAdjective(),
						value: faker.commerce.productAdjective(),
					})),
					images: Array.from({ length: 5 }, () =>
						faker.image.urlPicsumPhotos(),
					),
				}),
			),
		)
		.returningAll()
		.execute();

	for (const p of products) {
		const variants = await db
			.insertInto("productVariant")
			.values(
				Array.from({ length: 3 + Math.floor(Math.random() * 3) }).map(() => ({
					id: crypto.randomUUID(),

					// sku: faker.string.alphanumeric(10),

					price: Math.round(
						Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
					),
					// stockQty: faker.number.int({ min: 1, max: 500 }),

					unit: faker.helpers.arrayElement([
						"1kg",
						"250gm",
						"4 lb",
						"2 oz",
						"1 pcs",
					]),

					productId: p.id,
				})),
			)
			.returningAll()
			.execute();

		for (const v of variants) {
			await db
				.insertInto("storeInventory")
				.values({
					id: crypto.randomUUID(),
					storeId: org.id!,
					price: Math.round(
						Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
					),
					stock: Math.round(
						Number(faker.commerce.price({ min: -1, max: 1000, dec: 0 })),
					),
				})
				.execute();
		}
	}

	const orders = await db
		.insertInto("orders")
		.values(
			Array.from({ length: faker.number.int({ min: 0, max: 100 }) }).map(
				() => ({
					pk: crypto.randomUUID(),
					id: idGenerate(),
					items: Array.from({
						length: faker.number.int({ min: 1, max: 5 }),
					}).map(() => ({
						inventoryId: crypto.randomUUID(),
						variantId: crypto.randomUUID(),
						productId: crypto.randomUUID(),

						title: faker.commerce.productName(),
						qty: faker.number.int({ min: 1, max: 100 }),
						thumbnail: faker.image.urlPicsumPhotos(),
						unit: faker.helpers.arrayElement([
							"1kg",
							"4 packs",
							"1 piece",
							"500gm",
							"1L",
						]),
						maxPrice: faker.number.int({ min: 1, max: 100 }),
						price: faker.number.int({ min: 1, max: 100 }),
					})),
					taxes: Array.from({
						length: faker.number.int({ min: 0, max: 5 }),
					}).map(() => ({
						id: crypto.randomUUID(),
						name: faker.helpers.arrayElement([
							"gst",
							"vat",
							"surge",
							"handling fee",
							"packing fee",
						]),
						amount: faker.number.int({ min: 1, max: 100 }),
					})),
					discounts: Array.from({
						length: faker.number.int({ min: 0, max: 5 }),
					}).map(() => ({
						id: crypto.randomUUID(),
						name: faker.helpers.arrayElement([
							"first-order",
							"Holiday50",
							"Holi Special",
						]),
						amount: faker.number.int({ min: 1, max: 100 }),
					})),
					storeId: org.id,
					userId: user.id,
					currency: "inr",
					delivery: {
						trackingId: crypto.randomUUID(),
						partnerName: "KungFu Panda",
						partnerId: crypto.randomUUID(),
					},
					customerDetails: {
						name: faker.person.fullName(),
						phone: faker.phone.number({ style: "international" }),
						address: {
							id: crypto.randomUUID(),
							name: faker.person.fullName(),
							tag: faker.helpers.arrayElement(["home", "work", "other"]),
							line1: faker.location.street(),
							line2: faker.location.streetAddress(),
							city: faker.location.city(),
							state: faker.location.state(),
							country: faker.location.country(),
							postalCode: faker.location.zipCode(),
							phone: faker.phone.number(),
							lat: faker.location.latitude(),
							lng: faker.location.longitude(),
							metadata: {
								building: faker.location.buildingNumber(),
							},
						},
					},

					customerInstructions: {
						delivery: faker.lorem.paragraph(),
						store: faker.lorem.paragraph(),
					},
					paymentMethod: faker.helpers.arrayElement(["cod", "upi", "card"]),
					orderedAt: faker.date.anytime(),
					cancelledAt: faker.helpers.maybe(() => faker.date.anytime()),
					refundedAt: faker.helpers.maybe(() => faker.date.anytime()),
					deliveredAt: faker.helpers.maybe(() => faker.date.anytime()),
					deliveryAgentAssignedAt: faker.helpers.maybe(() =>
						faker.date.anytime(),
					),
					status: faker.helpers.arrayElement(ORDER_STATUS),
					totalTaxAmount: faker.number.int({ min: 1, max: 1000 }),
					totalDiscountAmount: faker.number.int({ min: 1, max: 1000 }),
					maxItemTotalAmount: faker.number.int({ min: 1, max: 1000 }),
					itemTotalAmount: faker.number.int({ min: 1, max: 1000 }),
					totalAmount: faker.number.int({ min: 1, max: 1000 }),
					amountSaved: faker.number.int({ min: 1, max: 1000 }),
					timeline: [],
				}),
			),
		)
		.returningAll()
		.execute();
};

async function main() {
	const adminEmails = ["kundanmbhosale@gmail.com"];
	const users = await db
		.selectFrom("user")
		.where("email", "in", adminEmails)
		.selectAll()
		.execute();

	if (users.length === 0) {
		await db.deleteFrom("store").execute();
	}
	await db.deleteFrom("productVariant").execute();
	await db.deleteFrom("product").execute();
	await db.deleteFrom("category").execute();
	await db.deleteFrom("orders").execute();
	await db.deleteFrom("customer").execute();
	await db.deleteFrom("user").where("email", "not in", adminEmails).execute();

	for (const user of users) {
		await create(user);
	}
}

main()
	.then(() => {
		logger.info("✅ Successfully seeded data.");
		return dbClient.destroy(); // If using `pg` or a raw client
	})
	.catch((e) => {
		logger.error("❌ Failed to seed data.");
		logger.error(e);
		process.exit(1);
	});
