import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity({ name: 'case_card' })
export class StreamRecordEntity extends BaseEntity {
  @Column({ name: 'name' })
  public name: string;

  @Column({ name: 'description' })
  public description: string;

  @Column({
    name: 'metadata',
    type: 'jsonb',
    default: () => '{}',
    nullable: true,
  })
  public metadata: object = {};

  @Column({ name: 'progress' })
  public progress: number;
}
