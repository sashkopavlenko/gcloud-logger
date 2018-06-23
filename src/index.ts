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

function formatPrint({
  level,
  message,
  timestamp,
  stack,
}: logform.TransformableInfo): string {
  const msg = typeof message === 'object' ? util.inspect(message) : message;
  return `${timestamp} ${level} ${stack || msg}`;
}

const formatter = format.combine(
  preserveLevel(),
  format.colorize(),
  format.timestamp(),
  format.printf(formatPrint)
);

function getTransports({ console: consoleOutput, stackdriver }: Options) {
  const transports = [];
  const config = { handleExceptions: true };
  if (consoleOutput) {
    transports.push(new winston.transports.Console(config));
  }

  if (stackdriver) {
    transports.push(new TransportStackdriver(config, stackdriver));
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
