import prisma from '../lib/prisma.js';
console.log('PRISMA_TYPE', typeof prisma);
console.log('PRISMA_KEYS', Object.keys(prisma));
console.log('PRISMA_USER', prisma.user);
console.log('PRISMA_PRODUCT', prisma.product);
console.log('PRISMA_DEFAULT', prisma.default);
