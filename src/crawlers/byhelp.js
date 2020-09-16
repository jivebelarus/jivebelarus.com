const logger = require('../logger')('byhelp');
const config = require('config');
const sum = require('lodash/sum');

const byhelp = async ({ browser, eu, usd }) => {
    logger.debug(config.byhelp);

    const values = await Promise.all([
    (async () => {
        return 2870696; // ended
        const page = await browser.newPage();
        logger.debug('fb page opened');
        await page.goto(config.byhelp.fb, { waitUntil: 'networkidle2' });
        logger.debug('fb page loaded');
        const progress_card = await page.waitForSelector('#progress_card');
        const text = await progress_card.evaluate(node => node.innerText);
        logger.debug('fb', text)
        const value = await progress_card.evaluate(node => node.innerText.match(/€(\d[\d,]+)\s/)[1].replace(/,/g,''));
        logger.info('fb', value, 'eu');
        const in_byn = Number(value) * eu;
        const in_usd = Number(in_byn) / usd;
        logger.debug('fb', in_usd, 'usd');
        await page.close();
        return in_usd;
    })(),
    (async () => {
        const page = await browser.newPage();
        logger.debug('pp page opened');
        await page.goto(config.byhelp.pp, { waitUntil: 'networkidle2' });
        logger.debug('pp page loaded');
        const progress_card = await page.waitForSelector('[class^=money__money-big]');
        const text = await progress_card.evaluate(node => node.innerText);
        logger.debug('pp', text)
        const value = await progress_card.evaluate(node => node.innerText.match(/([\d.,]+)\sEUR/)[1].replace('.','').replace(',','.'));
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

module.exports = byhelp;