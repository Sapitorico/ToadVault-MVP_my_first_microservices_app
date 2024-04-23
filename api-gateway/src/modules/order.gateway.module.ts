import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { OrderController } from 'src/controllers/order.gateway';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import { Partitioners } from 'kafkajs';
process.loadEnvFile();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'inventory-order-microservice',
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
    ]),
  ],
  controllers: [OrderController],
  providers: [AuthProvider, OrderProvider],
})
export class OrderModule {}
