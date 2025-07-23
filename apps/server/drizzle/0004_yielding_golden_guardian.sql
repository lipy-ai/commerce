ALTER TABLE "lipy-dev"."storeMember" DROP CONSTRAINT "user_store_unique";--> statement-breakpoint
ALTER TABLE "lipy-dev"."customer" DROP CONSTRAINT "customer_storeId_userId_pk";--> statement-breakpoint
ALTER TABLE "lipy-dev"."authAccount" ALTER COLUMN "accessTokenExpiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authAccount" ALTER COLUMN "refreshTokenExpiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authAccount" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authAccount" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "orderedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "cancelledAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "refundedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "deliveredAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."orders" ALTER COLUMN "deliveryAgentAssignedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authSession" ALTER COLUMN "expires" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authSession" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authSession" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."store" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeInvitation" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeMember" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" ALTER COLUMN "deletedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."upload" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."user" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."user" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authVerification" ALTER COLUMN "expiresAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authVerification" ALTER COLUMN "createdAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."authVerification" ALTER COLUMN "updatedAt" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lipy-dev"."customer" ADD COLUMN "id" uuid PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "lipy-dev"."customer" ADD CONSTRAINT "customer_user_store_unique_key" UNIQUE("userId","storeId");--> statement-breakpoint
ALTER TABLE "lipy-dev"."storeMember" ADD CONSTRAINT "member_user_store_unique_key" UNIQUE("userId","storeId");