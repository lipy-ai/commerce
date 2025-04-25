import { sql } from "drizzle-orm";
import { bigint, customType, jsonb, uuid } from "drizzle-orm/pg-core";
import {
  text,
  timestamp,
  boolean,
  pgSchema,
  numeric,
} from "drizzle-orm/pg-core";

// Create a custom type for PostGIS POINT
const geographyPoint = customType<{ data: string }>({
  dataType() {
    return "geography(POINT, 4326)";
  },
});

export const schema = pgSchema("lipy");

export const enableUuidExtension = sql`CREATE EXTENSION IF NOT EXISTS "postgis";`;

export const user = schema.table("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  customerId: text("customer_id"),
  country: text("country"),
  onboarded: boolean("onboarded").notNull().default(false),
  address: text("address"),
});

export const address = schema.table("address", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  tag: text({ enum: ["home", "work", "other"] }).notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country"),
  postalCode: text("postal_code"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // location: geographyPoint("location"),
});

export const account = schema.table("auth_account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = schema.table("auth_verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});
export const session = schema.table("auth_session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const org = schema.table("org", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const orgMember = schema.table("org_member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const orgInvitation = schema.table("org_invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const category = schema.table("category", {
  id: text("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  slug: text("slug"),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const subCategory = schema.table("sub_category", {
  id: text("id").primaryKey(),
  parent: text("category").references(() => category.id, {
    onDelete: "set null",
  }),
  title: text("title"),
  summary: text("summary"),
  slug: text("slug"),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const product = schema.table("product", {
  id: text("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  brand: text("brand"),
  type: text({ enum: ["physical"] }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("0"),
  category: text("category").references(() => category.id, {
    onDelete: "set null",
  }),
  subCategory: text("sub_category").references(() => subCategory.id, {
    onDelete: "set null",
  }),
  organizationId: text("organization_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const productVariant = schema.table("product_variant", {
  id: text("id").primaryKey(),
  title: text("title"),
  product: text("product").references(() => product.id, {
    onDelete: "cascade",
  }),
  unit: numeric("uint"),
  organizationId: text("organization_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const shopCart = schema.table("shop_cart", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organizationId: text("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
  items: jsonb()
    .$type<Array<{ product: string; quantity: string }>>()
    .default([]),
});

export const shopOrders = schema.table("shop_order", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  shopId: text("shop_id").notNull(),
  items: jsonb("items"),
  taxes: jsonb("taxes"),
  address: jsonb("address"),
  total: bigint("total", { mode: "number" }).default(0),
  delivery: jsonb("delivery"),
  payment: jsonb("payment"),
  status: text("status", {
    enum: [
      "ordered",
      "accepted",
      "packed",
      "out_for_delivery",
      "delivered",
      "returned",
      "refunded",
    ],
  }),
});

export const upload = schema.table("upload", {
  id: uuid("id").primaryKey(),
  is_public: boolean("is_public").default(false),
  content_type: text("content_type").notNull(),
  content_length: bigint("content_length", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  path: text("path"),
  url: text("url"),
  uploaded_by: text("uploaded_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organization_id: text("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const dbTables = {
  user,
  address,
  account,
  session,
  verification,
  org,
  orgMember,
  orgInvitation,
  product,
  productVariant,
  shopCart,
  shopOrders,
  upload,
};
