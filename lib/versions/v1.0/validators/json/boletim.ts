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

import { DefinedError } from 'ajv';

import DocumentValidator from '@/core/validator/document.validator.interface';
import { DocumentType, StandardsVersion, ValidationResult } from '@/core/types';

import { BoletimType } from '../../types/boletim/boletim';

import JSONSchemaURIs from '../../utils/json-schema-uris';
import ajvErrorString from '../../utils/ajv-error-string';
import ajvInstanceCache from '../../utils/ajv-instance-cache';

export default class BoletimJSONValidator implements DocumentValidator<BoletimType> {
  private readonly type: DocumentType = 'boletim';
  private readonly version: StandardsVersion = 'v1.0';

  validate(json: BoletimType): ValidationResult {
    const validateSchema = ajvInstanceCache.getSchema(JSONSchemaURIs.boletimURI);

    if (validateSchema === undefined) {
      throw new Error(`${JSONSchemaURIs.boletimURI} not found in AJV instance cache`);
    }

    const validSchema = validateSchema(json);

    if (validSchema) return { valid: true, errors: [] };

    if (validateSchema.errors) {
      const errors: string[] = validateSchema.errors.map((error) =>
        ajvErrorString(error as DefinedError),
      );
      return { valid: false, errors };
    }
    return { valid: false, errors: [] };
  }

  public getKey(): string {
    return `${this.type}:${this.version}`;
  }
}
