import { MonitoringError } from '../../error';

/** */
export class HTTPResponseError extends MonitoringError {
  /** */
  static readonly CODE = 'http-response-error';

  /** */
  constructor(
    private readonly httpStatus: number,
    private readonly httpStatusText: string,
    msg: string,
  ) {
    super(
      HTTPResponseError.CODE,
      `[${httpStatus} ${httpStatusText}] ${msg}`,
    );
  }

  /** */
  getHTTPStatus(): number {
    return this.httpStatus;
  }

  /** */
  getHTTPStatusText(): string {
    return this.httpStatusText;
  }
}