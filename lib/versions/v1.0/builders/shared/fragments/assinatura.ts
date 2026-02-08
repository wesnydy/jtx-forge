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

import { BaseFragmentBuilder } from '../../base-fragment-builder';
import { AssinaturaType } from '../../../types/boletim/boletim-types.schema';

export default class AssinaturaFragment extends BaseFragmentBuilder<AssinaturaType> {
  name: string = 'Assinatura';

  build(json: AssinaturaType, parent: XMLBuilder): string {
    this.addReqElement(parent, 'NomeAssinador', json);
    this.addReqElement(parent, 'Cargo', json);
    this.addReqElement(parent, 'Data', json);
    this.addReqElement(parent, 'AssinaturaDigital', json);

    return parent.end({ prettyPrint: true });
  }
}
