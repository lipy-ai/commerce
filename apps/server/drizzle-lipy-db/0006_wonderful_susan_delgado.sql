CREATE TABLE "lipy-dev"."productsToAdd" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"title" text,
	"search_vector" "tsvector",
	"thumbnail" text,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE INDEX "productsToAdd_search_idx" ON "lipy-dev"."productsToAdd" USING gin ("search_vector");