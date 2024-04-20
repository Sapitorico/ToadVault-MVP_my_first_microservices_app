import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { AuthModule } from './auth.gateway.module';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { OrderController } from 'src/controllers/order.gateway';
import { OrderProvider } from 'src/providers/order.gateway.provider';

/**
 * Represents the Inventory module of the API Gateway.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ClientsModule.register([
      {
        name: process.env.INVENTORY_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.INVENTORY_MICROSERVICE_PORT) },
      },
      {
        name: process.env.ORDER_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.ORDER_MICROSERVICE_PORT) },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [AuthProvider, InventoryProvider, OrderProvider],
})
export class OrderModule {}
