import { TelegramCfg } from './TelegramCfg';
import { PropertiesCfg } from './PropertiesCfg';
import { EndpointCfg } from './EndpointCfg';

/** */
export interface MonitoringCfg {
  /** Telegram configuration. */
  telegram: TelegramCfg;

  /** Properties configuration. */
  properties: PropertiesCfg;

  /** Endpoints to monitor. */
  endpoints: EndpointCfg<unknown>[];
}
