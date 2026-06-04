import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Database...");

  // Hashing base passwords securely using bcryptjs
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);

  // Upsert Administrator Account
  const admin = await prisma.user.upsert({
    where: { email: "admin@simplifly.com" },
    update: {},
    create: {
      email: "admin@simplifly.com",
      name: "Simplifly Admin",
      password: hashedAdminPassword,
      role: "admin"
    }
  });
  console.log("Admin seeded:", admin.email);



  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error Seeding Database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
