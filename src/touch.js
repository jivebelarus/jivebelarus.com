const fs = require('fs');

const touch = path => {
  const time = new Date();
  try {
    fs.utimesSync(path, time, time);
  } catch (err) {
    fs.closeSync(fs.openSync(path, 'w'));
  }
}

module.exports = touch;