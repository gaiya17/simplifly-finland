import { prisma } from './src/config/db';

async function main() {
  try {
    const tours = await prisma.tourPackage.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' }
    });
    console.log("Success:", tours.length, "tours found.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}
main();
