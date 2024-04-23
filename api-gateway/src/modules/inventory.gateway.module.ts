import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { Partitioners } from 'kafkajs';

/**
 * Represents the Inventory module of the API Gateway.
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
    ]),
  ],
  controllers: [InventoryController],
  providers: [AuthProvider, InventoryProvider, ProductProvider],
})
export class InventoryModule {}
