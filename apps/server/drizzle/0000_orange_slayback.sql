drop schema "lipy-dev" cascade;
CREATE SCHEMA "lipy-dev";
--> statement-breakpoint
CREATE TABLE "lipy-dev"."authAccount" (
	"id" uuid PRIMARY KEY NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"userId" uuid NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"idToken" text,
	"accessTokenExpiresAt" timestamp,
	"refreshTokenExpiresAt" timestamp,
	"scope" text,
	"password" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."address" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"tag" text NOT NULL,
	"line1" text NOT NULL,
	"line2" text,
	"city" text NOT NULL,
	"state" text NOT NULL,
	"country" text,
	"postalCode" text,
	"phone" text,
	"lat" double precision,
	"lng" double precision,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."cart" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"inventoryId" uuid,
	"quantity" smallint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."customer" (
	"storeId" uuid,
	"userId" uuid,
	CONSTRAINT "customer_storeId_userId_pk" PRIMARY KEY("storeId","userId")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."orders" (
	"pk" uuid PRIMARY KEY NOT NULL,
	"id" text NOT NULL,
	"items" jsonb[],
	"currency" text NOT NULL,
	"taxes" jsonb[],
	"discounts" jsonb[],
	"storeId" uuid NOT NULL,
	"delivery" jsonb,
	"customerId" text,
	"customerDetails" jsonb,
	"customerInstructions" jsonb,
	"paymentMethod" text,
	"orderedAt" timestamp NOT NULL,
	"cancelledAt" timestamp,
	"refundedAt" timestamp,
	"deliveredAt" timestamp,
	"deliveryAgentAssignedAt" timestamp,
	"status" text,
	"totalTaxAmount" integer DEFAULT 0,
	"totalDiscountAmount" integer DEFAULT 0,
	"maxItemTotalAmount" integer DEFAULT 0,
	"itemTotalAmount" integer DEFAULT 0,
	"totalAmount" integer DEFAULT 0,
	"amountSaved" integer DEFAULT 0,
	CONSTRAINT "orders_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"price" numeric(10, 2),
	"maxPrice" numeric(10, 2),
	"thumbnail" text,
	"images" text[],
	"type" text,
	"category" uuid NOT NULL,
	"highlights" jsonb[],
	"information" jsonb[],
	"keywords" text[]
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."productVariant" (
	"id" uuid PRIMARY KEY NOT NULL,
	"unit" text,
	"price" numeric(10, 2),
	"images" text[],
	"productId" uuid
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."authSession" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"sessionToken" text NOT NULL,
	"activeStoreId" text,
	"expires" timestamp NOT NULL,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	CONSTRAINT "authSession_sessionToken_unique" UNIQUE("sessionToken")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."store" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"handle" text,
	"image" text,
	"description" text,
	"createdAt" timestamp NOT NULL,
	"metadata" text,
	"address" jsonb,
	"email" text,
	"phone" text,
	"type" text,
	"active" boolean DEFAULT false,
	CONSTRAINT "store_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."storeInventory" (
	"id" uuid PRIMARY KEY NOT NULL,
	"productVariant" uuid,
	"storeId" uuid,
	"price" numeric(10, 2),
	"stock" integer DEFAULT 0,
	"sku" text,
	CONSTRAINT "variant_store_unique" UNIQUE("productVariant","storeId")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."storeInvitation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"storeId" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"inviterId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."storeMember" (
	"id" uuid PRIMARY KEY NOT NULL,
	"storeId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" text NOT NULL,
	"createdAt" timestamp NOT NULL,
	CONSTRAINT "user_store_unique" UNIQUE("userId","storeId")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."storePayments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"acceptedPayments" text[] NOT NULL,
	"upiIds" jsonb[]
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."upload" (
	"id" uuid PRIMARY KEY NOT NULL,
	"contentType" text NOT NULL,
	"contentLength" bigint NOT NULL,
	"name" text NOT NULL,
	"path" text,
	"url" text,
	"uploadedBy" uuid NOT NULL,
	"storeId" uuid,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"phoneNumber" text,
	"phoneNumberVerified" boolean,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"country" text,
	"onboarded" boolean DEFAULT false NOT NULL,
	"address" text,
	"normalizedEmail" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."userAddress" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy-dev"."authVerification" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "lipy-dev"."authAccount" ADD CONSTRAINT "authAccount_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."cart" ADD CONSTRAINT "cart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."cart" ADD CONSTRAINT "cart_inventoryId_storeInventory_id_fk" FOREIGN KEY ("inventoryId") REFERENCES "lipy-dev"."storeInventory"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."customer" ADD CONSTRAINT "customer_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."customer" ADD CONSTRAINT "customer_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD CONSTRAINT "orders_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."product" ADD CONSTRAINT "product_category_category_id_fk" FOREIGN KEY ("category") REFERENCES "lipy-dev"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."productVariant" ADD CONSTRAINT "productVariant_productId_product_id_fk" FOREIGN KEY ("productId") REFERENCES "lipy-dev"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authSession" ADD CONSTRAINT "authSession_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInventory" ADD CONSTRAINT "storeInventory_productVariant_productVariant_id_fk" FOREIGN KEY ("productVariant") REFERENCES "lipy-dev"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInventory" ADD CONSTRAINT "storeInventory_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInvitation" ADD CONSTRAINT "storeInvitation_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInvitation" ADD CONSTRAINT "storeInvitation_inviterId_user_id_fk" FOREIGN KEY ("inviterId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeMember" ADD CONSTRAINT "storeMember_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeMember" ADD CONSTRAINT "storeMember_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storePayments" ADD CONSTRAINT "storePayments_id_store_id_fk" FOREIGN KEY ("id") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" ADD CONSTRAINT "upload_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" ADD CONSTRAINT "upload_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."userAddress" ADD CONSTRAINT "userAddress_id_address_id_fk" FOREIGN KEY ("id") REFERENCES "lipy-dev"."address"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."userAddress" ADD CONSTRAINT "userAddress_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;