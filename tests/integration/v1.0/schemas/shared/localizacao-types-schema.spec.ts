import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';
import loadFixture from '@tests/utils/load-fixture';

describe('Localização Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const schemasPath = path.resolve(__dirname, '../../../../../lib/versions/v1.0/schemas/json');

    const schemasFiles = await Promise.all([
      fs.readFile(path.join(schemasPath, 'shared/localizacao-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/simple-types.schema.json'), 'utf-8'),
    ]);

    const [localizacaoTypesSchema, simpleTypesSchema] = schemasFiles.map((file) =>
      JSON.parse(file),
    );

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesSchema, simpleTypesSchema.$id);
    ajvInstance.addSchema(localizacaoTypesSchema, localizacaoTypesSchema.$id);
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

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/localizacao-types/endereco/valid-required-endereco-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(enderecoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/localizacao-types/endereco/valid-required-endereco-type.json',
      );

      const typeValidator = ajvInstance.getSchema(enderecoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Complemento" is provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/localizacao-types/endereco/valid-complete-endereco-type.json',
      );

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

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/localizacao-types/contato/valid-required-contato-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/localizacao-types/contato/valid-required-contato-type.json',
      );

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Email" is provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/localizacao-types/contato/valid-complete-contato-type.json',
      );

      const typeValidator = ajvInstance.getSchema(contatoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
