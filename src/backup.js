const fs = require('fs');
const Path = require('path');
const logger = require('./logger.js')('backup');

const touch = require('./touch');

const backup = async (fn, name) => {
  logger.debug(name);
  const path = Path.join('backup', name);
  touch(path);
  let backup_value = fs.readFileSync(path, 'utf8');
  backup_value = Number(backup_value);
  logger.info(name, backup_value);
  try {
    const value = await fn();
    logger.debug(name, value);
    fs.writeFileSync(path, String(value), 'utf8');
    return value;
  } catch (error) {
    logger.warn(name)
    logger.error(error);
    return backup_value;
  }
}

module.exports = backup;