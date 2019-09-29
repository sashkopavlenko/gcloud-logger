import consoleLog from './transports/console';
import stackdriver from './transports/stackdriver';

const logger = (options: Options) => {
  const transports: Log[] = [];

  if (options && options.console) {
    transports.push(consoleLog);
  }

  if (options && options.stackdriver) {
    transports.push(stackdriver(options.stackdriver));
  }

  const log: Log = (level, messages) => {
    transports.forEach(transportLog => transportLog(level, messages));
  };

  return log;
};

export const createLogger = (options: Options) => {
  const log = logger(options);
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
