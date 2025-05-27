CREATE SCHEMA "lipy";
--> statement-breakpoint
CREATE TABLE "lipy"."auth_account" (
	"id" uuid PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
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
	"postal_code" text,
	"phone" text,
	"lat" double precision,
	"lng" double precision,
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."cart" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid,
	"variant_id" uuid,
	"quantity" smallint DEFAULT 1
);
--> statement-breakpoint
CREATE TABLE "lipy"."category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text,
	"organization_id" uuid,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lipy"."global_category" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."global_product" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."global_tag" (
	"id" uuid PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."orders" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"items" jsonb[],
	"taxes" jsonb,
	"address" jsonb,
	"total" bigint DEFAULT 0,
	"delivery" jsonb,
	"payment" jsonb,
	"organization_id" uuid,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "lipy"."org" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	CONSTRAINT "org_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lipy"."org_invitation" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"email" text NOT NULL,
	"role" text,
	"status" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."org_member" (
	"id" uuid PRIMARY KEY NOT NULL,
	"organization_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"content" text,
	"brand" text,
	"category" uuid,
	"organization_id" uuid,
	"keywords" text[],
	"default_price" integer,
	"in_stock" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "lipy"."product_variant" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"sku" text,
	"model" text,
	"price" integer DEFAULT 0,
	"max_price" integer DEFAULT 0,
	"qty" integer DEFAULT 1,
	"unit" text,
	"metadata" jsonb,
	"product" uuid,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "lipy"."auth_session" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"session_token" text NOT NULL,
	"expires" timestamp NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "auth_session_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "lipy"."tag" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text,
	"organization_id" uuid
);
--> statement-breakpoint
CREATE TABLE "lipy"."upload" (
	"id" uuid PRIMARY KEY NOT NULL,
	"is_public" boolean DEFAULT false,
	"content_type" text NOT NULL,
	"content_length" bigint NOT NULL,
	"name" text NOT NULL,
	"path" text,
	"url" text,
	"uploaded_by" uuid NOT NULL,
	"organization_id" uuid,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"customer_id" text,
	"country" text,
	"onboarded" boolean DEFAULT false NOT NULL,
	"address" text,
	"normalized_email" text,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "lipy"."auth_verification" (
	"id" uuid PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "lipy"."auth_account" ADD CONSTRAINT "auth_account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."address" ADD CONSTRAINT "address_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD CONSTRAINT "cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD CONSTRAINT "cart_variant_id_product_id_fk" FOREIGN KEY ("variant_id") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."category" ADD CONSTRAINT "category_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."global_category" ADD CONSTRAINT "global_category_id_category_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."global_product" ADD CONSTRAINT "global_product_id_product_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."global_tag" ADD CONSTRAINT "global_tag_id_tag_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."tag"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."orders" ADD CONSTRAINT "orders_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."orders" ADD CONSTRAINT "orders_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_invitation" ADD CONSTRAINT "org_invitation_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_invitation" ADD CONSTRAINT "org_invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_member" ADD CONSTRAINT "org_member_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_member" ADD CONSTRAINT "org_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_category_category_id_fk" FOREIGN KEY ("category") REFERENCES "lipy"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_organization_id_global_product_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."global_product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ADD CONSTRAINT "product_variant_product_product_id_fk" FOREIGN KEY ("product") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ADD CONSTRAINT "product_variant_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."auth_session" ADD CONSTRAINT "auth_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."tag" ADD CONSTRAINT "tag_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."upload" ADD CONSTRAINT "upload_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."upload" ADD CONSTRAINT "upload_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;