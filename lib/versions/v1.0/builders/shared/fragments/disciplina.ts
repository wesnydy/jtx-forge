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
import { DisciplinaType } from '../../../types/shared/academico-types.schema';

export default class DisciplinaFragment extends BaseFragmentBuilder<DisciplinaType> {
  name: string = 'Disciplina';

  build(json: DisciplinaType, parent: XMLBuilder): string {
    this.addReqElement(parent, 'Nome', json);
    this.addReqElement(parent, 'Codigo', json);
    this.addReqElement(parent, 'Creditos', json);
    this.addReqElement(parent, 'CargaHoraria', json);
    this.addOneElement(parent, ['Nota', 'NotaEscala'], json);
    this.addOpElement(parent, 'Frequencia', json);
    this.addReqElement(parent, 'Situacao', json);
    this.addOpElement(parent, 'Comentarios', json);

    return parent.end({ prettyPrint: true });
  }
}
