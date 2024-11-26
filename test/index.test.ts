import { describe, expect, it } from 'vitest';

import {
  failure,
  fromThrowable,
  fromTryCatch,
  isFailure,
  isOk,
  ok,
} from '../src/index';

describe('FailureOrData', () => {
  describe('ok', () => {
    it('should return no error', () => {
      const [err, data] = ok(1);
      expect(err).toBe(null);
      expect(data).toBe(1);
    });
  });

  describe('failure', () => {
    it('should return no data', () => {
      const [err, data] = failure('error');
      expect(data).toBe(null);
      expect(err).toBe('error');
    });
  });

  describe('isOk', () => {
    it('should return true for data', () => {
      const res = ok(1);
      expect(isOk(res)).toBe(true);
    });

    it('should return false for error', () => {
      const res = failure('error');
      expect(isOk(res)).toBe(false);
    });
  });

  describe('isFailure', () => {
    it('should return true for error', () => {
      const res = failure('error');
      expect(isFailure(res)).toBe(true);
    });

    it('should return false if for error', () => {
      const res = ok(1);
      expect(isFailure(res)).toBe(false);
    });
  });

  describe('fromTryCatch', () => {
    it('should return data if no error is thrown', () => {
      const res = fromTryCatch(() => 1);
      expect(isOk(res)).toBe(true);
      expect(res[1]).toBe(1);
    });

    it('should return error if error is thrown', () => {
      const res = fromTryCatch(() => {
        throw new Error('error');
      });
      expect(isFailure(res)).toBe(true);
      expect(res[0]).toBeInstanceOf(Error);
    });
  });

  describe('fromThrowable', () => {
    it('should return a function', () => {
      const res = fromThrowable(() => 1);
      expect(res).toBeInstanceOf(Function);
    });

    it('should return data if no error is thrown', () => {
      const fn = fromThrowable(() => 1);
      const res = fn();
      expect(isOk(res)).toBe(true);
      expect(res[1]).toBe(1);
    });

    it('should return error if error is thrown', () => {
      const fn = fromThrowable(() => {
        throw new Error('error');
      });
      const res = fn();
      expect(isFailure(res)).toBe(true);
      expect(res[0]).toBeInstanceOf(Error);
    });
  });
});
