import { describe, it, expect, vi, Mock, beforeEach } from 'vitest';
import { ProcessParameter } from '@/domain/process-parameter.ts';
import { Environment } from '@/domain/environment.ts';
import { Config } from '@/domain/config.ts';
import readProcessParameter from '@/infrastructure/read-process-parameter.ts';
import validateEnvironment from '@/domain/validate-environment.ts';
import validateConfig from '@/domain/validate-config.ts';
import convertTextToMatchedLabels from '@/domain/convert-text-to-matched-labels.ts';
import loadEnvironment from '@/infrastructure/load-environment.ts';
import loadConfig from '@/infrastructure/load-config.ts';
import queryGitLogMessages from '@/infrastructure/query-git-log-messages.ts';
import queryGitDiffPaths from '@/infrastructure/query-git-diff-paths.ts';
import assignMergeRequestLabels from '@/infrastructure/assign-merge-request-labels.ts';
import main from '@/main.ts';

vi.mock('@/infrastructure/read-process-parameter.ts');
vi.mock('@/domain/validate-environment.ts');
vi.mock('@/infrastructure/load-environment.ts');
vi.mock('@/domain/validate-config.ts');
vi.mock('@/infrastructure/load-config.ts');
vi.mock('@/infrastructure/query-git-log-messages.ts');
vi.mock('@/infrastructure/query-git-diff-paths.ts');
vi.mock('@/domain/convert-text-to-matched-labels.ts');
vi.mock('@/infrastructure/assign-merge-request-labels.ts');

describe('main()', () => {
  const consoleInfoSpy = vi.spyOn(console, 'info');
  const consoleWarnSpy = vi.spyOn(console, 'warn');
  const spacer = '_________________________________________________________________________________';
  const parameter: ProcessParameter = {
    ACCESS_TOKEN: 'myPrivateAccessToken',
    CONFIG_PATH: 'myConfigPath',
  };
  const environment: Environment = {
    CI_API_V4_URL: 'https://gitlab.local/api/v4',
    CI_PROJECT_DIR: 'myProject',
    CI_PROJECT_ID: 'myCiProjectId',
    CI_MERGE_REQUEST_IID: 'myCiMergeRequestIId',
    CI_MERGE_REQUEST_DIFF_BASE_SHA: 'myMergeRequestDiffBaseSha',
    CI_COMMIT_SHA: 'myCommitSha',
  };
  const config: Config = {
    assignMethod: 'APPEND',
    gitLogMessages: {
      myLabelA: ['anything'],
    },
    gitDiffPaths: {
      myLabelB: ['anything'],
    },
  };
  beforeEach(() => {
    vi.resetAllMocks();
    consoleInfoSpy.mockImplementation(() => {});
    consoleWarnSpy.mockImplementation(() => {});
  });
  it('should execute but should not find any labels to add', async () => {
    (readProcessParameter as Mock).mockImplementation(() => parameter);
    (validateEnvironment as Mock).mockImplementation(() => environment);
    (validateConfig as Mock).mockImplementation(() => config);
    (queryGitLogMessages as Mock).mockImplementation(() => Promise.resolve('myGitLogMessages'));
    (queryGitDiffPaths as Mock).mockImplementation(() => Promise.resolve('myGitDiffPaths'));
    (convertTextToMatchedLabels as Mock).mockImplementation(() => []);

    await main();

    expect(loadEnvironment).toHaveBeenCalledTimes(1);
    expect(loadConfig).toHaveBeenCalledTimes(1);

    expect(consoleInfoSpy).toHaveBeenNthCalledWith(1, spacer);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(2, `Using "${parameter.CONFIG_PATH}" as configuration file`);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(3, `Using "${config.assignMethod}" method to assign labels`);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(4, 'Source commit SHA', environment.CI_COMMIT_SHA);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(5, 'Target commit SHA', environment.CI_MERGE_REQUEST_DIFF_BASE_SHA);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(6, spacer);

    expect(queryGitLogMessages).toHaveBeenLastCalledWith(
      environment.CI_MERGE_REQUEST_DIFF_BASE_SHA,
      environment.CI_COMMIT_SHA,
    );
    expect(convertTextToMatchedLabels).toHaveBeenNthCalledWith(1, 'myGitLogMessages', config.gitLogMessages);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(7, 'Matched labels based on git log messages:');
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(8, []);

    expect(queryGitDiffPaths).toHaveBeenLastCalledWith(
      environment.CI_MERGE_REQUEST_DIFF_BASE_SHA,
      environment.CI_COMMIT_SHA,
    );
    expect(convertTextToMatchedLabels).toHaveBeenNthCalledWith(2, 'myGitDiffPaths', config.gitDiffPaths);
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(9, 'Matched labels based on git diff paths:');
    expect(consoleInfoSpy).toHaveBeenNthCalledWith(10, []);

    expect(consoleInfoSpy).toHaveBeenNthCalledWith(11, spacer);
    expect(consoleWarnSpy).toHaveBeenLastCalledWith('Skip API request as no labels have been matched');
    expect(assignMergeRequestLabels).not.toHaveBeenCalled();
  });
  it('should skip git diff paths analysis if config is empty', async () => {
    (readProcessParameter as Mock).mockImplementation(() => parameter);
    (validateEnvironment as Mock).mockImplementation(() => environment);
    (validateConfig as Mock).mockImplementation(() => ({ ...config, gitDiffPaths: {} }));
    (queryGitLogMessages as Mock).mockImplementation(() => Promise.resolve('myGitLogMessages'));
    (queryGitDiffPaths as Mock).mockImplementation(() => Promise.resolve('myGitDiffPaths'));
    (convertTextToMatchedLabels as Mock).mockImplementation(() => []);

    await main();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skip git diff paths analysis because no configuration has been defined',
    );
    expect(assignMergeRequestLabels).not.toHaveBeenCalled();
  });
  it('should skip git log messages analysis if config is empty', async () => {
    (readProcessParameter as Mock).mockImplementation(() => parameter);
    (validateEnvironment as Mock).mockImplementation(() => environment);
    (validateConfig as Mock).mockImplementation(() => ({ ...config, gitLogMessages: {} }));
    (queryGitLogMessages as Mock).mockImplementation(() => Promise.resolve('myGitLogMessages'));
    (queryGitDiffPaths as Mock).mockImplementation(() => Promise.resolve('myGitDiffPaths'));
    (convertTextToMatchedLabels as Mock).mockImplementation(() => []);

    await main();

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Skip git log messages analysis because no configuration has been defined',
    );
    expect(assignMergeRequestLabels).not.toHaveBeenCalled();
  });
});
