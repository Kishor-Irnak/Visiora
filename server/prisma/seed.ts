import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/crypto';

const prisma = new PrismaClient();

// Mock data array - using environment variables for sensitive data
const mockUsersData = [
  {
    email: process.env.SHOP_USER_EMAIL || 'user@example.com',
    password: process.env.SHOP_USER_PASSWORD || '$2b$10$8ZqkL9z8y2z5Z0y8ZqkL9u', // This should be a properly hashed password
    name: process.env.SHOP_USER_NAME || 'Demo User',
    shopifyDomain: process.env.SHOP_DOMAIN || 'example.myshopify.com',
    accessToken: process.env.SHOP_ACCESS_TOKEN || '', // Will be provided via environment
    apiKey: process.env.SHOP_API_KEY || '' // Will be provided via environment
  }
  // Add more users here when ready
];

async function main() {
  for (const userData of mockUsersData) {
    // Use upsert to handle potential duplicates
    const user = await prisma.user.upsert({
      where: {
        email: userData.email,
      },
      update: {
        password: userData.password,
        name: userData.name,
      },
      create: {
        email: userData.email,
        password: userData.password,
        name: userData.name,
      },
    });

    // Encrypt the access token and API key
    const encryptedAccessToken = encrypt(userData.accessToken);
    const encryptedApiKey = encrypt(userData.apiKey);

    // Create or update the store linked to the user
    await prisma.store.upsert({
      where: {
        shopifyDomain: userData.shopifyDomain,
      },
      update: {
        encryptedAccessToken: encryptedAccessToken,
        encryptedApiKey: encryptedApiKey,
        userId: user.id,
      },
      create: {
        shopifyDomain: userData.shopifyDomain,
        encryptedAccessToken: encryptedAccessToken,
        encryptedApiKey: encryptedApiKey,
        userId: user.id,
      },
    });

    console.log(`Upserted user ${userData.name} with store ${userData.shopifyDomain}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });