import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { UsersModule } from './users.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UsersModule,
    {
      transport: Transport.REDIS,
      options: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT),
      },
    },
  );
  // const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  //   UsersModule,
  //   {
  //     transport: Transport.KAFKA,
  //     options: {
  //       client: {
  //         clientId: process.env.CLIENT_ID,
  //         brokers: [process.env.BROKER],
  //       },
  //       consumer: {
  //         groupId: process.env.GROUP_ID,
  //       },
  //       producer: {
  //         createPartitioner: Partitioners.LegacyPartitioner,
  //       },
  //     },
  //   },
  // );
  await app.listen();
}
bootstrap();
