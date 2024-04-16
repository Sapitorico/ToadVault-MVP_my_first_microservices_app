import { Module } from '@nestjs/common';
import { ProductController } from 'src/controllers/product.controller';
import { DatabaseProvider } from 'src/databases/db_connection';
import { ProductProvider } from 'src/providers/product.provider';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [ProductProvider, DatabaseProvider],
})
export class ProductModule {}
