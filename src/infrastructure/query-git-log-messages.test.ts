import { describe, it, expect, vi, beforeEach } from 'vitest';
import queryGitLogMessages from '@/infrastructure/query-git-log-messages.ts';
// eslint-disable-next-line unicorn/import-style
import util from 'node:util';

vi.mock('node:util');

describe('queryGitLogMessages()', () => {
  const baseSHA = 'myBaseSHA';
  const commitSHA = 'myCommitSHA';
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('should return standard output of "git log" command as single string', async () => {
    const execMock = vi.fn().mockResolvedValue({ stdout: 'myGitLogResponse' });
    vi.spyOn(util, 'promisify').mockReturnValueOnce(execMock);

    await expect(queryGitLogMessages(baseSHA, commitSHA)).resolves.toBe('myGitLogResponse');

    expect(execMock).toHaveBeenLastCalledWith(`git log --pretty=format:"%s" ${baseSHA}..${commitSHA}`);
  });
  it('should throw exception if executed "git log" command fails', async () => {
    const execError = new Error('myFailure');
    vi.spyOn(util, 'promisify').mockReturnValueOnce(() => Promise.reject(execError));

    await expect(queryGitLogMessages(baseSHA, commitSHA)).rejects.toThrow(
      new Error('Could not read git log messages.', { cause: execError }),
    );
  });
});
