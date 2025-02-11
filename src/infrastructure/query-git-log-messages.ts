import child_process from 'node:child_process';
import { promisify } from 'node:util';

/**
 * Returns the git-log messages between the provided base SHA and commit SHA revision as single string.
 * @param baseSHA The base SHA
 * @param commitSHA Commit revision SHA
 */
async function queryGitLogMessages(baseSHA: string, commitSHA: string) {
  const exec = promisify(child_process.exec);

  try {
    const { stdout } = await exec(`git log --pretty=format:"%s" ${baseSHA}..${commitSHA}`);
    return stdout;
  } catch (error) {
    throw new Error('Could not read git log messages.', { cause: error });
  }
}

export default queryGitLogMessages;
