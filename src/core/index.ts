export type Data<T> = {
  data: T;
  error: undefined;
  isOk: true;
  isFailure: false;
};

export type Failure<E> = {
  data: undefined;
  error: E;
  isOk: false;
  isFailure: true;
};

export type Result<E, T> = Data<T> | Failure<E>;

/**
 * Creates a success result object.
 *
 * @param data - The data to be included in the result.
 * @returns A result object indicating success.
 */
export function ok<T>(data: T): Result<never, T> {
  return {
    data,
    error: undefined,
    isOk: true,
    isFailure: false,
  };
}

/**
 * Creates a failure result object.
 *
 * @param error - The error object to be included in the result.
 * @returns A result object indicating failure.
 */
export function failure<E>(error: E): Result<E, never> {
  return {
    data: undefined,
    error,
    isOk: false,
    isFailure: true,
  };
}

/**
 * Checks if the result is a success.
 *
 * @param result - The result object to check.
 * @returns True if the result is a success, false otherwise.
 */
export function isOk<E, T>(result: Result<E, T>): result is Data<T> {
  return result.isOk;
}

/**
 * Checks if the result is a failure.
 *
 * @param result - The result object to check.
 * @returns True if the result is a failure, false otherwise.
 */
export function isFailure<E, T>(result: Result<E, T>): result is Failure<E> {
  return result.isFailure;
}
