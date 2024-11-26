import { fromThrowable } from '../dist';

const safeJSONParse = fromThrowable(JSON.parse, () => 'Oh no, parsing error');

const okRes = safeJSONParse('{"a": 1}');
console.log(okRes);

const failureRes = safeJSONParse('{"a": 1');
console.log(failureRes);
