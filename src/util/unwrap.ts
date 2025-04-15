import type { Result } from '../core';

/**
 * Unwraps a Result, returning its data if it is a success.
 * If the Result is a failure, it throws the associated error.
 *
 * @throws {E} - Throws the error contained in the Result if it is a failure.
 *
 * @example
 * const successResult = ok( "Success data");
 * const data = unwrapOrThrow(successResult); // Returns "Success data"
 *
 * const failureResult = failure("Error occurred");
 * unwrapOrThrow(failureResult); // Throws "Error occurred"
 */
export function unwrapOrThrow<E, T>(result: Result<E, T>): T {
  if (result.isFailure) {
    throw result.error;
  }
  return result.data;
}

/**
 * Unwraps a Result, returning a specified fallback value in the event of a Failure.
 *
 * @example
 * const successResult = ok('Success data');
 * const failureResult = failure('Error occurred');
 *
 * const data1 = unwrapOrFallback(successResult, 'Default value'); // Returns 'Success data'
 * const data2 = unwrapOrFallback(failureResult, 'Default value'); // Returns 'Default value'
 */
export function unwrapOrFallback<E, T>(result: Result<E, T>, fallback: T): T {
  if (result.isFailure) return fallback;
  return result.data;
}
