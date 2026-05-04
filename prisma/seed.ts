import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../generated/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@example.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.warn(
      "Warning: ADMIN_EMAIL or ADMIN_PASSWORD not set. Using defaults.",
    );
  }

  const existing = await prisma.admin.findUnique({
    where: { email },
  });

  if (existing) {
    console.log(`Admin with email ${email} already exists. Skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.admin.create({
    data: {
      email,
      password_hash: passwordHash,
      name: email.split("@")[0],
    },
  });

  console.log(`Admin created: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });