ALTER TABLE "lipy"."cart" DROP CONSTRAINT "cart_user_id_pk";--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD PRIMARY KEY ("user_id");--> statement-breakpoint
ALTER TABLE "lipy"."cart" ALTER COLUMN "user_id" SET NOT NULL;