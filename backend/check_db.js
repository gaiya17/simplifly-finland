const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.tourCategory.findMany();
  console.log("Categories:", categories);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
