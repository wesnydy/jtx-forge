import { jest, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import ResumoAcademicoFragmentBuilder from '@/versions/v1.0/builders/shared/fragments/resumo-academico';
import type { ResumoAcademicoType } from '@/versions/v1.0/types/boletim/boletim-types.schema';

import loadFixture from '@tests/utils/load-fixture';

describe('ResumoAcademicoFragmentBuilder v1.0', () => {
  let fragmentBuilder: ResumoAcademicoFragmentBuilder;
  let xmlParentMock: XMLBuilder;

  let validRequiredInput: ResumoAcademicoType;
  let validCompleteInput: ResumoAcademicoType;

  let validOptionalKeys: string[];

  beforeAll(async () => {
    fragmentBuilder = new ResumoAcademicoFragmentBuilder();

    validRequiredInput = (await loadFixture(
      'v1.0/schemas/boletim-types/resumo-academico/valid-required-resumo-academico-type.json',
    )) as ResumoAcademicoType;

    validCompleteInput = (await loadFixture(
      'v1.0/schemas/boletim-types/resumo-academico/valid-complete-resumo-academico-type.json',
    )) as ResumoAcademicoType;

    validOptionalKeys = Object.keys(validCompleteInput).filter(
      (key) => !Object.keys(validRequiredInput).includes(key),
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnValue('<ResumoAcademico />'),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      txt: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnValue('<ResumoAcademico />'),
      ele: jest.fn().mockImplementation(createMockElement),
    } as unknown as XMLBuilder;
  });

  describe('build', () => {
    it('should throw an error for each required property when it is missing', () => {
      expect.hasAssertions();

      for (const key of Object.keys(validRequiredInput)) {
        jest.clearAllMocks();

        const invalidInput = { ...validRequiredInput } as ResumoAcademicoType;
        delete invalidInput[key as keyof ResumoAcademicoType];

        expect(() => {
          fragmentBuilder.build(invalidInput, xmlParentMock);
        }).toThrow(`Field '${key}' is required`);
      }
    });

    it('should create an element for optional property "Observacoes" when it is present', () => {
      expect.hasAssertions();

      for (const key of validOptionalKeys) {
        jest.clearAllMocks();

        const validInput = { ...validCompleteInput } as ResumoAcademicoType;
        fragmentBuilder.build(validInput, xmlParentMock);

        expect(xmlParentMock.ele).toHaveBeenCalledWith(key);
      }
    });

    it('should return a string when building fragment with a valid json', () => {
      const result = fragmentBuilder.build(validRequiredInput, xmlParentMock);

      expect(typeof result).toBe('string');
      expect(result).toBe('<ResumoAcademico />');
    });
  });
});
