/**
 * Represents the required environment variables that are used.
 * @see https://docs.gitlab.com/ee/ci/variables/predefined_variables.html
 */
export type Environment = {
  /** Path to the json configuration file. Path must be relative to project root. */
  GL_MR_LABELER_CONFIG_PATH: string;
  /** GitLab REST API Access Token */
  GL_MR_LABELER_ACCESS_TOKEN: string;
  /** Base URL of the GitLab V4 REST API (Automatically injected as pipeline variable) */
  CI_API_V4_URL: string;
  /** The top-level directory where builds are executed. */
  CI_BUILDS_DIR: string;
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
  'GL_MR_LABELER_CONFIG_PATH',
  'GL_MR_LABELER_ACCESS_TOKEN',
  'CI_API_V4_URL',
  'CI_BUILDS_DIR',
  'CI_PROJECT_DIR',
  'CI_PROJECT_ID',
  'CI_MERGE_REQUEST_IID',
  'CI_MERGE_REQUEST_DIFF_BASE_SHA',
  'CI_COMMIT_SHA',
];
