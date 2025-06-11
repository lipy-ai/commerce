import type { addressSchema } from "@/routes/address";
import { sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	bigint,
	boolean,
	doublePrecision,
	integer,
	jsonb,
	pgSchema,
	smallint,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import type { z } from "zod";

export const ORDER_STATUS = [
	"ordered",
	"accepted",
	"packed",
	"out_for_delivery",
	"delivered",
	"return_requested",
	"refunded",
	"replaced",
	"cancelled",
] as const;

export const schema = pgSchema("lipy");

export const enableUuidExtension = sql`CREATE EXTENSION IF NOT EXISTS "postgis";`;

export const user = schema.table("user", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
	customerId: text("customerId"),
	country: text("country"),
	onboarded: boolean("onboarded").notNull().default(false),
	address: text("address"),
	normalizedEmail: text("normalizedEmail"),
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
	postalCode: text("postalCode"),
	phone: text("phone"),
	lat: doublePrecision("lat"),
	lng: doublePrecision("lng"),
});

export const userAddress = schema.table("userAddress", {
	id: uuid("id")
		.primaryKey()
		.references(() => address.id, {
			onDelete: "cascade",
		}),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const storeAddress = schema.table("storeAddress", {
	id: uuid("id")
		.primaryKey()
		.references(() => address.id, {
			onDelete: "cascade",
		}),
	storeId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),
});

export const account = schema.table("authAccount", {
	id: uuid("id").primaryKey(),
	accountId: text("accountId").notNull(),
	providerId: text("providerId").notNull(),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	accessToken: text("accessToken"),
	refreshToken: text("refreshToken"),
	idToken: text("idToken"),
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const verification = schema.table("authVerification", {
	id: uuid("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	createdAt: timestamp("createdAt"),
	updatedAt: timestamp("updatedAt"),
});

export const session = schema.table("authSession", {
	id: uuid("id").primaryKey(),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	sessionToken: text("sessionToken").notNull().unique(),
	activeStoreId: text("activeStoreId"),
	expires: timestamp("expires").notNull(),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const store = schema.table("store", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	handle: text("handle").unique(),
	logo: text("logo"),
	description: text("description"),
	createdAt: timestamp("createdAt").notNull(),
	metadata: text("metadata"),
	email: text("email"),
	phone: text("phone"),
	active: boolean("active").default(false),
});

export const storeMember = schema.table("storeMember", {
	id: uuid("id").primaryKey(),
	storeId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	role: text("role").notNull(),
	createdAt: timestamp("createdAt").notNull(),
});

export const storeInvitation = schema.table("storeInvitation", {
	id: uuid("id").primaryKey(),
	organizationId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),
	email: text("email").notNull(),
	role: text("role"),
	status: text("status").notNull(),
	expiresAt: timestamp("expiresAt").notNull(),
	inviterId: uuid("inviterId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
});

export const upload = schema.table("upload", {
	id: uuid("id").primaryKey(),
	contentType: text("contentType").notNull(),
	contentLength: bigint("contentLength", { mode: "number" }).notNull(),
	name: text("name").notNull(),
	path: text("path"),
	url: text("url"),
	uploadedBy: uuid("uploadedBy")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
});

export const category = schema.table("category", {
	id: uuid("id").primaryKey(),
	title: text("title"),
	summary: text("summary"),
	slug: text("slug").unique(),
	image: text("image"),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
});

export const tags = schema.table("tag", {
	id: uuid("id").primaryKey(),
	title: text("title"),
	summary: text("summary"),
	slug: text("slug"),
	image: text("image"),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
});

export const globalProduct = schema.table("globalProduct", {
	id: uuid("id")
		.primaryKey()
		.references((): AnyPgColumn => product.id, {
			onDelete: "cascade",
		}),
});

export const globalCategory = schema.table("globalCategory", {
	id: uuid("id")
		.primaryKey()
		.references((): AnyPgColumn => category.id, {
			onDelete: "cascade",
		}),
});

export const globalTag = schema.table("globalTag", {
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
	thumbnail: text("thumbnail"),
	category: uuid("category").references(() => category.id, {
		onDelete: "set null",
	}),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
	globalProduct: uuid("globalProduct").references(() => globalProduct.id),
	keywords: text("keywords").array(),
});

export const productVariant = schema.table("productVariant", {
	id: uuid("id").primaryKey(),
	title: text("title").notNull(),
	description: text("description"),
	sku: text("sku"),
	model: text("model"),
	maxPrice: integer("maxPrice").default(0),
	price: integer("price").default(0),
	stockQty: integer("stockQty").default(1),
	unit: text("unit"),
	metadata: jsonb(),
	product: uuid("product").references(() => product.id, {
		onDelete: "cascade",
	}),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
});

export const cart = schema.table("cart", {
	id: uuid("id").primaryKey(),
	userId: uuid("userId").references(() => user.id, {
		onDelete: "cascade",
	}),
	variantId: uuid("variantId").references(() => productVariant.id, {
		onDelete: "cascade",
	}),
	quantity: smallint("quantity").default(1),
});

export const orders = schema.table("orders", {
	id: uuid("id").primaryKey(),
	pk: text().unique(),
	items: jsonb("items").array().$type<
		Array<{
			id: string;
			title: string;
			quantity: number;
			thumbnail: string;
			variant: {
				id: string;
				title: string;
				maxPrice: number;
				price: number;
			};
		}>
	>(),
	taxes: jsonb("taxes").array().$type<
		Array<{
			id: string;
			name: string;
			amount: number;
		}>
	>(),
	discounts: jsonb("discounts").array().$type<
		Array<{
			id: string;
			name: string;
			amount: number;
		}>
	>(),
	storeId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),

	orderedBy: uuid("orderedBy")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	currency: text("currency", { enum: ["inr"] }).notNull(),
	delivery: jsonb("delivery").$type<{
		trackingId?: string;
		partnerName?: string;
		partnerId?: string;
	}>(),

	// address: jsonb("address").$type<typeof address.$inferSelect>(),
	address: jsonb("address").$type<z.infer<typeof addressSchema>>(),
	deliveryInstruction: text("deliveryInstruction"),
	storeInstructions: text("storeInstructions"),
	paymentMethod: text("paymentMethod", { enum: ["cod", "upi", "card"] }),

	orderedAt: timestamp("orderedAt").notNull(),
	cancelledAt: timestamp("cancelledAt"),
	refundedAt: timestamp("refundedAt"),
	deliveredAt: timestamp("deliveredAt"),
	deliveryAgentAssignedAt: timestamp("deliveryAgentAssignedAt"),
	status: text("status", {
		enum: ORDER_STATUS,
	}),
	totalTaxAmount: integer("totalTaxAmount").default(0),
	totalDiscountAmount: integer("totalDiscountAmount").default(0),
	maxItemTotalAmount: integer("maxItemTotalAmount").default(0),
	itemTotalAmount: integer("itemTotalAmount").default(0),
	totalAmount: integer("totalAmount").default(0),
	amountSaved: integer("amountSaved").default(0),
});

export const dbTables = {
	user,
	address,
	userAddress,
	storeAddress,
	account,
	session,
	verification,
	store,
	storeMember,
	storeInvitation,
	product,
	productVariant,
	cart,
	orders,
	upload,
	category,
	tags,
	globalProduct,
	globalCategory,
};
