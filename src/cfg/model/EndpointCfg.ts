/** */
export interface EndpointCfg<T> {
  /** Endpoint type. */
  type: string;

  /** Endpoint name. */
  name: string;

  /** Endpoint configuration. */
  cfg: T;
}