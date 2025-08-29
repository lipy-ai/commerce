CREATE TABLE "lipy-dev"."devices" (
	"id" uuid PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"fcmToken" text NOT NULL,
	"platform" text,
	"fcmTokenUpdatedAt" timestamp with time zone,
	"lastSeenAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "lipy-dev"."devices" ADD CONSTRAINT "devices_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "lipy-dev"."user"("id") ON DELETE cascade ON UPDATE no action;