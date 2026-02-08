import { jest, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import AssinaturaFragmentBuilder from '@/versions/v1.0/builders/shared/fragments/assinatura';
import type { AssinaturaType } from '@/versions/v1.0/types/boletim/boletim-types.schema';

import loadFixture from '@tests/utils/load-fixture';

describe('AssinaturaFragmentBuilder v1.0', () => {
  let fragmentBuilder: AssinaturaFragmentBuilder;
  let xmlParentMock: XMLBuilder;

  let validRequiredInput: AssinaturaType;

  beforeAll(async () => {
    fragmentBuilder = new AssinaturaFragmentBuilder();

    validRequiredInput = (await loadFixture(
      'v1.0/schemas/boletim-types/assinatura/valid-required-assinatura-type.json',
    )) as AssinaturaType;
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnValue('<Assinatura />'),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      txt: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnValue('<Assinatura />'),
      ele: jest.fn().mockImplementation(createMockElement),
    } as unknown as XMLBuilder;
  });

  describe('build', () => {
    it('should throw an error when each assinatura required property is missing', () => {
      for (const key of Object.keys(validRequiredInput)) {
        const invalidInput = { ...validRequiredInput } as AssinaturaType;

        delete invalidInput[key as keyof AssinaturaType];

        expect(() => {
          fragmentBuilder.build(invalidInput, xmlParentMock);
        }).toThrow(`Field '${key}' is required`);
      }
    });

    it('should return a string when building assinatura fragment with a valid json', () => {
      const result = fragmentBuilder.build(validRequiredInput, xmlParentMock);

      expect(typeof result).toBe('string');
      expect(result).toBe('<Assinatura />');
    });
  });
});
