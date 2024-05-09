import { Result } from '../result';
import { ValueObject } from '../value-object';
import { IAuditProps } from './audit.props';

export class Audit extends ValueObject<IAuditProps> {
  get createdBy(): string {
    return this.props.createdBy;
  }

  get modifiedBy(): string | undefined {
    return this.props.modifiedBy;
  }

  get deletedBy(): string | undefined {
    return this.props.deletedBy;
  }

  get createdDateTime(): Date {
    return this.props.createdDateTime;
  }

  get modifiedDateTime(): Date | undefined {
    return this.props.modifiedDateTime;
  }
  get deletedDateTime(): Date | undefined {
    return this.props.deletedDateTime;
  }

  public static create(
    createdBy: string,
    createdDateTime: Date,
    modifiedBy?: string,
    modifiedDateTime?: Date,
    deletedBy?: string,
    deletedDateTime?: Date,
  ) {
    return Result.ok(
      new Audit({
        createdBy,
        createdDateTime,
        modifiedBy,
        modifiedDateTime,
        deletedBy,
        deletedDateTime,
      }),
    );
  }
}
