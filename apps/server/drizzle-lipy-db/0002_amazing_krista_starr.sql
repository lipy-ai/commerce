ALTER TABLE "lipy-dev"."orders" ADD COLUMN "totalTaxAmount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "totalDiscountAmount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "maxItemTotalAmount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "itemTotalAmount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "totalAmount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "amountSaved" numeric(10, 2);