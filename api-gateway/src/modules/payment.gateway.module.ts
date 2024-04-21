import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { AuthModule } from './auth.gateway.module';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { OrderController } from 'src/controllers/order.gateway';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import { PaymentProvider } from 'src/providers/payment.gateway.provider';
import { PaymentController } from 'src/controllers/payment.gateway';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ClientsModule.register([
      {
        name: process.env.ORDER_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.ORDER_MICROSERVICE_PORT) },
      },
      {
        name: process.env.PAYMENT_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.PAYMENT_MICROSERVICE_PORT) },
      },
    ]),
  ],
  controllers: [PaymentController],
  providers: [AuthProvider, PaymentProvider, OrderProvider],
})
export class PaymentModule {}
