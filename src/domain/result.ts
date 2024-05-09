//any enhancement to this method?
export class Result<T> {
  public isSuccess: boolean;
  private data: T | undefined;
  public message: string | undefined;
  public errorCode: number | undefined;

  constructor(
    isSuccess: boolean,
    message?: string,
    value?: T,
    errorCode?: number,
  ) {
    this.isSuccess = isSuccess;
    this.data = value;
    this.message = message;
    this.errorCode = errorCode;

    Object.freeze(this);
  }

  public getValue(): T {
    return this.data;
  }

  public static ok<U>(value: U, message?: string): Result<U> {
    return new Result<U>(true, message, value, undefined);
  }

  public static fail<U>(message?: string, errorCode?: number): Result<U> {
    return new Result<U>(false, message, undefined, errorCode);
  }

  public map<U>(fn: (value: T) => U): Result<U> {
    if (this.isSuccess) {
      return Result.ok(fn(this.data));
    } else {
      return Result.fail<U>(this.message, this.errorCode);
    }
  }
}
