import { MonitoringError } from 'error';

/** */
export class InvalidEndpointCfgError extends MonitoringError {
  /** */
  static readonly CODE = 'invalid-endpoint-cfg-error';

  /** */
  constructor(msg: string) {
    super(InvalidEndpointCfgError.CODE, msg);
  }
}