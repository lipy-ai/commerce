ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "totalTaxAmount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "totalDiscountAmount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "maxItemTotalAmount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "itemTotalAmount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "totalAmount" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "amountSaved" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."productsToAdd" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "lipy-dev"."productsToAdd" ADD COLUMN "subCategory" text;