ALTER TABLE "lipy"."cart" DROP CONSTRAINT "cart_organization_id_org_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy"."cart" DROP CONSTRAINT "cart_user_id_organization_id_pk";--> statement-breakpoint
ALTER TABLE "lipy"."cart" ADD CONSTRAINT "cart_user_id_pk" PRIMARY KEY("user_id");--> statement-breakpoint
ALTER TABLE "lipy"."cart" DROP COLUMN "organization_id";