# gcloud-logger

[![Build Status](https://travis-ci.com/a-pavlenko/gcloud-logger.svg?branch=master)](https://travis-ci.com/a-pavlenko/gcloud-logger)

Simple logger wrapper for GCP with winston under the hood.

## Installation

```bash
npm install gcloud-logger
```

## Usage

To initialize the logger pass the options object to the method `createLogger`.

Configuration is simple and consists of next params:

- `console` - writing logs to stdout or stderr which depends on level;
- `stackdriver` - sending logs to Stackdriver. Note: application must have access to your GCP project and permission to write logs.

You can omit any of these properties or set the value to falsy if it's not needed.

```js
const gcloudLogger = require('gcloud-logger');

const logger = gcloudLogger.createLogger({
  console: true,
  stackdriver: { projectId: 'gcloud-project-ID', logName: 'log-name' },
});

logger.debug('Debug');
logger.error(new Error('Something went wrong'));
```

## Viewing logs on Stackdriver

![Stackdriver logs screenshot](https://image.ibb.co/dtAHgy/stackdriver_logs.png)

## Levels

Available logging levels and corresponding Stackdriver severity:

```js
logger.debug('Debug');
logger.info('Info');
logger.notice('Info');
logger.warning('Warning');
logger.error('Error');
logger.crit('Fatal');
logger.alert('Fatal');
logger.emerg('Fatal');
```
