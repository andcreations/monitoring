import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import {
  TelegramBot,
  TelegramBotCommand,
  TelegramMessage,
  TelegramUpdate,
} from '@andcreations/telegram-bot';

import { CfgService } from '../../cfg/service';

/** */
@Injectable()
export class TelegramBotClientService implements OnApplicationBootstrap {
  /** Telegram bot. */
  private telegramBot: TelegramBot;

  /** */
  constructor(private readonly cfgService: CfgService) {
  }

  /** */
  onApplicationBootstrap(): void {
  // create telegram bot
    const telegramCfg = this.cfgService.getCfg().telegram;
    this.telegramBot = new TelegramBot(telegramCfg.token);
  }

  setCommands(commands: TelegramBotCommand[]): Promise<void> {
    return this.telegramBot.setCommands(commands);
  }

  /** */
  sendMessage(message: TelegramMessage): Promise<void> {
    return this.telegramBot.sendMessage(message);
  }

  /** */
  getUpdates(offset?: number): Promise<TelegramUpdate[]> {
    return this.telegramBot.getUpdates(offset);
  }
}
