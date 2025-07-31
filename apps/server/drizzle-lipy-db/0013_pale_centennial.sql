ALTER TABLE "lipy-dev"."productsToAdd" RENAME TO "reviewProducts";--> statement-breakpoint
DROP INDEX "lipy-dev"."productsToAdd_search_idx";--> statement-breakpoint
ALTER TABLE "lipy-dev"."reviewProducts" ADD COLUMN "storeId" uuid;--> statement-breakpoint
ALTER TABLE "lipy-dev"."reviewProducts" ADD CONSTRAINT "reviewProducts_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "reviewProducts_search_idx" ON "lipy-dev"."reviewProducts" USING gin ("searchVector");