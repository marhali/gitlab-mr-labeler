import { Environment, environmentKeys } from '@/domain/environment.ts';

/**
 * Validates the loaded environment variables.
 * @param environment Loaded environment variables.
 */
function validateEnvironment(environment: Partial<Environment>): Environment {
  for (const environmentKey of environmentKeys) {
    if (!environment[environmentKey]) {
      throw new Error(`Missing required environment variable "${environmentKey}".`);
    }
  }

  // TODO: Consider to apply any input validation to prevent potential execution of malicious code

  return environment as Environment;
}

export default validateEnvironment;
