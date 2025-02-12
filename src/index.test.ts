import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import main from '@/main.ts';

vi.mock('@/main.ts');

describe('index', () => {
  beforeEach(() => {
    vi.resetModules();
  });
  it('should call and await main function', async () => {
    (main as Mock).mockImplementation(() => Promise.resolve());
    await import('@/index.ts');
    expect(main).toHaveBeenCalled();
  });
  it('should catch exceptions and properly report them', async () => {
    const error = new Error('myFailure');
    (main as Mock).mockImplementation(() => Promise.reject(error));
    await expect(async () => await import('@/index.ts')).rejects.toThrow(error);
  });
});
