import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { TransformableInfo } from 'logform';
import { Logging, Log, Entry } from '@google-cloud/logging';

interface StackdriverLogOptions {
  projectId: string;
  logName: string;
}

interface SeverityLevels {
  [key: string]: number;
}

const severityLevels: SeverityLevels = {
  debug: 100,
  info: 200,
  notice: 300,
  warning: 400,
  error: 500,
  crit: 600,
  alert: 700,
  emerg: 800,
};

export default class StackdriverTransport extends Transport {
  logName: string;
  projectId: string;
  logger: Log;

  constructor(
    options: Transport.TransportStreamOptions,
    { projectId, logName }: StackdriverLogOptions
  ) {
    super(options);
    this.logName = logName;
    this.projectId = projectId;
    this.logger = this.initLogger();
  }

  initLogger() {
    const logging = new Logging({ projectId: this.projectId });
    return logging.log(this.logName);
  }

  prepareEntry({
    message,
    stack,
    noncolorizedLevel: level,
  }: TransformableInfo): Entry {
    const severity = severityLevels[level];
    const metadata = { severity, resource: { type: 'global' } };

    const payload = {
      serviceContext: { service: this.logName },
      message: stack || message,
    };

    return this.logger.entry(metadata, payload);
  }

  async writeLog(
    info: TransformableInfo,
    callback: winston.LogCallback
  ): Promise<void> {
    const entry = this.prepareEntry(info);
    await this.logger.write(entry);
    this.emit('logged', info);
    callback();
    if (info.exception) {
      process.exit(1);
    }
  }

  async log(
    info: TransformableInfo,
    callback: winston.LogCallback
  ): Promise<void> {
    try {
      await this.writeLog(info, callback);
    } catch (e) {
      this.errorHandler(e, callback);
    }
  }

  errorHandler(e: Error, callback: winston.LogCallback) {
    this.logger = this.initLogger();
    const info = {
      level: 'error',
      noncolorizedLevel: 'error',
      stack: e.stack,
      message: e.message,
    };
    this.log(info, callback);
  }
}
