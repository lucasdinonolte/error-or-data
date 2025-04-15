import type { Result } from '../core';
import { failure, isFailure, isOk, ok } from '../core';

/**
 * Creates a transformer, that will operate on a successful Result type.
 * In case of failure to original Result is passed through.
 */
export function createTransformer<E, T, U>(
  fn: (data: T) => U,
): (result: Result<E, T>) => Result<E, U> {
  return (result) => {
    if (isOk(result)) {
      return ok(fn(result.data));
    }
    return result;
  };
}

/**
 * Immediately runs a transformer on a succesful Result type.
 */
export function mapData<E, T, U>(result: Result<E, T>, fn: (data: T) => U) {
  return createTransformer<E, T, U>(fn)(result);
}

/**
 * Creates a transformer, that will operate on a failure Result type.
 * In case of success to original Result is passed through.
 */
export function createFailureTransformer<E, T, U>(
  fn: (data: E) => U,
): (result: Result<E, T>) => Result<U, T> {
  return (result) => {
    if (isFailure(result)) {
      return failure(fn(result.error));
    }
    return result;
  };
}

/**
 * Immediately runs a transformer on a failure Result type.
 */
export function mapError<E, T, U>(result: Result<E, T>, fn: (error: E) => U) {
  return createFailureTransformer<E, T, U>(fn)(result);
}
