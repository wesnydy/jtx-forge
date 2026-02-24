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
import { EnderecoType } from '../../../types/shared/localizacao-types.schema';

export default class EnderecoFragment extends BaseFragmentBuilder<EnderecoType> {
  name: string = 'Endereco';

  build(json: EnderecoType, parent: XMLBuilder): string {
    this.addReqElement(parent, 'Logradouro', json);
    this.addReqElement(parent, 'Numero', json);
    this.addOpElement(parent, 'Complemento', json);
    this.addReqElement(parent, 'Bairro', json);
    this.addReqElement(parent, 'Cidade', json);
    this.addReqElement(parent, 'UF', json);
    this.addReqElement(parent, 'CEP', json);

    return parent.end({ prettyPrint: true });
  }
}
