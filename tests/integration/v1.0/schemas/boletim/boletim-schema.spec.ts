import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';
import loadFixture from '@tests/utils/load-fixture';

describe('Boletim JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const schemasPath = path.resolve(__dirname, '../../../../../lib/versions/v1.0/schemas/json');

    const schemasFiles = await Promise.all([
      fs.readFile(path.join(schemasPath, 'boletim/boletim.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'boletim/boletim-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/academico-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/institucional-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/localizacao-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/pessoal-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/simple-types.schema.json'), 'utf-8'),
    ]);

    const [
      boletimSchema,
      boletimTypesSchema,
      academicoTypesSchema,
      institucionalTypesSchema,
      localizacaoTypesSchema,
      pessoalTypesSchema,
      simpleTypesSchema,
    ] = schemasFiles.map((file) => JSON.parse(file));

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesSchema, simpleTypesSchema.$id);
    ajvInstance.addSchema(pessoalTypesSchema, pessoalTypesSchema.$id);
    ajvInstance.addSchema(localizacaoTypesSchema, localizacaoTypesSchema.$id);
    ajvInstance.addSchema(institucionalTypesSchema, institucionalTypesSchema.$id);
    ajvInstance.addSchema(academicoTypesSchema, academicoTypesSchema.$id);
    ajvInstance.addSchema(boletimTypesSchema, boletimTypesSchema.$id);
    ajvInstance.addSchema(boletimSchema, boletimSchema.$id);

    ajvInstance.compile(boletimSchema);
  });

  describe('Boletim root validations', () => {
    const boletimRef = `${JSONSchemaURIs.boletimURI}#/$defs/Boletim`;

    it('should return invalid when root is missing the required property "Boletim"', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(boletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Boletim' },
      });
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture('v1.0/schemas/boletim/valid-required-boletim.json', {
        ExtraProperty: 'not-allowed',
      });

      const typeValidator = ajvInstance.getSchema(boletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when a minimal valid boletim is provided', async () => {
      const validInput = await loadFixture('v1.0/schemas/boletim/valid-required-boletim.json');

      const typeValidator = ajvInstance.getSchema(boletimRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('Boletim root array validations', () => {
    const loteBoletimRef = `${JSONSchemaURIs.boletimURI}#/$defs/LoteBoletim`;

    it('should return invalid when root is an empty array', () => {
      const invalidInput: object[] = [];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'minItems',
        params: { limit: 1 },
      });
    });

    it('should return invalid when root has an item missing the required "Boletim" property', () => {
      const invalidInput = [{}];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Boletim' },
      });
    });

    it('should return invalid when root has an item with additional properties', async () => {
      const invalidItem = await loadFixture('v1.0/schemas/boletim/valid-required-boletim.json', {
        ExtraProperty: 'not-allowed',
      });
      const invalidInput = [invalidItem];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when root contains duplicated items', async () => {
      const validItem = await loadFixture('v1.0/schemas/boletim/valid-required-boletim.json');
      const invalidInput = [validItem, validItem];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid boletim items are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim/valid-required-boletim-array.json',
      );

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('BoletimType validations', () => {
    const boletimTypeRef = `${JSONSchemaURIs.boletimURI}#/$defs/BoletimType`;

    it('should return invalid when required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Versao' } },
        { keyword: 'required', params: { missingProperty: 'Cabecalho' } },
        { keyword: 'required', params: { missingProperty: 'Estudante' } },
        { keyword: 'required', params: { missingProperty: 'Curso' } },
        { keyword: 'required', params: { missingProperty: 'Periodos' } },
        { keyword: 'required', params: { missingProperty: 'ResumoAcademico' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/boletim/valid-required-boletim-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when "Versao" property is not "1.0"', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/boletim/valid-required-boletim-type.json',
        { Versao: '0.0' },
      );

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(invalidInput as unknown);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'const',
        params: { allowedValue: '1.0' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture('v1.0/schemas/boletim/valid-required-boletim-type.json');

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Assinaturas" is provided', async () => {
      const validInput = await loadFixture('v1.0/schemas/boletim/valid-optional-boletim-type.json');

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
