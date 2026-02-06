import { beforeAll, describe, expect, it } from '@jest/globals';

import { DocumentType } from '@/core/types';
import BaseDocumentBuilder from '@/versions/v1.0/builders/base-document-builder';

class BaseDocumentBuilderMock extends BaseDocumentBuilder<{ key: string; value: string }> {
  readonly type: DocumentType = 'boletim';
  build(json: { key: string; value: string }): string {
    return `<mock><key>${json.key}</key><value>${json.value}</value></mock>`;
  }
}

describe('BaseDocumentBuilder v1.0', () => {
  let builder: BaseDocumentBuilderMock;

  beforeAll(() => {
    builder = new BaseDocumentBuilderMock();
  });

  describe('getKey', () => {
    it('should return the correct key format when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toBe('boletim:v1.0');
    });

    it('should use colon as separator between type and version when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toMatch(/^boletim:v1\.0$/);
    });

    it('should include the document type in the key when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toContain('boletim');
    });

    it('should include the version in the key when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toContain('v1.0');
    });
  });
});
