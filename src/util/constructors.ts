import type { Result } from '../core';
import { ok, failure } from '../core';

/**
 * Wraps a synchronous thunk that may fail.
 */
export function fromTryCatch<T>(
  fn: () => T,
  errorTransformer?: never,
): Result<unknown, T>;
export function fromTryCatch<E, T>(
  fn: () => T,
  errorTransformer?: (e: unknown) => E,
): Result<E, T>;
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
): Promise<Result<unknown, T>>;
export async function fromAsyncTryCatch<E, T>(
  fn: () => PromiseLike<T>,
  errorTransformer?: (e: unknown) => E,
): Promise<Result<E, T>>;
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
): (...args: Parameters<Fn>) => Result<unknown, ReturnType<Fn>>;
export function fromThrowable<E, Fn extends (...args: readonly any[]) => any>(
  fn: Fn,
  errorTransformer: (e: unknown) => E,
): (...args: Parameters<Fn>) => Result<E, ReturnType<Fn>>;
export function fromThrowable<E, Fn extends (...args: readonly any[]) => any>(
  fn: Fn,
  errorTransformer?: (e: unknown) => E,
): (...args: Parameters<Fn>) => Result<E, ReturnType<Fn>> {
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
): (...args: Parameters<Fn>) => Promise<Result<unknown, ReturnType<Fn>>>;
export function fromAsyncThrowable<
  E,
  Fn extends (...args: readonly any[]) => PromiseLike<any>,
>(
  fn: Fn,
  errorTransformer: (e: unknown) => E,
): (...args: Parameters<Fn>) => Promise<Result<E, ReturnType<Fn>>>;
export function fromAsyncThrowable<
  E,
  Fn extends (...args: readonly any[]) => PromiseLike<any>,
>(
  fn: Fn,
  errorTransformer?: (e: unknown) => E,
): (...args: Parameters<Fn>) => Promise<Result<E, ReturnType<Fn>>> {
  return async (...args) =>
    await fromAsyncTryCatch(async () => await fn(...args), errorTransformer);
}
