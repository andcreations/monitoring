import { Module } from '@nestjs/common';
import { ServerStatusGWControllerV1 } from './controller';

/** */
@Module({
  controllers: [ServerStatusGWControllerV1],
})
export class ServerStatusGatewayModule {
}