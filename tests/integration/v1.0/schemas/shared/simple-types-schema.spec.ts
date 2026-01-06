import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Simple Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const schemaString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/simple-types.schema.json',
      ),
      'utf-8',
    );
    const schemaObject = JSON.parse(schemaString);
    ajvInstance = new Ajv({ allErrors: true, strict: false });
    ajvInstance.compile(schemaObject);
  });

  describe('StringType Validations', () => {
    const stringTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/StringType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(stringTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input exceeds the max length of 255', () => {
      const invalidInput = `xR9zqGojTvFakPtOhUpDAELW38HVQ4wCmbxNrsZYC56ySdXI7eglnhlMTKnJ2fu0BwRo1p
      vFemGqU9DztxYiJcWOLvQHbKaX3PersNkC7VMj5IBDYRoG1pxlKzwf0tnhQEUSyJZagCuVTq2mb8Lvd94eF5DPsIOXirL
      7Mn6WKhjbNQkAzHvY1ptwGsomJ9fRcTC0yXLxgBZleU3EWqnvFRTc75MsjdVHbXDy29N8kouiLPQaJpMGzWwEt14KxZSl
      Kn05v8XYgdcmrD3OBqe9whJtPazPi7RlTUxDyFfGeoS1CVqQb`;

      const typeValidator = ajvInstance.getSchema(stringTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'maxLength',
        params: { limit: 255 },
      });
    });

    it('should return invalid when the input is shorter than the min length of 1', () => {
      const invalidInput = '';

      const typeValidator = ajvInstance.getSchema(stringTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'minLength',
        params: { limit: 1 },
      });
    });

    it('should return valid when the input is a string and has a valid length', () => {
      const validInput = 'hello world!';

      const typeValidator = ajvInstance.getSchema(stringTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('NumberType Validations', () => {
    const numberTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/NumberType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(numberTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[1-9]{1,4}$"', () => {
      const invalidInput = '123456789';

      const typeValidator = ajvInstance.getSchema(numberTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[1-9]{1,4}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[1-9]{1,4}$"', () => {
      const validInput = '1234';

      const typeValidator = ajvInstance.getSchema(numberTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('DecimalType Validations', () => {
    const decimalTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/DecimalType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(decimalTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[0-9]+\\.[0-9]{2}$"', () => {
      const invalidInput = '123';

      const typeValidator = ajvInstance.getSchema(decimalTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[0-9]+\\.[0-9]{2}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[0-9]+\\.[0-9]{2}$"', () => {
      const validInput = '0.10';

      const typeValidator = ajvInstance.getSchema(decimalTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('IDType Validations', () => {
    const IDTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/IDType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(IDTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[A-Za-z]+-[0-9]{1,4}$"', () => {
      const invalidInput = '123-abc';

      const typeValidator = ajvInstance.getSchema(IDTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[A-Za-z]+-[0-9]{1,4}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[A-Za-z]+-[0-9]{1,4}$"', () => {
      const validInput = 'abc-1234';

      const typeValidator = ajvInstance.getSchema(IDTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('PhoneType Validations', () => {
    const phoneTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/PhoneType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(phoneTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[0-9]{9}$"', () => {
      const invalidInput = '99956';

      const typeValidator = ajvInstance.getSchema(phoneTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[0-9]{9}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[0-9]{9}$"', () => {
      const validInput = '999562160';

      const typeValidator = ajvInstance.getSchema(phoneTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('CPFType Validations', () => {
    const CPFTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/CPFType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(CPFTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[0-9]{11}$"', () => {
      const invalidInput = '201.222.427-56';

      const typeValidator = ajvInstance.getSchema(CPFTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[0-9]{11}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[0-9]{11}$"', () => {
      const validInput = '20122242756';

      const typeValidator = ajvInstance.getSchema(CPFTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('CNPJType Validations', () => {
    const CNPJTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/CNPJType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(CNPJTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[0-9a-zA-Z]{14}$"', () => {
      const invalidInput = '12.345.678/0001-95';

      const typeValidator = ajvInstance.getSchema(CNPJTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[0-9a-zA-Z]{14}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[0-9a-zA-Z]{14}$"', () => {
      const validInput = '12345678000195';

      const typeValidator = ajvInstance.getSchema(CNPJTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('CEPType Validations', () => {
    const CEPTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/CEPType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(CEPTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^[0-9]{8}$"', () => {
      const invalidInput = '58051-380';

      const typeValidator = ajvInstance.getSchema(CEPTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^[0-9]{8}$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^[0-9]{8}$"', () => {
      const validInput = '58051380';

      const typeValidator = ajvInstance.getSchema(CEPTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('UFType Validations', () => {
    const UFTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/UFType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(UFTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches a "UF" enum', () => {
      const invalidInput = 'ZZ';

      const typeValidator = ajvInstance.getSchema(UFTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'enum',
        params: {
          allowedValues: [
            'AC',
            'AL',
            'AM',
            'AP',
            'BA',
            'CE',
            'DF',
            'ES',
            'GO',
            'MA',
            'MG',
            'MS',
            'MT',
            'PA',
            'PB',
            'PE',
            'PI',
            'PR',
            'RJ',
            'RN',
            'RO',
            'RR',
            'RS',
            'SC',
            'SE',
            'SP',
            'TO',
          ],
        },
      });
    });

    it('should return valid when the input is a string and matches a "UF" enum', () => {
      const validInput = 'PB';

      const typeValidator = ajvInstance.getSchema(UFTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('PercentType Validations', () => {
    const PercentTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/PercentType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(PercentTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^(100|[0-9]{1,2})(\\.[0-9]{1,2})?$"', () => {
      const invalidInput = '200.50';

      const typeValidator = ajvInstance.getSchema(PercentTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^(100|[0-9]{1,2})(\\.[0-9]{1,2})?$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^(100|[0-9]{1,2})(\\.[0-9]{1,2})?$', () => {
      const validInput = '50.00';

      const typeValidator = ajvInstance.getSchema(PercentTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('NotaType Validations', () => {
    const NotaTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/NotaType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(NotaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches the pattern "^(10|[0-9]{1,2})(\\.[0-9]{1,2})?$"', () => {
      const invalidInput = '100.00';

      const typeValidator = ajvInstance.getSchema(NotaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'pattern',
        params: { pattern: '^(10|[0-9]{1,2})(\\.[0-9]{1,2})?$' },
      });
    });

    it('should return valid when the input is a string and matches the pattern "^(10|[0-9]{1,2})(\\.[0-9]{1,2})?$', () => {
      const validInput = '10.00';

      const typeValidator = ajvInstance.getSchema(NotaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('SituacaoType Validations', () => {
    const SituacaoTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/SituacaoType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(SituacaoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches a "Situacao" enum', () => {
      const invalidInput = 'Jubilado';

      const typeValidator = ajvInstance.getSchema(SituacaoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'enum',
        params: {
          allowedValues: ['Aprovado', 'Reprovado', 'Recuperação', 'Matriculado', 'Dispensado'],
        },
      });
    });

    it('should return valid when the input is a string and matches a "Situacao" enum', () => {
      const validInput = 'Aprovado';

      const typeValidator = ajvInstance.getSchema(SituacaoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('EscalaConceitoType Validations', () => {
    const EscalaConceitoTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/EscalaConceitoType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(EscalaConceitoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches a "EscalaConceito" enum', () => {
      const invalidInput = 'Z';

      const typeValidator = ajvInstance.getSchema(EscalaConceitoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'enum',
        params: {
          allowedValues: ['A', 'B', 'C', 'D', 'E', 'F'],
        },
      });
    });

    it('should return valid when the input is a string and matches a "EscalaConceito" enum', () => {
      const validInput = 'A';

      const typeValidator = ajvInstance.getSchema(EscalaConceitoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('NivelCursoType Validations', () => {
    const NivelCursoTypeRef = `${JSONSchemaURIs.simpleTypesURI}#/$defs/NivelCursoType`;

    it('should return invalid when the input is not a string', () => {
      const invalidInput = null;

      const typeValidator = ajvInstance.getSchema(NivelCursoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'type',
        params: { type: 'string' },
      });
    });

    it('should return invalid when the input does not matches a "NivelCurso" enum', () => {
      const invalidInput = 'pós-graduação';

      const typeValidator = ajvInstance.getSchema(NivelCursoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'enum',
        params: {
          allowedValues: ['Bacharelado', 'Licenciatura', 'Tecnólogo'],
        },
      });
    });

    it('should return valid when the input is a string and matches a "NivelCurso" enum', () => {
      const validInput = 'Bacharelado';

      const typeValidator = ajvInstance.getSchema(NivelCursoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
