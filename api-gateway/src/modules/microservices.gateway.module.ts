import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { Partitioners } from 'kafkajs';
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
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.PRODUCT_CLIENT_ID,
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: process.env.PRODUCT_GROUP_ID,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
      {
        name: process.env.INVENTORY_MICROSERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.INVENTORY_CLIENT_ID,
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: process.env.INVENTORY_GROUP_ID,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
      {
        name: process.env.ORDER_MICROSERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.ORDER_CLIENT_ID,
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: process.env.ORDER_GROUP_ID,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
      {
        name: process.env.PAYMENT_MICROSERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.PAYMENT_CLIENT_ID,
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: process.env.PAYMENT_GROUP_ID,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
      {
        name: process.env.PAYMENT_MICROSERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.PAYMENT_CLIENT_ID,
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: process.env.PAYMENT_GROUP_ID,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
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
