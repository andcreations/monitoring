/** */
export interface EndpointFailedToStartBusEvent {
  /** Endpoint name. */
  endpointName: string;

  /** Cause of the failure. */
  error: any;
}