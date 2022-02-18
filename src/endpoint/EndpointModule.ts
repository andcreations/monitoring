import { Module } from '@nestjs/common';
import { LogModule, BusModule } from '@andcreations/nestjs-common';

import { CfgModule } from '../cfg';
import { HTTPModule } from '../http';
import { EndpointFactory, EndpointService } from './service';

/** */
@Module({
  imports: [LogModule, BusModule, CfgModule, HTTPModule],
  providers: [EndpointFactory, EndpointService],
  exports: [EndpointService]
})
export class EndpointModule {
}