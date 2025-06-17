import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamRecordEntity } from '../entities/stream-record.entity';

const entities = [StreamRecordEntity];

const services = [];

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  providers: [...services],
  exports: [...services],
})
export class DBModule {}
