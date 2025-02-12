import { Environment } from '@/domain/environment.ts';
import { Config } from '@/domain/config.ts';
import { ProcessParameter } from '@/domain/process-parameter.ts';

type AssignMergeRequestLabelsOptions = {
  labels: string[];
  parameter: Pick<ProcessParameter, 'ACCESS_TOKEN'>;
  environment: Pick<Environment, 'CI_API_V4_URL' | 'CI_PROJECT_ID' | 'CI_MERGE_REQUEST_IID'>;
  config: Pick<Config, 'assignMethod'>;
};

/**
 * Assigns the specified labels to the merge request provided via the config parameter.
 * @param labels Labels to assign
 * @param parameter Process configuration with access token
 * @param environment Environment variables to target GitLab REST API
 * @param config Configuration option containing label assign method
 * @see https://docs.gitlab.com/ee/api/merge_requests.html#update-mr
 */
async function assignMergeRequestLabels({ labels, parameter, environment, config }: AssignMergeRequestLabelsOptions) {
  const url = `${environment.CI_API_V4_URL}/projects/${environment.CI_PROJECT_ID}/${environment.CI_MERGE_REQUEST_IID}`;

  try {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': parameter.ACCESS_TOKEN,
      },
      body: JSON.stringify({ [config.assignMethod === 'APPEND' ? 'add_labels' : 'labels']: labels.join(',') }),
    });
  } catch (error) {
    throw new Error('Could not assign merge request labels.', { cause: error });
  }
}

export default assignMergeRequestLabels;
