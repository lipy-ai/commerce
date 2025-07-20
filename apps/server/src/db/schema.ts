import type {
	addressSchema,
	coreAddressSchema,
} from "@/routes/loggedRoutes/address";
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

export const PRODUCT_STATUS = ["draft", "published", "archived"] as const;

export const STORE_TYPE = [
	"grocery",
	"pharmacy",
	"fruits_and_vegetables",
	"restaurant",
	"cafe",
	"hardware",
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
	createdAt: timestamp("createdAt",{withTimezone:true}).notNull(),
	updatedAt: timestamp("updatedAt",{withTimezone:true}).notNull(),
	country: text("country"),
	onboarded: boolean("onboarded").notNull().default(false),
	address: uuid("address").references((): any => user?.id, {
		onDelete: "set null",
	}),
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
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt",{withTimezone:true}),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt",{withTimezone:true}),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt",{withTimezone:true}).notNull(),
	updatedAt: timestamp("updatedAt",{withTimezone:true}).notNull(),
});

export const verification = schema.table("authVerification", {
	id: uuid("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt",{withTimezone:true}).notNull(),
	createdAt: timestamp("createdAt",{withTimezone:true}),
	updatedAt: timestamp("updatedAt",{withTimezone:true}),
});

export const session = schema.table("authSession", {
	id: uuid("id").primaryKey(),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	sessionToken: text("sessionToken").notNull().unique(),
	activeStoreId: text("activeStoreId"),
	expires: timestamp("expires",{withTimezone:true}).notNull(),
	createdAt: timestamp("createdAt",{withTimezone:true}).notNull(),
	updatedAt: timestamp("updatedAt",{withTimezone:true}).notNull(),
});

export const store = schema.table("store", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	handle: text("handle").unique(),
	image: text("image"),
	description: text("description"),
	createdAt: timestamp("createdAt",{withTimezone:true}).notNull(),
	metadata: text("metadata"),
	address: jsonb("address").$type<z.infer<typeof coreAddressSchema>>(),
	email: text("email"),
	phone: text("phone"),
	type: text("type"),
	active: boolean("active").default(false),
});

export const storePayments = schema.table("storePayments", {
	id: uuid("id")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" })
		.primaryKey(),
	acceptedPayments: text({ enum: ["cod"] })
		.array()
		.notNull(),
	upiIds: jsonb("upiIds").array().$type<Array<{ name: string; id: string }>>(),
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
		createdAt: timestamp("createdAt",{withTimezone:true}).notNull(),
	},
	(table) => [
		// 👇 This enforces uniqueness on the combination
		unique("user_store_unique").on(table.userId, table.storeId),
	],
);

export const storeInvitation = schema.table("storeInvitation", {
	id: uuid("id").primaryKey(),
	storeId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),
	email: text("email").notNull(),
	role: text("role"),
	status: text("status").notNull(),
	expiresAt: timestamp("expiresAt",{withTimezone:true}).notNull(),
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
	deletedAt: timestamp("deletedAt",{withTimezone:true}),
	createdAt: timestamp("createdAt",{withTimezone:true}).notNull(),
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

	highlights: jsonb("highlights")
		.array()
		.$type<{ label: string; value: string }[]>(),
	information: jsonb("information")
		.array()
		.$type<{ label: string; value: string }[]>(),
	keywords: text("keywords").array(),
	status: text("status", { enum: PRODUCT_STATUS }).default("draft"),
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

export const storeInventory = schema.table(
	"storeInventory",
	{
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
	},
	(table) => [
		// 👇 This enforces uniqueness on the combination
		unique("variant_store_unique").on(table.variantId, table.storeId),
	],
);

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
		name?: string;
		agentId?: string;
		image?:string;
		phone?:string
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
		attachments?: Array<string> | null;
	}>(),
	paymentMethod: text("paymentMethod", { enum: ["cod", "upi", "card"] }),
	orderedAt: timestamp("orderedAt", {withTimezone:true}).notNull(),
	cancelledAt: timestamp("cancelledAt",{withTimezone:true}),
	refundedAt: timestamp("refundedAt",{withTimezone:true}),
	deliveredAt: timestamp("deliveredAt",{withTimezone:true}),
	deliveryAgentAssignedAt: timestamp("deliveryAgentAssignedAt",{withTimezone:true}),
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
	storePayments,
};
