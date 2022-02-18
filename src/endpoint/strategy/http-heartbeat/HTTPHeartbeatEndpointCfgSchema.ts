import * as Joi from 'joi';

/** */
export const HTTPHeartbeatEndpointCfgSchema = Joi.object({
  url: Joi.string().required(),
  interval: Joi.number().integer().min(1).required(),
});