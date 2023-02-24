import * as Joi from '@hapi/joi';

export const configSchema = Joi.object({
  APP_NAME: Joi.string().required(),
  APP_PORT: Joi.string().required(),
  RMQ_USER: Joi.string().required(),
  RMQ_PASSWORD: Joi.string().required(),
  RMQ_HOST: Joi.string().required(),
  RMQ_PORT: Joi.number().required(),
  RMQ_PREFETCH_COUNT: Joi.number().required(),
  EXCHANGE: Joi.string().required(),
});
