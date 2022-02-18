import * as Joi from 'joi';

/** */
export const PropertiesCfgSchema = Joi.object({
  file: Joi
    .string()
    .required(),
});