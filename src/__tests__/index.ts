import { createLogger } from '../index';

describe('logger without options', () => {
  test('logger throws an error', () => {
    expect(createLogger).toThrow();
  });
});

describe('logger without transports', () => {
  const logger = createLogger({ console: false });
  let output = '';
  let expectedOutput = '';

  const error = '[winston] Attempt to write logs with no transports %j';
  for (let i = 0; i < 8; i += 1) {
    expectedOutput += error;
  }
  const consoleError = console.error;

  beforeAll(() => {
    console.error = jest.fn(message => {
      output += message;
    });
  });

  afterAll(() => {
    console.error = consoleError;
  });

  test('error should be printed on attemt to write logs', () => {
    logger.debug('debug');
    logger.info('info');
    logger.notice('notice');
    logger.warning('warning');
    logger.error('error');
    logger.crit('crit');
    logger.alert('alert');
    logger.emerg('emerg');

    expect(output).toMatch(expectedOutput);
  });
});

describe('logger with output to console', () => {
  const logger = createLogger({ console: true });

  let errOutput = '';
  let output = '';
  const processStdErrWrite = process.stderr.write;
  const processStdOutWrite = process.stdout.write;

  beforeAll(() => {
    process.stderr.write = jest.fn(message => {
      errOutput = message;
    });
    process.stdout.write = jest.fn(message => {
      output = message;
    });
  });

  beforeEach(() => {
    output = '';
  });

  afterAll(() => {
    process.stderr.write = processStdErrWrite;
    process.stdout.write = processStdOutWrite;
  });

  test('log debug', () => {
    logger.debug('debug');
    expect(errOutput).toMatch(/debug/);
  });
  test('log info', () => {
    logger.info('info');
    expect(output).toMatch(/info/);
  });
  test('log notice', () => {
    logger.notice('notice');
    expect(output).toMatch(/notice/);
  });
  test('log warning', () => {
    logger.warning('warning');
    expect(output).toMatch(/warning/);
  });
  test('log error', () => {
    logger.error('error');
    expect(errOutput).toMatch(/error/);
  });
  test('log crit', () => {
    logger.crit('crit');
    expect(output).toMatch(/crit/);
  });
  test('log alert', () => {
    logger.alert('alert');
    expect(output).toMatch(/alert/);
  });
  test('log emerg', () => {
    logger.emerg('emerg');
    expect(output).toMatch(/emerg/);
  });
});
