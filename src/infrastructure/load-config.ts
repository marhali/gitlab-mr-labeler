import { Environment } from '@/domain/environment.ts';
import path from 'node:path';

/**
 * Loads the configuration json file.
 * @param environment Environment variables
 */
async function loadConfig(
  environment: Pick<Environment, 'GL_MR_LABELER_CONFIG_PATH' | 'CI_BUILDS_DIR' | 'CI_PROJECT_DIR'>,
): Promise<unknown> {
  const absolutePath = path.join(
    environment.CI_BUILDS_DIR,
    environment.CI_PROJECT_DIR,
    environment.GL_MR_LABELER_CONFIG_PATH,
  );

  try {
    return await import(absolutePath, {
      assert: { type: 'json' },
    });
  } catch (error) {
    throw new Error(
      `Could not load json configuration file from relative path "${environment.GL_MR_LABELER_CONFIG_PATH}".`,
      {
        cause: error,
      },
    );
  }
}

export default loadConfig;
