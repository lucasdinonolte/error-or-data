import { describe, expect, it } from 'vitest';

import { failure, ok, unwrapOrThrow, unwrapOrFallback } from '../src/index';

describe('Unwrap', () => {
  describe('unwrapOrThrow', () => {
    it('should return data for a success result', () => {
      const res = unwrapOrThrow(ok(1));
      expect(res).toBe(1);
    });

    it('should throw error for a failure result', () => {
      expect(() => unwrapOrThrow(failure('error'))).toThrow('error');
    });
  });

  describe('unwrapOrFallback', () => {
    it('should return data for a success result', () => {
      const res = unwrapOrFallback(ok(1), 2);
      expect(res).toBe(1);
    });
    it('should return fallback for a failure result', () => {
      const res = unwrapOrFallback(failure('error'), 2);
      expect(res).toBe(2);
    });
  });
});
