const puppeteer = require('puppeteer');
const config = require('config');
const sum = require('lodash/sum');
const logger = require('./src/logger.js')('app');

const backup = require('./src/backup');
const upload = require('./src/upload');

const get_usd = require('./src/usd');
const get_eu = require('./src/eu');
const get_hp = require('./src/crawlers/hp');
const get_hmr = require('./src/crawlers/hmr');
const get_bysol = require('./src/crawlers/bysol');
const get_byhelp = require('./src/crawlers/byhelp');
const get_mikado = require('./src/crawlers/mikado');
const get_names = require('./src/crawlers/names');
const get_mediasol = require('./src/crawlers/mediasol');

(async () => {
  const [ usd, eu ] = await Promise.all([
    backup(() => get_usd(), 'usd'),
    backup(() => get_eu(), 'eu'),
  ]);
  logger.info({ usd, eu });
  const browser = await puppeteer.launch();
  logger.info('browser launched');
  const values = await Promise.all([
    backup(() => get_hp({ browser, usd, eu }), 'hp'),
    backup(() => get_hmr({ browser, usd, eu }), 'hmr'),
    backup(() => get_bysol({ browser, usd, eu }), 'bysol'),
    backup(() => get_byhelp({ browser, usd, eu }), 'byhelp'),
    backup(() => get_mikado({ browser, usd, eu }), 'mikado'),
    backup(() => get_names({ browser, usd, eu }), 'names'),
    backup(() => get_mediasol({ browser, usd, eu }), 'mediasol'),
  ]);
  browser.close();
  logger.info('browser closed');
  const [
    hp,
    hmr,
    bysol,
    byhelp,
    mikado,
    names,
    mediasol,
  ] = values;
  const total = Math.floor(sum(values));
  logger.info({
    hp,
    hmr,
    bysol,
    byhelp,
    mikado,
    names,
    mediasol,
  });
  logger.info(total, 'total');
  const valuejs = `window.VALUE=${total}; window.UPDATED='${new Date().toISOString()}'`;
  await upload(valuejs);
})();
