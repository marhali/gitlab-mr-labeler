import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import readProcessParameter from '@/infrastructure/read-process-parameter.ts';

describe('readProcessParameter()', () => {
  let originalArgv: string[];
  beforeAll(() => {
    originalArgv = process.argv;
  });
  afterAll(() => {
    process.argv = originalArgv;
  });
  it('should return extracted process parameter', () => {
    process.argv = ['node', 'script.js', 'myAccessToken', 'myConfigPath.json'];
    expect(readProcessParameter()).toStrictEqual({
      ACCESS_TOKEN: 'myAccessToken',
      CONFIG_PATH: 'myConfigPath.json',
    });
  });
  it('should throw exception if first argument (ACCESS_TOKEN) is not provided', () => {
    process.argv = ['node', 'script.js'];
    expect(() => readProcessParameter()).toThrow(
      new RangeError('Missing required command-line argument "ACCESS_TOKEN" at index 0.'),
    );
  });
  it('should throw exception if second argument (CONFIG_PATH) is not provided', () => {
    process.argv = ['node', 'script.js', 'myAccessToken'];
    expect(() => readProcessParameter()).toThrow(
      new RangeError('Missing required command-line argument "CONFIG_PATH" at index 1.'),
    );
  });
});
