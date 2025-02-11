import { describe, it, expect, vi, beforeEach } from 'vitest';
import queryGitDiffPaths from '@/infrastructure/query-git-diff-paths.ts';
// eslint-disable-next-line unicorn/import-style
import util from 'node:util';

vi.mock('node:util');

describe('queryGitDiffPaths()', () => {
  const baseSHA = 'myBaseSHA';
  const commitSHA = 'myCommitSHA';
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('should return standard output of "git diff" command as single string', async () => {
    const execMock = vi.fn().mockResolvedValue({ stdout: 'myGitDiffResponse' });
    vi.spyOn(util, 'promisify').mockReturnValueOnce(execMock);

    await expect(queryGitDiffPaths(baseSHA, commitSHA)).resolves.toBe('myGitDiffResponse');

    expect(execMock).toHaveBeenLastCalledWith(`git diff --name-only ${baseSHA} ${commitSHA}`);
  });
  it('should throw exception if executed "git diff" command fails', async () => {
    const execError = new Error('myFailure');
    vi.spyOn(util, 'promisify').mockReturnValueOnce(() => Promise.reject(execError));

    await expect(queryGitDiffPaths(baseSHA, commitSHA)).rejects.toThrow(
      new Error('Could not read git diff paths.', { cause: execError }),
    );
  });
});
