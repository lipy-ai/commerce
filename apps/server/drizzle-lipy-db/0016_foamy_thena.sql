-- 1. Drop the column
ALTER TABLE "lipy-dev"."reviewProducts" 
DROP COLUMN "category";

-- 2. Add the column back
ALTER TABLE "lipy-dev"."reviewProducts"
ADD COLUMN "category" UUID;

-- 3. Add the foreign key constraint
ALTER TABLE "lipy-dev"."reviewProducts"
ADD CONSTRAINT "reviewProducts_category_category_id_fk"
FOREIGN KEY ("category") REFERENCES "lipy-dev"."category"("id")
ON DELETE SET NULL
ON UPDATE NO ACTION;