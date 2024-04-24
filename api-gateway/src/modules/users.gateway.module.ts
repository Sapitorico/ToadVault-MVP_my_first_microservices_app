import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from 'src/controllers/users.gateway';
import { UsersProvider } from 'src/providers/users.gateway.provider';
import { Partitioners } from 'kafkajs';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
process.loadEnvFile();

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.USERS_MICROSERVICE_NAME,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.USERS_CLIENT_ID,
            brokers: [process.env.BROKER],
          },
          consumer: {
            groupId: process.env.USERS_GROUP_ID,
          },
          producer: {
            createPartitioner: Partitioners.LegacyPartitioner,
          },
        },
      },
    ]),
  ],
  providers: [UsersProvider, AuthGuard, AuthProvider],
  controllers: [UsersController],
})
export class UsersModule {}
