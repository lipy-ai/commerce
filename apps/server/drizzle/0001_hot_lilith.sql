ALTER TABLE "lipy"."productVariant" ADD COLUMN "stockQty" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "lipy"."store" ADD COLUMN "active" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "lipy"."productVariant" DROP COLUMN "qty";