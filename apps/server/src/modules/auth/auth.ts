import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/infra/prisma";
import { bearer } from "better-auth/plugins/bearer";
import { UserRole } from "@/types";
import { AuthHookUser, createRoleRecord } from "@/modules/auth/auth.service";
import { config } from "@/infra/config";
import { authenticationTemplates, sendEmail } from "@/modules/email";
import { logger } from "@/infra/logger";

type AuthEmailUser = {
  email?: unknown;
  name?: unknown;
};

const appName = config.notification.mailgen.product.name;

const toOrigin = (value: string): string | null => {
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
};

const trustedOrigins = Array.from(
  new Set(
    [
      config.auth.url,
      ...config.server.corsOrigins,
      `http://localhost:${config.server.port}`,
      `http://127.0.0.1:${config.server.port}`,
    ]
      .map(toOrigin)
      .filter((origin): origin is string => Boolean(origin)),
  ),
);

const getUserEmail = (user: AuthEmailUser): string | null => {
  if (typeof user.email !== "string") {
    return null;
  }

  const normalizedEmail = user.email.trim();
  return normalizedEmail.length > 0 ? normalizedEmail : null;
};

export const getUserName = (user: AuthEmailUser): string => {
  if (typeof user.name !== "string") {
    return "there";
  }

  const normalizedName = user.name.trim();
  return normalizedName.length > 0 ? normalizedName : "there";
};

const sendWelcomeEmail = async (user: AuthEmailUser): Promise<void> => {
  const email = getUserEmail(user);
  if (!email) {
    logger.warn("Skipping welcome email because user email is missing.");
    return;
  }

  try {
    await sendEmail(
      authenticationTemplates.welcomeTemplate({
        email,
        name: getUserName(user),
        appName,
      }),
    );
  } catch (error) {
    logger.warn("Failed to send welcome email.", error);
  }
};

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins,
  advanced: {
    disableCSRFCheck: config.server.env === "development",
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      console.log(url);
      const email = getUserEmail(user as AuthEmailUser);
      if (!email) {
        throw new Error(
          "Cannot send reset password email without a valid user email.",
        );
      }

      await sendEmail(
        authenticationTemplates.passwordResetLinkTemplate({
          email,
          appName,
          resetUrl: url,
        }),
      );
    },
    onPasswordReset: async ({ user }) => {
      const email = getUserEmail(user as AuthEmailUser);
      if (!email) {
        logger.warn(
          "Skipping password update email because user email is missing.",
        );
        return;
      }

      try {
        await sendEmail(
          authenticationTemplates.passwordUpdateTemplate({
            email,
            name: getUserName(user as AuthEmailUser),
            appName,
          }),
        );
      } catch (error) {
        logger.warn("Failed to send password update email.", error);
      }
    },
  },

  emailVerification: {
    autoSignInAfterVerification: false,
    sendVerificationEmail: async ({ user, url }) => {
      const email = getUserEmail(user as AuthEmailUser);
      if (!email) {
        throw new Error(
          "Cannot send verification email without a valid user email.",
        );
      }

      await sendEmail(
        authenticationTemplates.emailVerificationTemplate({
          email,
          appName,
          verificationUrl: url,
        }),
      );
    },
    afterEmailVerification: async (user) => {
      await sendWelcomeEmail(user as AuthEmailUser);
    },
  },

  user: {
    additionalFields: {
      phone: {
        type: "string",
        required: true,
      },
      role: {
        type: "string",
        required: true,
        defaultValue: UserRole.SEEKER,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await createRoleRecord(user as AuthHookUser);
        },
      },
    },
  },

  session: {
    cookieCache: {
      enabled: true,
    },
  },
  bearer: {
    enabled: true,
  },
  secret: config.auth.secret,
  url: config.auth.url,
  plugins: [bearer()],
});
