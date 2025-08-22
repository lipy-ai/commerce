import { sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	bigint,
	bigserial,
	boolean,
	check,
	customType,
	index,
	integer,
	jsonb,
	numeric,
	pgSchema,
	primaryKey,
	real,
	smallint,
	text,
	time,
	timestamp,
	unique,
	uuid,
} from "drizzle-orm/pg-core";
import type { z } from "zod";
import type {
	addressSchema,
	coreAddressSchema,
} from "@/routes/loggedRoutes/address";

export const ORDER_STATUS = [
	"created",
	"accepted",
	"packed",
	"out_for_delivery",
	"delivered",
	"return_requested",
	"refunded",
	"replaced",
	"canceled",
	"completed",
	"awaiting_customer_confirmation",
] as const;

export const SUM_TYPE = ["flat", "percent"] as const;

export const PRODUCT_TYPE = [
	"grocery",
	"medicine",
	"food",
	"vegetable",
	"fruits",
] as const;

export const PRODUCT_STATUS = [
	"draft",
	"published",
	"archived",
	"underReview",
	"rejected",
] as const;

export const STORE_TYPE = [
	"grocery",
	"pharmacy",
	"fruits_and_vegetables",
	"restaurant",
	"cafe",
	"hardware",
] as const;

export const COUPON_TYPE = ["amount-off", "free-delivery"] as const;

export const STORE_STATUS = ["closed", "open"] as const;

export const schema = pgSchema("lipy-dev");

// export const enableUuidExtension = sql`CREATE EXTENSION IF NOT EXISTS "postgis";`;

const geography = customType<{ data: string }>({
	dataType() {
		return "geography";
	},
});

const tsVector = customType<{ data: string }>({
	dataType() {
		return "tsvector";
	},
});

export const user = schema.table("user", {
	id: uuid("id").primaryKey(),
	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("emailVerified").notNull(),
	phoneNumber: text("phoneNumber"),
	phoneNumberVerified: boolean("phoneNumberVerified"),
	image: text("image"),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
	country: text("country"),
	onboarded: boolean("onboarded").notNull().default(false),
	address: uuid("address").references((): any => userAddress?.id, {
		onDelete: "set null",
	}),
	normalizedEmail: text("normalizedEmail"),
});

export const address = schema.table(
	"address",
	{
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
		location: geography("location"),
		metadata: jsonb("metadata").$type<{
			building: string;
		}>(),
	},
	(t) => [index("address_spatial_index").using("gist", t.location)],
);

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
	accessTokenExpiresAt: timestamp("accessTokenExpiresAt", {
		withTimezone: true,
	}),
	refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", {
		withTimezone: true,
	}),
	scope: text("scope"),
	password: text("password"),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const verification = schema.table("authVerification", {
	id: uuid("id").primaryKey(),
	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }),
	updatedAt: timestamp("updatedAt", { withTimezone: true }),
});

export const session = schema.table("authSession", {
	id: uuid("id").primaryKey(),
	userId: uuid("userId")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	sessionToken: text("sessionToken").notNull().unique(),
	activeStoreId: text("activeStoreId"),
	expires: timestamp("expires", { withTimezone: true }).notNull(),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull(),
});

export const store = schema.table(
	"store",
	{
		id: uuid("id").primaryKey(),
		name: text("name").notNull(),
		handle: text("handle").unique(),
		image: text("image"),
		description: text("description"),
		createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
		metadata: text("metadata"),
		address: jsonb("address").$type<z.infer<typeof coreAddressSchema>>(),
		location: geography("location"),
		email: text("email"),
		phone: text("phone"),
		type: text("type"),
		active: boolean("active").default(false),
		openingHour: time("openingHour").notNull().default("00:00"),
		closingHour: time("closingHour").notNull().default("00:00"),
		deliveryDistance: real("deliveryDistance").notNull().default(1),
		freeDeliveryDistance: real("freeDeliveryDistance").notNull().default(1),
		minimumOrderValue: real("minimumOrderValue").notNull().default(0),
		deliveryChargePerKm: real("deliveryChargePerKm").notNull().default(1),
		payments: jsonb("payments").$type<{
			upiIds: Array<{ id: string; name: string }>;
		}>(),
		refunds: jsonb("refunds").$type<{
			enabled: boolean;
			content?: string;
		}>(),
		replacements: jsonb("replacements").$type<{
			enabled: boolean;
			content?: string;
		}>(),
		gstTax: integer("gstTax").notNull().default(0),
		status: text("status", { enum: STORE_STATUS }).default("open"),
	},
	(t) => [index("store_spatial_index").using("gist", t.location)],
);
export const coupons = schema.table("coupons", {
	id: uuid("id").primaryKey(),
	storeId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),
	title: text("title"),
	type: text("type", { enum: COUPON_TYPE }),
	discountType: text("discountType", { enum: SUM_TYPE }),
	discountValue: numeric("discountValue", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
	minimumOrderValue: numeric("minimumOrderValue", {
		precision: 10,
		scale: 2,
		mode: "number",
	}).default(0),
	status: text("status", { enum: ["active", "inactive", "expired"] }).default(
		"active",
	),
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
		createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
	},
	(table) => [
		// 👇 This enforces uniqueness on the combination
		unique("member_user_store_unique_key").on(table.userId, table.storeId),
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
	expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
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
	(t) => [
		primaryKey({
			name: "customer_store_user_p_key",
			columns: [t.userId, t.storeId],
		}),
	],
);

export const upload = schema.table("upload", {
	id: uuid("id").primaryKey(),
	contentType: text("contentType").notNull(),
	contentLength: bigint("contentLength", { mode: "number" }).notNull(),
	name: text("name").notNull(),
	path: text("path"),
	url: text("url"),
	deletedAt: timestamp("deletedAt", { withTimezone: true }),
	createdAt: timestamp("createdAt", { withTimezone: true }).notNull(),
});

export const category = schema.table(
	"category",
	{
		id: uuid("id").primaryKey(),
		title: text("title"),
		summary: text("summary"),
		slug: text("slug").unique(),
		image: text("image"),
		parentId: uuid("parentId").references((): AnyPgColumn => category.id, {
			onDelete: "cascade",
		}),
	},
	(table) => [
		check(
			"no_self_parenting",
			sql`${table.parentId} IS NULL OR ${table.parentId} != ${table.id}`,
		),
	],
);

export const tags = schema.table("tag", {
	id: uuid("id").primaryKey(),
	title: text("title"),
	summary: text("summary"),
	slug: text("slug"),
	image: text("image"),
});

// TODO Trigger below

// CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
// CREATE OR REPLACE FUNCTION update_search_vector() RETURNS trigger AS $$
// BEGIN
//   NEW."searchVector" :=
//     to_tsvector('english', coalesce(NEW.title, ''));
//   RETURN NEW;
// END;
// $$ LANGUAGE plpgsql;

// DROP TRIGGER IF EXISTS trigger_search_vector ON "lipy-dev"."productsToAdd";

// CREATE TRIGGER trigger_search_vector
// BEFORE INSERT OR UPDATE ON "lipy-dev"."productsToAdd"
// FOR EACH ROW EXECUTE FUNCTION update_search_vector();

export const reviewProducts = schema.table(
	"reviewProducts",
	{
		id: bigserial("id", { mode: "number" }).primaryKey(),
		title: text("title"),
		summary: text("summary"),
		tags: text("tags").array(),
		searchVector: tsVector("searchVector"),
		thumbnail: text("thumbnail"),
		category: uuid("category").references(() => category.id, {
			onDelete: "set null",
		}),
		primaryCategory: text("primaryCategory"),
		subCategory: text("subCategory"),
		storeId: uuid("storeId").references(() => store.id, {
			onDelete: "cascade",
		}),
		variants: jsonb("variants")
			.array()
			.$type<
				Array<{ id: string; unit: string; price: number; maxPrice?: number }>
			>(),
		highlights: jsonb("highlights")
			.array()
			.$type<Array<{ name: string; value: string }>>(),
		information: jsonb("information")
			.array()
			.$type<Array<{ name: string; value: string }>>(),
		content: text("content"),
		images: text("images").array(),
		metadata: jsonb().$type<{
			table: string;
			ref_id: string;
		}>(),
		reviewedAt: timestamp("reviewedAt", { withTimezone: true }),
		reviewedBy: uuid("reviewedBy").references(() => user.id, {
			onDelete: "set null",
		}),
		productId: uuid("productId").references(() => product.id, {
			onDelete: "set null",
		}),
	},
	(t) => [index("reviewProducts_search_idx").using("gin", t.searchVector)],
);

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
		.$type<{ name: string; value: string }[]>(),
	information: jsonb("information")
		.array()
		.$type<{ name: string; value: string }[]>(),
	keywords: text("keywords").array(),
	status: text("status", { enum: PRODUCT_STATUS }).default("draft"),
	store: uuid("store").references(() => store.id, {
		onDelete: "cascade",
	}),
});

export const productVariant = schema.table("productVariant", {
	id: uuid("id").primaryKey(),
	unit: text("unit"),
	price: numeric("price", { precision: 10, scale: 2, mode: "number" })
		.default(0)
		.notNull(),
	maxPrice: numeric("maxPrice", {
		precision: 10,
		scale: 2,
		mode: "number",
	})
		.notNull()
		.default(0),
	images: text("images").array(),
	productId: uuid("productId").references(() => product.id, {
		onDelete: "cascade",
	}),
});

export const storeInventory = schema.table(
	"storeInventory",
	{
		id: uuid("id").primaryKey(),
		variantId: uuid("variantId").references(() => productVariant.id, {
			onDelete: "cascade",
		}),
		active: boolean("active").default(true),
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
			inventoryId?: string | null;
			variantId?: string | null;
			productId?: string | null;
			title: string;
			thumbnail?: string;
			unit: string;
			qty: number;
			price: number;
			maxPrice?: number;
		}>
	>(),
	currency: text("currency", { enum: ["inr"] }).notNull(),

	taxes: jsonb("taxes").array().$type<
		Array<{
			name: string;
			amount: number;
			sum: (typeof SUM_TYPE)[number];
		}>
	>(),
	discounts: jsonb("discounts").array().$type<
		Array<{
			name: string;
			amount: number;
			sum: (typeof SUM_TYPE)[number];
		}>
	>(),
	storeId: uuid("storeId")
		.notNull()
		.references(() => store.id, { onDelete: "cascade" }),

	delivery: jsonb("delivery").$type<{
		trackingId?: string;
		name?: string;
		agentId?: string;
		image?: string;
		phone?: string;
	}>(),
	userId: uuid("userId"),
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
	timeline: jsonb("timeline")
		.array()
		.$type<
			Array<{
				content: string;
				status: (typeof ORDER_STATUS)[number];
				userId: string;
				createdAt: string;
			}>
		>()
		.notNull()
		.default([]),
	paymentMethod: text("paymentMethod", { enum: ["cod", "upi", "card"] }),
	orderedAt: timestamp("orderedAt", { withTimezone: true }).notNull(),
	canceledAt: timestamp("canceledAt", { withTimezone: true }),
	cancelReason: text("cancelReason"),
	refundedAt: timestamp("refundedAt", { withTimezone: true }),
	deliveredAt: timestamp("deliveredAt", { withTimezone: true }),
	paidAt: timestamp("paidAt", { withTimezone: true }),
	deliveryAgentAssignedAt: timestamp("deliveryAgentAssignedAt", {
		withTimezone: true,
	}),
	confirmationOtp: text("confirmationOtp"),
	status: text("status", {
		enum: ORDER_STATUS,
	}),
	totalTaxAmount: numeric("totalTaxAmount", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
	totalDiscountAmount: numeric("totalDiscountAmount", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
	maxItemTotalAmount: numeric("maxItemTotalAmount", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
	itemTotalAmount: numeric("itemTotalAmount", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
	totalAmount: numeric("totalAmount", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
	amountSaved: numeric("amountSaved", {
		precision: 10,
		scale: 2,
		mode: "number",
	}),
});

export const dbTables = {
	user,
	address,
	userAddress,
	account,
	session,
	verification,
	store,
	coupons,
	storeMember,
	storeInvitation,
	customer,
	product,
	productVariant,
	reviewProducts,
	cart,
	orders,
	upload,
	category,
	tags,
	storeInventory,
	storePayments,
};
