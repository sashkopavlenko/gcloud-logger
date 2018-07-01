const { createLogger } = require('../dist');

const severityLevels = {
  debug: 100,
  info: 200,
  notice: 300,
  warning: 400,
  error: 500,
  crit: 600,
  alert: 700,
  emerg: 800,
};

describe('Logger', () => {
  test('Create logger without options', () => {
    expect(createLogger).toThrow();
  });

  test('Create logger with empty options', () => {
    const logger = createLogger({});
    Object.keys(severityLevels).forEach((level) => {
      expect(logger).toHaveProperty(level);
    });
  });
});
