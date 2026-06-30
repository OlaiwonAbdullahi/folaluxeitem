/**
 * Seeds a single admin user so the /admin dashboard can be accessed.
 * No products are seeded — the catalogue starts empty and is managed via admin.
 *
 * Run with: npm run db:seed
 * Configure SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD in .env.local (defaults below).
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = (
    process.env.SEED_ADMIN_EMAIL || "olaiwonabdullahi@gmail.com"
  ).toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";
  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "admin", isActive: true },
    create: {
      firstName: "Fola",
      lastName: "Admin",
      email,
      passwordHash,
      role: "admin",
    },
  });

  console.log(`✓ Admin ready: ${admin.email}`);
  console.log("  Log in at /admin/login with the SEED_ADMIN_PASSWORD value.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
