ALTER TABLE "lipy-dev"."productVariant" ALTER COLUMN "price" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "lipy-dev"."productVariant" ALTER COLUMN "price" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy-dev"."productVariant" ALTER COLUMN "maxPrice" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "lipy-dev"."productVariant" ALTER COLUMN "maxPrice" SET NOT NULL;