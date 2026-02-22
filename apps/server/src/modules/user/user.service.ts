import { prisma } from "@/infra/prisma";
import { auth } from "@/modules/auth";
import { Context } from "@/app/context";
import { UserRole } from "@/types";
import { unauthenticated, unauthorized, notFound, badInput } from "@/utils";
import { Prisma } from "@/generated/prisma/client";
import { enqueuePasswordUpdated } from "@/modules/auth/jobs";
import { getUserName } from "@/modules/auth/auth";
import { config } from "@/infra/config";
import { logger } from "@/infra/logger";

const includeUser = { admin: true, seeker: true, company: true } as const;

export const requireUser = (ctx: Context) => {
  const user = ctx.session?.user;
  if (!user) unauthenticated();
  return user!;
};

export const requireAdmin = (ctx: Context) => {
  const user = requireUser(ctx);
  if (user.role !== UserRole.ADMIN) unauthorized();
  return user;
};

export const userService = {
  me: async (ctx: Context) => {
    const sessionUser = requireUser(ctx);

    const user = await prisma.user.findUnique({
      where: { id: sessionUser.id },
      include: includeUser,
    });

    if (!user) notFound("User not found");
    return user;
  },

  user: async (id: string, ctx: Context) => {
    const sessionUser = requireUser(ctx);

    if (sessionUser.role !== UserRole.ADMIN && sessionUser.id !== id) {
      unauthorized();
    }

    const user = await prisma.user.findUnique({
      where: { id },
      include: includeUser,
    });

    if (!user) notFound("User not found");
    return user;
  },

  users: async (ctx: Context) => {
    requireAdmin(ctx);

    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: includeUser,
    });
  },

  updateProfile: async (
    data: { name?: string; email?: string; phone?: string; avatar?: string },
    ctx: Context,
  ) => {
    const sessionUser = requireUser(ctx);

    const nextData = {
      ...data,
      email: data.email?.trim().toLowerCase(),
      name: data.name?.trim(),
      phone: data.phone?.trim(),
    };

    try {
      return await prisma.user.update({
        where: { id: sessionUser.id },
        data: nextData,
        include: includeUser,
      });
    } catch (e) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        badInput("Failed to update profile.");
      }
      throw e;
    }
  },

  changePassword: async (
    {
      currentPassword,
      newPassword,
    }: { currentPassword: string; newPassword: string },
    ctx: Context,
  ) => {
    requireUser(ctx);

    const result = await auth.api.changePassword({
      body: { currentPassword, newPassword, revokeOtherSessions: true },
      headers: ctx.headers,
    });

    if (!result.user) {
      badInput("Failed to change password.");
    }

    try {
      await enqueuePasswordUpdated({
        email: result.user.email,
        name: getUserName(result.user),
        appName: config.notification.mailgen.product.name,
      });
    } catch (err) {
      logger.error("Failed to enqueue password update email", { err });
    }

    return true;
  },

  deleteAccount: async (ctx: Context) => {
    const sessionUser = requireUser(ctx);

    await auth.api.revokeSessions({ headers: ctx.headers });

    await prisma.user.delete({ where: { id: sessionUser.id } });
    return true;
  },
};
