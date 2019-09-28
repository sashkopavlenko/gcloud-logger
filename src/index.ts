import consoleLog from './transports/console';
import stackdriver from './transports/stackdriver';

const logger = (options: Options) => (level: Level, ...rest: any[]) => {
  if (options && options.console) {
    consoleLog(level, ...rest);
  }
  if (options && options.stackdriver) {
    const stackdriverLog = stackdriver(options.stackdriver);
    stackdriverLog(level, ...rest);
  }
};

export const createLogger = (options: Options) => {
  const log = logger(options);
  return {
    debug: (...rest: any[]) => log('debug', ...rest),
    info: (...rest: any[]) => log('info', ...rest),
    notice: (...rest: any[]) => log('notice', ...rest),
    warning: (...rest: any[]) => log('warning', ...rest),
    error: (...rest: any[]) => log('error', ...rest),
    crit: (...rest: any[]) => log('crit', ...rest),
    alert: (...rest: any[]) => log('alert', ...rest),
    emerg: (...rest: any[]) => log('emerg', ...rest),
    log,
  };
};
