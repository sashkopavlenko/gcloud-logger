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

const colorsLevelMap = {
  debug: <Color>'cyan',
  info: <Color>'blue',
  notice: <Color>'yellow',
  warning: <Color>'yellow',
  error: <Color>'red',
  crit: <Color>'red',
  alert: <Color>'red',
  emerg: <Color>'red',
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

const log = (level: Level, messages: any[]) => {
  const message = formatPrint(level, messages);
  process.stdout.write(message);
};
export default log;
