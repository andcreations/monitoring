import { Module } from '@nestjs/common';

import { CfgModule } from './cfg';
import { PropertyModule } from './property';
import { HTTPModule } from './http';
import { EndpointModule } from './endpoint';
import { TelegramModule } from './telegram';
import { LifecycleModule } from './lifecycle';
import { GatewayModule } from './gateway';

/** */
@Module({
  imports: [
    CfgModule,
    PropertyModule,
    HTTPModule,
    EndpointModule,
    TelegramModule,
    LifecycleModule,
    GatewayModule,
  ]
})
export class MainModule {
}