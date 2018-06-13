import * as winston from 'winston';
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

function formatPrint(info) {
  const { level, message, timestamp, stack } = info;
  const msg = typeof message === 'object' ? util.inspect(message) : message;
  return `${timestamp} ${level} ${stack || msg}`;
}

const formatter = format.combine(
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
    level: 'debug',
    format: formatter,
    exitOnError: false,
  });
}

export default { createLogger };
