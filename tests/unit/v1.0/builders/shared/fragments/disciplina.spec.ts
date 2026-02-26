import { jest, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import DisciplinaFragmentBuilder from '@/versions/v1.0/builders/shared/fragments/disciplina';
import type { DisciplinaType } from '@/versions/v1.0/types/shared/academico-types.schema';

import loadFixture from '@tests/utils/load-fixture';

describe('DisciplinaFragmentBuilder v1.0', () => {
  let fragmentBuilder: DisciplinaFragmentBuilder;
  let xmlParentMock: XMLBuilder;

  let validRequiredInput: DisciplinaType;
  let validCompleteInput: DisciplinaType;

  let validOneOfInput0: DisciplinaType;
  let validOneOfInput1: DisciplinaType;

  let validOptionalKeys: string[];
  let validOneOfKeys: string[];

  beforeAll(async () => {
    fragmentBuilder = new DisciplinaFragmentBuilder();

    validRequiredInput = (await loadFixture(
      'v1.0/schemas/academico-types/disciplina/valid-required-disciplina-type.json',
    )) as DisciplinaType;

    validCompleteInput = (await loadFixture(
      'v1.0/schemas/academico-types/disciplina/valid-complete-disciplina-type.json',
    )) as DisciplinaType;

    validOneOfInput0 = (await loadFixture(
      'v1.0/schemas/academico-types/disciplina/oneof/only-nota-disciplina-type.json',
    )) as DisciplinaType;

    validOneOfInput1 = (await loadFixture(
      'v1.0/schemas/academico-types/disciplina/oneof/only-nota-escala-disciplina-type.json',
    )) as DisciplinaType;

    const requiredKeysSet = new Set(Object.keys(validRequiredInput));
    validOptionalKeys = Object.keys(validCompleteInput).filter((key) => !requiredKeysSet.has(key));

    const validOneOfInput0KeySet = new Set(Object.keys(validOneOfInput0));
    const validOneOfInput1KeySet = new Set(Object.keys(validOneOfInput1));

    validOneOfKeys = [
      ...Object.keys(validOneOfInput0).filter((item) => !validOneOfInput1KeySet.has(item)),
      ...Object.keys(validOneOfInput1).filter((item) => !validOneOfInput0KeySet.has(item)),
    ];
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnValue('<Disciplina />'),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      txt: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnValue('<Disciplina />'),
      ele: jest.fn().mockImplementation(createMockElement),
    } as unknown as XMLBuilder;
  });

  describe('build', () => {
    it('should throw an error for each required property when it is missing', () => {
      expect.hasAssertions();

      const validRequiredKeys = Object.keys(validRequiredInput).filter(
        (key) => !validOneOfKeys.includes(key),
      );

      for (const key of validRequiredKeys) {
        jest.clearAllMocks();

        const invalidInput = { ...validRequiredInput } as DisciplinaType;
        delete invalidInput[key as keyof DisciplinaType];

        expect(() => {
          fragmentBuilder.build(invalidInput, xmlParentMock);
        }).toThrow(`Field '${key}' is required`);
      }
    });

    it('should throw an error when all oneOf properties are missing', () => {
      const invalidInput = { ...validRequiredInput } as DisciplinaType;

      for (const key of validOneOfKeys) {
        delete invalidInput[key as keyof DisciplinaType];
      }

      expect(() => {
        fragmentBuilder.build(invalidInput, xmlParentMock);
      }).toThrow(`One of the fields '${validOneOfKeys}' is required`);
    });

    it('should create an element for "Nota" property when it is the oneOf variant', () => {
      const validInput = { ...validOneOfInput0 } as DisciplinaType;

      fragmentBuilder.build(validInput, xmlParentMock);

      expect(xmlParentMock.ele).toHaveBeenCalledWith('Nota');
    });

    it('should create an element for "NotaEscala" property when it is the oneOf variant', () => {
      const validInput = { ...validOneOfInput1 } as DisciplinaType;

      fragmentBuilder.build(validInput, xmlParentMock);

      expect(xmlParentMock.ele).toHaveBeenCalledWith('NotaEscala');
    });

    it('should create an element for each optional property when it is present', () => {
      expect.hasAssertions();

      for (const key of validOptionalKeys) {
        jest.clearAllMocks();

        const validInput = { ...validCompleteInput } as DisciplinaType;
        fragmentBuilder.build(validInput, xmlParentMock);

        expect(xmlParentMock.ele).toHaveBeenCalledWith(key);
      }
    });

    it('should return a string when building fragment with a valid json', () => {
      const result = fragmentBuilder.build(validRequiredInput, xmlParentMock);

      expect(typeof result).toBe('string');
      expect(result).toBe('<Disciplina />');
    });
  });
});
