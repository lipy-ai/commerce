CREATE TABLE "lipy"."storeAddress" (
	"id" uuid PRIMARY KEY NOT NULL,
	"storeId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lipy"."userAddress" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lipy"."address" DROP CONSTRAINT "address_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy"."store" ADD COLUMN "email" text;--> statement-breakpoint
ALTER TABLE "lipy"."store" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "lipy"."storeAddress" ADD CONSTRAINT "storeAddress_id_address_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."address"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."storeAddress" ADD CONSTRAINT "storeAddress_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."userAddress" ADD CONSTRAINT "userAddress_id_address_id_fk" FOREIGN KEY ("id") REFERENCES "lipy"."address"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."userAddress" ADD CONSTRAINT "userAddress_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."address" DROP COLUMN "userId";