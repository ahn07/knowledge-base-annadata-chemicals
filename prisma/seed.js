const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const email = "aahan.chemicals@annadata.com";
  const password = "chemicals@7781";

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: "admin",
    },
    create: {
      email,
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log("✅ Seeded admin user:", user.email);
}

main()
  .catch((error) => {
    console.error("❌ Error seeding:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });