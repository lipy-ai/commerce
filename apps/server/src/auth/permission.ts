import { getCachedOrgUser } from "@/cache/org";
import { DBTypes } from "@/db";
import { HTTPException } from "hono/http-exception";
export const roles = ["owner", "manager", "customer"] as const;

export const statements = {
  // Org
  owner: ["read", "create", "update", "delete"],
  manager: ["list", "read", "create", "update", "delete"],
  customer: ["read", "create", "update", "delete"],
} as const;

export type Roles = (typeof roles)[number];

export type Statements = keyof typeof statements;
type NonUndefined<T> = T extends undefined ? never : T;

type Mutable<T> = T extends ReadonlyArray<infer U> ? U[] : T;

export type RoleWithStatement = {
  [T in Statements]?: Mutable<(typeof statements)[T]>;
};

export type RolesWithPermission = {
  [T in Roles]?: RoleWithStatement;
};

const ownerRole: RoleWithStatement = {
  org: ["read", "create", "update", "delete"],
  subscription: ["read", "create", "update", "delete"],
  employee: ["list", "read", "create", "update", "delete"],
  job: ["read", "create", "update", "delete"],
};

const managerRole: RoleWithStatement = {
  org: ["read"],
  subscription: [],
};

const customerRole: RoleWithStatement = {
  org: [],
  subscription: [],
};

const rolesWithPermission: RolesWithPermission = {
  owner: ownerRole,
  manager: managerRole,
  customer: customerRole,
};

export const hasPermission = async ({
  orgId,
  userId,
  scope,
}: {
  orgId: DBTypes["org.list"]["id"];
  userId: DBTypes["auth.user"]["id"];
  scope?: RoleWithStatement;
}) => {
  const data = await getCachedOrgUser(orgId, userId);

  if (scope) {
    Object.keys(scope).forEach((k) => {
      const userStatement = rolesWithPermission[data.member.role as Roles];

      if (userStatement) {
        const userStatementPerms = userStatement[k as Statements];
        const currStatements = scope[k as Statements];

        if (
          currStatements &&
          userStatementPerms &&
          currStatements.every((item) => userStatementPerms.includes(item))
        )
          return true;
      }

      throw new HTTPException(401, {
        message: "Insufficient permissions",
        cause: `Required scopes - [${Object.keys(scope)
          .map((f: any) => scope[f]?.map((k) => `${f}:${k}`).join(","))
          .join(",")}]`,
      });
    });
  }
  return data;
};
