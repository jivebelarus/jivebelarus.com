const fs = require('fs');
const Path = require('path');
const { NodeSSH } = require('node-ssh');
const config = require('config');
const touch = require('./touch');
const logger = require('./logger')('upload');

const upload = async (content) => {
  logger.debug(config.upload);
  const destination = Path.join(config.upload.front, config.upload.valuejs);
  logger.debug(destination);
  touch(destination);
  logger.debug('file touched');
  fs.writeFileSync(destination, String(content), 'utf8');
  logger.info('file copied');
};

/* SSH
const ssh = new NodeSSH();
const upload = async (content) => {
  logger.debug(config.upload);
  touch(config.upload.valuejs);
  logger.debug('file touched');
  fs.writeFileSync(config.upload.valuejs, String(content), 'utf8');
  logger.debug('file writed locally');
  const { host, username, privateKey } = config.upload;
  const tunnel = await ssh.connect({ host, username, privateKey })
  logger.info('connected');
  const destination = Path.join(config.upload.front, config.upload.valuejs);
  logger.debug(destination);
  await tunnel.putFile(config.upload.valuejs, destination);
  logger.info('file sent');
  await ssh.dispose();
  logger.info('disconnected');
};
*/

module.exports = upload;