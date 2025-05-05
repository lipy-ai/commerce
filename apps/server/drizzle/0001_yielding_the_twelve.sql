CREATE TABLE "lipy"."global_category" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text,
	CONSTRAINT "global_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lipy"."global_product" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"brand" text,
	"category" uuid,
	"keywords" text[]
);
--> statement-breakpoint
CREATE TABLE "lipy"."global_tags" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text,
	"summary" text,
	"slug" text,
	"image" text
);
--> statement-breakpoint
ALTER TABLE "lipy"."category" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lipy"."product" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lipy"."sub_category" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "lipy"."category" CASCADE;--> statement-breakpoint
DROP TABLE "lipy"."product" CASCADE;--> statement-breakpoint
DROP TABLE "lipy"."sub_category" CASCADE;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" DROP CONSTRAINT "product_variant_product_product_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy"."global_product" ADD CONSTRAINT "global_product_category_global_category_id_fk" FOREIGN KEY ("category") REFERENCES "lipy"."global_category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ADD CONSTRAINT "product_variant_product_global_product_id_fk" FOREIGN KEY ("product") REFERENCES "lipy"."global_product"("id") ON DELETE cascade ON UPDATE no action;