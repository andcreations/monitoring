import { Endpoint } from './Endpoint';

/** */
export abstract class HeartbeatEndpoint<T> extends Endpoint<T> {
  /** Timeout to the next check. */
  private checkTimeout: NodeJS.Timeout;

  /** */
  protected startHeartbeat(): void {
    this.checkTimeout = setTimeout(() => this.check(), this.getInterval());
  }

  /** */
  protected stopHeartbeat(): void {
    if (this.checkTimeout) {
      clearTimeout(this.checkTimeout);
      delete this.checkTimeout;
    }
  }

  /** */
  private async check(): Promise<void> {
    await this.checkEndpoint();
    this.checkTimeout = setTimeout(
      () => this.check(),
      this.getInterval(),
    );
  }

  /** */
  protected abstract getInterval(): number;

  /** */
  protected abstract checkEndpoint(): Promise<void>;
}