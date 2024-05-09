import { Injectable } from '@nestjs/common';
import { IMapper } from '../mapper';
import { Audit } from 'src/domain';
import { BaseModel } from 'src/infrastructure/sql';

Injectable();
export class AuditMapper implements IMapper<Audit, BaseModel> {
  toPersistence(entity: Audit): BaseModel {
    const {
      createdBy,
      createdDateTime,
      modifiedBy,
      modifiedDateTime,
      deletedDateTime,
      deletedBy,
    } = entity;
    const model: BaseModel = {
      createdBy,
      createdDateTime,
      modifiedBy,
      modifiedDateTime,
      deletedDateTime,
      deletedBy,
    };
    return model;
  }

  toDomain(model: BaseModel): Audit {
    const {
      createdBy,
      createdDateTime,
      modifiedBy,
      modifiedDateTime,
      deletedDateTime,
      deletedBy,
    } = model;
    const entity: Audit = Audit.create(
      createdBy,
      createdDateTime,
      modifiedBy,
      modifiedDateTime,
      deletedBy,
      deletedDateTime,
    ).getValue();
    return entity;
  }
}
