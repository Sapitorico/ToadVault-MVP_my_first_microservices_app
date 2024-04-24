import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { DatabaseService } from './databases/db_connection';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [OrdersService, DatabaseService],
})
export class OrdersModule {}
