import { customType } from "drizzle-orm/pg-core";
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

export const authSchema = pgSchema("auth");
export const orgSchema = pgSchema("org");
export const userSchema = pgSchema("user");
export const publicSchema = pgSchema("global");

export const authUser = authSchema.table("user", {
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

export const userAddress = userSchema.table("address", {
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
    .references(() => authUser.id, { onDelete: "cascade" }),
  location: geographyPoint("location"),
});

export const authAccount = authSchema.table("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),
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

export const authVerification = authSchema.table("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const orgList = orgSchema.table("list", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique(),
  logo: text("logo"),
  createdAt: timestamp("created_at").notNull(),
  metadata: text("metadata"),
});

export const orgMember = orgSchema.table("member", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => orgList.id, { onDelete: "cascade" }),
  userId: text("user_id")
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),
  role: text("role").notNull(),
  createdAt: timestamp("created_at").notNull(),
});

export const orgInvitation = orgSchema.table("invitation", {
  id: text("id").primaryKey(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => orgList.id, { onDelete: "cascade" }),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: text("inviter_id")
    .notNull()
    .references(() => authUser.id, { onDelete: "cascade" }),
});

export const publicCategory = publicSchema.table("category", {
  id: text("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  slug: text("slug"),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const publicSubCategory = publicSchema.table("sub_category", {
  id: text("id").primaryKey(),
  parent: text("category").references(() => publicCategory.id, {
    onDelete: "set null",
  }),
  title: text("title"),
  summary: text("summary"),
  slug: text("slug"),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const publicProduct = publicSchema.table("product", {
  id: text("id").primaryKey(),
  title: text("title"),
  summary: text("summary"),
  brand: text("brand"),
  type: text({ enum: ["physical"] }),
  rating: numeric("rating", { precision: 2, scale: 1 }).notNull().default("0"),
  category: text("category").references(() => publicCategory.id, {
    onDelete: "set null",
  }),
  subCategory: text("sub_category").references(() => publicSubCategory.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const publicProductVariants = publicSchema.table("variants", {
  id: text("id").primaryKey(),
  title: text("title"),
  product: text("product").references(() => publicSubCategory.id, {
    onDelete: "cascade",
  }),
  unit: numeric("uint"),
  createdAt: timestamp("created_at").notNull(),
  updateAt: timestamp("updated_at").notNull(),
});

export const publicImages = publicSchema.table("images", {});
