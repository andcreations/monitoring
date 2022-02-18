import { MonitoringError } from '../../error';

/** */
export class PropertiesError extends MonitoringError {
  /** */
  static readonly CODE = 'properties-error';

  /** */
  constructor(msg: string) {
    super(PropertiesError.CODE, msg);
  }
}