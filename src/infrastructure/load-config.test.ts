import { describe, it, expect, vi, afterEach } from 'vitest';
import fs from 'node:fs/promises';
import loadConfig from '@/infrastructure/load-config.ts';

vi.mock('node:fs/promises');

describe('loadConfig()', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });
  it('should return resolved json data', async () => {
    vi.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify({ myKey: 'myValue' }));
    expect(
      await loadConfig({
        parameter: { CONFIG_PATH: '.gitlab/myValidJsonPath.json' },
        environment: { CI_PROJECT_DIR: 'builds/myProject' },
      }),
    ).toStrictEqual({ myKey: 'myValue' });
  });
  it('should throw exception if module could not be resolved', async () => {
    const cause = new Error('myCause');
    vi.spyOn(fs, 'readFile').mockRejectedValue(cause);

    await expect(() =>
      loadConfig({
        parameter: { CONFIG_PATH: '.gitlab/myInvalidPath.json' },
        environment: { CI_PROJECT_DIR: 'builds/myProject' },
      }),
    ).rejects.toThrow(
      new Error('Could not load json configuration file from relative path ".gitlab/myInvalidPath.json".', {
        cause,
      }),
    );
  });
});
