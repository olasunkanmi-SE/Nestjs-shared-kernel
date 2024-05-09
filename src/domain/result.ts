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

  /**
   * Get the data returned from an API response
   * @returns {T}
   */
  public getValue(): T {
    return this.data;
  }

  /**
   * Get a positive response from an API query
   * @returns {Result<U>}
   * @param {string} message
   * @param {U} value
   */
  public static ok<U>(value: U, message?: string): Result<U> {
    return new Result<U>(true, message, value, undefined);
  }

  /**
   * Get a positive response from an API query
   * @returns {Result<U>}
   * @param {string} message
   * @param {number} errorCode
   */
  public static fail<U>(message?: string, errorCode?: number): Result<U> {
    return new Result<U>(false, message, undefined, errorCode);
  }
}
