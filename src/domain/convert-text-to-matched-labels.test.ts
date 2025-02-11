import { describe, it, expect } from 'vitest';
import convertTextToMatchedLabels from '@/domain/convert-text-to-matched-labels.ts';

function join(...lines: string[]): string {
  return lines.join('\n');
}

describe('convertTextToMatchedLabels()', () => {
  it('should return empty array if nothing matches', () => {
    expect(convertTextToMatchedLabels('', {})).toStrictEqual([]);
  });
  it('should return multiple matches of same label only once (set logic)', () => {
    expect(
      convertTextToMatchedLabels(join('alpha', 'alphaMore'), {
        myLabel: ['^alpha'],
      }),
    ).toStrictEqual(['myLabel']);
  });
  it('should return multiple matches of different labels', () => {
    expect(
      convertTextToMatchedLabels(join('prefixText', 'textSuffix'), {
        firstLabel: ['^prefix'],
        secondLabel: ['Suffix$'],
      }),
    ).toStrictEqual(['firstLabel', 'secondLabel']);
  });
});
