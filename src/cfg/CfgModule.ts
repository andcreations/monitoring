import { Module } from '@nestjs/common';
import { LogModule } from '@andcreations/nestjs-common';

import { CfgService } from './service';

/** */
@Module({
  imports: [LogModule],
  providers: [CfgService],
  exports: [CfgService],
})
export class CfgModule {
}