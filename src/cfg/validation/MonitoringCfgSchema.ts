import * as Joi from 'joi';

import { TelegramCfgSchema } from './TelegramCfgSchema';
import { PropertiesCfgSchema } from './PropertiesCfgSchema';
import { EndpointCfgSchema } from './EndpointCfgSchema';

/** */
export const MonitoringCfgSchema = Joi.object({
  telegram: TelegramCfgSchema.required(),
  properties: PropertiesCfgSchema.required(),
  endpoints: Joi
    .array()
    .items(EndpointCfgSchema)
    .required(),
});