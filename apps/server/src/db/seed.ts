import { logger } from "@/lib/logger";
import { faker } from "@faker-js/faker";
import { db, dbClient } from ".";

async function main() {
	await db.deleteFrom("productVariant").execute();
	await db.deleteFrom("product").execute();
	await db.deleteFrom("category").execute();
	await db.deleteFrom("store").execute();

	const [newOrg] = await db
		.insertInto("store")
		.values({
			id: crypto.randomUUID(),
			name: faker.company.name(),
			handle: faker.lorem.slug(),
			logo: faker.image.urlLoremFlickr({ category: "business" }), // Simulated logo URL
			createdAt: new Date(),
		})
		.returningAll()
		.execute();

	const categories = await db
		.insertInto("category")
		.values(
			Array.from({ length: 5 }).map(() => ({
				id: crypto.randomUUID(),
				title: faker.commerce.department(),
				summary: faker.commerce.productDescription(),
				slug: faker.lorem.slug(),
				storeId: newOrg.id,
			})),
		)
		.returningAll()
		.execute();

	const catIds = categories.map((c) => c.id);

	const products = await db
		.insertInto("product")
		.values(
			Array.from({ length: 20 }).map(() => ({
				id: crypto.randomUUID(),
				title: faker.commerce.productName(),
				summary: faker.commerce.productDescription(),
				content: faker.lorem.paragraphs({ min: 1, max: 3 }),
				brand: faker.company.name(),
				category: faker.helpers.arrayElement(catIds),
				storeId: newOrg.id,
				keywords: Array.from({ length: 3 }, () =>
					faker.commerce.productAdjective(),
				),
			})),
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
					storeId: newOrg.id,
				})),
			)
			.returningAll()
			.execute();
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
