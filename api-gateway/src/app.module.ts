import { Module } from '@nestjs/common';
import { InventoryModule } from './modules/inventory.gateway.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users.gateway.module';
import { AuthModule } from './modules/auth.gateway.module';
import { OrderModule } from './modules/order.gateway.module';
import { PaymentModule } from './modules/payment.gateway.module';
process.loadEnvFile();

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    InventoryModule,
    OrderModule,
    UsersModule,
    // PaymentModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
