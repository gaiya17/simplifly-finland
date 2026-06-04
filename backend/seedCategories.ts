import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CATEGORIES = [
  { slug: "adventure-nature", name: "Adventure & Nature Based Tours", heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa" },
  { slug: "culture-heritage", name: "Culture & Heritage Tour", heroImage: "https://images.unsplash.com/photo-1588598130782-690a298573ec" },
  { slug: "family-tours", name: "Family Tours", heroImage: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5" },
  { slug: "wild-life", name: "Wild Life Tours", heroImage: "https://images.unsplash.com/photo-1571607389053-670851a6e0fc" },
  { slug: "romantic-tours", name: "Romantic Tours", heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
  { slug: "sustainable-tours", name: "Sustainable Tours", heroImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
  { slug: "sports-adventure", name: "Sports & Adventure Tours", heroImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa" },
  { slug: "wellness-ayurveda", name: "Wellness & Ayurveda Tours", heroImage: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07" },
];

async function seed() {
  for (const cat of CATEGORIES) {
    await prisma.tourCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, desc: "Explore " + cat.name }
    });
  }
  console.log('Categories seeded!');
  await prisma.$disconnect();
}

seed();
