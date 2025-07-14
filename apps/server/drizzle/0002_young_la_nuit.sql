ALTER TABLE "lipy-dev"."upload" DROP CONSTRAINT "upload_uploadedBy_user_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" DROP CONSTRAINT "upload_storeId_store_id_fk";
--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" DROP COLUMN "uploadedBy";--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" DROP COLUMN "storeId";--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" DROP COLUMN "updatedAt";