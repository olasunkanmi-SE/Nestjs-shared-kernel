import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'BaseModel' })
export abstract class BaseModel {
  @PrimaryGeneratedColumn('uuid')
  _id?: string;

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
