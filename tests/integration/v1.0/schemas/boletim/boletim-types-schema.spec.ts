import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Boletim Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const boletimTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/boletim/boletim-types.schema.json',
      ),
      'utf-8',
    );
    const boletimTypesObject = JSON.parse(boletimTypesString);

    const simpleTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/simple-types.schema.json',
      ),
      'utf-8',
    );
    const simpleTypesObject = JSON.parse(simpleTypesString);

    const institucionalTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/institucional-types.schema.json',
      ),
      'utf-8',
    );
    const institucionalTypesObject = JSON.parse(institucionalTypesString);

    const localizacaoTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/localizacao-types.schema.json',
      ),
      'utf-8',
    );
    const localizacaoTypesObject = JSON.parse(localizacaoTypesString);

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesObject, simpleTypesObject.$id);
    ajvInstance.addSchema(localizacaoTypesObject, localizacaoTypesObject.$id);
    ajvInstance.addSchema(institucionalTypesObject, institucionalTypesObject.$id);
    ajvInstance.addSchema(boletimTypesObject, boletimTypesObject.$id);
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

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Instituicao: {
          Nome: 'Instituto Teste',
          CNPJ: '12345678000195',
          Endereco: {
            Logradouro: 'Rua A',
            Numero: '1',
            Bairro: 'Centro',
            Cidade: 'Cidade',
            UF: 'PB',
            CEP: '58051380',
          },
        },
        IdentificadorDocumento: 'doc-1',
        DataEmissao: '2020-01-01',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(cabecalhoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        Instituicao: {
          Nome: 'Instituto Teste',
          CNPJ: '12345678000195',
          Endereco: {
            Logradouro: 'Rua A',
            Numero: '1',
            Bairro: 'Centro',
            Cidade: 'Cidade',
            UF: 'PB',
            CEP: '58051380',
          },
        },
        IdentificadorDocumento: 'doc-1',
        DataEmissao: '2020-01-01',
      };

      const typeValidator = ajvInstance.getSchema(cabecalhoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Emitente" is provided', () => {
      const validInput = {
        Instituicao: {
          Nome: 'Instituto Teste',
          CNPJ: '12345678000195',
          Endereco: {
            Logradouro: 'Rua A',
            Numero: '1',
            Bairro: 'Centro',
            Cidade: 'Cidade',
            UF: 'PB',
            CEP: '58051380',
          },
        },
        IdentificadorDocumento: 'doc-1',
        DataEmissao: '2020-01-01',
        Emitente: 'Secretaria Acadêmica',
      };

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

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        CRA: '0.00',
        TotalCreditosConcluidos: '0.00',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(resumoAcademicoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        CRA: '0.00',
        TotalCreditosConcluidos: '0.00',
      };

      const typeValidator = ajvInstance.getSchema(resumoAcademicoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Observacoes" is provided', () => {
      const validInput = {
        CRA: '8.50',
        TotalCreditosConcluidos: '120.00',
        Observacoes: 'Estudante em bom desempenho',
      };

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

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        NomeAssinador: 'Assinador Teste',
        Cargo: 'Diretor',
        Data: '2020-01-01',
        AssinaturaDigital: 'abcdef1234567890',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(assinaturaTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when all required properties are provided', () => {
      const validInput = {
        NomeAssinador: 'Assinador Teste',
        Cargo: 'Diretor',
        Data: '2020-01-01',
        AssinaturaDigital: 'abcdef1234567890',
      };

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

    it('should return invalid when an array item has additional properties', () => {
      const invalidInput = [
        {
          Assinatura: {
            NomeAssinador: 'Assinador Teste',
            Cargo: 'Diretor',
            Data: '2020-01-01',
            AssinaturaDigital: 'abcdef1234567890',
          },
          ExtraProperty: 'not-allowed',
        },
      ];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
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
          Assinatura: {
            NomeAssinador: 'Assinador Teste',
            Cargo: 'Diretor',
            Data: '2020-01-01',
            AssinaturaDigital: 'abcdef1234567890',
          },
        },
        {
          Assinatura: {
            NomeAssinador: 'Assinador Teste',
            Cargo: 'Diretor',
            Data: '2020-01-01',
            AssinaturaDigital: 'abcdef1234567890',
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
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
          Assinatura: {
            NomeAssinador: 'Assinador Teste',
            Cargo: 'Diretor',
            Data: '2020-01-01',
            AssinaturaDigital: 'abcdef1234567890',
          },
        },
        {
          Assinatura: {
            NomeAssinador: 'Assinador Teste',
            Cargo: 'Coordenadora',
            Data: '2020-01-02',
            AssinaturaDigital: '1234567890abcdef',
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(assinaturaArrayTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
