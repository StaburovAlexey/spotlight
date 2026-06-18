import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { hash } from "argon2";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is required");
}
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function createStartAdmin() {
  const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error(
      "One of the fields required to create the first user is missing from the .env file.",
    );
  }
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: ADMIN_EMAIL }, { username: ADMIN_USERNAME }],
    },
  });
  if (existingUser) {
    console.log("A seed user with this email or username already exists");
    return;
  }
  const passwordHash = await hash(ADMIN_PASSWORD);
  await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      displayName: ADMIN_USERNAME,
      role: "ADMIN",
      mustChangePassword: false,
      passwordHash: passwordHash,
    },
  });
}
createStartAdmin()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
