import * as winston from 'winston';
import * as logform from 'logform';
import * as util from 'util';
import TransportStackdriver from './transports/stackdriver';

const { format } = winston;
const { levels, colors } = winston.config.syslog;

interface Options {
  console: boolean;
  stackdriver?: {
    projectId: string;
    logName: string;
  };
}

winston.addColors(colors);

const preserveLevel = format((info: logform.TransformableInfo) => {
  info.noncolorizedLevel = info.level;
  return info;
});

function formatPrint(info: logform.TransformableInfo): string {
  const { level, message, timestamp, stack } = info;
  const msg = typeof message === 'object' ? util.inspect(message) : message;
  return `${timestamp} ${level} ${stack || msg}`;
}

const formatter = format.combine(
  preserveLevel(),
  format.colorize(),
  format.timestamp(),
  format.printf(formatPrint)
);

function getTransports(options: Options) {
  const transports = [];
  const config = { handleExceptions: true };
  if (options.console) {
    transports.push(new winston.transports.Console(config));
  }

  if (options.stackdriver) {
    transports.push(new TransportStackdriver(config, options.stackdriver));
  }

  return transports;
}

function createLogger(options: Options): winston.Logger {
  return winston.createLogger({
    levels,
    transports: getTransports(options),
    format: formatter,
    level: 'debug',
    exitOnError: false,
  });
}

export { createLogger };
