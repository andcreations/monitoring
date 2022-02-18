import { LogService, BusService } from '@andcreations/nestjs-common';
import { 
  EndpointDisconnectedBusEvent,
  EndpointConnectedBusEvent,
  EndpointsBusTopics } from 'endpoint/bus';

import { EndpointCfg } from '../../cfg/model';
import { EndpointContext } from './EndpointContext';

/** Log tag. */
const TAG = 'endpoint';

/** */
export abstract class Endpoint<T> {
  /** */
  private disconnectionNotified = false;

  /** */
  protected constructor(
    private readonly endpointCfg: EndpointCfg<T>,
    private readonly context: EndpointContext,
  ) {
  }

  /** */
  getName(): string {
    return this.endpointCfg.name;
  }

  /** */
  isConnected(): boolean {
    return !this.disconnectionNotified;
  }

  /** */
  protected getCfg(): T {
    return this.endpointCfg.cfg;
  }

  /** */
  protected getLog(): LogService {
    return this.context.getLog();
  }

  /** */
  protected getBus(): BusService {
    return this.context.getBus();
  }

  /** */
  protected async endpointDisconnected(error?: any): Promise<void> {
  // flag
    if (this.disconnectionNotified) {
      return;
    }
    this.disconnectionNotified = true;

  // log
    this.getLog().error(
      `Endpoint ${this.getName()} lost`,
      TAG,
      error,
      { name: this.getName() },
    );

  // emit
    const event: EndpointDisconnectedBusEvent = {
      endpointName: this.getName(),
      error,
    };
    await this.getBus().emit<EndpointDisconnectedBusEvent>(
      EndpointsBusTopics.EndpointDisconnected,
      event,
    );
  }

  /** */
  protected async endpointConnected(): Promise<void> {
  // flag
    if (!this.disconnectionNotified) {
      return;
    }
    this.disconnectionNotified = false;

  // log
    this.getLog().info(
      `Endpoint ${this.getName()} recovered`,
      TAG,
      { name: this.getName() },
    );

  // emit
    const event: EndpointConnectedBusEvent = {
      endpointName: this.getName(),
    };
    await this.getBus().emit<EndpointConnectedBusEvent>(
      EndpointsBusTopics.EndpointConnected,
      event,
    );
  }

  /** */
  abstract start(): Promise<void>;

  /** */
  abstract stop(): Promise<void>;
}