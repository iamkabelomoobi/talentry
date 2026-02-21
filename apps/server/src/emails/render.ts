import Mailgen from "mailgen";
import { config } from "@/infra/config";

type MailgenTheme = "default" | "cerberus" | "salted";

const themes: MailgenTheme[] = ["default", "cerberus", "salted"];

const mailgenInstances = new Map<MailgenTheme, Mailgen>();

const getOrCreateMailgen = (theme: MailgenTheme): Mailgen => {
  const existingInstance = mailgenInstances.get(theme);
  if (existingInstance) {
    return existingInstance;
  }

  const instance = new Mailgen({
    theme,
    product: {
      name: config.notification.mailgen.product.name,
      link: config.notification.mailgen.product.link,
      logo: config.notification.mailgen.product.logo,
      copyright: config.notification.mailgen.product.copyright,
    },
  });

  mailgenInstances.set(theme, instance);
  return instance;
};

themes.forEach((theme) => {
  getOrCreateMailgen(theme);
});

export const getMailgenInstance = (theme: MailgenTheme = "default"): Mailgen =>
  getOrCreateMailgen(theme);

export const renderHtmlEmail = (
  template: Mailgen.Content,
  theme: MailgenTheme = "default",
): string => getMailgenInstance(theme).generate(template);

export const renderTextEmail = (
  template: Mailgen.Content,
  theme: MailgenTheme = "default",
): string => getMailgenInstance(theme).generatePlaintext(template);

export type { MailgenTheme };
