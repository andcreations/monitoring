/** */
export interface EndpointDisconnectedBusEvent {
  /** Endpoint name. */
  endpointName: string;

  /** Cause of failure. */
  error?: any;
}