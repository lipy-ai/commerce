import { faker } from "@faker-js/faker";

export const fakeTableData = () => {
	const count = Number.parseInt("100", 10);
	const statuses = ["active", "inactive", "pending"];
	const departments = ["engineering", "marketing", "sales", "design"];

	const generateSubRows = (
		count: number,
		parentId: number,
		level: number,
	): any[] => {
		if (level > 2) return [];
		return Array.from({ length: count }, (_, j) => {
			const newId = parentId * 100 + j + 1;
			return {
				id: newId,
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				age: faker.number.int({ min: 20, max: 70 }),
				visits: faker.number.int({ min: 0, max: 100 }),
				status: faker.helpers.arrayElement(statuses),
				progress: faker.number.int({ min: 0, max: 100 }),
				department: faker.helpers.arrayElement(departments),
				createdAt: faker.date.past().toISOString(),
				subRows: generateSubRows(2, newId, level + 1),
				avatar: faker.image.avatar(),
			};
		});
	};

	const data = Array.from({ length: count }, (_, i) => {
		const id = i + 1;
		return {
			id,
			firstName: faker.person.firstName(),
			lastName: faker.person.lastName(),
			age: faker.number.int({ min: 20, max: 70 }),
			visits: faker.number.int({ min: 0, max: 100 }),
			status: faker.helpers.arrayElement(statuses),
			progress: faker.number.int({ min: 0, max: 100 }),
			department: faker.helpers.arrayElement(departments),
			createdAt: faker.date.past().toISOString(),
			subRows: generateSubRows(2, id, 1),
			avatar: faker.image.avatar(),
		};
	});

	return data;
};
