import { MonitoringError } from '../../error';

/** */
export class MonitoringCfgError extends MonitoringError {
  /** */
  static readonly CODE = 'monitoring-cfg-error';

  /** */
  constructor(msg: string) {
    super(MonitoringCfgError.CODE, msg);
  }
}