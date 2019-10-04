export type Level =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'crit'
  | 'alert'
  | 'emerg';

export type Log = (level: Level, ...messages: any[]) => Promise<any> | void;

export interface StackdriverOptions {
  readonly projectId: string;
  readonly logName: string;
}

export interface Options {
  readonly console?: boolean;
  readonly stackdriver?: StackdriverOptions;
  readonly logExceptionLevel?: Level;
  readonly logRejectionLevel?: Level;
}
