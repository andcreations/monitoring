import { Controller, Get } from '@nestjs/common';
import { HTTPStatus } from '@andcreations/common';

import { PingResponseV1 } from '../dto';

/** */
@Controller('/api/v1/status')
export class ServerStatusGWControllerV1 {
  /** */
  @Get('/ping')
  ping(): PingResponseV1 {
    return {
      message: 'Pong!',
    };
  }
}