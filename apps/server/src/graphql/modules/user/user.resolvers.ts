import { Context } from "@/app/context";
import { userService } from "@/modules/user";

export const userResolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: Context) => userService.me(ctx),

    user: (_: unknown, { id }: { id: string }, ctx: Context) =>
      userService.user(id, ctx),

    users: (_: unknown, __: unknown, ctx: Context) => userService.users(ctx),
  },

  Mutation: {
    updateProfile: (
      _: unknown,
      args: { name?: string; email?: string; phone?: string; avatar?: string },
      ctx: Context,
    ) => userService.updateProfile(args, ctx),

    changePassword: (
      _: unknown,
      args: { currentPassword: string; newPassword: string },
      ctx: Context,
    ) => userService.changePassword(args, ctx),

    deleteAccount: (_: unknown, __: unknown, ctx: Context) =>
      userService.deleteAccount(ctx),
  },
};
