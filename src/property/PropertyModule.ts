import { Module } from '@nestjs/common';
import { LogModule } from '@andcreations/nestjs-common';

import { CfgModule } from '../cfg';
import { PropertyService } from './service';

/** */
@Module({
  imports: [LogModule, CfgModule],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {
}