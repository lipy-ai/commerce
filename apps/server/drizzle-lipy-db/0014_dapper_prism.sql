ALTER TABLE "lipy-dev"."reviewProducts" ADD COLUMN "reviewedAt" timestamptz;--> statement-breakpoint
ALTER TABLE "lipy-dev"."reviewProducts" ADD COLUMN "reviewedBy" uuid;--> statement-breakpoint
ALTER TABLE "lipy-dev"."reviewProducts" ADD CONSTRAINT "reviewProducts_reviewedBy_user_id_fk" FOREIGN KEY ("reviewedBy") REFERENCES "lipy-dev"."user"("id") ON DELETE set null ON UPDATE no action;