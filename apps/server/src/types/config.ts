export interface IRedisConfig {
  url?: string;
  host: string;
  port: number;
  password?: string;
}

export interface IServerConfig {
  port: number;
  env: string;
  corsOrigins: string[];
  rateLimit: {
    windowMs: number;
    max: number;
  };
}

export interface IDatabaseConfig {
  url: string;
  redis: IRedisConfig;
}

export interface IAuthConfig {
  secret: string;
  url: string;
}

export interface IFrontendConfig {
  admin: string;
  seeker: string;
  company: string;
}

export interface ILoggerConfig {
  logtail: {
    accessToken?: string;
  };
}

export interface IMailgenProductConfig {
  name: string;
  link: string;
  logo: string;
  copyright: string;
}

export interface INodemailerConfig {
  service?: string;
  host: string;
  port: number;
  secure: boolean;
  from: string;
  auth?: {
    user: string;
    pass: string;
  };
}

export interface IResendConfig {
  apiKey: string;
  from: string;
}

export interface INotificationConfig {
  mailgen: {
    product: IMailgenProductConfig;
  };
  nodemailer: INodemailerConfig;
  resend: IResendConfig;
}

export interface IConfig {
  server: IServerConfig;
  database: IDatabaseConfig;
  auth: IAuthConfig;
  frontend: IFrontendConfig;
  logger: ILoggerConfig;
  notification: INotificationConfig;
}
