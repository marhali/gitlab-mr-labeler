/** Represents the possible command-line arguments. */
export type ProcessParameter = {
  /**
   * GitLab REST API Access Token.
   * Must be provided as FIRST cli argument.
   */
  ACCESS_TOKEN: string;
  /**
   * Path to the json configuration file. Resolves paths relative to the project root.
   * Must be provided as the SECOND cli argument.
   */
  CONFIG_PATH: string;
};

export const processParameterKeys: (keyof ProcessParameter)[] = ['ACCESS_TOKEN', 'CONFIG_PATH'];
