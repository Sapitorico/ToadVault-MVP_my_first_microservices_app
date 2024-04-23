import { Module } from '@nestjs/common';
import { MicroservicesGatewayModule } from './modules/microservices.gateway.module';
import { UsersModule } from './modules/users.gateway.module';

@Module({
  imports: [UsersModule, MicroservicesGatewayModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
