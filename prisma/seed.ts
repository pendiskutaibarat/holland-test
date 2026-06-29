import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "./generated/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { assessmentCatalog, ASSESSMENT_SLUGS } from "../src/data/assessments";
import {
  minatHobiCategories,
  minatHobiQuestions,
  minatHobiScale,
} from "../src/data/minatHobi";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function seedAssessments() {
  for (const item of assessmentCatalog) {
    const assessment = await prisma.assessment.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        engine_key: item.engineKey,
        is_active: true,
      },
      create: {
        slug: item.slug,
        name: item.name,
        description: item.description,
        engine_key: item.engineKey,
        is_active: true,
      },
    });

    await prisma.assessmentVersion.upsert({
      where: {
        assessment_id_version: {
          assessment_id: assessment.id,
          version: item.defaultVersion,
        },
      },
      update: {
        title: `${item.name} ${item.defaultVersion}`,
        description: item.description,
        scoring_key: item.engineKey,
        question_count: item.questionCount,
        is_active: true,
      },
      create: {
        assessment_id: assessment.id,
        version: item.defaultVersion,
        title: `${item.name} ${item.defaultVersion}`,
        description: item.description,
        scoring_key: item.engineKey,
        question_count: item.questionCount,
        is_active: true,
      },
    });
  }

  const minatHobi = await prisma.assessment.findUniqueOrThrow({
    where: { slug: ASSESSMENT_SLUGS.minatHobi },
  });
  await prisma.assessmentVersion.updateMany({
    where: {
      assessment_id: minatHobi.id,
      version: "v1",
    },
    data: {
      is_active: false,
    },
  });
  const minatHobiVersion = await prisma.assessmentVersion.findUniqueOrThrow({
    where: {
      assessment_id_version: {
        assessment_id: minatHobi.id,
        version: "v2",
      },
    },
  });

  const categoryIds = new Map<string, string>();

  for (const [index, category] of minatHobiCategories.entries()) {
    const record = await prisma.assessmentCategory.upsert({
      where: {
        assessment_id_code: {
          assessment_id: minatHobi.id,
          code: category.code,
        },
      },
      update: {
        name: category.name,
        description: category.description,
        activities: category.activities,
        display_order: index + 1,
      },
      create: {
        assessment_id: minatHobi.id,
        code: category.code,
        name: category.name,
        description: category.description,
        activities: category.activities,
        display_order: index + 1,
      },
    });
    categoryIds.set(category.code, record.id);
  }

  for (const [index, scale] of minatHobiScale.entries()) {
    await prisma.assessmentScaleOption.upsert({
      where: {
        assessment_version_id_code: {
          assessment_version_id: minatHobiVersion.id,
          code: scale.code,
        },
      },
      update: {
        label: scale.label,
        score: scale.score,
        display_order: index + 1,
      },
      create: {
        assessment_version_id: minatHobiVersion.id,
        code: scale.code,
        label: scale.label,
        score: scale.score,
        display_order: index + 1,
      },
    });
  }

  for (const question of minatHobiQuestions) {
    await prisma.assessmentQuestion.upsert({
      where: {
        assessment_version_id_question_number: {
          assessment_version_id: minatHobiVersion.id,
          question_number: question.number,
        },
      },
      update: {
        category_id: categoryIds.get(question.categoryCode) ?? null,
        statement: question.statement,
        display_order: question.number,
        is_active: true,
      },
      create: {
        assessment_version_id: minatHobiVersion.id,
        category_id: categoryIds.get(question.categoryCode) ?? null,
        question_number: question.number,
        statement: question.statement,
        display_order: question.number,
        is_active: true,
      },
    });
  }
}

async function main() {
  await seedAssessments();

  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn(
      "Warning: ADMIN_EMAIL or ADMIN_PASSWORD not set. Using defaults.",
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`User with email ${email} already exists. Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      password_hash: passwordHash,
      name: email.split("@")[0],
      role: "ADMIN",
      status: "ACTIVE",
    },
  });

  console.log(`Admin user created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
