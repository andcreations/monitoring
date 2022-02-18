import { TelegramMessage } from '@andcreations/telegram-bot';

/** */
export interface TelegramMessageQueueEntry {
  /** */
  message: TelegramMessage;
}

/** */
export abstract class TelegramMessageQueueService {
  /** */
  abstract push(message: TelegramMessageQueueEntry): Promise<void>;

  /** */
  abstract empty(): Promise<boolean>;

  /** */
  abstract peek(): Promise<TelegramMessageQueueEntry>;

  /** */
  abstract pop(): Promise<void>;
}