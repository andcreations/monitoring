import { BusService, LogService } from '@andcreations/nestjs-common';

/** */
export class EndpointContext {
  /** */
  constructor(
    private readonly log: LogService,
    private readonly bus: BusService
  ) {}

  /** */
  getLog(): LogService {
    return this.log;
  }

  /** */
  getBus(): BusService {
    return this.bus;
  }
}