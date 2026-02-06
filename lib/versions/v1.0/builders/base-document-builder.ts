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

import DocumentBuilder from '@/core/builder/document-builder.interface';
import { DocumentType } from '@/core/types';

import BaseBuilder from './base-builder';

export default abstract class BaseDocumentBuilder<T>
  extends BaseBuilder
  implements DocumentBuilder<T>
{
  abstract readonly type: DocumentType;

  abstract build(json: T): string;

  public getKey(): string {
    return `${this.type}:${this.version}`;
  }
}
