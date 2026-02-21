import { AdminType, UserRole } from "@/types";
import { prisma } from "@/infra/prisma";

export type AuthHookUser = {
  id: string;
  role?: unknown;
  name?: unknown;
};

type UpsertDelegate = {
  upsert: (args: {
    where: { userId: string };
    update: Record<string, unknown>;
    create: Record<string, unknown>;
  }) => Promise<unknown>;
};

type PrismaRoleDelegates = {
  admin?: UpsertDelegate;
  company?: UpsertDelegate;
  seeker?: UpsertDelegate;
};

const asUserRole = (role: unknown): UserRole => {
  if (
    role === UserRole.ADMIN ||
    role === UserRole.SEEKER ||
    role === UserRole.COMPANY
  ) {
    return role;
  }

  return UserRole.SEEKER;
};

export const createRoleRecord = async (user: AuthHookUser): Promise<void> => {
  const role = asUserRole(user.role);
  const roleDelegates = prisma as unknown as PrismaRoleDelegates;

  if (role === UserRole.ADMIN) {
    if (!roleDelegates.admin) {
      return;
    }

    await roleDelegates.admin.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id, type: AdminType.SUPER_ADMIN },
    });
    return;
  }

  if (role === UserRole.COMPANY) {
    if (!roleDelegates.company) {
      return;
    }

    const companyName =
      typeof user.name === "string" && user.name.trim().length > 0
        ? user.name.trim()
        : "New Company";

    await roleDelegates.company.upsert({
      where: { userId: user.id },
      update: { name: companyName },
      create: { userId: user.id, name: companyName },
    });
    return;
  }

  if (!roleDelegates.seeker) {
    return;
  }

  await roleDelegates.seeker.upsert({
    where: { userId: user.id },
    update: {},
    create: { userId: user.id },
  });
};
