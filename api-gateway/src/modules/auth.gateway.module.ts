import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthGuard } from 'src/guards/auth.gateway.provider';
import { AuthProvider } from 'src/providers/auth.gateway.provider';

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
  providers: [AuthGuard, AuthProvider],
  controllers: [],
})
export class AuthModule {}
