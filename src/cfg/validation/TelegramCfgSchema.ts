import * as Joi from 'joi';

/** */
export const TelegramCfgSchema = Joi.object({
  token: Joi
    .string()
    .required(),
  messageRetryDelay: Joi
    .number()
    .integer()
    .min(1)
    .required(),
  updatesInterval: Joi
    .number()
    .integer()
    .min(1)
    .required(),
  allowedUsers: Joi
    .array()
    .items(Joi.string().not().empty())
    .required()
});