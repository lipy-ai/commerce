import { logger } from "@/lib/logger";
import { faker } from "@faker-js/faker";
import { type DBTypes, db, dbClient } from ".";
import { PRODUCT_TYPE } from "./schema";

const create = async (user: DBTypes["user"]) => {
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

	await db
		.insertInto("storeMember")
		.values({
			id: crypto.randomUUID(),
			storeId: newOrg.id,
			userId: user.id,
			role: "owner",
			createdAt: new Date(),
		})
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
				type: faker.helpers.arrayElement(PRODUCT_TYPE),
				summary: faker.commerce.productDescription(),
				price: Number(faker.commerce.price()),
				maxPrice: Number(faker.commerce.price()),
				category: faker.helpers.arrayElement(catIds),
				storeId: newOrg.id,
				thumbnail: faker.image.urlPicsumPhotos(),
				highlights: Array.from({ length: 5 }, () => ({
					label: faker.commerce.productAdjective(),
					value: faker.commerce.productAdjective(),
				})),
				information: Array.from({ length: 5 }, () => ({
					label: faker.commerce.productAdjective(),
					value: faker.commerce.productAdjective(),
				})),
				images: Array.from({ length: 5 }, () => faker.image.urlPicsumPhotos()),
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
};

async function main() {
	await db.deleteFrom("productVariant").execute();
	await db.deleteFrom("product").execute();
	await db.deleteFrom("category").execute();
	await db.deleteFrom("store").execute();

	const users = await db
		.selectFrom("user")
		.where("email", "in", ["kundanmbhosale@gmail.com"])
		.selectAll()
		.execute();

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
