import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Pessoal Types JSON Schema v1.0', () => {
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

    const pessoalTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/pessoal-types.schema.json',
      ),
      'utf-8',
    );
    const pessoalTypesObject = JSON.parse(pessoalTypesString);

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesObject, simpleTypesObject.$id);
    ajvInstance.addSchema(pessoalTypesObject, pessoalTypesObject.$id);
  });

  describe('PessoalType validations', () => {
    const pessoalTypeRef = `${JSONSchemaURIs.pessoalTypesURI}#/$defs/EstudanteType`;

    it('should return invalid when the required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(pessoalTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'ID' } },
        { keyword: 'required', params: { missingProperty: 'Nome' } },
        { keyword: 'required', params: { missingProperty: 'CPF' } },
      ]);
    });

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        ID: 'est-1',
        Nome: 'Aluno Teste',
        CPF: '20122242756',
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(pessoalTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when all required properties are provided', () => {
      const validInput = {
        ID: 'est-1',
        Nome: 'Aluno Teste',
        CPF: '20122242756',
      };

      const typeValidator = ajvInstance.getSchema(pessoalTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
