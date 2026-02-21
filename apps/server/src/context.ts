import { prisma } from "@/prisma/client";

export type Context = {
  prisma: typeof prisma;
};

export const createContext = async (): Promise<Context> => ({
  prisma,
});
