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
	"user_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
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
	"brand" text,
	"type" text,
	"rating" numeric(2, 1) DEFAULT '0' NOT NULL,
	"category" uuid,
	"sub_category" uuid,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."product_variant" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"product" uuid,
	"uint" numeric,
	"organization_id" uuid NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
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
CREATE TABLE "lipy"."shop_cart" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"organization_id" uuid,
	"items" jsonb DEFAULT '[]'::jsonb
);
--> statement-breakpoint
CREATE TABLE "lipy"."shop_order" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"shop_id" text NOT NULL,
	"items" jsonb,
	"taxes" jsonb,
	"address" jsonb,
	"total" bigint DEFAULT 0,
	"delivery" jsonb,
	"payment" jsonb,
	"status" text
);
--> statement-breakpoint
CREATE TABLE "lipy"."sub_category" (
	"id" uuid PRIMARY KEY NOT NULL,
	"category" uuid,
	"title" text,
	"summary" text,
	"slug" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
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
ALTER TABLE "lipy"."org_invitation" ADD CONSTRAINT "org_invitation_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_invitation" ADD CONSTRAINT "org_invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_member" ADD CONSTRAINT "org_member_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."org_member" ADD CONSTRAINT "org_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_category_category_id_fk" FOREIGN KEY ("category") REFERENCES "lipy"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_sub_category_sub_category_id_fk" FOREIGN KEY ("sub_category") REFERENCES "lipy"."sub_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ADD CONSTRAINT "product_variant_product_product_id_fk" FOREIGN KEY ("product") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ADD CONSTRAINT "product_variant_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."auth_session" ADD CONSTRAINT "auth_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."shop_cart" ADD CONSTRAINT "shop_cart_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."shop_cart" ADD CONSTRAINT "shop_cart_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."shop_order" ADD CONSTRAINT "shop_order_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."sub_category" ADD CONSTRAINT "sub_category_category_category_id_fk" FOREIGN KEY ("category") REFERENCES "lipy"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."upload" ADD CONSTRAINT "upload_uploaded_by_user_id_fk" FOREIGN KEY ("uploaded_by") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."upload" ADD CONSTRAINT "upload_organization_id_org_id_fk" FOREIGN KEY ("organization_id") REFERENCES "lipy"."org"("id") ON DELETE cascade ON UPDATE no action;