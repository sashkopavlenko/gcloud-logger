import { Format, TransformableInfo, TransformFunction } from 'logform';
import { SPLAT } from 'triple-beam';
import * as util from 'util';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import TransportStackdriver from './transports/stackdriver';

const { format } = winston;
const { levels, colors } = winston.config.syslog;

winston.addColors(colors);

interface Options {
  console: boolean;
  stackdriver?: {
    projectId: string;
    logName: string;
  };
}

export function createLogger(options: Options): winston.Logger {
  return winston.createLogger({
    levels,
    transports: getTransports(options),
    format: format.combine(format(preserveStack)()),
    level: 'debug',
    exitOnError: false,
  });
}

function getTransports({
  console: consoleOutput,
  stackdriver,
}: Options): Transport[] {
  const transports: Transport[] = [];
  const config: Transport.TransportStreamOptions = { handleExceptions: true };

  if (consoleOutput) {
    transports.push(
      new winston.transports.Console({ ...config, format: getConsoleFormat() })
    );
  }

  if (stackdriver) {
    transports.push(
      new TransportStackdriver(
        { ...config, format: format.combine(format(preserveSplat(false))()) },
        stackdriver
      )
    );
  }
  return transports;
}

function getConsoleFormat(): Format {
  return format.combine(
    format.colorize(),
    format.timestamp(),
    format(preserveSplat(true))(),
    format.printf(formatPrint)
  );
}

function preserveSplat(colors: boolean): TransformFunction {
  return (info: TransformableInfo): TransformableInfo => {
    info.preservedSplat = info[SPLAT]
      ? info[SPLAT].map(<T>(a: T) => util.inspect(a, { colors }))
      : [''];
    return info;
  };
}

function formatPrint(info: TransformableInfo): string {
  const { level, message, timestamp, preservedStack, preservedSplat } = info;

  const msg =
    typeof message === 'object'
      ? util.inspect(message, { colors: true })
      : message;

  return util.format(
    timestamp,
    level,
    preservedStack || msg,
    ...preservedSplat
  );
}

function preserveStack(info: TransformableInfo): TransformableInfo {
  info.preservedStack = info.stack;
  return info;
}
