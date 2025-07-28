ALTER TABLE "lipy-dev"."category" ADD COLUMN "parent_id" uuid;--> statement-breakpoint
ALTER TABLE "lipy-dev"."category" ADD CONSTRAINT "category_parent_id_category_id_fk" FOREIGN KEY ("parent_id") REFERENCES "lipy-dev"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."address" DROP COLUMN "lat";--> statement-breakpoint
ALTER TABLE "lipy-dev"."address" DROP COLUMN "lng";--> statement-breakpoint
ALTER TABLE "lipy-dev"."category" ADD CONSTRAINT "no_self_parenting" CHECK ("lipy-dev"."category"."parent_id" IS NULL OR "lipy-dev"."category"."parent_id" != "lipy-dev"."category"."id");

