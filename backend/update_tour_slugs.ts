import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

async function main() {
  const tours = await prisma.tourPackage.findMany({
    where: { slug: null }
  });

  for (const tour of tours) {
    const slug = generateSlug(tour.title);
    await prisma.tourPackage.update({
      where: { id: tour.id },
      data: { slug }
    });
    console.log(`Updated tour ${tour.title} with slug ${slug}`);
  }
  console.log("Done updating slugs!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
