import * as Joi from 'joi';

/** */
export const EndpointCfgSchema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  cfg: Joi.any(),
});