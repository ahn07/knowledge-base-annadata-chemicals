import { PrismaClient } from '@prisma/client';
console.log('PrismaClient', typeof PrismaClient, PrismaClient.name);
const prisma = new PrismaClient();
console.log('prisma type', typeof prisma);
console.log('has user', prisma.user !== undefined);
console.log('has product', prisma.product !== undefined);
console.log('user keys', Object.keys(prisma).slice(0,20));
await prisma.$disconnect();
