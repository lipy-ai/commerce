ALTER TABLE "lipy-dev"."user" DROP CONSTRAINT "user_address_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "openingHour" time NOT NULL DEFAULT '00:00';--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "closingHour" time NOT NULL DEFAULT '00:00';--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "deliveryDistance" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "freeDeliveryDistance" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "deliveryChargePerKm" real DEFAULT 1 NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "gstTax" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy-dev"."user" ADD CONSTRAINT "user_address_userAddress_id_fk" FOREIGN KEY ("address") REFERENCES "lipy-dev"."userAddress"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" DROP COLUMN "delivery";--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" DROP COLUMN "gst";