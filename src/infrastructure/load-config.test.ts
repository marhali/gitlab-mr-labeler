import { describe, it, expect, vi } from 'vitest';
import loadConfig from '@/infrastructure/load-config.ts';

describe('loadConfig()', () => {
  it('should return resolved json data', async () => {
    vi.doMock('builds/myProject/myValidJsonPath.json', () => ({ myKey: 'myValue' }));
    expect(
      await loadConfig({
        CI_BUILDS_DIR: 'builds',
        CI_PROJECT_DIR: 'myProject',
        GL_MR_LABELER_CONFIG_PATH: 'myValidJsonPath.json',
      }),
    ).toStrictEqual({ myKey: 'myValue' });
  });
  it('should throw exception if module could not be resolved', async () => {
    await expect(() =>
      loadConfig({
        CI_BUILDS_DIR: 'builds',
        CI_PROJECT_DIR: 'myProject',
        GL_MR_LABELER_CONFIG_PATH: 'myInvalidPath.json',
      }),
    ).rejects.toThrow(
      new Error('Could not load json configuration file from relative path "myInvalidPath.json".', {
        cause: new Error(
          'Failed to load url builds/myProject/myInvalidPath.json (resolved id: builds/myProject/myInvalidPath.json). Does the file exist?',
        ),
      }),
    );
  });
});
