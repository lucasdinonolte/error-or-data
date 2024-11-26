# Errors as Values

A small utility package that brings Golang inspired error-as-values-handling to Javascript and Typescript.

## Example

```typescript
import { fromThrowable } from 'error-or-data';

const safeJSONParse = fromThrowable(JSON.parse);

const [err, data] = safeJSONParse('{"a": 1');
```

## Why Golang inspired?

Personally, I do prefer the way Rust handles errors-as-values using the `Result` type. I experimented with working with a Result-type utility in Javascript a bunch. It just never felt right for me, because what makes Rust’s Result type so great is Rust’s pattern matching. I do believe in working with what the language and its syntax gives us. And this way of returning an error-data-tuple just feels more natural to me.

However, this is just a small utility, which could easily be used to roll your own Result-type on top of it.

## API Documentation

### `ok`

Creates a data variant.

**Example**

```typescript
const [_, data] = ok(100);
```

### `failure`

Creates an error variant.

**Example**

```typescript
const [err, _] = failure('Oh no');
```

### `isOk`

Checks if a result is of the data variant.

**Example**

```typescript
const dataRes = ok(100);
const errorRes = failure('Oh no');

isOk(dataRes); // true
isOk(errorRes); // false
```

### `isFailure`

Checks if a result is of the error variant.

**Example**

```typescript
const dataRes = ok(100);
const errorRes = failure('Oh no');

isFailure(errorRes); // true
isFailure(dataRes); // false
```

### `fromTryCatch`

Wraps a potentially throwing computation and will return either a data or error variant.

**Example**

```typescript
const [err, data] = fromTryCatch(() => {
  if (Math.random() > 0.5) throw new Error('Oh no!');
  return 100;
});
```

### `fromAsyncTryCatch`

Async version of `fromTryCatch`

### `fromThrowable`

Wraps a potentially throwing function, returning a _safe_ version of that function, that when called will either return a data or error variant.

**Example**

```typescript
const safeJSONParse = fromThrowable(JSON.parse);
ons;

const [err, data] = safeJSONParse('{"a": 1');
```

### `fromAsyncThrowable`

Async version of `fromThrowable`.
