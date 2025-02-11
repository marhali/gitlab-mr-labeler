import { Environment, environmentKeys } from '@/domain/environment.ts';

/**
 * Loads the necessary environment variables with fallback options.
 */
function loadEnvironment(): Partial<Environment> {
  const environment: Partial<Environment> = {};

  for (const environmentKey of environmentKeys) {
    const variable = process.env[environmentKey];

    if (environmentKey === 'GL_MR_LABELER_CONFIG_PATH' && !variable) {
      environment[environmentKey] = 'gl-mr-labeler.config.json';
      continue;
    }

    if (environmentKey === 'CI_BUILDS_DIR' && !variable) {
      environment[environmentKey] = '';
      continue;
    }

    environment[environmentKey] = variable;
  }

  return environment;
}

export default loadEnvironment;
