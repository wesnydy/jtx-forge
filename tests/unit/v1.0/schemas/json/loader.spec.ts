import { describe, expect, it, beforeEach, afterEach, jest } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

import readJSONSchemas from '@/versions/v1.0/schemas/json/loader';
import ajvInstanceCache from '@/versions/v1.0/utils/ajv-instance-cache';

describe('JSON schema loader v1.0', () => {
  let tmpDir: string;
  let addSchemaSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(async () => {
    tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'jtx-forge-schema-loader-'));
    addSchemaSpy = jest
      .spyOn(ajvInstanceCache, 'addSchema')
      .mockReturnValue(undefined as unknown as ReturnType<typeof ajvInstanceCache.addSchema>);
  });

  afterEach(async () => {
    addSchemaSpy.mockRestore();
    await fs.rm(tmpDir, { recursive: true, force: true });
  });

  it('should reject when dir does not exist', async () => {
    await expect(readJSONSchemas(path.join(tmpDir, 'no-such-dir'))).rejects.toThrow();
  });

  it('should reject when JSON schema is invalid', async () => {
    await fs.writeFile(path.join(tmpDir, 'invalid.json'), '{ invalid json', 'utf-8');

    await expect(readJSONSchemas(tmpDir)).rejects.toThrow();
  });

  it('should add JSON schemas when reading from directory recursively', async () => {
    await fs.writeFile(path.join(tmpDir, 'foo.json'), JSON.stringify({ $id: 'foo' }), 'utf-8');
    await fs.mkdir(path.join(tmpDir, '1'));
    await fs.writeFile(path.join(tmpDir, '1', 'bar.json'), JSON.stringify({ $id: 'bar' }), 'utf-8');

    await readJSONSchemas(tmpDir);

    expect(addSchemaSpy).toHaveBeenCalledTimes(2);
    expect(addSchemaSpy).toHaveBeenCalledWith({ $id: 'foo' }, 'foo.json');
    expect(addSchemaSpy).toHaveBeenCalledWith({ $id: 'bar' }, 'bar.json');
  });

  it('should add only JSON files when non-json files are present', async () => {
    await fs.writeFile(path.join(tmpDir, 'is-text.txt'), 'text', 'utf-8');
    await fs.writeFile(path.join(tmpDir, 'is-json.json'), JSON.stringify({ $id: 'json' }), 'utf-8');

    await readJSONSchemas(tmpDir);

    expect(addSchemaSpy).toHaveBeenCalledTimes(1);
    expect(addSchemaSpy).toHaveBeenCalledWith({ $id: 'json' }, 'is-json.json');
  });
});
