import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Acadêmico Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const academicoTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/academico-types.schema.json',
      ),
      'utf-8',
    );
    const academicoTypesObject = JSON.parse(academicoTypesString);

    const simpleTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/simple-types.schema.json',
      ),
      'utf-8',
    );
    const simpleTypesObject = JSON.parse(simpleTypesString);

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesObject, simpleTypesObject.$id);
    ajvInstance.addSchema(academicoTypesObject, academicoTypesObject.$id);
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

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Nome: 'Curso de Teste',
        Codigo: '1',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(cursoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        Nome: 'Curso de Teste',
        Codigo: '1',
      };

      const typeValidator = ajvInstance.getSchema(cursoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Nivel" is provided', () => {
      const validInput = {
        Nome: 'Curso de Teste',
        Codigo: '1',
        Nivel: 'Bacharelado',
      };

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

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Nome: 'Disciplina A',
        Codigo: '1',
        Creditos: '1',
        CargaHoraria: '1',
        Situacao: 'Aprovado',
        Nota: '10.00',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when properties from more than oneOf schema are present', () => {
      const validInput = {
        Nome: 'Disciplina A',
        Codigo: '1',
        Creditos: '1',
        CargaHoraria: '1',
        Situacao: 'Aprovado',
        Nota: '10.00',
        NotaEscala: 'A',
      };

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'oneOf',
        params: { passingSchemas: [0, 1] },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        Nome: 'Disciplina A',
        Codigo: '1',
        Creditos: '1',
        CargaHoraria: '1',
        Situacao: 'Aprovado',
        Nota: '10.00',
      };

      const typeValidator = ajvInstance.getSchema(disciplinaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional properties are provided', () => {
      const validInput = {
        Nome: 'Disciplina A',
        Codigo: '1',
        Creditos: '1',
        CargaHoraria: '1',
        Frequencia: '100',
        Situacao: 'Aprovado',
        Nota: '10.00',
        Comentarios: 'Estudante em bom desempenho',
      };

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

    it('should return invalid when an array item has additional properties', () => {
      const invalidInput = [
        {
          Disciplina: {
            Nome: 'Disciplina A',
            Codigo: '1',
            Creditos: '1',
            CargaHoraria: '1',
            Situacao: 'Aprovado',
            Nota: '10.00',
            ExtraProperty: 'not-allowed',
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when the array contains duplicated items', () => {
      const invalidInput = [
        {
          Disciplina: {
            Nome: 'Disciplina A',
            Codigo: '1',
            Creditos: '1',
            CargaHoraria: '1',
            Situacao: 'Aprovado',
            Nota: '10.00',
          },
        },
        {
          Disciplina: {
            Nome: 'Disciplina A',
            Codigo: '1',
            Creditos: '1',
            CargaHoraria: '1',
            Situacao: 'Aprovado',
            Nota: '10.00',
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(disciplinaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid array items are provided', () => {
      const validInput = [
        {
          Disciplina: {
            Nome: 'Disciplina A',
            Codigo: '1',
            Creditos: '1',
            CargaHoraria: '1',
            Situacao: 'Aprovado',
            Nota: '10.00',
          },
        },
        {
          Disciplina: {
            Nome: 'Disciplina B',
            Codigo: '2',
            Creditos: '1',
            CargaHoraria: '1',
            Situacao: 'Aprovado',
            Nota: '10.00',
          },
        },
      ];

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

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Codigo: '2021.1',
        Inicio: '2021-01-01',
        Fim: '2021-06-30',
        Disciplinas: [
          {
            Disciplina: {
              Nome: 'Disciplina A',
              Codigo: '1',
              Creditos: '1',
              CargaHoraria: '1',
              Situacao: 'Aprovado',
              Nota: '10.00',
            },
          },
        ],
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(periodoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when all required properties are provided', () => {
      const validInput = {
        Codigo: '2021.1',
        Inicio: '2021-01-01',
        Fim: '2021-06-30',
        Disciplinas: [
          {
            Disciplina: {
              Nome: 'Disciplina A',
              Codigo: '1',
              Creditos: '1',
              CargaHoraria: '1',
              Situacao: 'Aprovado',
              Nota: '10.00',
            },
          },
        ],
      };
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

    it('should return invalid when an array item has additional properties', () => {
      const invalidInput = [
        {
          Periodo: {
            Codigo: '2021.1',
            Inicio: '2021-01-01',
            Fim: '2021-06-30',
            Disciplinas: [
              {
                Disciplina: {
                  Nome: 'Disciplina A',
                  Codigo: '1',
                  Creditos: '1',
                  CargaHoraria: '1',
                  Situacao: 'Aprovado',
                  Nota: '10.00',
                },
              },
            ],
            ExtraProperty: 'not-allowed',
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when the array contains duplicated items', () => {
      const invalidInput = [
        {
          Periodo: {
            Codigo: '2021.1',
            Inicio: '2021-01-01',
            Fim: '2021-06-30',
            Disciplinas: [
              {
                Disciplina: {
                  Nome: 'Disciplina A',
                  Codigo: '1',
                  Creditos: '1',
                  CargaHoraria: '1',
                  Situacao: 'Aprovado',
                  Nota: '10.00',
                },
              },
            ],
          },
        },
        {
          Periodo: {
            Codigo: '2021.1',
            Inicio: '2021-01-01',
            Fim: '2021-06-30',
            Disciplinas: [
              {
                Disciplina: {
                  Nome: 'Disciplina A',
                  Codigo: '1',
                  Creditos: '1',
                  CargaHoraria: '1',
                  Situacao: 'Aprovado',
                  Nota: '10.00',
                },
              },
            ],
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid array items are provided', () => {
      const validInput = [
        {
          Periodo: {
            Codigo: '2021.1',
            Inicio: '2021-01-01',
            Fim: '2021-06-30',
            Disciplinas: [
              {
                Disciplina: {
                  Nome: 'Disciplina A',
                  Codigo: '1',
                  Creditos: '1',
                  CargaHoraria: '1',
                  Situacao: 'Aprovado',
                  Nota: '10.00',
                },
              },
            ],
          },
        },
        {
          Periodo: {
            Codigo: '2021.2',
            Inicio: '2021-07-01',
            Fim: '2021-12-31',
            Disciplinas: [
              {
                Disciplina: {
                  Nome: 'Disciplina A',
                  Codigo: '1',
                  Creditos: '1',
                  CargaHoraria: '1',
                  Situacao: 'Aprovado',
                  Nota: '10.00',
                },
              },
            ],
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(periodoArrayTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
