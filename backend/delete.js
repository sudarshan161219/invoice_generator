const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function resetDB() {
  await prisma.attachment.deleteMany();
  console.log("✅ Data deleted from all tables.");
  await prisma.$disconnect();
}

resetDB();
