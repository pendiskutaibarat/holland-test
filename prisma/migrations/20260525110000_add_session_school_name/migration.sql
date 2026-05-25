ALTER TABLE "sessions" ADD COLUMN "school_name" TEXT;

UPDATE "sessions"
SET "school_name" = "name"
WHERE "school_name" IS NULL;

ALTER TABLE "sessions" ALTER COLUMN "school_name" SET NOT NULL;
