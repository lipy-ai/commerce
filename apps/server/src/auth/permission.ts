// import { getCachedOrgUser } from "@/cache/org";
// import { HTTPException } from "hono/http-exception";
// export const roles = ["owner", "manager", "customer"] as const;

// export const statements = {
// 	owner: ["list", "read", "create", "update", "delete"],
// 	manager: ["list", "read", "create", "update", "delete"],
// 	delivery: ["list", "read", "create", "update", "delete"],
// } as const;

// export type Roles = (typeof roles)[number];

// export type Statements = keyof typeof statements;
// type NonUndefined<T> = T extends undefined ? never : T;

// type Mutable<T> = T extends ReadonlyArray<infer U> ? U[] : T;

// export type RoleWithStatement = {
// 	[T in Statements]?: Mutable<(typeof statements)[T]>;
// };

// export type RolesWithPermission = {
// 	[T in Roles]?: RoleWithStatement;
// };

// const ownerRole: RoleWithStatement = {
// 	store: ["read", "create", "update", "delete"],
// 	subscription: ["read", "create", "update", "delete"],
// 	employee: ["list", "read", "create", "update", "delete"],
// 	job: ["read", "create", "update", "delete"],
// };

// const managerRole: RoleWithStatement = {
// 	org: ["read"],
// 	subscription: [],
// };

// const customerRole: RoleWithStatement = {
// 	org: [],
// 	subscription: [],
// };

// const rolesWithPermission: RolesWithPermission = {
// 	owner: ownerRole,
// 	manager: managerRole,
// 	customer: customerRole,
// };

// export const hasPermission = async ({
// 	storeId,
// 	userId,
// 	scope,
// }: {
// 	storeId: DBTypes["store"]["id"];
// 	userId: DBTypes["user"]["id"];
// 	scope?: RoleWithStatement;
// }) => {
// 	const data = await getCachedOrgUser(orgId, userId);

// 	if (scope) {
// 		Object.keys(scope).forEach((k) => {
// 			const userStatement = rolesWithPermission[data.member.role as Roles];

// 			if (userStatement) {
// 				const userStatementPerms = userStatement[k as Statements];
// 				const currStatements = scope[k as Statements];

// 				if (
// 					currStatements &&
// 					userStatementPerms &&
// 					currStatements.every((item) => userStatementPerms.includes(item))
// 				)
// 					return true;
// 			}

// 			throw new HTTPException(401, {
// 				message: "Insufficient permissions",
// 				cause: `Required scopes - [${Object.keys(scope)
// 					.map((f: any) => scope[f]?.map((k) => `${f}:${k}`).join(","))
// 					.join(",")}]`,
// 			});
// 		});
// 	}
// 	return data;
// };

// import { createAccessControl } from "better-auth/plugins/access";
// import {
// 	adminAc,
// 	defaultStatements,
// 	memberAc,
// 	ownerAc,
// } from "better-auth/plugins/organization/access";
// import { DBTypes } from "@/db";

// const statement = {
// 	...defaultStatements,
// } as const;

// const ac = createAccessControl(statement);

// // const member = ac.newRole({
// //     project: ["create"],
// // });

// const admin = ac.newRole({
// 	...adminAc.statements,
// });

// const owner = ac.newRole({
// 	...ownerAc.statements,
// });

// const staff = ac.newRole({
// 	...memberAc.statements,
// });

// const deliveryAgent = ac.newRole({
// 	...memberAc.statements,
// });

// export { ac, statement, admin, owner, staff, deliveryAgent };
