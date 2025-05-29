CREATE SCHEMA "lipy";
--> statement-breakpoint
CREATE TABLE "lipy"."authAccount" (
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
CREATE TABLE "lipy"."address" (
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
	"userId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."cart" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid,
	"variantId" bigint,
	"quantity" smallint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "lipy"."category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text,
	"storeId" uuid,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lipy"."globalCategory" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."globalProduct" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."globalTag" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"items" jsonb[],
	"taxes" jsonb,
	"address" jsonb,
	"total" bigint DEFAULT 0,
	"delivery" jsonb,
	"payment" jsonb,
	"storeId" uuid,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "lipy"."product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"content" text,
	"brand" text,
	"category" uuid,
	"storeId" uuid,
	"globalProduct" uuid,
	"keywords" text[]
);
--> statement-breakpoint
CREATE TABLE "lipy"."productVariant" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sku" text,
	"model" text,
	"maxPrice" integer DEFAULT 0,
	"price" integer DEFAULT 0,
	"qty" integer DEFAULT 1,
	"unit" text,
	"metadata" jsonb,
	"product" uuid,
	"storeId" uuid
);
--> statement-breakpoint
CREATE TABLE "lipy"."authSession" (
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
CREATE TABLE "lipy"."store" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"handle" text,
	"logo" text,
	"description" text,
	"createdAt" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "store_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE "lipy"."storeInvitation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"storeId" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"inviterId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."storeMember" (
	"id" uuid PRIMARY KEY NOT NULL,
	"storeId" uuid NOT NULL,
	"userId" uuid NOT NULL,
	"role" text NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text,
	"storeId" uuid
);
--> statement-breakpoint
CREATE TABLE "lipy"."upload" (
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
CREATE TABLE "lipy"."user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean NOT NULL,
	"image" text,
	"createdAt" timestamp NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"customerId" text,
	"country" text,
	"onboarded" boolean DEFAULT false NOT NULL,
	"address" text,
	"normalizedEmail" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "lipy"."authVerification" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp NOT NULL,
	"createdAt" timestamp,
	"updatedAt" timestamp
);
--> statement-breakpoint
ALTER TABLE "lipy"."authAccount" ADD CONSTRAINT "authAccount_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."address" ADD CONSTRAINT "address_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD CONSTRAINT "cart_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD CONSTRAINT "cart_variantId_productVariant_id_fk" FOREIGN KEY ("variantId") REFERENCES "lipy"."productVariant"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."category" ADD CONSTRAINT "category_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."globalCategory" ADD CONSTRAINT "globalCategory_id_category_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."globalProduct" ADD CONSTRAINT "globalProduct_id_product_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."globalTag" ADD CONSTRAINT "globalTag_id_tag_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."orders" ADD CONSTRAINT "orders_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_category_category_id_fk" FOREIGN KEY ("category") REFERENCES "lipy"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_globalProduct_globalProduct_id_fk" FOREIGN KEY ("globalProduct") REFERENCES "lipy"."globalProduct"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."productVariant" ADD CONSTRAINT "productVariant_product_product_id_fk" FOREIGN KEY ("product") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."productVariant" ADD CONSTRAINT "productVariant_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."authSession" ADD CONSTRAINT "authSession_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."storeInvitation" ADD CONSTRAINT "storeInvitation_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."storeInvitation" ADD CONSTRAINT "storeInvitation_inviterId_user_id_fk" FOREIGN KEY ("inviterId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."storeMember" ADD CONSTRAINT "storeMember_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."storeMember" ADD CONSTRAINT "storeMember_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."tag" ADD CONSTRAINT "tag_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."upload" ADD CONSTRAINT "upload_uploadedBy_user_id_fk" FOREIGN KEY ("uploadedBy") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."upload" ADD CONSTRAINT "upload_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;