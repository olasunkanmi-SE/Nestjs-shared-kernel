import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'BaseModel' })
export abstract class BaseModel {
  @CreateDateColumn()
  createdDateTime: Date;

  @Column({ type: 'varchar', length: 50 })
  createdBy: string;

  @UpdateDateColumn()
  modifiedDateTime?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  modifiedBy?: string;

  @DeleteDateColumn()
  deletedDateTime?: Date;

  @Column({ type: 'varchar', length: 50, nullable: true })
  deletedBy?: string;
}
