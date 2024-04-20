import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ProductProvider } from 'src/providers/product.gateway.provider';

/**
 * Represents the module responsible for managing products in the API gateway.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: process.env.PRODUCT_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.PRODUCT_MICROSERVICE_PORT) },
      },
    ]),
  ],
  controllers: [],
  providers: [ProductProvider],
})
export class ProductModule {}
