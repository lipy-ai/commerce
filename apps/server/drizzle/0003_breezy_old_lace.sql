/* 
    Unfortunately in current drizzle-kit version we can't automatically get name for primary key.
    We are working on making it available!

    Meanwhile you can:
        1. Check pk name in your database, by running
            SELECT constraint_name FROM information_schema.table_constraints
            WHERE table_schema = 'lipy'
                AND table_name = 'cart'
                AND constraint_type = 'PRIMARY KEY';
        2. Uncomment code below and paste pk name manually
        
    Hope to release this update as soon as possible
*/

-- ALTER TABLE "cart" DROP CONSTRAINT "<constraint_name>";--> statement-breakpoint
ALTER TABLE "lipy"."cart" ALTER COLUMN "user_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ALTER COLUMN "price" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "lipy"."address" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "lipy"."address" ADD COLUMN "lat" double precision;--> statement-breakpoint
ALTER TABLE "lipy"."address" ADD COLUMN "lng" double precision;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD COLUMN "id" uuid PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD COLUMN "variant_id" uuid;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD COLUMN "quantity" smallint DEFAULT 1;--> statement-breakpoint
ALTER TABLE "lipy"."product_variant" ADD COLUMN "max_price" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD CONSTRAINT "cart_variant_id_product_id_fk" FOREIGN KEY ("variant_id") REFERENCES "lipy"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."cart" DROP COLUMN "items";