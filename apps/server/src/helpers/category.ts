import { db } from "@/db";
import { delCache } from "@/services/cache";

const key = "category";

export const categoryCacheKey = (title: string) => `${key}:${title}`;

export const getCategory = async (title: string) => {
	// return await getOrCache({
	// 	key: categoryCacheKey(title),
	// 	cacheMissFn: async () =>
	// 		await db
	// 			.selectFrom("category as c")
	// 			.where("c.title", "=", title)
	// 			.selectAll()
	// 			.execute(),
	// 	errorName: "Category not found!",
	// });
};

export const getAllCategory = async () => {
	const parents = await db
		.selectFrom("category as parent")
		.selectAll("parent")
		.select((eb) =>
			eb
				.selectFrom("category as child")
				.select((eb) => eb.fn.jsonAgg("child").as("items"))
				.whereRef("child.parentId", "=", "parent.id")
				.as("items"),
		)
		.where("parent.parentId", "is", null)
		.execute();

	return parents;
};

export const delStore = async (title: string) => {
	await delCache(`${key}:${title}`);
};
