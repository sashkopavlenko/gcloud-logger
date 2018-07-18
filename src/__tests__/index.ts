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

  test('error should be printed on attemt to write logs', () => {
    const consoleErrorMock = jest.spyOn(console, 'error');
    consoleErrorMock.mockImplementation(message => {
      output += message;
    });

    logger.debug('debug');
    logger.info('info');
    logger.notice('notice');
    logger.warning('warning');
    logger.error('error');
    logger.crit('crit');
    logger.alert('alert');
    logger.emerg('emerg');

    consoleErrorMock.mockRestore();
    expect(output).toMatch(expectedOutput);
  });
});

describe('logger with output to console', () => {
  const logger = createLogger({ console: true });

  let errOutput = '';
  let output = '';
  let processStdErrWriteMock: jest.SpyInstance;
  let processStdOutWriteMock: jest.SpyInstance;

  beforeAll(() => {
    processStdErrWriteMock = jest.spyOn(process.stderr, 'write');
    processStdErrWriteMock.mockImplementation(message => {
      errOutput = message;
    });

    processStdOutWriteMock = jest.spyOn(process.stdout, 'write');
    processStdOutWriteMock.mockImplementation(message => {
      output = message;
    });
  });

  beforeEach(() => {
    output = '';
    errOutput = '';
  });

  afterAll(() => {
    processStdErrWriteMock.mockRestore();
    processStdOutWriteMock.mockRestore();
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
