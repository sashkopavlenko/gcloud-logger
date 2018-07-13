import { createLogger } from '../index';

describe('Without options', () => {
  test('Create logger without options', () => {
    expect(createLogger).toThrow();
  });
});

describe('Without transports', () => {
  const logger = createLogger({ console: false });

  test('Debug', () => {
    expect(() => logger.debug('debug')).not.toThrow();
  });
  test('Info', () => {
    expect(() => logger.debug('info')).not.toThrow();
  });
  test('Notice', () => {
    expect(() => logger.debug('notice')).not.toThrow();
  });
  test('Warning', () => {
    expect(() => logger.debug('warning')).not.toThrow();
  });
  test('Error', () => {
    expect(() => logger.debug('error')).not.toThrow();
  });
  test('Crit', () => {
    expect(() => logger.debug('crit')).not.toThrow();
  });
  test('Alert', () => {
    expect(() => logger.debug('alert')).not.toThrow();
  });
  test('Emerg', () => {
    expect(() => logger.debug('emerg')).not.toThrow();
  });
});
