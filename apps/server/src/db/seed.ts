import { logger } from "@/lib/logger";
import { faker } from "@faker-js/faker";
import { db, dbClient } from ".";

async function main() {
	await db.deleteFrom("product_variant").execute();
	await db.deleteFrom("product").execute();
	await db.deleteFrom("category").execute();
	await db.deleteFrom("org").execute();

	const [newOrg] = await db
		.insertInto("org")
		.values({
			id: crypto.randomUUID(),
			name: faker.company.name(),
			slug: faker.lorem.slug(),
			logo: faker.image.urlLoremFlickr({ category: "business" }), // Simulated logo URL
			created_at: new Date(),
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
				organization_id: newOrg.id,
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
				organization_id: newOrg.id,
				keywords: Array.from({ length: 3 }, () =>
					faker.commerce.productAdjective(),
				),
				in_stock: faker.datatype.boolean(),
			})),
		)
		.returningAll()
		.execute();

	for (const p of products) {
		await db
			.insertInto("product_variant")
			.values(
				Array.from({ length: 3 + Math.floor(Math.random() * 3) }).map(() => ({
					id: faker.number.bigInt() as any,
					title: faker.commerce.productName(),
					description: faker.commerce.productDescription(),
					sku: faker.string.alphanumeric(10),
					model: faker.vehicle.model(),
					max_price: Math.round(
						Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
					),
					price: Math.round(
						Number(faker.commerce.price({ min: 100, max: 1000, dec: 0 })),
					),
					qty: faker.number.int({ min: 1, max: 500 }),
					unit: faker.helpers.arrayElement(["kg", "g", "lb", "oz", "pcs"]),
					product: p.id,
					organization_id: newOrg.id,
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
