import { IValueObjectProps } from "./value-object.props";

/**
 * Value Object checks the type of data being passed
 * and ensures the data type is read only
 */
export class ValueObject<T extends IValueObjectProps> {
  protected readonly props: T;
  constructor(props: T) {
    this.props = Object.freeze(props);
  }
}
