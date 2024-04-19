import { Module } from '@nestjs/common';
import { DatabaseService } from './databases/db_connection';
import { UsersController } from './users.controller';
import { UsersServices } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { SecurityService } from './security/user.security.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  controllers: [UsersController],
  providers: [UsersServices, DatabaseService, SecurityService],
})
export class UsersModule {}
