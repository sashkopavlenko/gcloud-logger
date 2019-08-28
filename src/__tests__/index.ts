import { Log } from '@google-cloud/logging';
import { createLogger } from '../index';

const exitMock = jest.fn();
Object.defineProperty(process, 'exit', { value: exitMock });

class Exception extends TypeError {
  exception: boolean;

  constructor(message: string) {
    super(message);
    this.exception = true;
  }
}

describe('logger without options', () => {
  test('logger should throw an error', () => {
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

  test('should print an error on attempt to write logs', () => {
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

  let output = '';
  let processStdOutWriteMock: jest.SpyInstance;

  beforeAll(() => {
    processStdOutWriteMock = jest.spyOn(process.stdout, 'write');
    processStdOutWriteMock.mockImplementation(message => {
      output = message;
    });
  });

  beforeEach(() => {
    output = '';
  });

  afterAll(() => {
    processStdOutWriteMock.mockRestore();
  });

  test('should log debug string', () => {
    logger.debug('debug');
    expect(output).toMatch(/debug/);
  });

  test('should log debug error', () => {
    logger.debug(new Error('debug'));
    expect(output).toMatch(/Error: debug/);
  });

  test('should log debug object', () => {
    logger.debug({ testProp: 'testValue' });
    expect(output).toMatch(/{ testProp: .*'testValue'.* }/);
  });

  test('should log info', () => {
    logger.info('info');
    expect(output).toMatch(/info/);
  });

  test('should log notice', () => {
    logger.notice('notice');
    expect(output).toMatch(/notice/);
  });

  test('should log warning', () => {
    logger.warning('warning');
    expect(output).toMatch(/warning/);
  });

  test('should log error', () => {
    logger.error('error');
  });

  test('should log crit', () => {
    logger.crit('crit');
    expect(output).toMatch(/crit/);
  });

  test('should log alert', () => {
    logger.alert('alert');
    expect(output).toMatch(/alert/);
  });

  test('should log emerg', () => {
    logger.emerg('emerg');
    expect(output).toMatch(/emerg/);
  });

  test('should log emerg multiple arguments', () => {
    logger.emerg('emerg', 'second', 'third', new Error('test err'));
    expect(output).toMatch(
      /emerg .*second.*third.*Error: test err\n {4}at Object.test/
    );
  });
});

describe('logger with output to stackdriver', () => {
  const logger = createLogger({
    console: false,
    stackdriver: { projectId: 'test', logName: 'test' },
  });

  let output = '';
  let logWriteMock: jest.SpyInstance;

  beforeAll(() => {
    logWriteMock = jest.spyOn(Log.prototype, 'write');
    logWriteMock.mockImplementation(({ data }) => {
      output = data.message;
    });
  });

  beforeEach(() => {
    exitMock.mockClear();
    output = '';
  });

  afterAll(() => {
    logWriteMock.mockRestore();
  });

  test('should log debug', () => {
    logger.debug('debug');
    expect(output).toMatch('debug');
  });

  test('should log info', () => {
    logger.info('info');
    expect(output).toMatch(/info/);
  });

  test('should log notice', () => {
    logger.notice('notice');
    expect(output).toMatch(/notice/);
  });

  test('should log warning', () => {
    logger.warning('warning');
    expect(output).toMatch(/warning/);
  });

  test('should log error', () => {
    logger.error('error');
    expect(output).toMatch(/error/);
  });

  test('should log crit', () => {
    logger.crit('crit');
    expect(output).toMatch(/crit/);
  });

  test('should log alert', () => {
    logger.alert('alert');
    expect(output).toMatch(/alert/);
  });

  test('should log emerg', () => {
    logger.emerg('emerg');
    expect(output).toMatch(/emerg/);
  });

  test('should log exception', () => {
    logger.debug(new Exception('TestException'));
    expect(output).toMatch(/TypeError: TestException/);
  });

  test('should exit on exception', async () => {
    await logger.debug(new Exception('TestException'));
    expect(exitMock).toHaveBeenCalledTimes(1);
  });

  test('should log an error occured while sending to stackdriver', done => {
    logWriteMock
      .mockImplementationOnce(() => {
        throw new Error('Test');
      })
      .mockImplementationOnce(({ data }) => {
        output = data.message;
        expect(output).toMatch(/Error: Test/);
        done();
      });
    logger.debug('debug');
  });

  test('should log emerg multiple arguments to stackdriver', () => {
    logger.emerg('emerg', 'second', 'third', new Error('test err'));
    expect(output).toMatch(
      /emerg .*second.*third.*Error: test err\n {4}at Object.test/
    );
  });
});
