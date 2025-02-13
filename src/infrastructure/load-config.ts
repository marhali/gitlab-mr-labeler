import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { Environment } from '@/domain/environment.ts';
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
    // Per JSON RFC we can assert that the file is encoded using utf8 as default
    return JSON.parse(await readFile(absolutePath, 'utf8'));
  } catch (error) {
    throw new Error(`Could not load json configuration file from relative path "${parameter.CONFIG_PATH}".`, {
      cause: error,
    });
  }
}

export default loadConfig;
