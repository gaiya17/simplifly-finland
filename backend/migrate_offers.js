const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting migration of customOffers...');
  const resorts = await prisma.resort.findMany();
  
  let updatedCount = 0;

  for (const resort of resorts) {
    if (resort.customOffers && Array.isArray(resort.customOffers) && resort.customOffers.length > 0) {
      let needsUpdate = false;
      const updatedOffers = resort.customOffers.map(offer => {
        const newOffer = { ...offer };
        
        // Mark as fixed if missing
        if (!newOffer.offerType) {
          newOffer.offerType = 'fixed';
          needsUpdate = true;
        }

        // Set default offerName
        if (!newOffer.offerName) {
          newOffer.offerName = `${newOffer.nights} Nights Offer`;
          needsUpdate = true;
        }

        // Remove poster fields
        if (newOffer.posterUrl !== undefined) {
          delete newOffer.posterUrl;
          needsUpdate = true;
        }
        if (newOffer.posterPublicId !== undefined) {
          delete newOffer.posterPublicId;
          needsUpdate = true;
        }

        return newOffer;
      });

      if (needsUpdate) {
        await prisma.resort.update({
          where: { id: resort.id },
          data: { customOffers: updatedOffers }
        });
        updatedCount++;
        console.log(`Updated resort: ${resort.title}`);
      }
    }
  }

  console.log(`Migration completed. Updated ${updatedCount} resorts.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
