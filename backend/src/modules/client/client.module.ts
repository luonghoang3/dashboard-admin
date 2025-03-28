import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([]),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class ClientModule {} 