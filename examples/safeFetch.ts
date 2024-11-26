import { ok, failure } from '../dist';

type RequestError = {
  reason: 'RequestError';
  message: string;
  status: number;
};

type JsonParseError = {
  reason: 'InvalidJson';
};

type OtherError = {
  reason: 'OtherError';
};

type Todo = {
  userId: number;
  id: number;
  title: string;
  complated: boolean;
};

async function safeFetch<T>(url: string, init: RequestInit) {
  try {
    const response = await fetch(url, init);
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
      return failure<JsonParseError>({ reason: 'InvalidJson' });
    }
  } catch (error) {
    return failure<OtherError>({ reason: 'OtherError' });
  }
}

const [err, data] = await safeFetch<Todo>(
  'https://jsonplaceholder.typicode.com/todos/1',
  {},
);

console.log(err, data);
