/** Represents the possible configuration options. */
export type Config = {
  assignMethod: 'APPEND' | 'OVERRIDE';
  gitDiffPaths: Record<string, string[]>;
  gitLogMessages: Record<string, string[]>;
};
