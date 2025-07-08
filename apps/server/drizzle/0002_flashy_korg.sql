CREATE TABLE "lipy-dev"."storePayments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"acceptedPayments" text[] NOT NULL,
	"upiIds" jsonb[]
);
--> statement-breakpoint
DROP TABLE "lipy-dev"."storeAddress" CASCADE;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "type" text;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storePayments" ADD CONSTRAINT "storePayments_id_store_id_fk" FOREIGN KEY ("id") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;