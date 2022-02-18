import { Module } from '@nestjs/common';
import { HTTPService } from './service';

/** */
@Module({
  providers: [HTTPService],
  exports: [HTTPService],
})
export class HTTPModule {
}