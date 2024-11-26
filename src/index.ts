type Failure<E> = [E, null];
type Data<T> = [null, T];
type FailureOrData<E, T> = Failure<E> | Data<T>;

/**
 * Creates a data return value
 */
export function ok<T>(data: T): Data<T> {
  return [null, data];
}

/**
 * Creates a failure return value
 */
export function failure<E>(error: E): Failure<E> {
  return [error, null];
}

/**
 * Checks if a returned value is of data type
 */
export function isOk<E, T>(result: FailureOrData<E, T>): result is Data<T> {
  return result[0] === null;
}

/**
 * Checks if a returned value is of error type
 */
export function isFailure<E, T>(
  result: FailureOrData<E, T>,
): result is Failure<E> {
  /**
   * All type checking needs to happen on the failure
   * field, as `null` can be a valid data value that
   * does not necessarily mean that the result is a
   * failure. However, if an error is present it must
   * not be null. So checking for a non-null error
   * value is the exhausitve way to determine if the
   * result is a failure.
   */

  return result[0] !== null;
}

/**
 * Wraps a synchronous thunk that may fail.
 */
export function fromTryCatch<T>(
  fn: () => T,
  errorTransformer?: never,
): FailureOrData<unknown, T>;
export function fromTryCatch<E, T>(
  fn: () => T,
  errorTransformer?: (e: unknown) => E,
): FailureOrData<E, T>;
export function fromTryCatch<E, T = unknown>(
  fn: () => T,
  errorTransformer?: (e: unknown) => E,
) {
  try {
    return ok(fn());
  } catch (error) {
    return failure(errorTransformer ? errorTransformer(error) : error);
  }
}

/**
 * Wraps an asynchronous thunk that may fail.
 */
export async function fromAsyncTryCatch<E, T>(
  fn: () => PromiseLike<T>,
  errorTransformer?: never,
): Promise<FailureOrData<unknown, T>>;
export async function fromAsyncTryCatch<E, T>(
  fn: () => PromiseLike<T>,
  errorTransformer?: (e: unknown) => E,
): Promise<FailureOrData<E, T>>;
export async function fromAsyncTryCatch<E, T>(
  fn: () => PromiseLike<T>,
  errorTransformer?: (e: unknown) => E,
) {
  try {
    return ok(await fn());
  } catch (error) {
    return failure(errorTransformer ? errorTransformer(error) : error);
  }
}

/**
 * Makes a synchronous function that may throw an exception
 * safe by wrapping it.
 */
export function fromThrowable<E, Fn extends (...args: readonly any[]) => any>(
  fn: Fn,
): (...args: Parameters<Fn>) => FailureOrData<unknown, ReturnType<Fn>>;
export function fromThrowable<E, Fn extends (...args: readonly any[]) => any>(
  fn: Fn,
  errorTransformer: (e: unknown) => E,
): (...args: Parameters<Fn>) => FailureOrData<E, ReturnType<Fn>>;
export function fromThrowable<E, Fn extends (...args: readonly any[]) => any>(
  fn: Fn,
  errorTransformer?: (e: unknown) => E,
): (...args: Parameters<Fn>) => FailureOrData<E, ReturnType<Fn>> {
  return (...args) => fromTryCatch(() => fn(...args), errorTransformer);
}

/**
 * Makes an asynchronous function that may throw an exception
 * safe by wrapping it in a Result.
 */
export function fromAsyncThrowable<
  E,
  Fn extends (...args: readonly any[]) => PromiseLike<any>,
>(
  fn: Fn,
): (...args: Parameters<Fn>) => Promise<FailureOrData<unknown, ReturnType<Fn>>>;
export function fromAsyncThrowable<
  E,
  Fn extends (...args: readonly any[]) => PromiseLike<any>,
>(
  fn: Fn,
  errorTransformer: (e: unknown) => E,
): (...args: Parameters<Fn>) => Promise<FailureOrData<E, ReturnType<Fn>>>;
export function fromAsyncThrowable<
  E,
  Fn extends (...args: readonly any[]) => PromiseLike<any>,
>(
  fn: Fn,
  errorTransformer?: (e: unknown) => E,
): (...args: Parameters<Fn>) => Promise<FailureOrData<E, ReturnType<Fn>>> {
  return async (...args) =>
    await fromAsyncTryCatch(async () => await fn(...args), errorTransformer);
}
