import { TelegramCommand } from './TelegramCommand';
import {
  TelegramBotCommandExecutorContext,
} from './TelegramBotCommandExecutorContext';
import { TelegramAnonymousMessage } from '@andcreations/telegram-bot';

/** */
export abstract class TelegramBotCommandExecutor {
  /** */
  protected constructor(
    private readonly context: TelegramBotCommandExecutorContext,
  ) {
    this.context.registerBotCommandExecutor(this);
  }

  /** */
  protected sendResponse(
    command: TelegramCommand,
    message: TelegramAnonymousMessage,
  ): Promise<void> {
    return this.context.sendResponse(command, message);
  }

  /** */
  abstract getName(): string;

  /** */
  abstract getDescription(): string;

  /** */
  abstract execute(command: TelegramCommand): Promise<void>;
}