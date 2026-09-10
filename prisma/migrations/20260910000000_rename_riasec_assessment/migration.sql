UPDATE "assessments"
SET "name" = 'Tes RIASEC'
WHERE "slug" = 'holland_riasec';

UPDATE "assessment_versions"
SET
  "title" = 'Tes RIASEC v1',
  "description" = 'Versi awal asesmen Tes RIASEC.'
WHERE "assessment_id" IN (
  SELECT "id"
  FROM "assessments"
  WHERE "slug" = 'holland_riasec'
)
  AND "version" = 'v1';
