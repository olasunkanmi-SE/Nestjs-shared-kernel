import { IValueObjectProps } from './value-object.props';

export class ValueObject<T extends IValueObjectProps> {
  protected readonly props: T;
  constructor(props: T) {
    this.props = Object.freeze(props);
  }
}
