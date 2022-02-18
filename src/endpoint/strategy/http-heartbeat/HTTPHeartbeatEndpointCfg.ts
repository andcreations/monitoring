/** */
export interface HTTPHeartbeatEndpointCfg {
  /** URL to check.*/
  url: string;

  /** Interval between heartbeats. */
  interval: number;
}