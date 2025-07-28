ALTER TABLE "lipy-dev"."productsToAdd" RENAME COLUMN "search_vector" TO "searchVector";--> statement-breakpoint
DROP INDEX "lipy-dev"."productsToAdd_search_idx";--> statement-breakpoint
CREATE INDEX "productsToAdd_search_idx" ON "lipy-dev"."productsToAdd" USING gin ("searchVector");