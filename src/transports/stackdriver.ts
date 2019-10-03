import * as util from 'util';
import { Logging } from '@google-cloud/logging';

interface SeverityLevels {
  readonly [key: string]: number;
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

const stackdriverLogger = ({ projectId, logName }: StackdriverOptions) => {
  const logging = new Logging({ projectId });
  const log = logging.log(logName, { removeCircular: true });

  const stackdriverLog: Log = (level, ...messages) => {
    const metadata = {
      severity: severityLevels[level],
      resource: { type: 'global' },
    };

    const entries = messages.map(message =>
      log.entry(metadata, {
        message: typeof message === 'object' ? util.inspect(message) : message,
        serviceContext: { service: logName },
      })
    );
    return log.write(entries);
  };

  return stackdriverLog;
};

export default stackdriverLogger;
