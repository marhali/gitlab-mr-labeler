import { ProcessParameter, processParameterKeys } from '@/domain/process-parameter.ts';

/**
 * Reads the necessary command-line arguments.
 */
function readProcessParameter(): ProcessParameter {
  const parameters: Partial<ProcessParameter> = {};

  for (const [index, argumentVectorKey] of processParameterKeys.entries()) {
    if (process.argv.length <= index + 2) {
      throw new RangeError(`Missing required command-line argument "${argumentVectorKey}" at index ${index}.`);
    } else {
      parameters[argumentVectorKey] = process.argv[index + 2];
    }
  }

  return parameters as ProcessParameter;
}

export default readProcessParameter;
