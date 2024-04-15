import { Module } from '@nestjs/common';
import { WebsocketGateway } from 'src/controllers/websocket.gateway';

@Module({
  providers: [WebsocketGateway],
})
export class GatewayModule {}
