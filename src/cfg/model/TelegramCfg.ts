/** */
export interface TelegramCfg {
  /** Bot token. */
  token: string;

  /** Milliseconds after which to retry sending a message. */
  messageRetryDelay: number;

  /** Time in milliseconds between getting updates (messages). */
  updatesInterval: number;

  /** Names of users allowed to interact with the bot. */
  allowedUsers: string[];
}