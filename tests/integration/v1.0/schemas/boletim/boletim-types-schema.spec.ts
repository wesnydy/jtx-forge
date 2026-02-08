import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';
import loadFixture from '@tests/utils/load-fixture';

describe('Boletim Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const schemasPath = path.resolve(__dirname, '../../../../../lib/versions/v1.0/schemas/json');

    const schemasFiles = await Promise.all([
      fs.readFile(path.join(schemasPath, 'boletim/boletim-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/institucional-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/localizacao-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/simple-types.schema.json'), 'utf-8'),
    ]);

    const [
      boletimTypesSchema,
      institucionalTypesSchema,
      localizacaoTypesSchema,
      simpleTypesSchema,
    ] = schemasFiles.map((file) => JSON.parse(file));

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesSchema, simpleTypesSchema.$id);
    ajvInstance.addSchema(localizacaoTypesSchema, localizacaoTypesSchema.$id);
    ajvInstance.addSchema(institucionalTypesSchema, institucionalTypesSchema.$id);
    ajvInstance.addSchema(boletimTypesSchema, boletimTypesSchema.$id);
  });

  describe('CabecalhoType validations', () => {
    const cabecalhoTypeRef = `${JSONSchemaURIs.boletimTypesURI}#/$defs/CabecalhoType`;

    it('should return invalid when required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(cabecalhoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Instituicao' } },
        { keyword: 'required', params: { missingProperty: 'IdentificadorDocumento' } },
        { keyword: 'required', params: { missingProperty: 'DataEmissao' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/boletim-types/cabecalho/valid-required-cabecalho-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(cabecalhoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim-types/cabecalho/valid-required-cabecalho-type.json',
      );

      const typeValidator = ajvInstance.getSchema(cabecalhoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Emitente" is provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim-types/cabecalho/valid-complete-cabecalho-type.json',
      );

      const typeValidator = ajvInstance.getSchema(cabecalhoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('ResumoAcademicoType validations', () => {
    const resumoAcademicoTypeRef = `${JSONSchemaURIs.boletimTypesURI}#/$defs/ResumoAcademicoType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(resumoAcademicoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'CRA' } },
        { keyword: 'required', params: { missingProperty: 'TotalCreditosConcluidos' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/boletim-types/resumo-academico/valid-required-resumo-academico-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(resumoAcademicoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim-types/resumo-academico/valid-required-resumo-academico-type.json',
      );

      const typeValidator = ajvInstance.getSchema(resumoAcademicoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Observacoes" is provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim-types/resumo-academico/valid-complete-resumo-academico-type.json',
      );

      const typeValidator = ajvInstance.getSchema(resumoAcademicoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('AssinaturaType validations', () => {
    const assinaturaTypeRef = `${JSONSchemaURIs.boletimTypesURI}#/$defs/AssinaturaType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(assinaturaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'NomeAssinador' } },
        { keyword: 'required', params: { missingProperty: 'Cargo' } },
        { keyword: 'required', params: { missingProperty: 'Data' } },
        { keyword: 'required', params: { missingProperty: 'AssinaturaDigital' } },
      ]);
    });

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/boletim-types/assinatura/valid-required-assinatura-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(assinaturaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when all required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim-types/assinatura/valid-required-assinatura-type.json',
      );

      const typeValidator = ajvInstance.getSchema(assinaturaTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('AssinaturaArrayType validations', () => {
    const assinaturaArrayTypeRef = `${JSONSchemaURIs.boletimTypesURI}#/$defs/AssinaturaArrayType`;

    it('should return invalid when the array is empty', () => {
      const invalidInput: object[] = [];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'minItems',
        params: { limit: 1 },
      });
    });

    it('should return invalid when an array item is missing the required "Assinatura" property', () => {
      const invalidInput = [{}];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Assinatura' },
      });
    });

    it('should return invalid when an array item has additional properties', async () => {
      const invalidItem = await loadFixture(
        'v1.0/schemas/boletim-types/assinatura/valid-required-assinatura.json',
        { ExtraProperty: 'not-allowed' },
      );

      const invalidInput = [invalidItem];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when the array contains duplicated items', async () => {
      const validItem = await loadFixture(
        'v1.0/schemas/boletim-types/assinatura/valid-required-assinatura.json',
      );

      const invalidInput = [validItem, validItem];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid array items are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/boletim-types/assinatura/valid-required-assinatura-array.json',
      );

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
