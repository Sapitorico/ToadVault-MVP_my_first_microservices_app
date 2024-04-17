import { Module } from '@nestjs/common';
import { InventoryModule } from './modules/inventory.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [InventoryModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
