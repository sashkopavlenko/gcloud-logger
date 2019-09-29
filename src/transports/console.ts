import * as util from 'util';

type Color = 'reset' | 'dim' | 'red' | 'yellow' | 'blue' | 'cyan';

const colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const colorsLevelMap: Record<Level, Color> = {
  debug: 'cyan',
  info: 'blue',
  notice: 'yellow',
  warning: 'yellow',
  error: 'red',
  crit: 'red',
  alert: 'red',
  emerg: 'red',
};

const colorize = (text: string, color: Color) =>
  `${colors[color]}${text}${colors.reset}`;

const formatPrint = (level: Level, messages: any[]): string => {
  const timestamp = new Date().toLocaleString();

  const message = messages
    .map(msg => util.inspect(msg, { colors: true }))
    .join(' ');

  return util.format(
    colorize(timestamp, 'dim'),
    colorize(level, colorsLevelMap[level]),
    message,
    '\n'
  );
};

const log: Log = (level, messages) => {
  const message = formatPrint(level, messages);
  process.stdout.write(message);
};

export default log;
