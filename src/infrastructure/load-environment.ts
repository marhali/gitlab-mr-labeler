import { Environment, environmentKeys } from '@/domain/environment.ts';

/**
 * Loads the necessary environment variables.
 */
function loadEnvironment(): Partial<Environment> {
  const environment: Partial<Environment> = {};

  for (const environmentKey of environmentKeys) {
    environment[environmentKey] = process.env[environmentKey];
  }

  return environment;
}

export default loadEnvironment;
