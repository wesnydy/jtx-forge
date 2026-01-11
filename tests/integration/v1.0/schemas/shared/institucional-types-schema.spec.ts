import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Institucional Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const simpleTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/simple-types.schema.json',
      ),
      'utf-8',
    );
    const simpleTypesObject = JSON.parse(simpleTypesString);

    const localizacaoTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/localizacao-types.schema.json',
      ),
      'utf-8',
    );
    const localizacaoTypesObject = JSON.parse(localizacaoTypesString);

    const institucionalTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/institucional-types.schema.json',
      ),
      'utf-8',
    );
    const institucionalTypesObject = JSON.parse(institucionalTypesString);

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesObject, simpleTypesObject.$id);
    ajvInstance.addSchema(localizacaoTypesObject, localizacaoTypesObject.$id);
    ajvInstance.addSchema(institucionalTypesObject, institucionalTypesObject.$id);
  });

  describe('InstituicaoType validations', () => {
    const instituicaoTypeRef = `${JSONSchemaURIs.institucionalTypesURI}#/$defs/InstituicaoType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Nome' } },
        { keyword: 'required', params: { missingProperty: 'CNPJ' } },
        { keyword: 'required', params: { missingProperty: 'Endereco' } },
      ]);
    });

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
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
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
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
      };

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional properties are provided', () => {
      const validInput = {
        Nome: 'Instituto Teste',
        CNPJ: '12345678000195',
        Unidade: 'Unidade Teste',
        Endereco: {
          Logradouro: 'Rua A',
          Numero: '1',
          Bairro: 'Centro',
          Cidade: 'Cidade',
          UF: 'PB',
          CEP: '58051380',
        },
        Contato: {
          Telefone: '999562160',
        },
      };

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
