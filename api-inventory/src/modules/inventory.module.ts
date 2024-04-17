import { Module } from '@nestjs/common';
import { InventoryController } from 'src/controllers/inventory.controller';
import { DatabaseProvider } from 'src/databases/db_connection';
import { InventoryProvider } from 'src/providers/inventory.provider';

@Module({
  imports: [],
  controllers: [InventoryController],
  providers: [InventoryProvider, DatabaseProvider],
})
export class InventoryModule {}
