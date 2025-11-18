import { describe, expect, it } from '@jest/globals';

import ajvInstanceCache from '@/versions/v1.0/utils/ajv-instance-cache';

describe('AJV instance cache v1.0', () => {
  describe('Instance creation', () => {
    it('should export an instance of Ajv', () => {
      expect(ajvInstanceCache).toBeDefined();
      expect(typeof ajvInstanceCache.compile).toBe('function');
    });
  });

  describe('Validation handling', () => {
    it('should validate JSON inputs correctly when format support is enabled', () => {
      const emailSchema = {
        $id: 'email.schema.json',
        type: 'object',
        properties: { email: { type: 'string', format: 'email' } },
        required: ['email'],
        additionalProperties: false,
      };

      const validate = ajvInstanceCache.compile(emailSchema);

      expect(validate({ email: 'test@example.com' })).toBe(true);
      expect(validate({ email: 'not-email' })).toBe(false);
    });

    it('should return detailed errors when validation fails', () => {
      const dateSchema = {
        $id: 'date.schema.json',
        type: 'object',
        properties: { date: { type: 'string', format: 'date-time' } },
        required: ['date'],
        additionalProperties: false,
      };

      const validate = ajvInstanceCache.compile(dateSchema);
      validate({ date: 'not-date' });

      expect(validate.errors).toBeDefined();
      expect(validate.errors?.length).toBeGreaterThan(0);
    });
  });
});
