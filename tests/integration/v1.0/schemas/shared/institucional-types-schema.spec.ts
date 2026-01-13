import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';

import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';
import loadFixture from '@tests/utils/load-fixture';

describe('Institucional Types JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const schemasPath = path.resolve(__dirname, '../../../../../lib/versions/v1.0/schemas/json');

    const schemasFiles = await Promise.all([
      fs.readFile(path.join(schemasPath, 'shared/institucional-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/localizacao-types.schema.json'), 'utf-8'),
      fs.readFile(path.join(schemasPath, 'shared/simple-types.schema.json'), 'utf-8'),
    ]);

    const [institucionalTypesSchema, localizacaoTypesSchema, simpleTypesSchema] = schemasFiles.map(
      (file) => JSON.parse(file),
    );

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesSchema, simpleTypesSchema.$id);
    ajvInstance.addSchema(localizacaoTypesSchema, localizacaoTypesSchema.$id);
    ajvInstance.addSchema(institucionalTypesSchema, institucionalTypesSchema.$id);
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

    it('should return invalid when additional properties are present', async () => {
      const invalidInput = await loadFixture(
        'v1.0/schemas/institucional-types/valid-required-instituicao-type.json',
        { ExtraProperty: 'not-allowed' },
      );

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when only required properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/institucional-types/valid-required-instituicao-type.json',
      );

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional properties are provided', async () => {
      const validInput = await loadFixture(
        'v1.0/schemas/institucional-types/valid-optional-instituicao-type.json',
      );

      const typeValidator = ajvInstance.getSchema(instituicaoTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
