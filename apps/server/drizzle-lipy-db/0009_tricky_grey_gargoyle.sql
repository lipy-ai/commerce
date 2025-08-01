ALTER TABLE "lipy-dev"."category" RENAME COLUMN "parent_id" TO "parentId";--> statement-breakpoint
ALTER TABLE "lipy-dev"."category" DROP CONSTRAINT "no_self_parenting";--> statement-breakpoint
ALTER TABLE "lipy-dev"."category" DROP CONSTRAINT "category_parent_id_category_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "totalTaxAmount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "totalDiscountAmount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "maxItemTotalAmount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "itemTotalAmount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "totalAmount" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "amountSaved" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "lipy-dev"."category" ADD CONSTRAINT "category_parentId_category_id_fk" FOREIGN KEY ("parentId") REFERENCES "lipy-dev"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."category" ADD CONSTRAINT "no_self_parenting" CHECK ("lipy-dev"."category"."parentId" IS NULL OR "lipy-dev"."category"."parentId" != "lipy-dev"."category"."id");