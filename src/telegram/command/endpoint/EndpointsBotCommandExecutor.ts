import { Injectable } from '@nestjs/common';
import { TelegramMessageBuilder } from '@andcreations/telegram-bot';

import { EndpointService } from '../../../endpoint/service';
import { TelegramCommand } from '../TelegramCommand';
import { TelegramBotCommandExecutor } from '../TelegramBotCommandExecutor';
import {
  TelegramBotCommandExecutorContext,
} from '../TelegramBotCommandExecutorContext';

/** */
const NAME = '/endpoints';
const DESCRIPTION = 'List endpoints'

/** */
@Injectable()
export class EndpointsBotCommandExecutor extends TelegramBotCommandExecutor {
  /** */
  constructor(
    context: TelegramBotCommandExecutorContext,
    private readonly endpointService: EndpointService,
  ) {
    super(context);
  }

  /** */
  getName(): string {
    return NAME;
  }

  /** */
  getDescription(): string {
    return DESCRIPTION;
  }

  /** */
  execute(command: TelegramCommand): Promise<void> {
    const builder = new TelegramMessageBuilder();
    const endpoints = this.endpointService.getEndpoints();

  // for each endpoint
    for (const endpoint of endpoints) {
      builder
        .normal(endpoint.isConnected() ? '🟢' : '🔴')
        .normal(` ${endpoint.getName()}`)
        .newLine();
    }

    return this.sendResponse(command, builder.build());
  }
}