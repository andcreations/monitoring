import { EndpointCfg } from '../../../cfg/model';
import { HTTPService } from '../../../http/service';
import {
  HeartbeatEndpoint,
  EndpointContext,
  JoiEndpointCfgValidator,
} from '../../endpoint';
import { HTTPHeartbeatEndpointCfg } from './HTTPHeartbeatEndpointCfg';
import {
  HTTPHeartbeatEndpointCfgSchema,
} from './HTTPHeartbeatEndpointCfgSchema';

/** Log tag. */
const TAG = 'http-heartbeat';

/** */
export class HTTPHeartbeatEndpoint
  extends HeartbeatEndpoint<HTTPHeartbeatEndpointCfg> {
  /** */
  static readonly TYPE = 'http-heartbeat';

  /** */
  constructor(
    endpointCfg: EndpointCfg<HTTPHeartbeatEndpointCfg>,
    context: EndpointContext,
    private readonly httpService: HTTPService,
  ) {
    super(endpointCfg, context);
  }

  /** */
  async start(): Promise<void> {
    this.getLog().info(
      'Starting endpoint',
      TAG,
      {
        name: this.getName(),
        cfg: this.getCfg(),
      },
    );
    this.startHeartbeat();
  }

  /** */
  async stop(): Promise<void> {
    this.getLog().info(
      'Stopping endpoint',
      TAG,
      {
        name: this.getName(),
        cfg: this.getCfg(),
      },
    );
    this.stopHeartbeat();
  }

  /** */
  protected getInterval(): number {
    return this.getCfg().interval;
  }

  /** */
  protected async checkEndpoint(): Promise<void> {
    try {
      await this.httpService.get(this.getCfg().url);
    } catch (error) {
      await this.endpointDisconnected(error);
      return;
    }
    await this.endpointConnected();
  }

  /** */
  static validateCfg(endpointCfg: EndpointCfg<unknown>): EndpointCfg<HTTPHeartbeatEndpointCfg> {
    JoiEndpointCfgValidator.validate(
      endpointCfg,
      HTTPHeartbeatEndpointCfgSchema,
    );
    return endpointCfg as EndpointCfg<HTTPHeartbeatEndpointCfg>;
  }
}