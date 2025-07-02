ALTER TABLE "lipy-dev"."storeInventory" DROP CONSTRAINT "storeInventory_productVariant_product_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInventory" ADD CONSTRAINT "storeInventory_productVariant_productVariant_id_fk" FOREIGN KEY ("productVariant") REFERENCES "lipy-dev"."productVariant"("id") ON DELETE cascade ON UPDATE no action;