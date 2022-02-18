import { Module } from '@nestjs/common';
import { LogModule } from '@andcreations/nestjs-common';

import { EndpointModule } from '../endpoint';
import { TelegramModule } from '../telegram';
import { LifecycleService } from './service';

/** */
@Module({
  imports: [LogModule, TelegramModule, EndpointModule],
  providers: [LifecycleService],
})
export class LifecycleModule {
}