ALTER TABLE "lipy-dev"."orders" ADD COLUMN "cancelReason" text;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "confirmationOtp" text;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "refunds" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "replacements" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "delivery" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ADD COLUMN "gst" jsonb[];--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" DROP COLUMN "policies";--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" DROP COLUMN "taxes";