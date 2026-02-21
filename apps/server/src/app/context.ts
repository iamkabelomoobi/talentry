import { Request, Response } from "express";
import { prisma } from "@/infra/prisma";
import { getSessionFromHeaders, Session } from "@/auth/services/session.service";

export type Context = {
  prisma: typeof prisma;
  session: Session | null;
};

export const createContext = async ({
  req,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => ({
  prisma,
  session: await getSessionFromHeaders(req.headers),
});
