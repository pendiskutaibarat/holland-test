CREATE TABLE "assessments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "engine_key" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assessment_versions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assessment_id" UUID NOT NULL,
    "version" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "scoring_key" TEXT NOT NULL,
    "question_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assessment_categories" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assessment_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "activities" JSONB,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "assessment_categories_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assessment_questions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assessment_version_id" UUID NOT NULL,
    "category_id" UUID,
    "question_number" INTEGER NOT NULL,
    "statement" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "assessment_questions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assessment_scale_options" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assessment_version_id" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "display_order" INTEGER NOT NULL,

    CONSTRAINT "assessment_scale_options_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assessment_results" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "session_id" UUID NOT NULL,
    "assessment_version_id" UUID NOT NULL,
    "legacy_result_id" UUID,
    "student_name" TEXT NOT NULL,
    "student_class" TEXT NOT NULL,
    "birth_date" DATE,
    "total_score" INTEGER NOT NULL DEFAULT 0,
    "category_scores" JSONB NOT NULL,
    "ranked_categories" JSONB NOT NULL,
    "top_categories" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_results_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "assessment_responses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "assessment_result_id" UUID NOT NULL,
    "question_id" UUID,
    "question_number" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "answer_code" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "category_code" TEXT,

    CONSTRAINT "assessment_responses_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "assessments_slug_key" ON "assessments"("slug");
CREATE UNIQUE INDEX "assessment_versions_assessment_id_version_key" ON "assessment_versions"("assessment_id", "version");
CREATE UNIQUE INDEX "assessment_categories_assessment_id_code_key" ON "assessment_categories"("assessment_id", "code");
CREATE UNIQUE INDEX "assessment_questions_assessment_version_id_question_number_key" ON "assessment_questions"("assessment_version_id", "question_number");
CREATE UNIQUE INDEX "assessment_scale_options_assessment_version_id_code_key" ON "assessment_scale_options"("assessment_version_id", "code");
CREATE UNIQUE INDEX "assessment_results_session_id_student_name_student_class_key" ON "assessment_results"("session_id", "student_name", "student_class");

ALTER TABLE "assessment_versions" ADD CONSTRAINT "assessment_versions_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assessment_categories" ADD CONSTRAINT "assessment_categories_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessment_version_id_fkey" FOREIGN KEY ("assessment_version_id") REFERENCES "assessment_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "assessment_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "assessment_scale_options" ADD CONSTRAINT "assessment_scale_options_assessment_version_id_fkey" FOREIGN KEY ("assessment_version_id") REFERENCES "assessment_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessment_version_id_fkey" FOREIGN KEY ("assessment_version_id") REFERENCES "assessment_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "assessment_responses" ADD CONSTRAINT "assessment_responses_assessment_result_id_fkey" FOREIGN KEY ("assessment_result_id") REFERENCES "assessment_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO "assessments" ("slug", "name", "description", "engine_key")
VALUES (
  'holland_riasec',
  'Holland RIASEC',
  'Tes minat dan bakat berbasis Holland Occupational Themes.',
  'holland_riasec'
),
(
  'minat_hobi',
  'Minat Hobi',
  'Pemetaan 10 area minat dan hobi siswa dari aktivitas sehari-hari.',
  'minat_hobi'
);

INSERT INTO "assessment_versions" (
  "assessment_id",
  "version",
  "title",
  "description",
  "scoring_key",
  "question_count"
)
SELECT
  "id",
  'v1',
  'Holland RIASEC v1',
  'Versi awal asesmen Holland RIASEC.',
  'holland_riasec',
  90
FROM "assessments"
WHERE "slug" = 'holland_riasec';

INSERT INTO "assessment_versions" (
  "assessment_id",
  "version",
  "title",
  "description",
  "scoring_key",
  "question_count"
)
SELECT
  "id",
  'v1',
  'Minat Hobi v1',
  'Versi awal asesmen Minat Hobi.',
  'minat_hobi',
  100
FROM "assessments"
WHERE "slug" = 'minat_hobi';

ALTER TABLE "sessions" ADD COLUMN "assessment_id" UUID;
ALTER TABLE "sessions" ADD COLUMN "assessment_version_id" UUID;

UPDATE "sessions"
SET
  "assessment_id" = (
    SELECT "id" FROM "assessments" WHERE "slug" = 'holland_riasec' LIMIT 1
  ),
  "assessment_version_id" = (
    SELECT av."id"
    FROM "assessment_versions" av
    JOIN "assessments" a ON a."id" = av."assessment_id"
    WHERE a."slug" = 'holland_riasec' AND av."version" = 'v1'
    LIMIT 1
  );

ALTER TABLE "sessions" ALTER COLUMN "assessment_id" SET NOT NULL;
ALTER TABLE "sessions" ALTER COLUMN "assessment_version_id" SET NOT NULL;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_assessment_version_id_fkey" FOREIGN KEY ("assessment_version_id") REFERENCES "assessment_versions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
