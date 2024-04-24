import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { InventoryModule } from './inventory.module';
import { Partitioners } from 'kafkajs';
process.loadEnvFile();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InventoryModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: process.env.CLIENT_ID,
          brokers: [process.env.BROKER],
        },
        consumer: {
          groupId: process.env.GROUP_ID,
        },
        producer: {
          createPartitioner: Partitioners.LegacyPartitioner,
        },
      },
    },
  );
  await app.listen();
}
bootstrap();
