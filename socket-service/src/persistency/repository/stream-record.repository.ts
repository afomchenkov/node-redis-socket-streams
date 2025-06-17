import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StreamRecordEntity } from '../../entities/stream-record.entity';

type StreamRecordPayload = any;

@Injectable()
export class StreamRecordRepository {
  constructor(
    @InjectRepository(StreamRecordEntity)
    private streamRecord: Repository<StreamRecordEntity>,
  ) {}

  async create(payload: StreamRecordPayload): Promise<StreamRecordEntity> {
    const newRecord = this.streamRecord.create(payload);

    return this.streamRecord.save(newRecord) as never;
  }

  async update(
    id: string,
    payload: StreamRecordPayload,
  ): Promise<StreamRecordEntity | null> {
    const existingRecord = await this.findOne(id);

    if (!existingRecord) {
      throw new NotFoundException(`The record not found: ${id}`);
    }

    return this.streamRecord.save({
      ...existingRecord,
      ...payload,
    });
  }

  async bulkUpdate(
    payload: StreamRecordPayload[] = [],
  ): Promise<(StreamRecordEntity | null)[]> {
    const updatedItems: (StreamRecordEntity | null)[] = [];

    for (const updateBoardColumnPayload of payload) {
      const { id } = updateBoardColumnPayload;

      const updatedRecord = await this.update(id, updateBoardColumnPayload);

      updatedItems.push(updatedRecord);
    }

    return updatedItems;
  }

  async findAll(): Promise<StreamRecordEntity[]> {
    return this.streamRecord.find();
  }

  async findOne(id: string): Promise<StreamRecordEntity | null> {
    return this.streamRecord.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.streamRecord.delete(id);
  }
}
