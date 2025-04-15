import { fromThrowable } from '../dist';

type JsonParseError = {
  reason: 'InvalidJson';
};

const safeJSONParse = fromThrowable(
  JSON.parse,
  () => ({ reason: 'InvalidJson' }) as JsonParseError,
);

const okRes = safeJSONParse('{"a": 1}');
console.log(okRes);

const failureRes = safeJSONParse('{"a": 1');
console.log(failureRes);
