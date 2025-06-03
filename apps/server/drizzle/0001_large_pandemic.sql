ALTER TABLE "lipy"."orders" ADD COLUMN "pk" text;--> statement-breakpoint
ALTER TABLE "lipy"."orders" ADD CONSTRAINT "orders_pk_unique" UNIQUE("pk");