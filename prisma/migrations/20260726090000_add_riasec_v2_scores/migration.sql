ALTER TABLE "test_results"
ADD COLUMN "scoring_version" TEXT NOT NULL DEFAULT 'v1',
ADD COLUMN "ipa_score" INTEGER,
ADD COLUMN "ips_score" INTEGER,
ADD COLUMN "bahasa_score" INTEGER;
