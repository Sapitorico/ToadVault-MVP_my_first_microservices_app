import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { OrderController } from 'src/controllers/order.gateway';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import { PaymentController } from 'src/controllers/payment.gateway';
import { PaymentProvider } from 'src/providers/payment.gateway.provider';

/**
 * Represents the module for the microservices gateway.
 * This module is responsible for importing the necessary modules and configuring the clients for each microservice.
 */
@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.PRODUCT_MICROSERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
      {
        name: process.env.INVENTORY_MICROSERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
      {
        name: process.env.ORDER_MICROSERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
      {
        name: process.env.PAYMENT_MICROSERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
      {
        name: process.env.PAYMENT_MICROSERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
    ]),
  ],
  controllers: [InventoryController, OrderController, PaymentController],
  providers: [
    AuthProvider,
    InventoryProvider,
    ProductProvider,
    OrderProvider,
    PaymentProvider,
  ],
})
export class MicroservicesGatewayModule {}
