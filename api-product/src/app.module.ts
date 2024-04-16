import { Module } from '@nestjs/common';
import { ProductModule } from './modules/products.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ProductModule, ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
