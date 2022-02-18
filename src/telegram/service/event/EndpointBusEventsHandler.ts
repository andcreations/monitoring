import { Injectable } from '@nestjs/common';
import { BusListener, BusEvent } from '@andcreations/common';
import { TelegramMessageBuilder } from '@andcreations/telegram-bot';

import {
  EndpointConnectedBusEvent,
  EndpointFailedToStartBusEvent,
  EndpointFailedToStopBusEvent,
  EndpointsBusTopics,
} from 'endpoint/bus';
import { TelegramBotMessageService } from '../TelegramBotMessageService';

/** */
@Injectable()
@BusListener()
export class EndpointBusEventsHandler {
  /** */
  constructor(
    private readonly telegramBotMessageService: TelegramBotMessageService
  ) {}

  /** */
  @BusEvent(EndpointsBusTopics.EndpointFailedToStart)
  async endpointFailedToStart(
    event: EndpointFailedToStartBusEvent,
  ): Promise<void> {
    const builder = new TelegramMessageBuilder();
    builder
      .normal('Endpoint ')
      .bold(event.endpointName)
      .normal(' failed to start');
    await this.telegramBotMessageService.broadcastMessage(builder.build());
  }

  /** */
  @BusEvent(EndpointsBusTopics.EndpointFailedToStop)
  async endpointFailedToStop(
    event: EndpointFailedToStopBusEvent,
  ): Promise<void> {
    const builder = new TelegramMessageBuilder();
    builder
      .normal('Endpoint ')
      .bold(event.endpointName)
      .normal(' failed to stop');
    await this.telegramBotMessageService.broadcastMessage(builder.build());
  }

  /** */
  @BusEvent(EndpointsBusTopics.EndpointConnected)
  async endpointConnected(
    event: EndpointConnectedBusEvent,
  ): Promise<void> {
    const builder = new TelegramMessageBuilder();
    builder
      .normal('🟢 Endpoint ')
      .bold(event.endpointName)
      .normal(' connected');
    await this.telegramBotMessageService.broadcastMessage(builder.build());
  }

  /** */
  @BusEvent(EndpointsBusTopics.EndpointDisconnected)
  async endpointDisconnected(
    event: EndpointConnectedBusEvent,
  ): Promise<void> {
    const builder = new TelegramMessageBuilder();
    builder
      .normal('🔴 Endpoint ')
      .bold(event.endpointName)
      .normal(' disconnected');
    await this.telegramBotMessageService.broadcastMessage(builder.build());
  }
}