import { Log } from '@google-cloud/logging';
import { createLogger } from './index';

const processStdOutWriteMock = jest
  .spyOn(process.stdout, 'write')
  .mockImplementation(() => true);

describe('logger with output to console', () => {
  const logger = createLogger({ console: true });

  beforeEach(() => {
    processStdOutWriteMock.mockClear();
  });

  test('should log debug string', () => {
    logger.debug('debug');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/debug/);
  });

  test('should log debug error', () => {
    logger.debug(new Error('debug'));
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/Error: debug/);
  });

  test('should log debug object', () => {
    logger.debug({ testProp: 'testValue' });
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(
      /{ testProp: .*'testValue'.* }/
    );
  });

  test('should log info', () => {
    logger.info('info');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/info/);
  });

  test('should log notice', () => {
    logger.notice('notice');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/notice/);
  });

  test('should log warning', () => {
    logger.warning('warning');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/warning/);
  });

  test('should log error', () => {
    logger.error('error');
  });

  test('should log crit', () => {
    logger.crit('crit');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/crit/);
  });

  test('should log alert', () => {
    logger.alert('alert');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/alert/);
  });

  test('should log emerg', () => {
    logger.emerg('emerg');
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/emerg/);
  });

  test('should log emerg multiple arguments', () => {
    logger.emerg('emerg', 'second', 'third', new Error('test err'));
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(
      /emerg.*second.*third.*Error: test err\n {4}at Object.test/
    );
  });

  test('should not log exception', () => {
    process.emit('uncaughtException', new TypeError());
    expect(processStdOutWriteMock).not.toHaveBeenCalled();
  });
});

describe('logger with output to stackdriver', () => {
  const logger = createLogger({
    console: false,
    stackdriver: { projectId: 'test', logName: 'test' },
  });

  const logWriteMock = jest
    .spyOn(Log.prototype, 'write')
    .mockImplementation(() => {});

  beforeEach(() => {
    logWriteMock.mockClear();
  });

  afterAll(() => {
    logWriteMock.mockRestore();
  });

  test('should log debug', () => {
    const message = 'debug';
    logger.debug(message);
    const arg = logWriteMock.mock.calls[0][0];
    const entry = Array.isArray(arg) ? arg[0] : arg;
    expect(entry.toJSON()).toMatchObject({
      jsonPayload: { fields: { message: { stringValue: message } } },
    });
  });

  test('should log single entry to stackdriver', () => {
    logger.emerg('emerg', 'second', 'third');
    const arg = logWriteMock.mock.calls[0][0];
    expect(Array.isArray(arg)).toEqual(false);
  });

  test('should log format error', () => {
    logger.error(new Error('test'));
    const arg = logWriteMock.mock.calls[0][0];
    const entry = Array.isArray(arg) ? arg[0] : arg;
    expect(entry.toJSON()).toMatchObject({
      jsonPayload: {
        fields: {
          message: { stringValue: expect.stringContaining('Error: test') },
        },
      },
    });
  });
});

describe('log exceptions', () => {
  const exitMock = jest.fn();
  beforeEach(() => {
    processStdOutWriteMock.mockClear();
  });

  beforeAll(() => {
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
    Object.defineProperty(process, 'exit', { value: exitMock });
    createLogger({
      console: true,
      logExceptionLevel: 'alert',
      logRejectionLevel: 'crit',
    });
  });

  afterAll(() => {
    process.removeAllListeners('uncaughtException');
    process.removeAllListeners('unhandledRejection');
  });

  test('should log uncaughtException', () => {
    process.emit('uncaughtException', new TypeError());
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(/TypeError/);
  });

  test('should exit on exception', () => {
    process.emit('uncaughtException', new TypeError());
    expect(exitMock).toHaveBeenCalled();
  });

  test('should log unhandledRejection', async () => {
    process.emit('unhandledRejection', 'reject', new Promise(() => {}));
    expect(processStdOutWriteMock.mock.calls[0][0]).toMatch(
      /Unhandled Rejection at: Promise { <pending> } reason: reject/
    );
  });
});
