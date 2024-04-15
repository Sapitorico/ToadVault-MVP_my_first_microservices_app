import { Module } from '@nestjs/common';
import { GatewayModule } from './modules/websocket.module';

@Module({
  imports: [GatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
