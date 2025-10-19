import { PrismaClient } from '@prisma/client';

// Prefer DIRECT_URL (used by prisma schema/migrations). Fall back to DATABASE_URL for runtime.
const connectionUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;

if (!connectionUrl) {
  throw new Error(
    'Missing database connection URL. Set DIRECT_URL (for migrations) or DATABASE_URL (for runtime) in your environment.'
  );
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: connectionUrl }
  }
});

export default prisma;
