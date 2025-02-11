import { Config } from '@/domain/config.ts';

function isRecord(maybeRecord: unknown) {
  return typeof maybeRecord === 'object' && maybeRecord !== null && !Array.isArray(maybeRecord);
}

function validateIsRecord(config: unknown) {
  if (!isRecord(config)) {
    throw new TypeError('Configuration is not a valid object.');
  }
}

function validateAssignMethod(config: Record<string, unknown>) {
  if (config['assignMethod'] !== 'APPEND' && config['assignMethod'] !== 'OVERRIDE') {
    throw new TypeError('Configuration property "assignMethod" must be either "APPEND" or "OVERRIDE".');
  }
}

function validateLabelsMatcher(config: Record<string, unknown>, property: keyof Config) {
  if (!config[property]) {
    throw new TypeError(`Configuration property "${property}" is missing.`);
  }

  if (!isRecord(config[property])) {
    throw new TypeError(`Configuration property "${property}" is not a valid object.`);
  }

  const propertyRecord = config[property] as Record<string, unknown>;

  for (const key of Object.keys(propertyRecord)) {
    if (!Array.isArray(propertyRecord[key]) || propertyRecord[key].some((element) => typeof element !== 'string')) {
      throw new TypeError(`Label matcher configuration "${key}" of property "${property}" is not a string array.`);
    }
  }
}

/**
 * Validates all properties of the provided configuration.
 * @param config Loaded configuration.
 */
function validateConfig(config: unknown): Config {
  validateIsRecord(config);
  validateAssignMethod(config as Record<string, unknown>);
  validateLabelsMatcher(config as Record<string, unknown>, 'gitDiffPaths');
  validateLabelsMatcher(config as Record<string, unknown>, 'gitLogMessages');
  return config as Config;
}

export default validateConfig;
