# gcloud-logger

# Installation

`npm install gcloud-logger`

# Example Usage

```
const gcloudLogger = require('gcloud-logger');

const logger = gcloudLogger.createLogger({
  console: true,
  stackdriver: { projectId: 'gcloud-project-ID', logName: 'log-name' },
});

logger.debug('Debug');
logger.warn(new Error('Warning!'));
```

# Levels

Available logging levels and corresponding Stackdriver severity:

```
logger.debug('Debug');
logger.info('Info');
logger.notice('Info');
logger.warning('Warning');
logger.error('Error');
logger.crit('Fatal');
logger.alert('Fatal');
logger.emerg('Fatal');
```
