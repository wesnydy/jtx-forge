import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Localização Types JSON Schema v1.0', () => {
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

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesObject, simpleTypesObject.$id);
    ajvInstance.addSchema(localizacaoTypesObject, localizacaoTypesObject.$id);
  });

  describe('EnderecoType validations', () => {
    const enderecoTypeRef = `${JSONSchemaURIs.localizacaoTypesURI}#/$defs/EnderecoType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(enderecoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Logradouro' } },
        { keyword: 'required', params: { missingProperty: 'Numero' } },
        { keyword: 'required', params: { missingProperty: 'Bairro' } },
        { keyword: 'required', params: { missingProperty: 'Cidade' } },
        { keyword: 'required', params: { missingProperty: 'UF' } },
        { keyword: 'required', params: { missingProperty: 'CEP' } },
      ]);
    });

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Logradouro: 'Rua A',
        Numero: '1',
        Bairro: 'Centro',
        Cidade: 'Cidade',
        UF: 'PB',
        CEP: '58051380',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(enderecoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        Logradouro: 'Rua A',
        Numero: '1',
        Bairro: 'Centro',
        Cidade: 'Cidade',
        UF: 'PB',
        CEP: '58051380',
      };

      const typeValidator = ajvInstance.getSchema(enderecoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Complemento" is provided', () => {
      const validInput = {
        Logradouro: 'Rua A',
        Numero: '1',
        Complemento: 'Bloco A, Apartamento 501',
        Bairro: 'Centro',
        Cidade: 'Cidade',
        UF: 'PB',
        CEP: '58051380',
      };

      const typeValidator = ajvInstance.getSchema(enderecoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('ContatoType validations', () => {
    const contatoTypeRef = `${JSONSchemaURIs.localizacaoTypesURI}#/$defs/ContatoType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Telefone' } },
      ]);
    });

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Telefone: '999562160',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        Telefone: '999562160',
      };

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Email" is provided', () => {
      const validInput = {
        Telefone: '999562160',
        Email: 'contato@exemplo.com',
      };

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
