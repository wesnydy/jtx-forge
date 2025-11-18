import { jest, beforeAll, describe, expect, it } from '@jest/globals';
jest.mock('@/versions/v1.0/utils/ajv-instance-cache', () => ({
  __esModule: true,
  default: {
    getSchema: jest.fn(),
  },
}));

import { BoletimType } from '@/versions/v1.0/types/boletim/boletim';
import ajvInstanceCache from '@/versions/v1.0/utils/ajv-instance-cache';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';
import BoletimValidator from '@/versions/v1.0/validators/json/boletim';

describe('Boletim JSON Validator v1.0', () => {
  let validator: BoletimValidator;

  beforeAll(() => {
    validator = new BoletimValidator();
  });

  describe('Instance creation', () => {
    it('should return the correct validator key when creating a Boletim validator', () => {
      expect(validator.getKey()).toBe('boletim:v1.0');
    });
  });

  describe('Validation error handling', () => {
    it('should throw an error when schema is not found in the AJV cache', () => {
      (ajvInstanceCache.getSchema as jest.Mock).mockImplementationOnce(() => undefined);

      expect(() => validator.validate({} as BoletimType)).toThrow(
        new Error(`${JSONSchemaURIs.boletimURI} not found in AJV instance cache`),
      );
    });

    it('should return validation as false with an errors list when input is invalid', () => {
      const mockValidate = jest.fn().mockReturnValue(false) as jest.Mock & { errors?: unknown[] };
      mockValidate.errors = [
        {
          instancePath: '/Boletim/Versao',
          schemaPath: '#/properties/Versao/const',
          keyword: 'const',
          params: { allowedValue: '1.0' },
          message: 'must be equal to constant',
          schema: '1.0',
          parentSchema: { type: 'string', const: '1.0' },
          data: '0.0',
        },
      ];

      (ajvInstanceCache.getSchema as jest.Mock).mockImplementationOnce(() => mockValidate);

      const validationResult = validator.validate({} as BoletimType);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toBeDefined();
      expect(Array.isArray(validationResult.errors)).toBe(true);
    });

    it('should return an empty errors list when input is invalid but no validation errors are provided', () => {
      const mockValidate = jest.fn().mockReturnValue(false) as jest.Mock & { errors?: unknown[] };
      mockValidate.errors = undefined;

      (ajvInstanceCache.getSchema as jest.Mock).mockImplementationOnce(() => mockValidate);

      const validationResult = validator.validate({} as BoletimType);

      expect(validationResult.valid).toBe(false);
      expect(validationResult.errors).toEqual([]);
    });
  });

  describe('Validation success handling', () => {
    it('should return validation as true with an empty errors list when input is valid', () => {
      const mockValidate = jest.fn().mockReturnValue(true) as jest.Mock & { errors?: unknown[] };

      (ajvInstanceCache.getSchema as jest.Mock).mockImplementationOnce(() => mockValidate);

      const validationResult = validator.validate({} as BoletimType);

      expect(validationResult.valid).toBe(true);
      expect(validationResult.errors).toEqual([]);
    });
  });
});
