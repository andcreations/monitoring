import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { Mutex } from '@andcreations/common';
import { LogService } from '@andcreations/nestjs-common';
import {
  TelegramAnonymousMessage,
  TelegramMessage,
} from '@andcreations/telegram-bot';

import { CfgService } from '../../cfg/service';
import { TelegramMessageQueueService } from './queue';
import { TelegramBotClientService } from './TelegramBotClientService';
import { TelegramBotUserService } from './TelegramBotUserService';

/** */
const TAG = 'telegram-message';

/** */
const WAIT_FOR_QUEUE_DELAY = 320;

/** */
@Injectable()
export class TelegramBotMessageService {
  /** Mutex synchronizing access to send message call. */
  private sendMessageMutex: Mutex = new Mutex();

  /** */
  constructor(
    private readonly log: LogService,
    private readonly cfgService: CfgService,
    private readonly queue: TelegramMessageQueueService,
    private readonly telegramBotClientService: TelegramBotClientService,
    private readonly telegramBotUserService: TelegramBotUserService,
  ) {}

  /** */
  async waitToEmptyQueue(): Promise<void> {
    while (true) {
      const empty = await this.queue.empty();
      if (empty) {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, WAIT_FOR_QUEUE_DELAY));
    }
  }

  /** */
  private isDiscardRetryMessageError(error: any): boolean {
    const msg = error.toString();
    return msg.includes('chat not found');
  }

  /** */
  private async sendNextMessage(): Promise<void> {
    await this.sendMessageMutex.lock();
  // no message? nothing to do
    const empty = await this.queue.empty();
    if (empty) {
      await this.sendMessageMutex.unlock();
      return;
    }

  // send
    const entry = await this.queue.peek();
    const { message } = entry;
    try {
      await this.telegramBotClientService.sendMessage(message);
    } catch (error) {
      let retry = true;
    // check if the error disallows retry
      if (this.isDiscardRetryMessageError(error)) {
        this.log.error(
          'Discarding Telegram message',
          TAG,
          error,
          {
            chatId: message.chat_id,
          }
        );
        retry = false;
      }

    // retry
      if (retry) {
        const delay = this.cfgService.getCfg().telegram.messageRetryDelay;
        this.log.error(
          `Failed to send Telegram message. Will retry to send it.`,
          TAG,
          error,
          { delay }
        );

      // wait before retry
        await new Promise((resolve) => setTimeout(resolve, delay));
        await this.sendMessageMutex.unlock();

      // retry
        this.sendNextMessage();
        return;
      }
    }

  // pop the message
    await this.queue.pop();
    await this.sendMessageMutex.unlock();
  }

  /** */
  async sendMessage(message: TelegramMessage): Promise<void> {
    await this.queue.push({ message });
    this.sendNextMessage();
  }

  /** */
  async broadcastMessage(message: TelegramAnonymousMessage): Promise<void> {
    const chatIds = await this.telegramBotUserService.getAllChatIds();
    for (const chatId of chatIds) {
      await this.queue.push({
        message: {
          ...message,
          chat_id: chatId,
        },
      });
    }
    this.sendNextMessage();
  }
}