import { ObjectSchema } from 'joi';
import { InvalidEndpointCfgError } from '../error';
import { EndpointCfg } from '../../cfg/model';

/** */
export class JoiEndpointCfgValidator {
  /** */
  static validate(
    endpointCfg: EndpointCfg<unknown>,
    schema: ObjectSchema,
  ): void {
    const result = schema.validate(endpointCfg.cfg);
    if (result.error) {
      throw new InvalidEndpointCfgError(
        `Invalid endpoint ${endpointCfg.name} configuration: ` +
        `${result.error.message}`,
      );
    }
  }
}