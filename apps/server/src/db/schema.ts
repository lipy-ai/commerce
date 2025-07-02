import type { addressSchema } from "@/routes/address";
import { sql } from "drizzle-orm";
import {
	bigint,
	boolean,
	doublePrecision,
	integer,
	jsonb,
	numeric,
	pgSchema,
	primaryKey,
	smallint,
	text,
	timestamp,
	unique,
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

export const PRODUCT_TYPE = [
	"grocery",
	"medicine",
	"food",
	"vegetable",
	"fruits",
] as const;

export const schema = pgSchema("lipy-dev");

export const enableUuidExtension = sql`CREATE EXTENSION IF NOT EXISTS "postgis";`;

export const user = schema.table("user", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	phoneNumber: text("phoneNumber"),
	phoneNumberVerified: boolean("phoneNumberVerified"),
	image: text("image"),
	createdAt: timestamp("createdAt").notNull(),
	updatedAt: timestamp("updatedAt").notNull(),
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
	metadata: jsonb("metadata").$type<{
		building: string;
	}>(),
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
	image: text("image"),
	description: text("description"),
	createdAt: timestamp("createdAt").notNull(),
	metadata: text("metadata"),
	address: jsonb("address").$type<z.infer<typeof addressSchema>>(),
	email: text("email"),
	phone: text("phone"),
	active: boolean("active").default(false),
});

export const storeMember = schema.table(
	"storeMember",
	{
		id: uuid("id").primaryKey(),
		storeId: uuid("storeId")
			.notNull()
			.references(() => store.id, { onDelete: "cascade" }),
		userId: uuid("userId")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		role: text("role", {
			enum: ["owner", "admin", "delivery", "staff"],
		}).notNull(),
		createdAt: timestamp("createdAt").notNull(),
	},
	(table) => [
		// 👇 This enforces uniqueness on the combination
		unique("user_store_unique").on(table.userId, table.storeId),
	],
);

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

export const customer = schema.table(
	"customer",
	{
		storeId: uuid("storeId").references(() => store.id, {
			onDelete: "cascade",
		}),
		userId: uuid("userId").references(() => user.id, {
			onDelete: "set null",
		}),
	},
	(t) => [primaryKey({ columns: [t.storeId, t.userId] })],
);

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
});

export const tags = schema.table("tag", {
	id: uuid("id").primaryKey(),
	title: text("title"),
	summary: text("summary"),
	slug: text("slug"),
	image: text("image"),
});

export const product = schema.table("product", {
	id: uuid("id").primaryKey(),
	title: text("title"),
	summary: text("summary"),
	price: numeric("price", { precision: 10, scale: 2, mode: "number" }),
	maxPrice: numeric("maxPrice", { precision: 10, scale: 2, mode: "number" }),
	thumbnail: text("thumbnail"),
	images: text("images").array(),
	type: text("type", { enum: PRODUCT_TYPE }),
	category: uuid("category")
		.references(() => category.id, {
			onDelete: "set null",
		})
		.notNull(),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
	highlights: jsonb("highlights")
		.array()
		.$type<{ label: string; value: string }[]>(),
	information: jsonb("information")
		.array()
		.$type<{ label: string; value: string }[]>(),
	keywords: text("keywords").array(),
});

export const productVariant = schema.table("productVariant", {
	id: uuid("id").primaryKey(),
	unit: text("unit"),
	price: numeric("price", { precision: 10, scale: 2, mode: "number" }),
	images: text("images").array(),
	productId: uuid("productId").references(() => product.id, {
		onDelete: "cascade",
	}),
});

export const storeInventory = schema.table("storeInventory", {
	id: uuid("id").primaryKey(),
	variantId: uuid("productVariant").references(() => productVariant.id, {
		onDelete: "cascade",
	}),
	storeId: uuid("storeId").references(() => store.id, {
		onDelete: "cascade",
	}),
	price: numeric("price", { precision: 10, scale: 2, mode: "number" }),
	stock: integer("stock").default(0),
	sku: text("sku"),
});

export const cart = schema.table("cart", {
	id: uuid("id").primaryKey(),
	userId: uuid("userId").references(() => user.id, {
		onDelete: "cascade",
	}),
	inventoryId: uuid("inventoryId").references(() => storeInventory.id, {
		onDelete: "cascade",
	}),
	quantity: smallint("quantity").default(1),
});

export const orders = schema.table("orders", {
	pk: uuid("pk").primaryKey(),
	id: text().unique().notNull(),
	items: jsonb("items").array().$type<
		Array<{
			id: string;
			title: string;
			quantity: number;
			thumbnail: string;
			variant: {
				id: string;
				inventoryId: string;
				price: number;
				maxPrice: number;
				unit: string;
			};
		}>
	>(),
	currency: text("currency", { enum: ["inr"] }).notNull(),

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

	delivery: jsonb("delivery").$type<{
		trackingId?: string;
		partnerName?: string;
		partnerId?: string;
	}>(),
	customerId: text("customerId"),
	customerDetails: jsonb("customerDetails").$type<{
		name: string;
		phone: string;
		image?: string;
		email?: string;
		address: z.infer<typeof addressSchema>;
	}>(),
	customerInstructions: jsonb("customerInstructions").$type<{
		delivery?: string | null;
		store?: string | null;
	}>(),
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
	customer,
	product,
	productVariant,
	cart,
	orders,
	upload,
	category,
	tags,
	storeInventory,
};
