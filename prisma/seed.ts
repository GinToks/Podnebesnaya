import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { products } from "../data/products";

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL || "" }),
});

async function main() {
  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {
        name: p.name,
        description: p.description,
        fullDescription: p.fullDescription,
        price: p.price,
        costPrice: p.costPrice ?? null,
        category: p.category,
        legend: p.legend,
        accent: p.accent,
        stock: p.stock,
        images: JSON.stringify(p.images),
        notes: JSON.stringify(p.notes),
        offer: p.offer ? JSON.stringify(p.offer) : null,
        originalPrice: p.originalPrice ?? null,
        discountPercent: p.discountPercent ?? null,
      },
      create: {
        id: p.id,
        name: p.name,
        description: p.description,
        fullDescription: p.fullDescription,
        price: p.price,
        costPrice: p.costPrice ?? null,
        category: p.category,
        legend: p.legend,
        accent: p.accent,
        stock: p.stock,
        images: JSON.stringify(p.images),
        notes: JSON.stringify(p.notes),
        offer: p.offer ? JSON.stringify(p.offer) : null,
        originalPrice: p.originalPrice ?? null,
        discountPercent: p.discountPercent ?? null,
      },
    });
  }
  console.log(`Seeded ${products.length} products`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
