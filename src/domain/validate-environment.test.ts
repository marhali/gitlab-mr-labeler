import { describe, it, expect } from 'vitest';
import validateEnvironment from '@/domain/validate-environment.ts';
import { Environment, environmentKeys } from '@/domain/environment.ts';

function filterEnvironment(environment: Environment, filterOut: keyof Environment) {
  const filteredEntries = Object.entries(environment).filter(([key]) => key !== filterOut);
  return Object.fromEntries(filteredEntries);
}

describe('validateEnvironment()', () => {
  const environment: Environment = {
    CI_API_V4_URL: 'myApiV4Url',
    CI_PROJECT_DIR: 'myProject',
    CI_PROJECT_ID: 'myCiProjectId',
    CI_MERGE_REQUEST_IID: 'myMergeRequestIId',
    CI_MERGE_REQUEST_DIFF_BASE_SHA: 'myMergeRequestDiffBaseSha',
    CI_COMMIT_SHA: 'myCommitSha',
  };
  it('should just return environment if everything is okay', () => {
    expect(validateEnvironment(environment)).toStrictEqual(environment);
  });
  it('should throw exception if any environment variable is missing', () => {
    for (const environmentKey of environmentKeys) {
      expect(() => validateEnvironment(filterEnvironment(environment, environmentKey))).toThrow(
        new Error(`Missing required environment variable "${environmentKey}".`),
      );
    }
  });
});
