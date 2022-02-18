import { Module } from '@nestjs/common';
import { LogModule } from '@andcreations/nestjs-common';

import { CfgModule } from '../cfg';
import { PropertyModule } from '../property';
import { EndpointModule } from '../endpoint';
import {
  TelegramBotCommandExecutorContext,
  TELEGRAM_BOT_COMMAND_EXECUTORS,
} from './command';
import { 
  TelegramMessageQueueService,
  TelegramBotMemoryMessageQueueService,
  TelegramBotClientService,
  TelegramBotUserService,
  TelegramBotUpdateService,
  TelegramBotMessageService,
  EndpointBusEventsHandler,
} from './service';

/** */
@Module({
  imports: [LogModule, CfgModule, PropertyModule, EndpointModule],
  providers: [
    {
      provide: TelegramMessageQueueService,
      useClass: TelegramBotMemoryMessageQueueService,
    },
    TelegramBotCommandExecutorContext,
    TelegramBotClientService,
    TelegramBotUserService,
    TelegramBotUpdateService,
    TelegramBotMessageService,
    EndpointBusEventsHandler,
    ...TELEGRAM_BOT_COMMAND_EXECUTORS,
  ],
  exports: [TelegramBotMessageService],
})
export class TelegramModule {
}