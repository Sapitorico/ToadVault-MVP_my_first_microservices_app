import { Module } from '@nestjs/common';
import { InventoryModule } from './modules/inventory.gateway.module';
import { ProductModule } from './modules/products.gateway.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users.gateway.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/guards/auth.gateway.provider';

@Module({
  imports: [
    ConfigModule.forRoot(),
    InventoryModule,
    ProductModule,
    UsersModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
