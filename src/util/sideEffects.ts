import type { Result } from '../core';
import { isFailure, isOk } from '../core';

/**
 * Creates a function that will run a side effect on
 * a succesful Result type.
 *
 * The data is passed to the effect function.
 */
export function createSideEffect<E, T>(
  effect: (data: T) => void,
): (result: Result<E, T>) => void {
  return (result) => {
    if (isOk(result)) {
      effect(result.data);
    }
  };
}

/**
 * Immediately runs a side effect on a succesful
 * Result type.
 */
export function withData<E, T>(result: Result<E, T>, fn: (data: T) => void) {
  createSideEffect(fn)(result);
}

/**
 * Creates a function that will run a side effect on
 * a failure Result type.
 *
 * The error is passed to the effect function.
 */
export function createFailureSideEffect<E, T>(
  effect: (error: E) => void,
): (result: Result<E, T>) => void {
  return (result) => {
    if (isFailure(result)) {
      effect(result.error);
    }
  };
}

/**
 * Immediately runs a side effect on a failure
 * Result type.
 */
export function withError<E, T>(result: Result<E, T>, fn: (error: E) => void) {
  createFailureSideEffect(fn)(result);
}
