const fetch = require('node-fetch');
const config = require('config');
const sum = require('lodash/sum');
const logger = require('../logger')('mediasol');

const mediasol = async ({ browser, eu, usd }) => {
  logger.debug(config.mediasol);

  const values = await Promise.all([
    (async () => {
      const response = await fetch(config.mediasol.url).then(res => res.json());
      logger.debug(response);
      const { counts } = response.references;
      logger.debug('donations:', counts.total_donations);
      const value = Number(counts.amount_raised_unattributed);
      logger.info('gofundme', value, 'eu');
      const in_byn = Number(value) * eu;
      const in_usd = Number(in_byn) / usd;
      logger.debug('gofundme', in_usd, 'usd');
      return in_usd;
    })(),
    (async () => {
      const page = await browser.newPage();
      logger.debug('pp page opened');
      await page.goto(config.mediasol.pp, { waitUntil: 'networkidle2' });
      logger.debug('pp page loaded');
      const progress_card = await page.waitForSelector('[class^=money__money-big]');
      const text = await progress_card.evaluate(node => node.innerText);
      logger.debug('pp', text);
      const value = await progress_card.evaluate(node => node.innerText.match(/([\d.,]+)\sEUR/)[1].replace('.','').replace(',','.'))
      logger.info('pp', value, 'eu');
      const in_byn = Number(value) * eu;
      const in_usd = Number(in_byn) / usd;
      logger.debug('pp', in_usd, 'usd');
      await page.close();
      return in_usd;
    })(),
  ]);
  const total = sum(values);
  logger.debug(total, 'total');
  return total;
}

module.exports = mediasol;