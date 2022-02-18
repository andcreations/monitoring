import { BusService } from '@andcreations/nestjs-common';
import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';

import {
  EndpointFailedToStartBusEvent,
  EndpointFailedToStopBusEvent,
  EndpointsBusTopics,
} from '../bus';
import { CfgService } from '../../cfg/service';
import { Endpoint } from '../endpoint';
import { EndpointFactory } from './EndpointFactory';

/** */
@Injectable()
export class EndpointService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  /** */
  private readonly endpoints: Endpoint<unknown>[] = [];

  /** */
  constructor(
    private readonly bus: BusService,
    private readonly cfgService: CfgService,
    private readonly endpointsFactory: EndpointFactory,
  ) {}

  /** */
  async onApplicationBootstrap(): Promise<void> {
    await this.createEndpoints();
  }

  /** */
  async onApplicationShutdown(): Promise<void> {
  }

  /** */
  private async createEndpoints(): Promise<void> {
    const cfg = this.cfgService.getCfg();
    for (const endpointCfg of cfg.endpoints) {
      const endpoint = await this.endpointsFactory.createEndpoint(endpointCfg);
      this.endpoints.push(endpoint);
    }
  }

  /** */
  private async startEndpoint(endpoint: Endpoint<unknown>): Promise<void> {
    try {
      await endpoint.start();
    } catch (error) {
      const event: EndpointFailedToStartBusEvent = {
        endpointName: endpoint.getName(),
        error,
      };
      this.bus.emit<EndpointFailedToStartBusEvent>(
        EndpointsBusTopics.EndpointFailedToStart,
        event
      );
    } 
  }

  /** */
  async startEndpoints(): Promise<void> {
    for (const endpoint of this.endpoints) {
      await this.startEndpoint(endpoint);
    }
  }

  /** */
  private async stopEndpoint(endpoint: Endpoint<unknown>): Promise<void> {
    try {
      await endpoint.stop();
    } catch (error) {
      const event: EndpointFailedToStopBusEvent = {
        endpointName: endpoint.getName(),
        error,
      };
      this.bus.emit<EndpointFailedToStopBusEvent>(
        EndpointsBusTopics.EndpointFailedToStop,
        event
      );
    } 
  }

  /** */
  async stopEndpoints(): Promise<void> {
    for (const endpoint of this.endpoints) {
      await this.stopEndpoint(endpoint);
    }
  }

  /** */
  getEndpoints(): Endpoint<unknown>[] {
    return this.endpoints;
  }
}