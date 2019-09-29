import consoleLog from './transports/console';
import stackdriver from './transports/stackdriver';

const logger = (options: Options) => (level: Level, messages: any[]) => {
  if (options && options.console) {
    consoleLog(level, messages);
  }
  if (options && options.stackdriver) {
    const stackdriverLog = stackdriver(options.stackdriver);
    stackdriverLog(level, messages);
  }
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
