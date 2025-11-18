// Copyright 2025 Wesnydy L. Ribeiro
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import fs from 'node:fs/promises';
import path from 'node:path';

import ajvInstanceCache from '../../utils/ajv-instance-cache';

export default async function readJSONSchemas(dirname: string): Promise<void> {
  const entries = await fs.readdir(dirname, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirname, entry.name);
    if (entry.isDirectory()) {
      await readJSONSchemas(fullPath);
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.json')) {
      const schemaString = await fs.readFile(fullPath, 'utf-8');
      const schemaObject = JSON.parse(schemaString);
      ajvInstanceCache.addSchema(schemaObject, entry.name);
    }
  }
}
