import { auth } from "@/modules/auth";
import { prisma } from "@/infra/prisma";
import { getBetterAuthHeaders } from "@/utils/headers";
import { Request, Response } from "express";

export type Context = {
  prisma: typeof prisma;
  session: Awaited<ReturnType<typeof auth.api.getSession>> | null;
  headers: Headers;
};

export const createContext = async ({
  req,
  res,
}: {
  req: Request;
  res: Response;
}): Promise<Context> => {
  const headers = getBetterAuthHeaders(req.headers);
  return {
    prisma,
    headers,
    session: await auth.api.getSession({ headers }),
  };
};
