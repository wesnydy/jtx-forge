import fs from 'node:fs/promises';
import path from 'node:path';

const fixturesRoot = path.resolve(__dirname, '..', 'fixtures');

const isPlainObject = function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const deepMerge = function deepMerge(target: unknown, source: unknown): unknown {
  if (!isPlainObject(source)) {
    return source;
  }

  const targetObject: Record<string, unknown> = isPlainObject(target) ? { ...target } : {};

  for (const key of Object.keys(source)) {
    if (isPlainObject(source[key]) && isPlainObject(targetObject[key])) {
      targetObject[key] = deepMerge(targetObject[key], source[key]);
    } else {
      targetObject[key] = source[key];
    }
  }

  return targetObject;
};

export default async function loadFixture(
  relativePath: string,
  overrides?: Record<string, unknown>,
): Promise<unknown> {
  const fixturePath = path.join(fixturesRoot, relativePath);
  const rawFixture = await fs.readFile(fixturePath, 'utf-8');

  const fixture = structuredClone(JSON.parse(rawFixture));

  if (!overrides) {
    return fixture;
  }

  return deepMerge(fixture, overrides);
}
