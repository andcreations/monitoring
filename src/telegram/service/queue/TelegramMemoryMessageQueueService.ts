import { Injectable } from '@nestjs/common';

import {
  TelegramMessageQueueEntry,
  TelegramMessageQueueService,
} from './TelegramMessageQueueService';

/** */
@Injectable()
export class TelegramBotMemoryMessageQueueService
  extends TelegramMessageQueueService
{
  /** */
  private readonly queue: TelegramMessageQueueEntry[] = [];

  /** */
  async push(message: TelegramMessageQueueEntry): Promise<void> {
    this.queue.push(message);
  }

  /** */
  async empty(): Promise<boolean> {
    return this.queue.length === 0;
  }

  /** */
  async peek(): Promise<TelegramMessageQueueEntry> {
    return this.queue.length > 0 ? this.queue[0] : undefined;
  }

  /** */
  async pop(): Promise<void> {
    if (this.queue.length > 0) {
      this.queue.shift();
    }
  }
}