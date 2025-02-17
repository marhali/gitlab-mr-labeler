import { describe, it, expect } from 'vitest';
import parseRegExpFromString from '@/domain/parse-reg-exp-from-string.ts';

describe('parseRegExpFromString()', () => {
  it('should parse RegExp string without flags', () => {
    expect(parseRegExpFromString('/^myRegexPattern$/')).toStrictEqual(new RegExp(/^myRegexPattern$/));
  });
  it('should parse RegExp string with flags', () => {
    expect(parseRegExpFromString('/^myRegexPatternIgnoreCase/i')).toStrictEqual(
      new RegExp(/^myRegexPatternIgnoreCase/i),
    );
  });
  it('should throw exception if provided RegExp string is invalid', () => {
    expect(() => parseRegExpFromString('^myPattern$')).toThrow(
      new SyntaxError('Cannot parse invalid regular expression "^myPattern$".'),
    );
  });
});
