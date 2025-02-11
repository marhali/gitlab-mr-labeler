import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import main from '@/domain/main.ts';

vi.mock('@/domain/main.ts');

describe('bootstrap', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  it('should call and await main function', async () => {
    (main as Mock).mockImplementation(() => Promise.resolve());
    await import('@/bootstrap.ts');
    expect(main).toHaveBeenCalled();
  });
  it('should catch exceptions and properly report them', async () => {
    const error = new Error('myFailure');
    (main as Mock).mockImplementation(() => Promise.reject(error));
    await expect(async () => await import('@/bootstrap.ts')).rejects.toThrow(error);
  });
});
