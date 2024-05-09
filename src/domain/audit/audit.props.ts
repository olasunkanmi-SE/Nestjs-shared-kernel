export interface IAuditProps {
  createdBy: string;
  modifiedBy?: string;
  deletedBy?: string;
  createdDateTime: Date;
  modifiedDateTime?: Date;
  deletedDateTime?: Date;
}
