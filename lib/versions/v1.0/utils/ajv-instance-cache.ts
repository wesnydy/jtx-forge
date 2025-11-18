import Ajv from 'ajv';
import addFormats from 'ajv-formats';

const ajvInstanceCache = new Ajv({ allErrors: true, verbose: true });
addFormats(ajvInstanceCache);

export default ajvInstanceCache;
