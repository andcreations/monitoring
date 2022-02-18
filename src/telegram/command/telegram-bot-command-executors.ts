import { Type } from '@nestjs/common';

import { TelegramBotCommandExecutor } from './TelegramBotCommandExecutor';
import { StartBotCommandExecutor } from './misc';
import { EndpointsBotCommandExecutor } from './endpoint';

/** */
export const TELEGRAM_BOT_COMMAND_EXECUTORS:
  Type<TelegramBotCommandExecutor>[] = [
    StartBotCommandExecutor,
    EndpointsBotCommandExecutor,
  ];