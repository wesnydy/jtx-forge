import { beforeEach, describe, expect, it } from '@jest/globals';
import { DefinedError } from 'ajv';

import ajvErrorString from '@/versions/v1.0/utils/ajv-error-string';

describe('AJV error string v1.0', () => {
  let baseError: DefinedError;

  beforeEach(() => {
    baseError = {
      instancePath: '/foo',
      message: 'is required',
      keyword: 'required',
      params: { missingProperty: 'foo' },
      parentSchema: {},
      schemaPath: '',
    };
  });

  describe('Error object serialization', () => {
    it('should build the error string when both path and message are provided', () => {
      expect(ajvErrorString(baseError)).toBe(`root${baseError.instancePath} ${baseError.message}`);
    });

    it('should build the error string when const keyword is provided', () => {
      baseError.message = 'should be equal to constant';
      baseError.keyword = 'const';
      baseError.params = { allowedValue: 'foo' };

      expect(ajvErrorString(baseError)).toBe(
        `root${baseError.instancePath} ${baseError.message} '${baseError.params.allowedValue}'`,
      );
    });

    it('should build the error string when enum keyword is provided', () => {
      baseError.message = 'should be equal to one of the allowed values';
      baseError.keyword = 'enum';
      baseError.params = { allowedValues: ['foo', 'bar'] };

      expect(ajvErrorString(baseError)).toBe(
        `root${baseError.instancePath} ${baseError.message} '[${baseError.params.allowedValues}]'`,
      );
    });

    it('should build the error string when additionalProperties keyword is provided', () => {
      baseError.message = 'additional property not allowed';
      baseError.keyword = 'additionalProperties';
      baseError.params = { additionalProperty: 'any' };

      expect(ajvErrorString(baseError)).toBe(
        `root${baseError.instancePath} ${baseError.message} '${baseError.params.additionalProperty}'`,
      );
    });

    it('should build the error string when oneOf keyword is provided', () => {
      baseError.message = 'should match exactly one schema in "oneOf"';
      baseError.keyword = 'oneOf';
      baseError.schema = [
        { schema1: { type: 'string', const: 'foo' } },
        { schema2: { type: 'string', const: 'bar' } },
      ];

      expect(ajvErrorString(baseError)).toBe(
        `root${baseError.instancePath} ${baseError.message} '${JSON.stringify(baseError.schema)}'`,
      );
    });

    it('should build the error string when not keyword is provided', () => {
      baseError.message = 'should NOT match schema in "not"';
      baseError.keyword = 'not';
      baseError.schema = [{ schema: { type: 'string', const: 'any' } }];

      expect(ajvErrorString(baseError)).toBe(
        `root${baseError.instancePath} ${baseError.message} in '${JSON.stringify(baseError.schema)}'`,
      );
    });
  });
});
