import { Module } from '@nestjs/common';
import { ProductController } from 'src/product.controller';
import { ConfigModule } from '@nestjs/config';
import { DatabaseProvider } from 'src/databases/db_connection';
import { ProductProvider } from 'src/product.provider';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [ProductController],
  providers: [ProductProvider, DatabaseProvider],
})
export class ProductModule {}
