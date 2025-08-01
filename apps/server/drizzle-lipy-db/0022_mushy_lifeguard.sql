ALTER TABLE "lipy-dev"."store" ADD COLUMN "location" "geography";--> statement-breakpoint
CREATE INDEX "address_spatial_index" ON "lipy-dev"."address" USING gist ("location");--> statement-breakpoint
CREATE INDEX "store_spatial_index" ON "lipy-dev"."store" USING gist ("location");