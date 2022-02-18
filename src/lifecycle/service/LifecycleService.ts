import { LogService } from '@andcreations/nestjs-common';
import {
  Injectable,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { TelegramMessageBuilder } from '@andcreations/telegram-bot';

import { TelegramBotMessageService } from '../../telegram/service';
import { EndpointService } from '../../endpoint/service';

/** Log tag. */
const TAG = 'lifecycle';

/** */
@Injectable()
export class LifecycleService
  implements OnApplicationBootstrap, OnApplicationShutdown {
  /** */
  constructor(
    private readonly log: LogService,
    private readonly telegramBotMessageService: TelegramBotMessageService,
    private readonly endpointService: EndpointService,
  ) {}

  /** */
  async onApplicationBootstrap(): Promise<void> {
    this.log.info('Starting', TAG);
    await this.endpointService.startEndpoints();
    await this.broadcast('Server up and running. Hi!');
    this.log.info('Up and running. Hi!', TAG);
  }

  /** */
  async onApplicationShutdown(): Promise<void> {
    this.log.info('Shuting down', TAG);
    await this.endpointService.stopEndpoints();
    await this.broadcast('Server about to shut down. Bye!');
    await this.telegramBotMessageService.waitToEmptyQueue();
    this.log.info('Shut down. Bye!', TAG);
  }

  /** */
  private async broadcast(message: string): Promise<void> {
    await this.telegramBotMessageService.broadcastMessage(
      TelegramMessageBuilder.fromString(message),
    );
  }
}