import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main(): Promise<void> {
  console.log("🌱 Seeding DEPANNI.ma...");

  const passwordHash = await bcrypt.hash("Depanni@2026!", SALT_ROUNDS);

  const categories = [
    { slug: "plomberie", nameFr: "Plomberie", nameAr: "السباكة" },
    { slug: "electricite", nameFr: "Électricité", nameAr: "الكهرباء" },
    { slug: "climatisation", nameFr: "Climatisation", nameAr: "التكييف" },
    { slug: "serrurerie", nameFr: "Serrurerie", nameAr: "الأقفال" },
    { slug: "peinture", nameFr: "Peinture", nameAr: "الدهان" },
    { slug: "mecanique", nameFr: "Mécanique", nameAr: "الميكانيك" },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
  }

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@depanni.ma" },
    create: {
      email: "admin@depanni.ma",
      phone: "+212600000001",
      passwordHash,
      role: "ADMIN",
      isVerified: true,
    },
    update: { isVerified: true },
  });
  console.log("  ✓ Admin:", adminUser.email);

  const citizenData = [
    { email: "fatima@example.ma", phone: "+212612345678", firstName: "Fatima", lastName: "Alaoui" },
    { email: "youssef@example.ma", phone: "+212698765432", firstName: "Youssef", lastName: "Bennani" },
    { email: "sara@example.ma", phone: "+212655443322", firstName: "Sara", lastName: "Idrissi" },
  ];

  for (const c of citizenData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      create: {
        email: c.email,
        phone: c.phone,
        passwordHash,
        role: "CITIZEN",
        isVerified: true,
      },
      update: { isVerified: true },
    });

    await prisma.citizen.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        firstName: c.firstName,
        lastName: c.lastName,
        addresses: [
          {
            label: "HOME",
            city: "Casablanca",
            formatted: "Maarif, Casablanca",
            lat: 33.5731,
            lng: -7.5898,
          },
        ],
      },
      update: { firstName: c.firstName, lastName: c.lastName },
    });
    console.log("  ✓ Citoyen:", c.email);
  }

  const artisanData = [
    {
      email: "ahmed.plombier@example.ma",
      phone: "+212611111111",
      firstName: "Ahmed",
      lastName: "Tazi",
      specialty: "plomberie",
      tier: "STANDARD" as const,
      lat: 33.58,
      lng: -7.61,
    },
    {
      email: "karim.elec@example.ma",
      phone: "+212622222222",
      firstName: "Karim",
      lastName: "Fassi",
      specialty: "electricite",
      tier: "PREMIUM" as const,
      lat: 33.59,
      lng: -7.62,
    },
    {
      email: "nadia.clim@example.ma",
      phone: "+212633333333",
      firstName: "Nadia",
      lastName: "Cherkaoui",
      specialty: "climatisation",
      tier: "PRO" as const,
      lat: 33.57,
      lng: -7.58,
    },
    {
      email: "omar.serrurier@example.ma",
      phone: "+212644444444",
      firstName: "Omar",
      lastName: "Berrada",
      specialty: "serrurerie",
      tier: "STANDARD" as const,
      lat: 33.56,
      lng: -7.57,
    },
    {
      email: "leila.peinture@example.ma",
      phone: "+212655555555",
      firstName: "Leila",
      lastName: "Amrani",
      specialty: "peinture",
      tier: "PREMIUM" as const,
      lat: 33.55,
      lng: -7.56,
    },
  ];

  for (const a of artisanData) {
    const user = await prisma.user.upsert({
      where: { email: a.email },
      create: {
        email: a.email,
        phone: a.phone,
        passwordHash,
        role: "ARTISAN",
        isVerified: true,
      },
      update: { isVerified: true },
    });

    const artisan = await prisma.artisan.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        firstName: a.firstName,
        lastName: a.lastName,
        bio: `Artisan ${a.specialty} certifié DEPANNI`,
        specialties: [a.specialty],
        kycStatus: "APPROVED",
        kycDocUrls: [],
        subscriptionTier: a.tier,
        lat: a.lat,
        lng: a.lng,
        badgeVerified: true,
        availabilityStatus: "ONLINE",
        zones: ["Casablanca", "Maarif"],
        rating: 4.5 + Math.random() * 0.5,
        hourlyRate: 150 + Math.floor(Math.random() * 100),
      },
      update: {
        kycStatus: "APPROVED",
        badgeVerified: true,
        availabilityStatus: "ONLINE",
      },
    });

    await prisma.$executeRaw`
      UPDATE artisans
      SET location = ST_SetSRID(ST_MakePoint(${a.lng}, ${a.lat}), 4326)::geography
      WHERE id = ${artisan.id}
    `;

    await prisma.wallet.upsert({
      where: { artisanId: artisan.id },
      create: { artisanId: artisan.id, balance: 0 },
      update: {},
    });

    const existingSub = await prisma.artisanSubscription.findFirst({
      where: { artisanId: artisan.id, isActive: true },
    });
    if (!existingSub) {
      await prisma.artisanSubscription.create({
        data: {
          artisanId: artisan.id,
          tier: a.tier,
          price: a.tier === "PRO" ? 350 : a.tier === "PREMIUM" ? 150 : 0,
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          isActive: true,
        },
      });
    }

    console.log("  ✓ Artisan:", a.email, `(${a.tier})`);
  }

  await prisma.$executeRaw`
    UPDATE artisans
    SET location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
    WHERE lat IS NOT NULL AND lng IS NOT NULL
  `;

  console.log("\n✅ Seed terminé.");
  console.log("   Admin     : admin@depanni.ma / Depanni@2026!");
  console.log("   Citoyens  : fatima@, youssef@, sara@example.ma");
  console.log("   Artisans  : *@example.ma (5 comptes)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
