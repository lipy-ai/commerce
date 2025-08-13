CREATE TABLE "lipy-dev"."coupons" (
	"id" uuid PRIMARY KEY NOT NULL,
	"storeId" uuid NOT NULL,
	"description" text,
	"discountType" text,
	"discountValue" numeric(10, 2),
	"minimumOrderValue" numeric(10, 2),
	"status" text DEFAULT 'active',
	"createdAt" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lipy-dev"."coupons" ADD CONSTRAINT "coupons_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy-dev"."store"("id") ON DELETE cascade ON UPDATE no action;