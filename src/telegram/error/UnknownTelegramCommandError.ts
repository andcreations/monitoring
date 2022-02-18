import { MonitoringError } from '../../error';

/** */
export class UnknownTelegramCommandError extends MonitoringError {
  /** */
  static readonly CODE = 'unknown-telegram-command-error';
  
  /** */
  constructor(commandName: string) {
    super(UnknownTelegramCommandError.CODE, `Unknown command ${commandName}`);
  }
}