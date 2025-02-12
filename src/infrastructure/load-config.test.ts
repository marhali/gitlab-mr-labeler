import { describe, it, expect, vi } from 'vitest';
import loadConfig from '@/infrastructure/load-config.ts';

describe('loadConfig()', () => {
  it('should return resolved json data', async () => {
    vi.doMock('builds/myProject/.gitlab/myValidJsonPath.json', () => ({ myKey: 'myValue' }));
    expect(
      await loadConfig({
        parameter: { CONFIG_PATH: '.gitlab/myValidJsonPath.json' },
        environment: { CI_PROJECT_DIR: 'builds/myProject' },
      }),
    ).toStrictEqual({ myKey: 'myValue' });
  });
  it('should throw exception if module could not be resolved', async () => {
    await expect(() =>
      loadConfig({
        parameter: { CONFIG_PATH: '.gitlab/myInvalidPath.json' },
        environment: { CI_PROJECT_DIR: 'builds/myProject' },
      }),
    ).rejects.toThrow(
      new Error('Could not load json configuration file from relative path ".gitlab/myInvalidPath.json".', {
        cause: new Error(
          'Failed to load url builds/myProject/.gitlab/myInvalidPath.json (resolved id: builds/myProject/.gitlab/myInvalidPath.json). Does the file exist?',
        ),
      }),
    );
  });
});
