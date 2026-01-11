import { beforeAll, describe, expect, it } from '@jest/globals';

import fs from 'node:fs/promises';
import path from 'node:path';

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import JSONSchemaURIs from '@/versions/v1.0/utils/json-schema-uris';

describe('Boletim JSON Schema v1.0', () => {
  let ajvInstance: Ajv;

  beforeAll(async () => {
    const boletimString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/boletim/boletim.schema.json',
      ),
      'utf-8',
    );
    const boletimObject = JSON.parse(boletimString);

    const boletimTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/boletim/boletim-types.schema.json',
      ),
      'utf-8',
    );
    const boletimTypesObject = JSON.parse(boletimTypesString);

    const academicoTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/academico-types.schema.json',
      ),
      'utf-8',
    );
    const academicoTypesObject = JSON.parse(academicoTypesString);

    const institucionalTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/institucional-types.schema.json',
      ),
      'utf-8',
    );
    const institucionalTypesObject = JSON.parse(institucionalTypesString);

    const localizacaoTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/localizacao-types.schema.json',
      ),
      'utf-8',
    );
    const localizacaoTypesObject = JSON.parse(localizacaoTypesString);

    const pessoalTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/pessoal-types.schema.json',
      ),
      'utf-8',
    );
    const pessoalTypesObject = JSON.parse(pessoalTypesString);

    const simpleTypesString = await fs.readFile(
      path.resolve(
        __dirname,
        '../../../../../lib/versions/v1.0/schemas/json/shared/simple-types.schema.json',
      ),
      'utf-8',
    );
    const simpleTypesObject = JSON.parse(simpleTypesString);

    ajvInstance = new Ajv({ allErrors: true, strict: false });
    addFormats(ajvInstance);

    ajvInstance.addSchema(simpleTypesObject, simpleTypesObject.$id);
    ajvInstance.addSchema(pessoalTypesObject, pessoalTypesObject.$id);
    ajvInstance.addSchema(localizacaoTypesObject, localizacaoTypesObject.$id);
    ajvInstance.addSchema(institucionalTypesObject, institucionalTypesObject.$id);
    ajvInstance.addSchema(academicoTypesObject, academicoTypesObject.$id);
    ajvInstance.addSchema(boletimTypesObject, boletimTypesObject.$id);
    ajvInstance.addSchema(boletimObject, boletimObject.$id);

    ajvInstance.compile(boletimObject);
  });

  describe('Boletim root validations', () => {
    const boletimRef = `${JSONSchemaURIs.boletimURI}#/$defs/Boletim`;

    it('should return invalid when root is missing the required property "Boletim"', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(boletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Boletim' },
      });
    });

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Boletim: {
          Versao: '1.0',
          Cabecalho: {
            Instituicao: {
              Nome: 'Instituto Teste',
              CNPJ: '12345678000195',
              Endereco: {
                Logradouro: 'Rua A',
                Numero: '1',
                Bairro: 'Centro',
                Cidade: 'Cidade',
                UF: 'PB',
                CEP: '58051380',
              },
            },
            IdentificadorDocumento: 'doc-1',
            DataEmissao: '2020-01-01',
          },
          Estudante: {
            ID: 'est-1',
            Nome: 'Aluno Teste',
            CPF: '20122242756',
          },
          Curso: {
            Nome: 'Curso Teste',
            Codigo: '1',
          },
          Periodos: [
            {
              Periodo: {
                Codigo: 'P1',
                Inicio: '2020-01-01',
                Fim: '2020-06-01',
                Disciplinas: [
                  {
                    Disciplina: {
                      Nome: 'Disciplina A',
                      Codigo: '1',
                      Creditos: '1',
                      CargaHoraria: '1',
                      Situacao: 'Aprovado',
                      Nota: '10.00',
                    },
                  },
                ],
              },
            },
          ],
          ResumoAcademico: {
            CRA: '0.00',
            TotalCreditosConcluidos: '0.00',
          },
        },
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(boletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return valid when a minimal valid boletim is provided', () => {
      const validInput = {
        Boletim: {
          Versao: '1.0',
          Cabecalho: {
            Instituicao: {
              Nome: 'Instituto Teste',
              CNPJ: '12345678000195',
              Endereco: {
                Logradouro: 'Rua A',
                Numero: '1',
                Bairro: 'Centro',
                Cidade: 'Cidade',
                UF: 'PB',
                CEP: '58051380',
              },
            },
            IdentificadorDocumento: 'doc-1',
            DataEmissao: '2020-01-01',
          },
          Estudante: {
            ID: 'est-1',
            Nome: 'Aluno Teste',
            CPF: '20122242756',
          },
          Curso: {
            Nome: 'Curso Teste',
            Codigo: '1',
          },
          Periodos: [
            {
              Periodo: {
                Codigo: 'P1',
                Inicio: '2020-01-01',
                Fim: '2020-06-01',
                Disciplinas: [
                  {
                    Disciplina: {
                      Nome: 'Disciplina A',
                      Codigo: '1',
                      Creditos: '1',
                      CargaHoraria: '1',
                      Situacao: 'Aprovado',
                      Nota: '10.00',
                    },
                  },
                ],
              },
            },
          ],
          ResumoAcademico: {
            CRA: '0.00',
            TotalCreditosConcluidos: '0.00',
          },
        },
      };

      const typeValidator = ajvInstance.getSchema(boletimRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('Boletim root array validations', () => {
    const loteBoletimRef = `${JSONSchemaURIs.boletimURI}#/$defs/LoteBoletim`;

    it('should return invalid when root is an empty array', () => {
      const invalidInput: object[] = [];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'minItems',
        params: { limit: 1 },
      });
    });

    it('should return invalid when root has an item missing the required "Boletim" property', () => {
      const invalidInput = [{}];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'required',
        params: { missingProperty: 'Boletim' },
      });
    });

    it('should return invalid when root has an item with additional properties', () => {
      const invalidInput = [
        {
          Boletim: {
            Versao: '1.0',
            Cabecalho: {
              Instituicao: {
                Nome: 'Instituto Teste',
                CNPJ: '12345678000195',
                Endereco: {
                  Logradouro: 'Rua A',
                  Numero: '1',
                  Bairro: 'Centro',
                  Cidade: 'Cidade',
                  UF: 'PB',
                  CEP: '58051380',
                },
              },
              IdentificadorDocumento: 'doc-1',
              DataEmissao: '2020-01-01',
            },
            Estudante: {
              ID: 'est-1',
              Nome: 'Aluno Teste',
              CPF: '20122242756',
            },
            Curso: {
              Nome: 'Curso Teste',
              Codigo: '1',
            },
            Periodos: [
              {
                Periodo: {
                  Codigo: 'P1',
                  Inicio: '2020-01-01',
                  Fim: '2020-06-01',
                  Disciplinas: [
                    {
                      Disciplina: {
                        Nome: 'Disciplina A',
                        Codigo: '1',
                        Creditos: '1',
                        CargaHoraria: '1',
                        Situacao: 'Aprovado',
                        Nota: '10.00',
                      },
                    },
                  ],
                },
              },
            ],
            ResumoAcademico: {
              CRA: '0.00',
              TotalCreditosConcluidos: '0.00',
            },
          },
          ExtraProperty: 'not-allowed',
        },
      ];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when root contains duplicated items', () => {
      const invalidInput = [
        {
          Boletim: {
            Versao: '1.0',
            Cabecalho: {
              Instituicao: {
                Nome: 'Instituto Teste',
                CNPJ: '12345678000195',
                Endereco: {
                  Logradouro: 'Rua A',
                  Numero: '1',
                  Bairro: 'Centro',
                  Cidade: 'Cidade',
                  UF: 'PB',
                  CEP: '58051380',
                },
              },
              IdentificadorDocumento: 'doc-1',
              DataEmissao: '2020-01-01',
            },
            Estudante: {
              ID: 'est-1',
              Nome: 'Aluno Teste',
              CPF: '20122242756',
            },
            Curso: {
              Nome: 'Curso Teste',
              Codigo: '1',
            },
            Periodos: [
              {
                Periodo: {
                  Codigo: 'P1',
                  Inicio: '2020-01-01',
                  Fim: '2020-06-01',
                  Disciplinas: [
                    {
                      Disciplina: {
                        Nome: 'Disciplina A',
                        Codigo: '1',
                        Creditos: '1',
                        CargaHoraria: '1',
                        Situacao: 'Aprovado',
                        Nota: '10.00',
                      },
                    },
                  ],
                },
              },
            ],
            ResumoAcademico: {
              CRA: '0.00',
              TotalCreditosConcluidos: '0.00',
            },
          },
        },
        {
          Boletim: {
            Versao: '1.0',
            Cabecalho: {
              Instituicao: {
                Nome: 'Instituto Teste',
                CNPJ: '12345678000195',
                Endereco: {
                  Logradouro: 'Rua A',
                  Numero: '1',
                  Bairro: 'Centro',
                  Cidade: 'Cidade',
                  UF: 'PB',
                  CEP: '58051380',
                },
              },
              IdentificadorDocumento: 'doc-1',
              DataEmissao: '2020-01-01',
            },
            Estudante: {
              ID: 'est-1',
              Nome: 'Aluno Teste',
              CPF: '20122242756',
            },
            Curso: {
              Nome: 'Curso Teste',
              Codigo: '1',
            },
            Periodos: [
              {
                Periodo: {
                  Codigo: 'P1',
                  Inicio: '2020-01-01',
                  Fim: '2020-06-01',
                  Disciplinas: [
                    {
                      Disciplina: {
                        Nome: 'Disciplina A',
                        Codigo: '1',
                        Creditos: '1',
                        CargaHoraria: '1',
                        Situacao: 'Aprovado',
                        Nota: '10.00',
                      },
                    },
                  ],
                },
              },
            ],
            ResumoAcademico: {
              CRA: '0.00',
              TotalCreditosConcluidos: '0.00',
            },
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'uniqueItems',
        params: { i: 1, j: 0 },
      });
    });

    it('should return valid when multiple valid boletim items are provided', () => {
      const validInput = [
        {
          Boletim: {
            Versao: '1.0',
            Cabecalho: {
              Instituicao: {
                Nome: 'Instituto Teste',
                CNPJ: '12345678000195',
                Endereco: {
                  Logradouro: 'Rua A',
                  Numero: '1',
                  Bairro: 'Centro',
                  Cidade: 'Cidade',
                  UF: 'PB',
                  CEP: '58051380',
                },
              },
              IdentificadorDocumento: 'doc-1',
              DataEmissao: '2020-01-01',
            },
            Estudante: {
              ID: 'est-1',
              Nome: 'Aluno Teste',
              CPF: '20122242756',
            },
            Curso: {
              Nome: 'Curso Teste',
              Codigo: '1',
            },
            Periodos: [
              {
                Periodo: {
                  Codigo: 'P1',
                  Inicio: '2020-01-01',
                  Fim: '2020-06-01',
                  Disciplinas: [
                    {
                      Disciplina: {
                        Nome: 'Disciplina A',
                        Codigo: '1',
                        Creditos: '1',
                        CargaHoraria: '1',
                        Situacao: 'Aprovado',
                        Nota: '10.00',
                      },
                    },
                  ],
                },
              },
            ],
            ResumoAcademico: {
              CRA: '0.00',
              TotalCreditosConcluidos: '0.00',
            },
          },
        },
        {
          Boletim: {
            Versao: '1.0',
            Cabecalho: {
              Instituicao: {
                Nome: 'Instituto Teste',
                CNPJ: '12345678000195',
                Endereco: {
                  Logradouro: 'Rua A',
                  Numero: '1',
                  Bairro: 'Centro',
                  Cidade: 'Cidade',
                  UF: 'PB',
                  CEP: '58051380',
                },
              },
              IdentificadorDocumento: 'doc-2',
              DataEmissao: '2020-01-01',
            },
            Estudante: {
              ID: 'est-2',
              Nome: 'Aluno Teste',
              CPF: '20122242756',
            },
            Curso: {
              Nome: 'Curso Teste',
              Codigo: '2',
            },
            Periodos: [
              {
                Periodo: {
                  Codigo: 'P2',
                  Inicio: '2020-01-01',
                  Fim: '2020-06-01',
                  Disciplinas: [
                    {
                      Disciplina: {
                        Nome: 'Disciplina B',
                        Codigo: '1',
                        Creditos: '1',
                        CargaHoraria: '1',
                        Situacao: 'Aprovado',
                        Nota: '10.00',
                      },
                    },
                  ],
                },
              },
            ],
            ResumoAcademico: {
              CRA: '0.00',
              TotalCreditosConcluidos: '0.00',
            },
          },
        },
      ];

      const typeValidator = ajvInstance.getSchema(loteBoletimRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });

  describe('BoletimType validations', () => {
    const boletimTypeRef = `${JSONSchemaURIs.boletimURI}#/$defs/BoletimType`;

    it('should return invalid when required properties are missing', () => {
      const invalidInput = {};

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors).toMatchObject([
        { keyword: 'required', params: { missingProperty: 'Versao' } },
        { keyword: 'required', params: { missingProperty: 'Cabecalho' } },
        { keyword: 'required', params: { missingProperty: 'Estudante' } },
        { keyword: 'required', params: { missingProperty: 'Curso' } },
        { keyword: 'required', params: { missingProperty: 'Periodos' } },
        { keyword: 'required', params: { missingProperty: 'ResumoAcademico' } },
      ]);
    });

    it('should return invalid when additional properties are present', () => {
      const invalidInput = {
        Versao: '1.0',
        Cabecalho: {
          Instituicao: {
            Nome: 'Instituto Teste',
            CNPJ: '12345678000195',
            Endereco: {
              Logradouro: 'Rua A',
              Numero: '1',
              Bairro: 'Centro',
              Cidade: 'Cidade',
              UF: 'PB',
              CEP: '58051380',
            },
          },
          IdentificadorDocumento: 'doc-1',
          DataEmissao: '2020-01-01',
        },
        Estudante: {
          ID: 'est-1',
          Nome: 'Aluno Teste',
          CPF: '20122242756',
        },
        Curso: {
          Nome: 'Curso Teste',
          Codigo: '1',
        },
        Periodos: [
          {
            Periodo: {
              Codigo: 'P1',
              Inicio: '2020-01-01',
              Fim: '2020-06-01',
              Disciplinas: [
                {
                  Disciplina: {
                    Nome: 'Disciplina A',
                    Codigo: '1',
                    Creditos: '1',
                    CargaHoraria: '1',
                    Situacao: 'Aprovado',
                    Nota: '10.00',
                  },
                },
              ],
            },
          },
        ],
        ResumoAcademico: {
          CRA: '0.00',
          TotalCreditosConcluidos: '0.00',
        },
        ExtraProperty: 'not-allowed',
      };

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(invalidInput);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'additionalProperties',
        params: { additionalProperty: 'ExtraProperty' },
      });
    });

    it('should return invalid when "Versao" property is not "1.0"', () => {
      const invalidInput = {
        Versao: '0.0',
        Cabecalho: {
          Instituicao: {
            Nome: 'Instituto Teste',
            CNPJ: '12345678000195',
            Endereco: {
              Logradouro: 'Rua A',
              Numero: '1',
              Bairro: 'Centro',
              Cidade: 'Cidade',
              UF: 'PB',
              CEP: '58051380',
            },
          },
          IdentificadorDocumento: 'doc-1',
          DataEmissao: '2020-01-01',
        },
        Estudante: {
          ID: 'est-1',
          Nome: 'Aluno Teste',
          CPF: '20122242756',
        },
        Curso: {
          Nome: 'Curso Teste',
          Codigo: '1',
        },
        Periodos: [
          {
            Periodo: {
              Codigo: 'P1',
              Inicio: '2020-01-01',
              Fim: '2020-06-01',
              Disciplinas: [
                {
                  Disciplina: {
                    Nome: 'Disciplina A',
                    Codigo: '1',
                    Creditos: '1',
                    CargaHoraria: '1',
                    Situacao: 'Aprovado',
                    Nota: '10.00',
                  },
                },
              ],
            },
          },
        ],
        ResumoAcademico: {
          CRA: '0.00',
          TotalCreditosConcluidos: '0.00',
        },
      };

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(invalidInput as unknown);

      expect(validationResult).toBe(false);
      expect(typeValidator.errors?.at(0)).toMatchObject({
        keyword: 'const',
        params: { allowedValue: '1.0' },
      });
    });

    it('should return valid when only required properties are provided', () => {
      const validInput = {
        Versao: '1.0',
        Cabecalho: {
          Instituicao: {
            Nome: 'Instituto Teste',
            CNPJ: '12345678000195',
            Endereco: {
              Logradouro: 'Rua A',
              Numero: '1',
              Bairro: 'Centro',
              Cidade: 'Cidade',
              UF: 'PB',
              CEP: '58051380',
            },
          },
          IdentificadorDocumento: 'doc-1',
          DataEmissao: '2020-01-01',
        },
        Estudante: {
          ID: 'est-1',
          Nome: 'Aluno Teste',
          CPF: '20122242756',
        },
        Curso: {
          Nome: 'Curso Teste',
          Codigo: '1',
        },
        Periodos: [
          {
            Periodo: {
              Codigo: 'P1',
              Inicio: '2020-01-01',
              Fim: '2020-06-01',
              Disciplinas: [
                {
                  Disciplina: {
                    Nome: 'Disciplina A',
                    Codigo: '1',
                    Creditos: '1',
                    CargaHoraria: '1',
                    Situacao: 'Aprovado',
                    Nota: '10.00',
                  },
                },
              ],
            },
          },
        ],
        ResumoAcademico: {
          CRA: '0.00',
          TotalCreditosConcluidos: '0.00',
        },
      };

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });

    it('should return valid when optional property "Assinaturas" is provided', () => {
      const validInput = {
        Versao: '1.0',
        Cabecalho: {
          Instituicao: {
            Nome: 'Instituto Teste',
            CNPJ: '12345678000195',
            Endereco: {
              Logradouro: 'Rua A',
              Numero: '1',
              Bairro: 'Centro',
              Cidade: 'Cidade',
              UF: 'PB',
              CEP: '58051380',
            },
          },
          IdentificadorDocumento: 'doc-1',
          DataEmissao: '2020-01-01',
        },
        Estudante: {
          ID: 'est-1',
          Nome: 'Aluno Teste',
          CPF: '20122242756',
        },
        Curso: {
          Nome: 'Curso Teste',
          Codigo: '1',
        },
        Periodos: [
          {
            Periodo: {
              Codigo: 'P1',
              Inicio: '2020-01-01',
              Fim: '2020-06-01',
              Disciplinas: [
                {
                  Disciplina: {
                    Nome: 'Disciplina A',
                    Codigo: '1',
                    Creditos: '1',
                    CargaHoraria: '1',
                    Situacao: 'Aprovado',
                    Nota: '10.00',
                  },
                },
              ],
            },
          },
        ],
        ResumoAcademico: {
          CRA: '0.00',
          TotalCreditosConcluidos: '0.00',
        },
        Assinaturas: [
          {
            Assinatura: {
              NomeAssinador: 'Assinatura Teste',
              Cargo: 'Assinante',
              Data: '2020-01-01',
              AssinaturaDigital: 'abcdef1234567890',
            },
          },
        ],
      };

      const typeValidator = ajvInstance.getSchema(boletimTypeRef)!;
      const validationResult = typeValidator(validInput);

      expect(validationResult).toBe(true);
    });
  });
});
