import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryController } from 'src/controllers/inventory.gateway';
import { InventoryProvider } from 'src/providers/inventory.gateway.provider';
import { ProductProvider } from 'src/providers/product.gateway.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
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
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryProvider, ProductProvider],
})
export class InventoryModule {}
