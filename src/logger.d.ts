interface StackdriverOptions {
  readonly projectId: string;
  readonly logName: string;
}

interface Options {
  readonly console?: boolean;
  readonly stackdriver?: StackdriverOptions;
  readonly logExceptionLevel?: Level;
  readonly logRejectionLevel?: Level;
}

type Level =
  | 'debug'
  | 'info'
  | 'notice'
  | 'warning'
  | 'error'
  | 'crit'
  | 'alert'
  | 'emerg';

type Log = (level: Level, messages: any[]) => void;
