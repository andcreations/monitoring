import { Injectable } from '@nestjs/common';
import { BusService, LogService } from '@andcreations/nestjs-common';

import { EndpointCfg } from '../../cfg/model';
import { HTTPService } from '../../http/service';
import { UnknownEndpointTypeError } from '../error';
import { Endpoint, EndpointContext } from '../endpoint';
import { HTTPHeartbeatEndpoint } from '../strategy';

/** */
@Injectable()
export class EndpointFactory {
  /** */
  private readonly context: EndpointContext;

  /** */
  constructor(
    log: LogService,
    bus: BusService,
    private readonly httpService: HTTPService,
  ) {
    this.context = new EndpointContext(log, bus);
  }

  /** */
  async createEndpoint(
    endpointCfg: EndpointCfg<unknown>,
  ): Promise<Endpoint<unknown>> {
    switch (endpointCfg.type) {
      case HTTPHeartbeatEndpoint.TYPE:
        return new HTTPHeartbeatEndpoint(
          HTTPHeartbeatEndpoint.validateCfg(endpointCfg),
          this.context,
          this.httpService,
        );
      default:
        throw new UnknownEndpointTypeError(endpointCfg.type);
    }
  }
}