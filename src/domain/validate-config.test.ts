import { describe, it, expect } from 'vitest';
import validateConfig from '@/domain/validate-config.ts';
import { Config } from '@/domain/config.ts';

describe('validateConfig()', () => {
  it('should throw exception if config is not a record', () => {
    expect(() => validateConfig(undefined as never)).toThrow(new TypeError('Configuration is not a valid object.'));
    expect(() => validateConfig([])).toThrow(new TypeError('Configuration is not a valid object.'));
    expect(() => validateConfig(101)).toThrow(new TypeError('Configuration is not a valid object.'));
  });
  describe('assignMethod validator', () => {
    it('should throw exception if property is neither "APPEND" or "OVERRIDE"', () => {
      expect(() => validateConfig({})).toThrow(
        new TypeError('Configuration property "assignMethod" must be either "APPEND" or "OVERRIDE".'),
      );
      expect(() => validateConfig({ assignMethod: 'other' })).toThrow(
        new TypeError('Configuration property "assignMethod" must be either "APPEND" or "OVERRIDE".'),
      );
    });
  });
  describe('gitDiffPaths validator', () => {
    it('should throw exception if config not a record', () => {
      expect(() => validateConfig({ assignMethod: 'APPEND' })).toThrow(
        new TypeError('Configuration property "gitDiffPaths" is missing.'),
      );
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: [] })).toThrow(
        new TypeError('Configuration property "gitDiffPaths" is not a valid object.'),
      );
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: 101 })).toThrow(
        new TypeError('Configuration property "gitDiffPaths" is not a valid object.'),
      );
    });
    it('should throw exception if label matcher configuration is not a string array', () => {
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: { myLabel: 101 } })).toThrow(
        new TypeError('Label matcher configuration "myLabel" of property "gitDiffPaths" is not a string array.'),
      );
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: { myLabel: [101] } })).toThrow(
        new TypeError('Label matcher configuration "myLabel" of property "gitDiffPaths" is not a string array.'),
      );
    });
  });
  describe('gitLogMessages validator', () => {
    it('should throw exception if config not a record', () => {
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: {} })).toThrow(
        new TypeError('Configuration property "gitLogMessages" is missing.'),
      );
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: {}, gitLogMessages: [] })).toThrow(
        new TypeError('Configuration property "gitLogMessages" is not a valid object.'),
      );
      expect(() => validateConfig({ assignMethod: 'APPEND', gitDiffPaths: {}, gitLogMessages: 101 })).toThrow(
        new TypeError('Configuration property "gitLogMessages" is not a valid object.'),
      );
    });
    it('should throw exception if label matcher configuration is not a string array', () => {
      expect(() =>
        validateConfig({ assignMethod: 'APPEND', gitDiffPaths: {}, gitLogMessages: { myLabel: 101 } }),
      ).toThrow(
        new TypeError('Label matcher configuration "myLabel" of property "gitLogMessages" is not a string array.'),
      );
      expect(() =>
        validateConfig({ assignMethod: 'APPEND', gitDiffPaths: {}, gitLogMessages: { myLabel: [101] } }),
      ).toThrow(
        new TypeError('Label matcher configuration "myLabel" of property "gitLogMessages" is not a string array.'),
      );
    });
  });
  describe('as compound', () => {
    it('should return config if properly validated', () => {
      const config: Config = {
        assignMethod: 'APPEND',
        gitDiffPaths: {
          labelA: ['myRegex'],
        },
        gitLogMessages: {
          labelB: ['myRegex'],
        },
      };
      expect(validateConfig(config)).toStrictEqual(config);
    });
  });
});
