import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryProvider } from './inventory.provider';
import { DatabaseProvider } from './databases/db_connection';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryProvider, DatabaseProvider],
})
export class InventoryModule {}
