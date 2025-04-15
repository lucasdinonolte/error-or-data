import { z } from 'zod';
import type { StandardSchemaV1 } from '@standard-schema/spec';
import { ok, failure, mapData } from '../dist';

type RequestError = {
  reason: 'RequestError';
  message: string;
  status: number;
};

type TimeoutError = {
  reason: 'TimeoutError';
  message?: string;
};

type JsonParseError = {
  reason: 'InvalidJson';
  message?: string;
};

type OtherError = {
  reason: 'OtherError';
  message?: string;
};

type ValidationError = {
  reason: 'ValidationError';
  issues: Readonly<Array<StandardSchemaV1.Issue>>;
};

/**
 * Performs a fetch request with enhanced error handling, retries, and timeout support.
 *
 * @template T - The expected type of the response data.
 * @param url - The URL to fetch.
 * @param init - The fetch options, excluding the `signal` property.
 * @param options - Additional options for the fetch request.
 * @param options.timeout - The timeout duration in milliseconds (default: 10,000).
 * @param options.retries - The number of retry attempts on failure (default: 0).
 * @param options.retryBaseDelay - The base delay in milliseconds for retries, increasing exponentially (default: 1,000).
 * @returns A promise resolving to a success result with the parsed data or a failure result with an error.
 */
async function safeFetch<T>(
  url: string,
  init: RequestInit,
  {
    timeout = 10_000,
    retries = 0,
    retryBaseDelay = 1000,
  }: {
    retries?: number;
    retryBaseDelay?: number;
    timeout?: number;
  } = {},
) {
  async function execute(attempt: number) {
    try {
      const controller = new AbortController();
      const controllerTimeout = setTimeout(() => controller.abort(), timeout);

      init.signal?.addEventListener('abort', () => {
        controller.abort();
        clearTimeout(controllerTimeout);
      });

      const response = await fetch(url, { ...init, signal: controller.signal });
      clearTimeout(controllerTimeout);

      init.signal?.removeEventListener('abort', () => {
        controller.abort();
      });

      if (!response.ok) {
        return failure<RequestError>({
          reason: 'RequestError',
          message: response.statusText,
          status: response.status,
        });
      }

      try {
        const data = await response.json();
        return ok<T>(data);
      } catch (error) {
        if (attempt < retries) {
          throw error;
        }

        return failure<JsonParseError>({
          reason: 'InvalidJson',
          message: (error as Error).message,
        });
      }
    } catch (error) {
      if (attempt < retries) {
        await new Promise<void>((res) =>
          setTimeout(
            () => {
              res();
            },
            retryBaseDelay * 2 ** attempt,
          ),
        );
        return execute(attempt + 1);
      }

      if ((error as Error).name === 'AbortError') {
        return failure<TimeoutError>({
          reason: 'TimeoutError',
          message: `Fetching ${url} timed out after ${timeout}ms`,
        });
      }
      return failure<OtherError>({
        reason: 'OtherError',
        message: (error as Error).message,
      });
    }
  }

  return execute(0);
}

/**
 * Fetches data from a URL and validates it against a provided schema.
 *
 * @template T - The schema type extending `StandardSchemaV1`.
 * @param url - The URL to fetch data from.
 * @param schema - The schema to validate the fetched data against.
 * @param init - Optional fetch initialization options.
 * @param options - Additional options for the fetch request.
 * @param options.retries - The number of retry attempts on failure (default: 0).
 * @param options.retryBaseDelay - The base delay in milliseconds for retries, increasing exponentially (default: 1,000).
 * @param options.timeout - The timeout duration in milliseconds (default: 10,000).
 * @returns A promise resolving to a success result with validated data or a failure result with an error.
 */
async function fetchAndValidate<T extends StandardSchemaV1>(
  url: string,
  schema: T,
  init: RequestInit = {},
  options: {
    retries?: number;
    retryBaseDelay?: number;
    timeout?: number;
  } = {},
) {
  const res = await safeFetch<unknown>(url, init, options);

  if (res.isFailure) {
    return res;
  }

  let validated = schema['~standard'].validate(res.data);
  if (validated instanceof Promise) validated = await validated;

  if (validated.issues) {
    return failure<ValidationError>({
      reason: 'ValidationError',
      issues: validated.issues,
    });
  }

  return ok<StandardSchemaV1.InferOutput<T>>(validated.value);
}

const main = async () => {
  const res = await fetchAndValidate(
    'https://jsonplaceholder.typicode.com/todos/1',
    z.object({
      userId: z.number(),
      id: z.number(),
      title: z.string(),
      completed: z.boolean(),
    }),
  );

  if (res.isFailure) {
    console.log(res.error);
    return;
  }

  // Res is type-safe and validated now
  console.log(res.data);
};

main();
