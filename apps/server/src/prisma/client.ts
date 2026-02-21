import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to start the server.");
}

const globalForPrisma = globalThis as typeof globalThis & {
  prismaAdapter?: PrismaPg;
  prisma?: PrismaClient;
};

const adapter =
  globalForPrisma.prismaAdapter ?? new PrismaPg({ connectionString });

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaAdapter = adapter;
  globalForPrisma.prisma = prisma;
}

const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const asPositiveInt = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export type ConnectDatabaseOptions = {
  retries?: number;
  retryDelayMs?: number;
};

export const connectDatabase = async (
  options: ConnectDatabaseOptions = {},
): Promise<void> => {
  const retries =
    options.retries ??
    asPositiveInt(process.env.DB_CONNECT_RETRIES, 5);
  const retryDelayMs =
    options.retryDelayMs ??
    asPositiveInt(process.env.DB_CONNECT_RETRY_DELAY_MS, 2000);

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      await prisma.$connect();
      if (attempt > 1) {
        console.info(`[db] Connected after ${attempt} attempts.`);
      }
      return;
    } catch (error) {
      if (attempt > retries) {
        throw error;
      }

      console.warn(
        `[db] Connection attempt ${attempt} failed. Retrying in ${retryDelayMs}ms...`,
      );
      await sleep(retryDelayMs);
    }
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  await prisma.$disconnect();
};

export { prisma };
