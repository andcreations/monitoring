/** */
export class MonitoringError extends Error {
  /** */
  constructor(private readonly code: string, private readonly msg: string) {
    super(msg);
  }

  /** */
  getCode(): string {
    return this.code;
  }

  /** */
  getMessage(): string {
    return this.message;
  }
}