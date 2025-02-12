import { describe, it, expect, vi, afterEach } from 'vitest';
import loadEnvironment from '@/infrastructure/load-environment.ts';
import { Environment } from '@/domain/environment.ts';

describe('loadEnvironment()', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });
  it('should return loaded environment variables from process env', () => {
    const environment: Environment = {
      CI_API_V4_URL: 'myApiV4Url',
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
});
