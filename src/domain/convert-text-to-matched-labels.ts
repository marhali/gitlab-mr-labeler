import parseRegExpFromString from '@/domain/parse-reg-exp-from-string.ts';

/**
 * Maps the provided multiline text to labels based on the provided configuration.
 * @param text Multiline text to analyse
 * @param config Label configuration
 */
function convertTextToMatchedLabels(text: string, config: Record<string, string[]>) {
  const labels = new Set<string>();

  for (const [label, labelMatchers] of Object.entries(config)) {
    if (labelMatchers.some((labelMatcher) => text.match(parseRegExpFromString(labelMatcher)))) {
      labels.add(label);
    }
  }

  return [...labels];
}

export default convertTextToMatchedLabels;
