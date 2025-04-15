import { fromAsyncTryCatch } from '../src';

type User = {
  id: number;
  name: string;
  email: string;
};

/**
 * Example of an external library's database call.
 *
 * This call might fail, due to connection issues or
 * misconfigurations.
 *
 * But as far as typescript is concerned, this function
 * always returns. There's no visibility into how this
 * could fail, making it easy to forget error handling.
 */
const externalDatabaseCall = async <T>(query: string): Promise<T> => {
  throw new Error('Connection to database failed');
};

type DatabaseError = {
  reason: 'DatabaseError';
};

/**
 * By wrapping it in fromAsyncTryCatch we are
 * now explicit that this can fail and make it
 * the callers responsibility to handle the error.
 */
const queryCurrentUser = async () =>
  fromAsyncTryCatch<DatabaseError, User>(
    async () => externalDatabaseCall(`SELECT * FROM users WHERE id = 1`),
    (_) => ({ reason: 'DatabaseError' }),
  );

const user = await queryCurrentUser();

if (user.isOk) {
  console.log(user.data.id);
}
