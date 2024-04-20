import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UsersController } from 'src/controllers/users.gateway';
import { UsersProvider } from 'src/providers/users.gateway.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: process.env.USERS_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.USERS_MICROSERVICE_PORT) },
      },
    ]),
  ],
  providers: [UsersProvider],
  controllers: [UsersController],
})
export class UsersModule {}
