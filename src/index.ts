const winston = require('winston');
const util = require('util');
const TransportStackdriver = require('./transports/stackdriver.ts');

const { format } = winston;
const { levels, colors } = winston.config.syslog;

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

function getTransports(options) {
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

interface Options {
  transports: {
    console: boolean;
    stackdriver: boolean;
  };
  projectId: string;
  logName: string;
}

function createLogger(options: Options) {
  return winston.createLogger({
    levels,
    transports: getTransports(options),
    level: 'debug',
    format: formatter,
    exitOnError: false,
  });
}

module.exports = { createLogger };
