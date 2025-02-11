import validateEnvironment from '@/domain/validate-environment.ts';
import loadEnvironment from '@/infrastructure/load-environment.ts';
import validateConfig from '@/domain/validate-config.ts';
import loadConfig from '@/infrastructure/load-config.ts';
import queryGitLogMessages from '@/infrastructure/query-git-log-messages.ts';
import convertTextToMatchedLabels from '@/domain/convert-text-to-matched-labels.ts';
import queryGitDiffPaths from '@/infrastructure/query-git-diff-paths.ts';
import assignMergeRequestLabels from '@/infrastructure/assign-merge-request-labels.ts';

const spacer = '______________________________________________________________________';

async function main() {
  const environment = validateEnvironment(loadEnvironment());
  const config = validateConfig(await loadConfig(environment));

  console.info(spacer);
  console.info(`Using "${environment.GL_MR_LABELER_CONFIG_PATH}" as configuration file`);
  console.info(`Using "${config.assignMethod}" method to assign labels`);
  console.info('Source commit SHA', environment.CI_COMMIT_SHA);
  console.info('Target commit SHA', environment.CI_MERGE_REQUEST_DIFF_BASE_SHA);
  console.info(spacer);

  const labelsToAssign = new Set<string>();

  if (Object.keys(config.gitLogMessages).length > 0) {
    const gitLogMessages = await queryGitLogMessages(
      environment.CI_MERGE_REQUEST_DIFF_BASE_SHA,
      environment.CI_COMMIT_SHA,
    );

    const labelsByGitLogMessages = convertTextToMatchedLabels(gitLogMessages, config.gitLogMessages);
    console.info('Matched labels based on git log messages', labelsByGitLogMessages);

    for (const labelByGitLogMessage of labelsByGitLogMessages) {
      labelsToAssign.add(labelByGitLogMessage);
    }
  } else {
    console.warn('Skip git log messages analysis because no configuration has been defined');
  }

  if (Object.keys(config.gitDiffPaths).length > 0) {
    const gitDiffPaths = await queryGitDiffPaths(environment.CI_MERGE_REQUEST_DIFF_BASE_SHA, environment.CI_COMMIT_SHA);

    const labelsByGitDiffPaths = convertTextToMatchedLabels(gitDiffPaths, config.gitDiffPaths);
    console.info('Matched labels based on git diff paths', labelsByGitDiffPaths);

    for (const labelByGitDiffPath of labelsByGitDiffPaths) {
      labelsToAssign.add(labelByGitDiffPath);
    }
  } else {
    console.warn('Skip git diff paths analysis because no configuration has been defined');
  }

  console.info(spacer);

  if (labelsToAssign.size > 0 || config.assignMethod === 'OVERRIDE') {
    const labelsToAssignArray = [...labelsToAssign];
    console.info('Sending API request to assign labels', labelsToAssignArray);
    await assignMergeRequestLabels(labelsToAssignArray, environment, config);
  } else {
    console.warn('Skip API request as no labels have been matched');
  }

  console.info(spacer);
}

export default main;
