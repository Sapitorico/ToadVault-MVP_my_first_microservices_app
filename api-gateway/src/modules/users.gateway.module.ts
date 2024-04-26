import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from 'src/controllers/users.gateway';
import { UsersProvider } from 'src/providers/users.gateway.provider';
import { AuthProvider } from 'src/providers/auth.gateway.provider';
import { AuthGuard } from 'src/guards/auth.gateway.provider';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.USERS_MICROSERVICE_NAME,
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
        },
      },
    ]),
  ],
  providers: [UsersProvider, AuthGuard, AuthProvider],
  controllers: [UsersController],
})
export class UsersModule {}
