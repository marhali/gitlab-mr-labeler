/**
 * Represents the required environment variables that are used.
 * @see https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
 */
export type Environment = {
  /** Base URL of the GitLab V4 REST API (Automatically injected as pipeline variable) */
  CI_API_V4_URL: string;
  /** The full path the repository is cloned to. */
  CI_PROJECT_DIR: string;
  /** Internal project id (Automatically injected as pipeline variable) */
  CI_PROJECT_ID: string;
  /** Internal merge request id (Automatically injected as pipeline variable) */
  CI_MERGE_REQUEST_IID: string;
  /** The base SHA of the merge request diff. (Automatically injected as pipeline variable) */
  CI_MERGE_REQUEST_DIFF_BASE_SHA: string;
  /** The commit revision the project is built for. (Automatically injected as pipeline variable) */
  CI_COMMIT_SHA: string;
};

export const environmentKeys: (keyof Environment)[] = [
  'CI_API_V4_URL',
  'CI_PROJECT_DIR',
  'CI_PROJECT_ID',
  'CI_MERGE_REQUEST_IID',
  'CI_MERGE_REQUEST_DIFF_BASE_SHA',
  'CI_COMMIT_SHA',
];
