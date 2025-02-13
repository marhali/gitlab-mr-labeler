import { Environment } from '@/domain/environment.ts';
import path from 'node:path';
import { ProcessParameter } from '@/domain/process-parameter.ts';

type LoadConfigOptions = {
  parameter: Pick<ProcessParameter, 'CONFIG_PATH'>;
  environment: Pick<Environment, 'CI_PROJECT_DIR'>;
};

/**
 * Loads the configuration json file.
 * @param parameter Process configuration with relative configuration path to json file
 * @param environment Environment variables with project path
 */
async function loadConfig({ parameter, environment }: LoadConfigOptions): Promise<unknown> {
  const absolutePath = path.join(environment.CI_PROJECT_DIR, parameter.CONFIG_PATH);

  try {
    return await import(absolutePath, {
      with: { type: 'json' },
    });
  } catch (error) {
    throw new Error(`Could not load json configuration file from relative path "${parameter.CONFIG_PATH}".`, {
      cause: error,
    });
  }
}

export default loadConfig;
