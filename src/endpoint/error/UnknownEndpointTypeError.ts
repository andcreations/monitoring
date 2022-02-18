import { MonitoringError } from '../../error';

/** */
export class UnknownEndpointTypeError extends MonitoringError {
  /** */
  static readonly CODE = 'unknown-endpoint-type-error';

  /** */
  constructor(type: string) {
    super(UnknownEndpointTypeError.CODE, `Unknown endpoint type ${type}`);
  }
}