ALTER TABLE "lipy"."user" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy"."user" ALTER COLUMN "emailVerified" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy"."user" ADD COLUMN "phoneNumber" text;--> statement-breakpoint
ALTER TABLE "lipy"."user" ADD COLUMN "phoneNumberVerified" boolean;