import { IConfig } from "@/types";

type RequiredEnvKey =
  | "DATABASE_URL"
  | "BETTER_AUTH_SECRET"
  | "BETTER_AUTH_URL"
  | "MAILGEN_PRODUCT_NAME"
  | "MAILGEN_PRODUCT_LINK"
  | "FRONTEND_URL"
  | "RESEND_API_KEY"
  | "RESEND_FROM";

type QueueConfig = {
  retry: {
    attempts: number;
    backoff: {
      strategy: "fixed" | "exponential";
      delayMs: number;
    };
  };
  worker: {
    pollIntervalMs: number;
  };
};

const asPositiveInt = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const asBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (!value) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no"].includes(normalized)) {
    return false;
  }

  return fallback;
};

const getRequiredEnvValue = (key: RequiredEnvKey): string | undefined => {
  const value = process.env[key];
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const getOptionalEnvValue = (value: string | undefined): string | undefined => {
  if (!value) {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const serverEnv = process.env.NODE_ENV?.trim() || "development";

const resendRequiredEnvKeys: RequiredEnvKey[] =
  serverEnv === "development" ? [] : ["RESEND_API_KEY", "RESEND_FROM"];

const requiredEnvKeys: RequiredEnvKey[] = [
  "DATABASE_URL",
  "BETTER_AUTH_SECRET",
  "BETTER_AUTH_URL",
  "MAILGEN_PRODUCT_NAME",
  "MAILGEN_PRODUCT_LINK",
  "FRONTEND_URL",
  ...resendRequiredEnvKeys,
];

const missingRequiredEnv = requiredEnvKeys.filter(
  (key) => !getRequiredEnvValue(key),
);

if (missingRequiredEnv.length > 0) {
  const keys = missingRequiredEnv.join(", ");
  throw new Error(`Missing required environment variables: ${keys}`);
}

const frontendUrl = getRequiredEnvValue("FRONTEND_URL") as string;

export const config = {
  server: {
    port: asPositiveInt(process.env.PORT, 4000),
    env: serverEnv,
    corsOrigins: process.env.CORS_ORIGINS
      ? process.env.CORS_ORIGINS.split(",").map((origin) => origin.trim())
      : [frontendUrl],
    rateLimit: {
      windowMs: asPositiveInt(process.env.RATE_LIMIT_WINDOW, 900000),
      max: asPositiveInt(process.env.RATE_LIMIT_MAX, 100),
    },
  },
  database: {
    url: getRequiredEnvValue("DATABASE_URL") as string,
    redis: {
      url: process.env.REDIS_URL,
      host: process.env.REDIS_HOST ?? "localhost",
      port: asPositiveInt(process.env.REDIS_PORT, 6379),
      password: process.env.REDIS_PASSWORD,
    },
  },
  auth: {
    secret: getRequiredEnvValue("BETTER_AUTH_SECRET") as string,
    url: getRequiredEnvValue("BETTER_AUTH_URL") as string,
  },
  frontend: {
    admin: frontendUrl,
    seeker: frontendUrl,
    company: frontendUrl,
  },
  logger: {
    logtail: {
      accessToken: process.env.LOGTAIL_ACCESS_TOKEN,
    },
  },
  notification: {
    mailgen: {
      product: {
        name: getRequiredEnvValue("MAILGEN_PRODUCT_NAME") as string,
        link: getRequiredEnvValue("MAILGEN_PRODUCT_LINK") as string,
        logo: process.env.MAILGEN_PRODUCT_LOGO ?? "",
        copyright:
          process.env.MAILGEN_PRODUCT_COPYRIGHT ??
          `Copyright © ${new Date().getFullYear()} ${getRequiredEnvValue("MAILGEN_PRODUCT_NAME")}. All rights reserved.`,
      },
    },
    nodemailer: {
      host: process.env.MAILHOG_HOST?.trim() || "localhost",
      port: asPositiveInt(process.env.MAILHOG_PORT, 1025),
      secure: asBoolean(process.env.MAILHOG_SECURE, false),
      from:
        getOptionalEnvValue(process.env.MAILHOG_FROM) ??
        getOptionalEnvValue(process.env.RESEND_FROM) ??
        "Talentry <no-reply@talentry.local>",
      auth:
        getOptionalEnvValue(process.env.MAILHOG_USER) &&
        getOptionalEnvValue(process.env.MAILHOG_PASS)
          ? {
              user: getOptionalEnvValue(process.env.MAILHOG_USER) as string,
              pass: getOptionalEnvValue(process.env.MAILHOG_PASS) as string,
            }
          : undefined,
    },
    resend: {
      apiKey: getRequiredEnvValue("RESEND_API_KEY") as string,
      from: getRequiredEnvValue("RESEND_FROM") as string,
    },
  },
} satisfies IConfig;

export const queueConfig: QueueConfig = {
  retry: {
    attempts: asPositiveInt(process.env.QUEUE_RETRY_ATTEMPTS, 3),
    backoff: {
      strategy:
        process.env.QUEUE_BACKOFF_STRATEGY === "fixed" ? "fixed" : "exponential",
      delayMs: asPositiveInt(process.env.QUEUE_BACKOFF_DELAY_MS, 1000),
    },
  },
  worker: {
    pollIntervalMs: asPositiveInt(process.env.QUEUE_POLL_INTERVAL_MS, 500),
  },
};

export type { QueueConfig };
