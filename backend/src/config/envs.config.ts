import 'dotenv/config';
import * as Joi from 'joi';

type NodeEnv = 'development' | 'production' | 'test';

interface EnvVars {
  PORT: number;
  NODE_ENV: NodeEnv;
  DATABASE_URL: string;
  COOKIE_SECRET: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  MP_ACCESS_TOKEN: string;
  MP_PUBLIC_KEY: string;
  MP_WEBHOOK_SECRET: string;
}

const envVarsSchema = Joi.object({
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  DATABASE_URL: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  MP_ACCESS_TOKEN: Joi.string().description('Mercado Pago access token'),
  MP_PUBLIC_KEY: Joi.string().required().description('Mercado Pago public key'),
  MP_WEBHOOK_SECRET: Joi.string().description('Mercado Pago webhook secret'),
}).unknown(true);

const validatedEnvVars = envVarsSchema.validate(process.env);

if (validatedEnvVars.error) {
  throw new Error(`Config validation error: ${validatedEnvVars.error.message}`);
}

const envVars = validatedEnvVars.value as EnvVars;

export const envs = {
  port: envVars.PORT,
  nodeEnv: envVars.NODE_ENV,
  databaseUrl: envVars.DATABASE_URL,
  cookieSecret: envVars.COOKIE_SECRET,
  jwtSecret: envVars.JWT_SECRET,
  jwtRefreshSecret: envVars.JWT_REFRESH_SECRET,
  mp: {
    accessToken: envVars.MP_ACCESS_TOKEN,
    publicKey: envVars.MP_PUBLIC_KEY,
    webhookSecret: envVars.MP_WEBHOOK_SECRET,
  },
};
