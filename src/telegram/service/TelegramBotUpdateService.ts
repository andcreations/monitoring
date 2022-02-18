import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { LogService } from '@andcreations/nestjs-common';
import { 
  getTelegramUpdateUsername,
  TelegramBot,
  TelegramUpdate,
} from '@andcreations/telegram-bot';

import { MonitoringError } from '../../error';
import { PropertyService } from '../../property/service';
import { CfgService } from '../../cfg/service';
import { UnknownTelegramCommandError } from '../error';
import { TelegramBotCommandExecutor, TelegramCommand } from '../command';
import { TelegramBotClientService } from './TelegramBotClientService';
import { TelegramBotUserService } from './TelegramBotUserService';
import { TelegramBotMessageService } from './TelegramBotMessageService';

/** Log tag. */
const TAG = 'telegram-updates';

/** */
const OFFSET_PROPERTY = 'telegram.offset';

/** */
@Injectable()
export class TelegramBotUpdateService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  /** Timeout to the next get-updates. */
  private getUpdatesTimeout: NodeJS.Timeout;

  /** Registered bot command executors. */
  private botCommandExecutors: TelegramBotCommandExecutor[] = [];

  /** */
  constructor(
    private readonly log: LogService,
    private readonly cfgService: CfgService,
    private readonly propertyService: PropertyService,
    private readonly telegramBotClientService: TelegramBotClientService,
    private readonly telegramBotUserService: TelegramBotUserService,
    private readonly telegramBotMessageService: TelegramBotMessageService,
  ) {}

  /** */
  async onApplicationBootstrap(): Promise<void> {
  // commands
  const commands = this.botCommandExecutors.map(executor => {
    const command = executor.getName().substring(1); // without slash
    const description = executor.getDescription();
    return { command, description };
  });
  console.log('commands', commands);
  await this.telegramBotClientService.setCommands(commands)
  
  // countdown
    this.getUpdatesTimeout = setTimeout(
      () => this.getUpdates(),
      this.getInterval(),
    );
  }

  /** */
  onApplicationShutdown(): void {
  // clear get-updates timeout
    if (this.getUpdatesTimeout) {
      clearTimeout(this.getUpdatesTimeout);
    }
  }

  /** */
  private getInterval(): number {
    return this.cfgService.getCfg().telegram.updatesInterval;
  }

  /** */
  registerBotCommandExecutor(executor: TelegramBotCommandExecutor): void {
    this.botCommandExecutors.push(executor);
    this.log.debug(
      'Registering bot command executor',
      TAG,
      {
        name: executor.getName(),
        description: executor.getDescription(),
      },
    );
  }

  /** */
  private async handleError(
    update: TelegramUpdate,
    error: any,
  ): Promise<void> {
  // get error message
    let text: string;
    if (error instanceof MonitoringError) {
      text = error.getMessage();
    }
    else {
      text = `Unexpected error: ${error.toString()}`;
    }

  // send error
    try {
      await this.telegramBotMessageService.sendMessage(
        {
          chat_id: update.message.chat.id,
          text,
        },
      );
    } catch (error) {
      this.log.error('Failed to send error', TAG, error, { text });
      return;
    }
  }

  /** */
  private async executeCommand(command: TelegramCommand): Promise<void> {
  // find executor
    const executor = this.botCommandExecutors.find(executor => {
      return executor.getName() === command.getName();
    });
    if (!executor) {
      throw new UnknownTelegramCommandError(command.getName());
    }

  // execute
    await executor.execute(command);
  }

  /** */
  private async processUpdate(update: TelegramUpdate): Promise<void> {
  // set chat identifier
    await this.telegramBotUserService.setChatId(
      update.message.from.username,
      update.message.chat.id,
    );

  // parse
    const command = TelegramCommand.parse(update);
  
  // execute
    try {
      await this.executeCommand(command);
    } catch (error) {
      await this.handleError(update, error);
      return;
    }
  }

  /** */
  private async processUpdates(updates: TelegramUpdate[]): Promise<void> {
    let noUserNameCount = 0;
    let noTextCount = 0;
  // filter updates
    const updatesToProcess = updates.filter(update => {
    // user name
      const hasUserName = !!getTelegramUpdateUsername(update);
      if (!hasUserName) {
        noUserNameCount++;
      }

    // test
      const hasText = !!update.message?.text;
      if (!hasText) {
        noTextCount++;
      }

      return hasUserName && hasText;
    });
    if (noUserNameCount || noTextCount) {
      this.log.info(
        'Discarded Telegram updates',
        TAG,
        { noUserNameCount, noTextCount },
      );
    }

  // process
    for (const update of updatesToProcess) {
      try {
        await this.processUpdate(update);
      } catch (error) {
        this.log.error(
          'Failed to process Telegram updated',
          TAG,
          error,
        );
      }
    }
  }

  /** */
  private async getUpdates(): Promise<void> {
    delete this.getUpdatesTimeout;

  // offset
    const offset = await this.propertyService.get<number>(OFFSET_PROPERTY);

  // get
    let updates: TelegramUpdate[];
    try {
      updates = await this.telegramBotClientService.getUpdates(offset);
    } catch (error) {
      this.log.error('Failed to get Telegram updates', TAG, error);
    }

  // process
    if (updates) {
      await this.processUpdates(updates);

    // store offset
      const nextOffset = TelegramBot.getNextUpdateId(updates);
      await this.propertyService.set(OFFSET_PROPERTY, nextOffset);
    }

  // get more updates
    this.getUpdatesTimeout = setTimeout(
      () => this.getUpdates(),
      this.getInterval(),
    );
  }
}