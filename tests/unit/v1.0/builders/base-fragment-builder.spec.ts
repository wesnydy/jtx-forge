import { beforeAll, describe, expect, it } from '@jest/globals';
import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import { BaseFragmentBuilder } from '@/versions/v1.0/builders/base-fragment-builder';

class BaseFragmentBuilderMock extends BaseFragmentBuilder<{ key: string; value: string }> {
  readonly name: string = 'estudante';
  build(_json: { key: string; value: string }, _parent: XMLBuilder): string {
    return '';
  }
}

describe('BaseFragmentBuilder v1.0', () => {
  let builder: BaseFragmentBuilderMock;

  beforeAll(() => {
    builder = new BaseFragmentBuilderMock();
  });

  describe('getKey', () => {
    it('should return the correct key format when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toBe('estudante:v1.0');
    });

    it('should use colon as separator between name and version when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toMatch(/^estudante:v1\.0$/);
    });

    it('should include the fragment name in the key when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toContain('estudante');
    });

    it('should include the version in the key when getting the key value', () => {
      const key = builder.getKey();
      expect(key).toContain('v1.0');
    });
  });
});
