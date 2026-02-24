import { jest, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import EstudanteFragmentBuilder from '@/versions/v1.0/builders/shared/fragments/estudante';
import type { EstudanteType } from '@/versions/v1.0/types/shared/pessoal-types.schema';

import loadFixture from '@tests/utils/load-fixture';

describe('EstudanteFragmentBuilder v1.0', () => {
  let fragmentBuilder: EstudanteFragmentBuilder;
  let xmlParentMock: XMLBuilder;

  let validRequiredInput: EstudanteType;

  beforeAll(async () => {
    fragmentBuilder = new EstudanteFragmentBuilder();

    validRequiredInput = (await loadFixture(
      'v1.0/schemas/pessoal-types/estudante/valid-required-estudante-type.json',
    )) as EstudanteType;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnValue('<Estudante />'),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      txt: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnValue('<Estudante />'),
      ele: jest.fn().mockImplementation(createMockElement),
    } as unknown as XMLBuilder;
  });

  describe('build', () => {
    it('should throw an error for each required property when it is missing', () => {
      expect.hasAssertions();

      for (const key of Object.keys(validRequiredInput)) {
        jest.clearAllMocks();

        const invalidInput = { ...validRequiredInput } as EstudanteType;
        delete invalidInput[key as keyof EstudanteType];

        expect(() => {
          fragmentBuilder.build(invalidInput, xmlParentMock);
        }).toThrow(`Field '${key}' is required`);
      }
    });

    it('should return a string when building fragment with a valid json', () => {
      const result = fragmentBuilder.build(validRequiredInput, xmlParentMock);

      expect(typeof result).toBe('string');
      expect(result).toBe('<Estudante />');
    });
  });
});
