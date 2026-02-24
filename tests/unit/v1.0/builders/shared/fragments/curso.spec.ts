import { jest, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import CursoFragmentBuilder from '@/versions/v1.0/builders/shared/fragments/curso';
import type { CursoType } from '@/versions/v1.0/types/shared/academico-types.schema';

import loadFixture from '@tests/utils/load-fixture';

describe('CursoFragmentBuilder v1.0', () => {
  let fragmentBuilder: CursoFragmentBuilder;
  let xmlParentMock: XMLBuilder;

  let validRequiredInput: CursoType;
  let validCompleteInput: CursoType;

  let validOptionalKeys: string[];

  beforeAll(async () => {
    fragmentBuilder = new CursoFragmentBuilder();

    validRequiredInput = (await loadFixture(
      'v1.0/schemas/academico-types/curso/valid-required-curso-type.json',
    )) as CursoType;

    validCompleteInput = (await loadFixture(
      'v1.0/schemas/academico-types/curso/valid-complete-curso-type.json',
    )) as CursoType;

    validOptionalKeys = Object.keys(validCompleteInput).filter(
      (key) => !Object.keys(validRequiredInput).includes(key),
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnValue('<Curso />'),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      txt: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnValue('<Curso />'),
      ele: jest.fn().mockImplementation(createMockElement),
    } as unknown as XMLBuilder;
  });

  describe('build', () => {
    it('should throw an error for each required property when it is missing', () => {
      expect.hasAssertions();

      for (const key of Object.keys(validRequiredInput)) {
        jest.clearAllMocks();

        const invalidInput = { ...validRequiredInput } as CursoType;
        delete invalidInput[key as keyof CursoType];

        expect(() => {
          fragmentBuilder.build(invalidInput, xmlParentMock);
        }).toThrow(`Field '${key}' is required`);
      }
    });

    it('should create an element for optional property "Nivel" when it is present', () => {
      expect.hasAssertions();

      for (const key of validOptionalKeys) {
        jest.clearAllMocks();

        const validInput = { ...validCompleteInput } as CursoType;
        fragmentBuilder.build(validInput, xmlParentMock);

        expect(xmlParentMock.ele).toHaveBeenCalledWith(key);
      }
    });

    it('should return a string when building fragment with a valid json', () => {
      const result = fragmentBuilder.build(validRequiredInput, xmlParentMock);

      expect(typeof result).toBe('string');
      expect(result).toBe('<Curso />');
    });
  });
});
