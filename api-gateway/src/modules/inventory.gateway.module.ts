import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';
import { AuthModule } from './auth.gateway.module';
import { AuthProvider } from 'src/providers/auth.gateway.provider';

/**
 * Represents the Inventory module of the API Gateway.
 */
@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ClientsModule.register([
      {
        name: process.env.INVENTORY_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.INVENTORY_MICROSERVICE_PORT) },
      },
      {
        name: process.env.PRODUCT_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.PRODUCT_MICROSERVICE_PORT) },
      },
      {
        name: process.env.USERS_MICROSERVICE_NAME,
        transport: Transport.TCP,
        options: { port: parseInt(process.env.USERS_MICROSERVICE_PORT) },
      },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryProvider, ProductProvider, AuthProvider],
})
export class InventoryModule {}
