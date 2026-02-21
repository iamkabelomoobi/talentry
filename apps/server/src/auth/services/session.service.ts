import { auth } from "@/auth/auth";
import { getBetterAuthHeaders } from "@/utils/headers";
import { IncomingHttpHeaders } from "http";

export type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export const getSessionFromHeaders = async (
  headers: IncomingHttpHeaders,
): Promise<Session | null> =>
  auth.api.getSession({
    headers: getBetterAuthHeaders(headers),
  });
