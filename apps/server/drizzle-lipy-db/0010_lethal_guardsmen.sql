ALTER TABLE "lipy-dev"."productsToAdd" ADD COLUMN "variants" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy-dev"."productsToAdd" ADD COLUMN "highlights" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy-dev"."productsToAdd" ADD COLUMN "information" text;--> statement-breakpoint
ALTER TABLE "lipy-dev"."productsToAdd" ADD COLUMN "images" text[];