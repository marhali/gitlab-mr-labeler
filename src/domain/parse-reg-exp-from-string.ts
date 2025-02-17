const regExpPartsPattern = new RegExp(/^\/(.*)\/([a-z]*)$/i);

/**
 * Parses the provided single string to a regular expression including any specified flags.
 * @param regExpString RegExp string to parse
 */
function parseRegExpFromString(regExpString: string): RegExp {
  const parts = regExpString.match(regExpPartsPattern);

  if (!parts) {
    throw new SyntaxError(`Cannot parse invalid regular expression "${regExpString}".`);
  }

  const [, pattern, flags] = parts;
  return new RegExp(pattern, flags);
}

export default parseRegExpFromString;
