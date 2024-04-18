import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { InventoryModule } from './modules/inventory.gateway.module';
import { ProductModule } from './modules/products.gateway.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [InventoryModule, ProductModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
