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

import FragmentBuilder from '@/core/builder/fragment-builder.interface';

import BaseBuilder from './base-builder';

export abstract class BaseFragmentBuilder<T>
  extends BaseBuilder
  implements FragmentBuilder<T, XMLBuilder>
{
  abstract readonly name: string;

  abstract build(json: T, parent: XMLBuilder): string;

  public getKey(): string {
    return `${this.name}:${this.version}`;
  }
}
