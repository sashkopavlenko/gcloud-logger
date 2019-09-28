import * as util from 'util';

interface Colors {
  readonly [key: string]: string;
}

interface ColorsLevelMap {
  readonly [key: string]: string;
}

const colors: Colors = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
};

const colorsLevelMap: ColorsLevelMap = {
  debug: 'cyan',
  info: 'blue',
  notice: 'yellow',
  warning: 'yellow',
  error: 'red',
  crit: 'red',
  alert: 'red',
  emerg: 'red',
};

const colorize = (text: string, color: string) =>
  `${colors[color]}${text}${colors.reset}`;

const formatPrint = (level: Level, ...rest: any[]): string => {
  const timestamp = new Date().toLocaleString();

  const message = rest
    .map(msg => util.inspect(msg, { colors: true }))
    .join(' ');

  return util.format(
    colorize(timestamp, 'dim'),
    colorize(level, colorsLevelMap[level]),
    message,
    '\n'
  );
};

const log = (level: Level, ...rest: any[]) => {
  const message = formatPrint(level, ...rest);
  process.stdout.write(message);
};
export default log;
