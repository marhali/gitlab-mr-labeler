import { describe, it, expect, vi, afterEach } from 'vitest';
import loadEnvironment from '@/infrastructure/load-environment.ts';
import { Environment } from '@/domain/environment.ts';

describe('loadEnvironment()', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it('should return loaded environment variables from process env', () => {
    const environment: Environment = {
      GL_MR_LABELER_CONFIG_PATH: 'myConfigPath',
      GL_MR_LABELER_ACCESS_TOKEN: 'myAccessToken',
      CI_API_V4_URL: 'myApiV4Url',
      CI_BUILDS_DIR: '/builds',
      CI_PROJECT_DIR: '/myProject',
      CI_PROJECT_ID: 'myCiProjectId',
      CI_MERGE_REQUEST_IID: 'myMergeRequestIId',
      CI_MERGE_REQUEST_DIFF_BASE_SHA: 'myMergeRequestDiffBaseSha',
      CI_COMMIT_SHA: 'myCommitSha',
    };

    for (const [environmentKey, environmentValue] of Object.entries(environment)) {
      vi.stubEnv(environmentKey, environmentValue);
    }

    expect(loadEnvironment()).toStrictEqual(environment);
  });
  it('should return "gl-mr-labeler.config.json" as fallback value for property "GL_MR_LABELER_CONFIG_PATH"', () => {
    expect(loadEnvironment()).toStrictEqual(
      expect.objectContaining({
        GL_MR_LABELER_CONFIG_PATH: 'gl-mr-labeler.config.json',
      }),
    );
  });
  it('should return empty string as fallback value for property "CI_BUILDS_DIR"', () => {
    expect(loadEnvironment()).toStrictEqual(
      expect.objectContaining({
        CI_BUILDS_DIR: '',
      }),
    );
  });
});
