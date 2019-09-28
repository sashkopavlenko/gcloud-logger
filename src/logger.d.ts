interface StackdriverOptions {
  projectId: string;
  logName: string;
}

interface Options {
  console: boolean;
  stackdriver?: StackdriverOptions;
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
