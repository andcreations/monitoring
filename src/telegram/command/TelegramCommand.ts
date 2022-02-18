import { TelegramUpdate } from '@andcreations/telegram-bot';

/** */
export class TelegramCommand {
  /** */
  private constructor(
    private readonly name: string,
    private readonly args: string[],
    private readonly update: TelegramUpdate,
  ) {}

  /** */
  getName(): string {
    return this.name;
  }

  /** */
  getArgs(): string[] {
    return this.args;
  }

  /** */
  getUpdate(): TelegramUpdate {
    return this.update;
  }

  /** */
  getUserName(): string {
    return this.update.message.chat.username;
  }

  /** */
  getChatId(): number {
    return this.update.message.chat.id;
  }

  /** */
  static parse(update: TelegramUpdate): TelegramCommand {
    const tokens = update.message.text.split(' ');
    const name = tokens[0];
    const args = tokens.slice(1);
    return new TelegramCommand(name, args, update);
  }
}