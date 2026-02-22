import nodemailer, { type Transporter } from "nodemailer";
import { Resend } from "resend";
import { config } from "@/infra/config";
import { logger } from "@/infra/logger";

export type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

let resendClient: Resend | null = null;
let nodemailerClient: Transporter | null = null;

const extractEmailAddress = (value: string): string | null => {
  const normalized = value.trim();
  if (!normalized) {
    return null;
  }

  const angleBracketMatch = normalized.match(/<\s*([^<>\s]+@[^<>\s]+)\s*>/);
  if (angleBracketMatch?.[1]) {
    return angleBracketMatch[1];
  }

  const plainEmailMatch = normalized.match(/^[^<>\s@]+@[^<>\s@]+\.[^<>\s@]+$/);
  if (plainEmailMatch) {
    return normalized;
  }

  const domainMatch = normalized.match(/^[a-z0-9.-]+\.[a-z]{2,}$/i);
  if (domainMatch) {
    return `no-reply@${normalized.toLowerCase()}`;
  }

  return null;
};

export const getResendClient = (): Resend => {
  if (resendClient) {
    return resendClient;
  }

  resendClient = new Resend(config.notification.resend.apiKey);
  return resendClient;
};

export const getNodemailerClient = (): Transporter => {
  if (nodemailerClient) {
    return nodemailerClient;
  }

  const { host, port, secure, auth } = config.notification.nodemailer;

  nodemailerClient = nodemailer.createTransport({
    host,
    port,
    secure,
    auth,
  });

  return nodemailerClient;
};

export const sendEmail = async (payload: EmailPayload): Promise<void> => {
  if (config.server.env === "development") {
    const client = getNodemailerClient();
    const configuredFrom = config.notification.nodemailer.from;
    const envelopeFrom =
      extractEmailAddress(configuredFrom) ?? "no-reply@talentry.local";

    if (envelopeFrom !== configuredFrom) {
      logger.warn(
        `Invalid MAIL FROM configured for development ("${configuredFrom}"). Using "${envelopeFrom}" instead.`,
      );
    }

    await client.sendMail({
      from: envelopeFrom,
      envelope: {
        from: envelopeFrom,
        to: payload.to,
      },
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    });

    logger.info(`Email sent to MailHog: ${payload.subject}`);
    return;
  }

  const client = getResendClient();

  await client.emails.send({
    from: config.notification.resend.from,
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });

  logger.info(`Email queued for delivery: ${payload.subject}`);
};
