const { serializeError } = require('serialize-error');
const log4js = require('log4js');
const config = require('config');

const exporter = name => {
  if (!name) throw new ReferenceError('no logger name provided');
  const logger = log4js.getLogger(name);
  logger.level = config.app.loglevel;
  const error = logger.error.bind(logger);
  logger.error = (...args) => error(args.map(arg => arg instanceof Error ? serializeError(arg) : arg));
  return logger;
}

module.exports = exporter;