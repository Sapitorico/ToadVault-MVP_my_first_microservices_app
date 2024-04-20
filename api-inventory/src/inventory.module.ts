import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { InventoryController } from './inventory.controller';
import { InventoryProvider } from './inventory.provider';
import { DatabaseProvider } from './databases/db_connection';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [InventoryController],
  providers: [InventoryProvider, DatabaseProvider],
})
export class InventoryModule {}
