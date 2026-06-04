import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Resort Categories...");

  const categories = [
    { name: "Overwater Villas", slug: "overwater-villas" },
    { name: "Romantic Getaways", slug: "romantic-getaways" },
    { name: "Family Resorts", slug: "family-resorts" },
    { name: "Diving & Snorkeling", slug: "diving-snorkeling" }
  ];

  for (const cat of categories) {
    await prisma.resortCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        name: cat.name,
        slug: cat.slug
      }
    });
    console.log(`Seeded category: ${cat.name}`);
  }

  console.log("Categories seeded successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
