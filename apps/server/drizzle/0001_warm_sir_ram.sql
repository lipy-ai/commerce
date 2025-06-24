ALTER TABLE "lipy"."product" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "maxPrice" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "images" text[];--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "type" text NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "highlights" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy"."product" ADD COLUMN "information" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy"."product" DROP COLUMN "content";--> statement-breakpoint
ALTER TABLE "lipy"."product" DROP COLUMN "brand";--> statement-breakpoint
ALTER TABLE "lipy"."product" DROP COLUMN "keywords";