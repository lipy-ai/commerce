CREATE TABLE "lipy"."customer" (
	"storeId" uuid,
	"userId" uuid,
	CONSTRAINT "customer_storeId_userId_pk" PRIMARY KEY("storeId","userId")
);
--> statement-breakpoint
ALTER TABLE "lipy"."customer" ADD CONSTRAINT "customer_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lipy"."customer" ADD CONSTRAINT "customer_userId_store_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy"."store"("id") ON DELETE cascade ON UPDATE no action;