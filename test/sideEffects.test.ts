import { describe, expect, it, vi } from 'vitest';

import {
  failure,
  ok,
  createSideEffect,
  withData,
  createFailureSideEffect,
  withError,
} from '../src/index';

describe('SideEffects', () => {
  describe('createSideEffect', () => {
    it('should return a function', () => {
      const res = createSideEffect(() => {});
      expect(typeof res).toBe('function');
    });

    it('should run the effect for a success result', () => {
      const mock = vi.fn();
      const effect = createSideEffect(mock);
      effect(ok(1));
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(1);
    });

    it('should not run the effect for a failure result', () => {
      const mock = vi.fn();
      const effect = createSideEffect(mock);
      effect(failure(1));
      expect(mock).not.toHaveBeenCalled();
    });
  });

  describe('withData', () => {
    it('should run the effect for a success result', () => {
      const mock = vi.fn();
      withData(ok(1), mock);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(1);
    });

    it('should not run the effect for a failure result', () => {
      const mock = vi.fn();
      withData(failure(1), mock);
      expect(mock).not.toHaveBeenCalled();
    });
  });

  describe('createFailureSideEffect', () => {
    it('should return a function', () => {
      const res = createFailureSideEffect(() => {});
      expect(typeof res).toBe('function');
    });

    it('should not run the effect for a success result', () => {
      const mock = vi.fn();
      const effect = createFailureSideEffect(mock);
      effect(ok(1));
      expect(mock).not.toHaveBeenCalled();
    });

    it('should run the effect for a failure result', () => {
      const mock = vi.fn();
      const effect = createFailureSideEffect(mock);
      effect(failure(1));
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(1);
    });
  });

  describe('withError', () => {
    it('should not run the effect for a success result', () => {
      const mock = vi.fn();
      withError(ok(1), mock);
      expect(mock).not.toHaveBeenCalled();
    });

    it('should run the effect for a failure result', () => {
      const mock = vi.fn();
      withError(failure(1), mock);
      expect(mock).toHaveBeenCalledTimes(1);
      expect(mock).toHaveBeenCalledWith(1);
    });
  });
});
