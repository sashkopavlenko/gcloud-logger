import * as util from 'util';
import consoleLog from './transports/console';
import stackdriver from './transports/stackdriver';

const logger = (options: Options) => {
  const transports: Log[] = [];

  if (options.console) {
    transports.push(consoleLog);
  }

  if (options.stackdriver) {
    transports.push(stackdriver(options.stackdriver));
  }

  const log: Log = (level, messages) => {
    transports.forEach(transportLog => transportLog(level, messages));
  };

  return log;
};

const addUncaughtExceptionHandler = (
  { logExceptionLevel }: Options,
  log: Log
) => {
  if (logExceptionLevel) {
    process.on('uncaughtException', error => {
      log(logExceptionLevel, [error]);
      process.exit(1);
    });
  }
};

const addUnhandledRejectionHandler = (
  { logRejectionLevel }: Options,
  log: Log
) => {
  if (logRejectionLevel) {
    process.on('unhandledRejection', (reason, promise) => {
      const message = util.format(
        'Unhandled Rejection at:',
        promise,
        'reason:',
        reason
      );
      log(logRejectionLevel, [message]);
    });
  }
};

export const createLogger = (options: Options) => {
  const log = logger(options);

  addUncaughtExceptionHandler(options, log);
  addUnhandledRejectionHandler(options, log);

  return {
    debug: (...messages: any[]) => log('debug', messages),
    info: (...messages: any[]) => log('info', messages),
    notice: (...messages: any[]) => log('notice', messages),
    warning: (...messages: any[]) => log('warning', messages),
    error: (...messages: any[]) => log('error', messages),
    crit: (...messages: any[]) => log('crit', messages),
    alert: (...messages: any[]) => log('alert', messages),
    emerg: (...messages: any[]) => log('emerg', messages),
    log,
  };
};
