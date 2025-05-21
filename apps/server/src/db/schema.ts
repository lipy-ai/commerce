import { sql } from "drizzle-orm";
import {
  bigint,
  bigserial,
  customType,
  jsonb,
  uuid,
  text,
  timestamp,
  boolean,
  pgSchema,
  integer,
  type AnyPgColumn,
  primaryKey,
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
  id: uuid("id").primaryKey(),
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
  normalizedEmail: text("normalized_email"),
});

export const address = schema.table("address", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  tag: text({ enum: ["home", "work", "other"] }).notNull(),
  line1: text("line1").notNull(),
  line2: text("line2"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country"),
  postal_code: text("postal_code"),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  // location: geographyPoint("location"),
});

export const account = schema.table("auth_account", {
  id: uuid("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: uuid("user_id")
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
  id: uuid("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const session = schema.table("auth_session", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  sessionToken: text("session_token").notNull().unique(),
  expires: timestamp("expires").notNull(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const org = schema.table("org", {
  id: uuid("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const orgMember = schema.table("org_member", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const orgInvitation = schema.table("org_invitation", {
  id: uuid("id").primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => org.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const upload = schema.table("upload", {
  id: uuid("id").primaryKey(),
  is_public: boolean("is_public").default(false),
  content_type: text("content_type").notNull(),
  content_length: bigint("content_length", { mode: "number" }).notNull(),
  name: text("name").notNull(),
  path: text("path"),
  url: text("url"),
  uploaded_by: uuid("uploaded_by")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  organization_id: uuid("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp("created_at").notNull(),
  updated_at: timestamp("updated_at").notNull(),
});

export const category = schema.table("category", {
  id: uuid("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  slug: text("slug").unique(),
  image: text("image"),
  organization_id: uuid("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
});

export const tags = schema.table("tag", {
  id: uuid("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  slug: text("slug"),
  image: text("image"),
  organization_id: uuid("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
});

export const globalProduct = schema.table("global_product", {
  id: uuid("id")
    .primaryKey()
    .references((): AnyPgColumn => product.id, {
      onDelete: "cascade",
    }),
});

export const globalCategory = schema.table("global_category", {
  id: uuid("id")
    .primaryKey()
    .references((): AnyPgColumn => category.id, {
      onDelete: "cascade",
    }),
});

export const globalTag = schema.table("global_tag", {
  id: uuid("id")
    .primaryKey()
    .references((): AnyPgColumn => tags.id, {
      onDelete: "cascade",
    }),
});

export const product = schema.table("product", {
  id: uuid("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  content: text("content"),
  brand: text("brand"),
  category: uuid("category").references(() => category.id, {
    onDelete: "set null",
  }),
  organization_id: uuid("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
  global_product: uuid("organization_id").references(() => globalProduct.id, {
    onDelete: "cascade",
  }),
  keywords: text("keywords").array(),
  default_price: integer("default_price"),
  in_stock: boolean("in_stock").default(false),
});

export const productVariants = schema.table("product_variant", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  sku: text("sku"),
  model: text("model"),
  price: integer("price").default(1),
  qty: integer("qty").default(1),
  unit: text("unit"),
  metadata: jsonb(),
  product: uuid("product").references(() => product.id, {
    onDelete: "cascade",
  }),
  organization_id: uuid("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
});

export const cart = schema.table("cart", {
  user_id: uuid("user_id")
    .primaryKey()
    .references(() => user.id, {
      onDelete: "cascade",
    }),

  items: jsonb()
    .array()
    .$type<Array<{ product_id: string; quantity: number }>>()
    .default([]),
});

export const shopOrders = schema.table("shop_order", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  items: jsonb("items").array(),
  taxes: jsonb("taxes"),
  address: jsonb("address"),
  total: bigint("total", { mode: "number" }).default(0),
  delivery: jsonb("delivery"),
  payment: jsonb("payment"),
  organization_id: uuid("organization_id").references(() => org.id, {
    onDelete: "cascade",
  }),
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
  productVariants,
  cart,
  shopOrders,
  upload,
};
