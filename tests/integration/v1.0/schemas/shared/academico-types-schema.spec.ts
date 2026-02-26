import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';
import loadFixture from '@tests/utils/load-fixture';

describe('Acadêmico Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const schemasPath = path.resolve(__dirname, '../../../../../lib/versions/v1.0/schemas/json');

    const schemasFiles = await Promise.all([
      fs.readFile(path.join(schemasPath, 'shared/academico-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/simple-types.schema.json'), 'utf-8'),
    ]);

    const [academicoTypesSchema, simpleTypesSchema] = schemasFiles.map((file) => JSON.parse(file));

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesSchema, simpleTypesSchema.$id);
    ajvInstance.addSchema(academicoTypesSchema, academicoTypesSchema.$id);
  });

  describe('CursoType validations', () => {
    const cursoTypeRef = `${JSONSchemaURIs.academicoTypesURI}#/$defs/CursoType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(cursoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Nome' } },
        { keyword: 'required', params: { missingProperty: 'Codigo' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/academico-types/curso/valid-required-curso-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(cursoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/curso/valid-required-curso-type.json',
      );

      const typeValidator = ajvInstance.getSchema(cursoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Nivel" is provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/curso/valid-complete-curso-type.json',
      );

      const typeValidator = ajvInstance.getSchema(cursoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('DisciplinaType validations', () => {
    const disciplinaTypeRef = `${JSONSchemaURIs.academicoTypesURI}#/$defs/DisciplinaType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Nota' } },
        { keyword: 'required', params: { missingProperty: 'NotaEscala' } },
        { keyword: 'oneOf', params: { passingSchemas: null } },
        { keyword: 'required', params: { missingProperty: 'Nome' } },
        { keyword: 'required', params: { missingProperty: 'Codigo' } },
        { keyword: 'required', params: { missingProperty: 'Creditos' } },
        { keyword: 'required', params: { missingProperty: 'CargaHoraria' } },
        { keyword: 'required', params: { missingProperty: 'Situacao' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-required-disciplina-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when properties from more than oneOf schema are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-required-disciplina-type.json',
        { Nota: '10.00', NotaEscala: 'A' },
      );

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'oneOf',
        params: { passingSchemas: [0, 1] },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-required-disciplina-type.json',
      );

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when only "Nota" property is provided in oneOf schema', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/oneof/only-nota-disciplina-type.json',
      );

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when only "NotaEscala" property is provided in oneOf schema', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/oneof/only-nota-escala-disciplina-type.json',
      );

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-complete-disciplina-type.json',
      );

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('DisciplinaArrayType validations', () => {
    const disciplinaArrayTypeRef = `${JSONSchemaURIs.academicoTypesURI}#/$defs/DisciplinaArrayType`;

    it('should return invalid when the array is empty', () => {
      const invalidInput: object[] = [];

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'minItems',
        params: { limit: 1 },
      });
    });

    it('should return invalid when an array item is missing the required "Disciplina" property', () => {
      const invalidInput = [{}];

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Disciplina' },
      });
    });

    it('should return invalid when an array item has additional properties', async () => {
      const invalidItem = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-required-disciplina.json',
        { ExtraProperty: 'not-allowed' },
      );

      const invalidInput = [invalidItem];

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when the array contains duplicated items', async () => {
      const validItem = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-required-disciplina.json',
      );

      const invalidInput = [validItem, validItem];

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid array items are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/disciplina/valid-required-disciplina-array.json',
      );

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('PeriodoType validations', () => {
    const periodoTypeRef = `${JSONSchemaURIs.academicoTypesURI}#/$defs/PeriodoType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(periodoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Codigo' } },
        { keyword: 'required', params: { missingProperty: 'Inicio' } },
        { keyword: 'required', params: { missingProperty: 'Fim' } },
        { keyword: 'required', params: { missingProperty: 'Disciplinas' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/academico-types/periodo/valid-required-periodo-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(periodoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when all required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/periodo/valid-required-periodo-type.json',
      );

      const typeValidator = ajvInstance.getSchema(periodoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('PeriodoArrayType validations', () => {
    const periodoArrayTypeRef = `${JSONSchemaURIs.academicoTypesURI}#/$defs/PeriodoArrayType`;

    it('should return invalid when the array is empty', () => {
      const invalidInput: object[] = [];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'minItems',
        params: { limit: 1 },
      });
    });

    it('should return invalid when an array item is missing the required "Periodo" property', () => {
      const invalidInput = [{}];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Periodo' },
      });
    });

    it('should return invalid when an array item has additional properties', async () => {
      const invalidItem = await loadFixture(
        'v1.0/schemas/academico-types/periodo/valid-required-periodo.json',
        { ExtraProperty: 'not-allowed' },
      );

      const invalidInput = [invalidItem];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when the array contains duplicated items', async () => {
      const validItem = await loadFixture(
        'v1.0/schemas/academico-types/periodo/valid-required-periodo.json',
      );

      const invalidInput = [validItem, validItem];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid array items are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/academico-types/periodo/valid-required-periodo-array.json',
      );

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
