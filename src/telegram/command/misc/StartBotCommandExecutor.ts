import { Injectable } from '@nestjs/common';
import { TelegramMessageBuilder } from '@andcreations/telegram-bot';

import { TelegramCommand } from '../TelegramCommand';
import { TelegramBotCommandExecutor } from '../TelegramBotCommandExecutor';
import {
  TelegramBotCommandExecutorContext,
} from '../TelegramBotCommandExecutorContext';

/** */
const NAME = '/start';
const DESCRIPTION = 'Say Hi!'

/** */
@Injectable()
export class StartBotCommandExecutor extends TelegramBotCommandExecutor {
  /** */
  constructor(context: TelegramBotCommandExecutorContext) {
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
    return this.sendResponse(
      command,
      TelegramMessageBuilder.fromString('Hi there!'),
    );
  }
}