/** */
export interface EndpointFailedToStopBusEvent {
  /** Endpoint name. */
  endpointName: string;

  /** Cause of the failure. */
  error: any;
}