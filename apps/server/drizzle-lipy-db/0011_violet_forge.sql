ALTER TABLE "lipy-dev"."devices" RENAME COLUMN "fcmToken" TO "pushToken";--> statement-breakpoint
ALTER TABLE "lipy-dev"."devices" DROP COLUMN "fcmTokenUpdatedAt";