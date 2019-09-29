import { Logging } from '@google-cloud/logging';
import * as util from 'util';

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

  return (level: Level, messages: any[]) => {
    const metadata = {
      severity: severityLevels[level],
      resource: { type: 'global' },
    };

    const message = messages.map(msg => util.inspect(msg)).join(' ');
    const payload = {
      message,
      serviceContext: { service: logName },
    };
    const entry = log.entry(metadata, payload);
    log.write(entry);
  };
};

export default stackdriverLogger;
