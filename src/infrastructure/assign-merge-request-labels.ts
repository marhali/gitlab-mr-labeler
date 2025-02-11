import { Environment } from '@/domain/environment.ts';
import { Config } from '@/domain/config.ts';

/**
 * Assigns the specified labels to the merge request provided via the config parameter.
 * @param labels Labels to assign
 * @param environment Required environment variables
 * @param config Required configuration options
 * @see https://docs.gitlab.com/ee/api/merge_requests.html#update-mr
 */
async function assignMergeRequestLabels(
  labels: string[],
  environment: Pick<
    Environment,
    'GL_MR_LABELER_ACCESS_TOKEN' | 'CI_API_V4_URL' | 'CI_PROJECT_ID' | 'CI_MERGE_REQUEST_IID'
  >,
  config: Pick<Config, 'assignMethod'>,
) {
  const url = `${environment.CI_API_V4_URL}/projects/${environment.CI_PROJECT_ID}/${environment.CI_MERGE_REQUEST_IID}`;

  try {
    await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'PRIVATE-TOKEN': environment.GL_MR_LABELER_ACCESS_TOKEN,
      },
      body: JSON.stringify({ [config.assignMethod === 'APPEND' ? 'add_labels' : 'labels']: labels.join(',') }),
    });
  } catch (error) {
    throw new Error('Could not assign merge request labels.', { cause: error });
  }
}

export default assignMergeRequestLabels;
