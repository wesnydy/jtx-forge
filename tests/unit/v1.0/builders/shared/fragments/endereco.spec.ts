import { jest, beforeAll, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import EnderecoFragmentBuilder from '@/versions/v1.0/builders/shared/fragments/endereco';
import type { EnderecoType } from '@/versions/v1.0/types/shared/localizacao-types.schema';

import loadFixture from '@tests/utils/load-fixture';

describe('EnderecoFragmentBuilder v1.0', () => {
  let fragmentBuilder: EnderecoFragmentBuilder;
  let xmlParentMock: XMLBuilder;

  let validRequiredInput: EnderecoType;
  let validCompleteInput: EnderecoType;

  let validOptionalKeys: string[];

  beforeAll(async () => {
    fragmentBuilder = new EnderecoFragmentBuilder();

    validRequiredInput = (await loadFixture(
      'v1.0/schemas/localizacao-types/endereco/valid-required-endereco-type.json',
    )) as EnderecoType;

    validCompleteInput = (await loadFixture(
      'v1.0/schemas/localizacao-types/endereco/valid-complete-endereco-type.json',
    )) as EnderecoType;

    validOptionalKeys = Object.keys(validCompleteInput).filter(
      (key) => !Object.keys(validRequiredInput).includes(key),
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        end: jest.fn().mockReturnValue('<Endereco />'),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      txt: jest.fn().mockReturnThis(),
      end: jest.fn().mockReturnValue('<Endereco />'),
      ele: jest.fn().mockImplementation(createMockElement),
    } as unknown as XMLBuilder;
  });

  describe('build', () => {
    it('should throw an error for each required property when it is missing', () => {
      expect.hasAssertions();

      for (const key of Object.keys(validRequiredInput)) {
        jest.clearAllMocks();

        const invalidInput = { ...validRequiredInput } as EnderecoType;
        delete invalidInput[key as keyof EnderecoType];

        expect(() => {
          fragmentBuilder.build(invalidInput, xmlParentMock);
        }).toThrow(`Field '${key}' is required`);
      }
    });

    it('should create an element for optional property "Complemento" when it is present', () => {
      expect.hasAssertions();

      for (const key of validOptionalKeys) {
        jest.clearAllMocks();

        const validInput = { ...validCompleteInput } as EnderecoType;
        fragmentBuilder.build(validInput, xmlParentMock);

        expect(xmlParentMock.ele).toHaveBeenCalledWith(key);
      }
    });

    it('should return a string when building fragment with a valid json', () => {
      const result = fragmentBuilder.build(validRequiredInput, xmlParentMock);

      expect(typeof result).toBe('string');
      expect(result).toBe('<Endereco />');
    });
  });
});
