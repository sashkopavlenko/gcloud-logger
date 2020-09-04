# gcloud-logger

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Test Coverage][coveralls-image]][coveralls-url]

A simple lightweight logger for GCP Stackdriver.

## Contents

1. [Usage requirements](#usage-requirements)
2. [Installation](#installation)
3. [Quick start](#quick-start)
4. [Levels](#levels)
5. [uncaughtException and unhandledRejection handlers](#uncaughtexception-and-unhandledrejection-handlers)

## Usage requirements

Requires Node version 10 or higher.

To use Stackdriver logging your application must have access to the GCP project and permission to write logs.

## Installation

```bash
npm install gcloud-logger
```

## Quick start

To initialize the logger pass the options object to the method `createLogger`.

Configuration is simple and consists of next params:

- `console` - writing logs to stdout
- `stackdriver` - sending logs to Stackdriver

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

![Stackdriver logs screenshot](https://image.ibb.co/dtAHgy/stackdriver_logs.png)

## Levels

Available logging levels ([RFC 5424](https://tools.ietf.org/html/rfc5424)) and corresponding Stackdriver severity:

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

## uncaughtException and unhandledRejection handlers

You can add the following properties to your options object to log `uncaughtException` and `unhandledRejection` errors:

```js
const gcloudLogger = require('gcloud-logger');

const logger = gcloudLogger.createLogger({
  console: true,
  logExceptionLevel: 'alert',
  logRejectionLevel: 'crit',
});
```

Note: the logger will exit with `process.exit(1)` after logging `uncaughtException` or `unhandledRejection`.

[npm-image]: https://img.shields.io/npm/v/gcloud-logger.svg
[npm-url]: https://npmjs.org/package/gcloud-logger
[travis-image]: https://travis-ci.com/sashkopavlenko/gcloud-logger.svg?branch=master
[travis-url]: https://travis-ci.com/sashkopavlenko/gcloud-logger
[coveralls-image]: https://coveralls.io/repos/github/sashkopavlenko/gcloud-logger/badge.svg?branch=master
[coveralls-url]: https://coveralls.io/r/sashkopavlenko/gcloud-logger?branch=master
