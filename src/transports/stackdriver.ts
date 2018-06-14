import * as winston from 'winston';
import * as Transport from 'winston-transport';
import * as logform from 'logform';
import * as Logging from '@google-cloud/logging';

interface StackdriverLogOptions {
  projectId: string;
  logName: string;
}

const severityLevels = {
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
  service: string;
  logger: Logging;

  constructor(
    options: Transport.TransportStreamOptions,
    logOptions: StackdriverLogOptions
  ) {
    super(options);
    const { projectId, logName } = logOptions;
    this.service = logName;

    const logging = new Logging({ projectId });
    this.logger = logging.log(logName);
  }

  prepareEntry(info: logform.TransformableInfo) {
    const { message, stack, noncolorizedLevel: level } = info;
    const severity = severityLevels[level];
    const metadata = { severity, resource: { type: 'global' } };

    const payload = {
      serviceContext: { service: this.service },
      message: stack || message,
    };

    return this.logger.entry(metadata, payload);
  }

  async writeLog(
    info: logform.TransformableInfo,
    callback: winston.LogCallback
  ) {
    const entry = this.prepareEntry(info);
    await this.logger.write(entry);
    this.emit('logged', info);
    callback();
    if (info.exception) {
      process.exit(1);
    }
  }

  async log(info: logform.TransformableInfo, callback: winston.LogCallback) {
    try {
      await this.writeLog(info, callback);
    } catch (e) {
      throw e;
    }
  }
}
