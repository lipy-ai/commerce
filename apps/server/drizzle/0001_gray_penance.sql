ALTER TABLE "lipy"."product" DROP CONSTRAINT "product_organization_id_global_product_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "global_product" uuid;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD CONSTRAINT "product_global_product_global_product_id_fk" FOREIGN KEY ("global_product") REFERENCES "lipy"."global_product"("id") ON DELETE no action ON UPDATE no action;