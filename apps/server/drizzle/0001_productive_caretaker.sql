ALTER TABLE "lipy-dev"."product" DROP CONSTRAINT "product_storeId_store_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy-dev"."product" DROP COLUMN "storeId";--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInventory" ADD CONSTRAINT "variant_store_unique" UNIQUE("productVariant","storeId");