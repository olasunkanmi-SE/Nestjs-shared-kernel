import { Injectable } from '@nestjs/common';
import { FindManyOptions, Repository, FindOneOptions, IsNull } from 'typeorm';
import { throwApplicationError } from '../common/exception-instance';
import { IGenericRepository } from './interfaces/generic_repository.interface';

export interface IMapper<TEntity, TModel> {
  toPersistence(entity: TEntity): TModel;
  toDomain(model: TModel): TEntity;
}

/**
 * @export
 * @class GenericSqlRepository
 * @extends {GenericSqlRepository<TEntity, TModel>}
 * @implements {GenericSqlRepository}
 */
@Injectable()
export class GenericSqlRepository<TEntity, TModel>
  implements IGenericRepository<TEntity, TModel>
{
  constructor(
    protected readonly repository: Repository<TModel>,
    protected readonly mapper: IMapper<TEntity, TModel>,
  ) {}

  private extendFindOptions(
    findOptions?: FindOneOptions | FindManyOptions,
  ): FindOneOptions | FindManyOptions {
    let options: FindOneOptions | FindManyOptions | undefined = findOptions;
    if (!options) {
      options = { where: {} };
    }
    if (!options.where) {
      options.where = {
        auditDeletedBy: IsNull(),
        auditDeletedDateTime: IsNull(),
      };
    } else {
      (options.where as any).auditDeletedBy = IsNull();
      (options.where as any).auditDeletedDateTime = IsNull();
    }
    return options;
  }

  private findOneOption(findOneOptions?: FindOneOptions<TModel>) {
    const findOne: FindOneOptions<TModel> = <FindOneOptions>(
      this.extendFindOptions(findOneOptions)
    );
    return findOne;
  }

  private findManyOption(findManyOptions?: FindManyOptions<TModel>) {
    const findMany: FindManyOptions<TModel> = <FindManyOptions>(
      this.extendFindOptions(findManyOptions)
    );
    return findMany;
  }

  async find(findManyOptions: FindManyOptions<TModel>): Promise<TEntity[]> {
    try {
      const items = await this.repository.find(
        this.findManyOption(findManyOptions),
      );
      return items.map((item) => this.mapper.toDomain(item));
    } catch (error) {
      throwApplicationError(500, 'Failed to find entities');
    }
  }

  async findOneOrFail(): Promise<TEntity> {
    try {
      const item = await this.repository.findOneOrFail(this.findOneOption());
      return this.mapper.toDomain(item);
    } catch (error) {
      throwApplicationError(404, 'Entity not found');
    }
  }

  async findOne(
    findOneOptions: FindOneOptions<TModel>,
  ): Promise<TEntity | undefined> {
    try {
      const item = await this.repository.findOne(
        this.findOneOption(findOneOptions),
      );
      return item ? this.mapper.toDomain(item) : undefined;
    } catch (error) {
      throwApplicationError(404, 'Entity not found');
    }
  }

  async findAll(): Promise<TEntity[]> {
    try {
      const items = await this.repository.find(this.findManyOption());
      return items.map((r) => this.mapper.toDomain(r));
    } catch (error) {
      throwApplicationError(500, 'Failed to find all entities');
    }
  }

  async save(entity: TEntity): Promise<TModel> {
    try {
      return await this.repository.save(this.mapper.toPersistence(entity));
    } catch (error) {
      throwApplicationError(500, 'Failed to save entity');
    }
  }
}
