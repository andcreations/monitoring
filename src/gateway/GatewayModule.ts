import { Module } from '@nestjs/common';
import { ServerStatusGatewayModule } from './server-status-gateway';

/** */
@Module({
  imports: [ServerStatusGatewayModule],
})
export class GatewayModule {
}