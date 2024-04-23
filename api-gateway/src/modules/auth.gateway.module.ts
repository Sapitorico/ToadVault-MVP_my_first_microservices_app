import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
import { AuthProvider } from 'src/providers/auth.gateway.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  providers: [AuthGuard, AuthProvider],
  controllers: [],
})
export class AuthModule {}
