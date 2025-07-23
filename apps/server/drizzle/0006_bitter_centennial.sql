-- 1. Drop the foreign key constraint on orders.customerId if it exists
-- (Assuming constraint name is orders_customerId_fkey; change if different)
ALTER TABLE "lipy-dev"."orders" DROP CONSTRAINT IF EXISTS "orders_customerId_fkey";

-- 2. Drop column customerId from orders
ALTER TABLE "lipy-dev"."orders" DROP COLUMN "customerId";

-- 3. Add new column userId to orders
ALTER TABLE "lipy-dev"."orders" ADD COLUMN "userId" uuid;

-- 4. Drop unique constraint from customer table
ALTER TABLE "lipy-dev"."customer" DROP CONSTRAINT IF EXISTS "customer_user_store_unique_key";

-- 5. Drop existing primary key (if any)
ALTER TABLE "lipy-dev"."customer" DROP CONSTRAINT IF EXISTS "customer_pkey";

-- 6. Add new composite primary key
ALTER TABLE "lipy-dev"."customer" ADD CONSTRAINT "customer_store_user_p_key" PRIMARY KEY("userId", "storeId");

-- 7. Drop old id column
ALTER TABLE "lipy-dev"."customer" DROP COLUMN "id";
