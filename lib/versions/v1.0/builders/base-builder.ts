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

import type { XMLBuilder } from 'xmlbuilder2/lib/interfaces';

import { StandardsVersion } from '@/core/types';

export default abstract class BaseBuilder {
  protected readonly version: StandardsVersion = 'v1.0';

  protected addReqElement<O extends object, K extends keyof O & string>(
    parent: XMLBuilder,
    field: K,
    json: O,
  ): XMLBuilder {
    if (json[field] == null) {
      throw new Error(`Field '${field}' is required`);
    } else if (typeof json[field] !== 'object' && !Array.isArray(json[field])) {
      return this.addElement(parent, field, String(json[field]));
    }
    return this.addElement(parent, field);
  }

  protected addOpElement<O extends object, K extends keyof O & string>(
    parent: XMLBuilder,
    field: K,
    json: O,
  ): XMLBuilder | null {
    if (json[field] == null) {
      return null;
    } else if (typeof json[field] !== 'object' && !Array.isArray(json[field])) {
      return this.addElement(parent, field, String(json[field]));
    }
    return this.addElement(parent, field);
  }

  protected addOneElement<O extends object>(
    parent: XMLBuilder,
    fields: ReadonlyArray<string>,
    json: O,
  ): XMLBuilder | null {
    if (fields.length === 0) {
      return null;
    }
    for (const field of fields) {
      if (field in json) {
        const typedField = field as keyof O & string;
        if (json[typedField] == null) {
          throw new Error(`Field '${field}' is required`);
        } else if (typeof json[typedField] !== 'object' && !Array.isArray(json[typedField])) {
          return this.addElement(parent, typedField, String(json[typedField]));
        }
        return this.addElement(parent, typedField);
      }
    }
    throw new Error(`One of the fields '${fields}' is required`);
  }

  protected addElement(parent: XMLBuilder, name: string, value?: string): XMLBuilder {
    const element = parent.ele(name);
    if (value !== undefined) {
      element.txt(value);
    }
    return element;
  }
}
