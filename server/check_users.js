const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany({
      select: {
          id: true,
          email: true,
          name: true,
          // password: true // keep password hidden for security in logs
      }
    });
    console.log('--- Current Users in DB ---');
    users.forEach(u => {
        console.log(`ID: ${u.id}, Email: "${u.email}", Name: "${u.name}"`);
    });
    console.log('---------------------------');
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
