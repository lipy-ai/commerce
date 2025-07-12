UPDATE "lipy-dev"."user" SET "address" = NULL;
ALTER TABLE "lipy-dev"."user" ALTER COLUMN "address" SET DATA TYPE uuid USING "address"::uuid;
ALTER TABLE "lipy-dev"."user" ADD CONSTRAINT "user_address_user_id_fk" FOREIGN KEY ("address") REFERENCES "lipy-dev"."user"("id") ON DELETE set null ON UPDATE no action;