import { DefinedError } from 'ajv';

export default function ajvErrorString(error: DefinedError): string {
  let errorString = `root${error.instancePath} ${error.message}`;

  if (error.keyword === 'additionalProperties') {
    errorString += ` '${error.params.additionalProperty}'`;
    return errorString;
  }

  if (error.keyword === 'oneOf') {
    errorString += ` '${JSON.stringify(error.schema)}'`;
    return errorString;
  }

  if (error.keyword === 'not') {
    errorString += ` in '${JSON.stringify(error.schema)}'`;
    return errorString;
  }

  if (error.keyword === 'const') {
    errorString += ` '${error.params.allowedValue}'`;
  }

  if (error.keyword === 'enum') {
    errorString += ` '[${error.params.allowedValues}]'`;
  }

  return errorString;
}
