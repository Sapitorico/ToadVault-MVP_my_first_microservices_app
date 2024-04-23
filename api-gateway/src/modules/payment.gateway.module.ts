import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { OrderProvider } from 'src/providers/order.gateway.provider';
import { PaymentProvider } from 'src/providers/payment.gateway.provider';
import { PaymentController } from 'src/controllers/payment.gateway';
import { Partitioners } from 'kafkajs';
process.loadEnvFile();

@Module({
  imports: [
    ClientsModule.register([
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
    ]),
  ],
  controllers: [PaymentController],
  providers: [AuthProvider, PaymentProvider, OrderProvider],
})
export class PaymentModule {}
