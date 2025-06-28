import { idGenerate } from "@/lib/generateId";
import { logger } from "@/lib/logger";
import { faker } from "@faker-js/faker";
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
				createdAt: new Date(),
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
				createdAt: new Date(),
			})
			.execute();
	}

	const categories = await db
		.insertInto("category")
		.values(
			Array.from({ length: 5 }).map(() => ({
				id: crypto.randomUUID(),
				title: faker.commerce.department(),
				summary: faker.commerce.productDescription(),
				slug: faker.lorem.slug(),
				storeId: org.id,
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
					storeId: org.id,
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
		await db
			.insertInto("productVariant")
			.values(
				Array.from({ length: 3 + Math.floor(Math.random() * 3) }).map(() => ({
					id: crypto.randomUUID(),
					title: faker.commerce.productName(),
					description: faker.commerce.productDescription(),
					sku: faker.string.alphanumeric(10),
					model: faker.vehicle.model(),
					maxPrice: Math.round(
						Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
					),
					price: Math.round(
						Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
					),
					stockQty: faker.number.int({ min: 1, max: 500 }),
					unit: faker.helpers.arrayElement(["kg", "g", "lb", "oz", "pcs"]),
					product: p.id,
					storeId: org.id,
				})),
			)
			.returningAll()
			.execute();
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
						id: crypto.randomUUID(),
						title: faker.commerce.productName(),
						quantity: faker.number.int({ min: 1, max: 100 }),
						thumbnail: faker.image.urlPicsumPhotos(),
						variant: {
							id: crypto.randomUUID(),
							title: faker.helpers.arrayElement([
								"1kg",
								"4 packs",
								"1 piece",
								"500gm",
								"1L",
							]),
							maxPrice: faker.number.int({ min: 1, max: 100 }),
							price: faker.number.int({ min: 1, max: 100 }),
						},
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
					orderedBy: user.id,
					currency: "inr",
					delivery: {
						trackingId: crypto.randomUUID(),
						partnerName: "KungFu Panda",
						partnerId: crypto.randomUUID(),
					},
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
					deliveryInstruction: faker.lorem.paragraph(),
					storeInstructions: faker.lorem.paragraph(),
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
				}),
			),
		)
		.returningAll()
		.execute();
};

async function main() {
	const users = await db
		.selectFrom("user")
		.where("email", "in", ["kundanmbhosale@gmail.com"])
		.selectAll()
		.execute();

	if (users.length === 0) {
		await db.deleteFrom("store").execute();
	}
	await db.deleteFrom("productVariant").execute();
	await db.deleteFrom("product").execute();
	await db.deleteFrom("category").execute();
	await db.deleteFrom("orders").execute();
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
