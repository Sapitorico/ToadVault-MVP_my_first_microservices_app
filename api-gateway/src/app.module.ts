import { Module } from '@nestjs/common';
import { InventoryModule } from './modules/inventory.gateway.module';
import { ProductModule } from './modules/products.gateway.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users.gateway.module';
import { AuthModule } from './modules/auth.gateway.module';
import { OrderModule } from './modules/order.gateway.module';
import { PaymentModule } from './modules/payment.gateway.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    InventoryModule,
    ProductModule,
    UsersModule,
    PaymentModule,
    OrderModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
