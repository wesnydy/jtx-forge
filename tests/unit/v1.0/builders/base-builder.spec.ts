import { jest, beforeEach, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import BaseBuilder from '@/versions/v1.0/builders/base-builder';

class BaseBuilderMock extends BaseBuilder {
  public getKey(): string {
    return `mock:${this.version}`;
  }

  public testAddReqElement<O extends object, K extends keyof O & string>(
    parent: XMLBuilder,
    field: K,
    json: O,
  ): XMLBuilder {
    return this.addReqElement(parent, field, json);
  }

  public testAddOpElement<O extends object, K extends keyof O & string>(
    parent: XMLBuilder,
    field: K,
    json: O,
  ): XMLBuilder | null {
    return this.addOpElement(parent, field, json);
  }

  public testAddOneElement<O extends object>(
    parent: XMLBuilder,
    fields: ReadonlyArray<string>,
    json: O,
  ): XMLBuilder | null {
    return this.addOneElement(parent, fields, json);
  }
}

describe('BaseBuilder v1.0', () => {
  let baseBuilderMock: BaseBuilderMock;
  let xmlParentMock: XMLBuilder;

  beforeEach(() => {
    jest.clearAllMocks();

    const createMockElement = (): XMLBuilder => {
      return {
        txt: jest.fn().mockReturnThis(),
        ele: jest.fn().mockImplementation(createMockElement),
      } as unknown as XMLBuilder;
    };

    xmlParentMock = {
      ele: jest.fn().mockImplementation(createMockElement),
      txt: jest.fn().mockReturnThis(),
    } as unknown as XMLBuilder;

    baseBuilderMock = new BaseBuilderMock();
  });

  describe('getKey', () => {
    it('should return the correct key format when getting the key value', () => {
      const key = baseBuilderMock.getKey();
      expect(key).toBe('mock:v1.0');
    });

    it('should include version in key when getting the key value', () => {
      const key = baseBuilderMock.getKey();
      expect(key).toContain('v1.0');
    });
  });

  describe('addReqElement', () => {
    it('should throw an error when the value from json[field] is null', () => {
      const field = 'example-field';
      const json = { [field]: null };

      expect(() => {
        baseBuilderMock.testAddReqElement(xmlParentMock, field, json);
      }).toThrow(`Field '${field}' is required in ${baseBuilderMock.getKey()}`);
    });

    it('should throw an error when the value from json[field] is undefined', () => {
      const field = 'example-field';
      const json = { [field]: undefined };

      expect(() => {
        baseBuilderMock.testAddReqElement(xmlParentMock, field, json);
      }).toThrow(`Field '${field}' is required in ${baseBuilderMock.getKey()}`);
    });

    it('should add a required element with text when the value from json[field] is a string', () => {
      const field = 'example-field';
      const json = { [field]: 'test-value' };

      const newElement = baseBuilderMock.testAddReqElement(xmlParentMock, field, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).toHaveBeenCalledWith(json[field]);
    });

    it('should add a required element with text when the value from json[field] is a number', () => {
      const field = 'example-field';
      const json = { [field]: 30 };

      const newElement = baseBuilderMock.testAddReqElement(xmlParentMock, field, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).toHaveBeenCalledWith(json[field].toString());
    });

    it('should add a required element with text when the value from json[field] is a boolean', () => {
      const field = 'example-field';
      const json = { [field]: true };

      const newElement = baseBuilderMock.testAddReqElement(xmlParentMock, field, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).toHaveBeenCalledWith(json[field].toString());
    });

    it('should add a required element without text when the value from json[field] is an object', () => {
      const field = 'example-field';
      const json = { [field]: {} };

      const newElement = baseBuilderMock.testAddReqElement(xmlParentMock, field, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).not.toHaveBeenCalled();
    });

    it('should add a required element without text when the value from json[field] is an array', () => {
      const field = 'example-field';
      const json = { [field]: [] };

      const newElement = baseBuilderMock.testAddReqElement(xmlParentMock, field, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).not.toHaveBeenCalled();
    });
  });

  describe('addOpElement', () => {
    it('should return null when the value from json[field] is null', () => {
      const field = 'example-field';
      const json = { [field]: null };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json);

      expect(newElement).toBeNull();
    });

    it('should return null when the value from json[field] is undefined', () => {
      const field = 'example-field';
      const json = { [field]: null };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json);

      expect(newElement).toBeNull();
    });

    it('should add a optional element with text when the value from json[field] is a string', () => {
      const field = 'example-field';
      const json = { [field]: 'test-value' };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).toHaveBeenCalledWith(json[field]);
    });

    it('should add a optional element with text when the value from json[field] is a number', () => {
      const field = 'example-field';
      const json = { [field]: 30 };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).toHaveBeenCalledWith(json[field].toString());
    });

    it('should add a optional element with text when the value from json[field] is a boolean', () => {
      const field = 'example-field';
      const json = { [field]: true };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).toHaveBeenCalledWith(json[field].toString());
    });

    it('should add a optional element without text when the value from json[field] is an object', () => {
      const field = 'example-field';
      const json = { [field]: {} };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).not.toHaveBeenCalled();
    });

    it('should add a optional element without text when the value from json[field] is an array', () => {
      const field = 'example-field';
      const json = { [field]: [] };

      const newElement = baseBuilderMock.testAddOpElement(xmlParentMock, field, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(field);
      expect(newElement.txt).not.toHaveBeenCalled();
    });
  });

  describe('addOneElement', () => {
    it('should throw an error when none of the elements are present in json', () => {
      const fields = ['field-a', 'field-b'];
      const json = {};

      expect(() => {
        baseBuilderMock.testAddOneElement(xmlParentMock, fields, json);
      }).toThrow(`One of the fields ${fields} is required in ${baseBuilderMock.getKey()}`);
    });

    it('should throw an error when the first matching element present in json is null', () => {
      const fields = ['field-a', 'field-b'];
      const json = { [fields[0]]: null, [fields[1]]: 'value-b' };

      expect(() => {
        baseBuilderMock.testAddOneElement(xmlParentMock, fields, json);
      }).toThrow(`Field '${fields[0]}' is required in ${baseBuilderMock.getKey()}`);
    });

    it('should return null when the list of possible elements is empty', () => {
      const fields: string[] = [];
      const json = {};

      const newElement = baseBuilderMock.testAddOneElement(xmlParentMock, fields, json);
      expect(newElement).toBeNull();
    });

    it('should add the first matching element when multiple eligible elements are present in json', () => {
      const fields = ['field-a', 'field-b'];
      const json = { [fields[0]]: 'value-a', [fields[1]]: 'value-b' };

      baseBuilderMock.testAddOneElement(xmlParentMock, fields, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[0]);
    });

    it('should add the first matching element when it is the only eligible element in json', () => {
      const fields = ['field-a', 'field-b'];
      const json = { [fields[1]]: 'value-b', 'field-c': 'value-c' };

      baseBuilderMock.testAddOneElement(xmlParentMock, fields, json);

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[1]);
    });

    it('should add the first matching element with text when json[field[i]] is a string', () => {
      const fields = ['field-a'];
      const json = { [fields[0]]: 'value-a' };

      const newElement = baseBuilderMock.testAddOneElement(xmlParentMock, fields, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[0]);
      expect(newElement.txt).toHaveBeenCalledWith(json[fields[0]]);
    });

    it('should add the first matching element with text when json[field[i]] is a number', () => {
      const fields = ['field-a'];
      const json = { [fields[0]]: 30 };

      const newElement = baseBuilderMock.testAddOneElement(xmlParentMock, fields, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[0]);
      expect(newElement.txt).toHaveBeenCalledWith(json[fields[0]].toString());
    });

    it('should add the first matching element with text when json[field[i]] is a boolean', () => {
      const fields = ['field-a'];
      const json = { [fields[0]]: true };

      const newElement = baseBuilderMock.testAddOneElement(xmlParentMock, fields, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[0]);
      expect(newElement.txt).toHaveBeenCalledWith(json[fields[0]].toString());
    });

    it('should add the first matching element without text when json[field[i]] is an object', () => {
      const fields = ['field-a'];
      const json = { [fields[0]]: {} };

      const newElement = baseBuilderMock.testAddOneElement(xmlParentMock, fields, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[0]);
      expect(newElement.txt).not.toHaveBeenCalled();
    });

    it('should add the first matching element without text when json[field[i]] is an array', () => {
      const fields = ['field-a'];
      const json = { [fields[0]]: [] };

      const newElement = baseBuilderMock.testAddOneElement(xmlParentMock, fields, json)!;

      expect(xmlParentMock.ele).toHaveBeenCalledWith(fields[0]);
      expect(newElement.txt).not.toHaveBeenCalled();
    });
  });
});
