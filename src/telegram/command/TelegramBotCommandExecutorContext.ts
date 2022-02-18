import { Injectable } from '@nestjs/common';
import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';

import {
  TelegramBotMessageService,
  TelegramBotUpdateService,
} from '../service';
import { TelegramCommand } from './TelegramCommand';
import { TelegramBotCommandExecutor } from './TelegramBotCommandExecutor';

/** */
@Injectable()
export class TelegramBotCommandExecutorContext {
  /** */
  constructor(
    private readonly telegramBotUpdateService: TelegramBotUpdateService,
    private readonly telegramBotMessageService: TelegramBotMessageService,
  ) {}

  /** */
  registerBotCommandExecutor(executor: TelegramBotCommandExecutor): void {
    this.telegramBotUpdateService.registerBotCommandExecutor(executor);
  }

  /** */
  async sendResponse(
    command: TelegramCommand,
    response: TelegramAnonymousMessage,
  ): Promise<void> {
    await this.telegramBotMessageService.sendMessage(
      {
        chat_id: command.getChatId(),
        ...response,
      },
    )
  }  
}