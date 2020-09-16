const logger = require('../logger')('names');
const config = require('config');

const names = async ({ browser, usd }) => {
    return 1086878 / usd; // ended
    logger.debug(config.names);
    const page = await browser.newPage();
    logger.debug('page opened');
    await page.goto(config.names.injured, { waitUntil: 'networkidle2' });
    logger.debug('page loaded');
    const fund_num = await page.waitForSelector('.project-fund__fund-num');
    const text = await fund_num.evaluate(node => node.innerText);
    logger.debug(text);
    const value = await fund_num.evaluate(node => node.innerText.match(/\d[\d\s]+\d/)[0].replace(/\s/g,''))
    logger.info(value, 'byn');
    const in_usd = Number(value) / usd;
    logger.debug(in_usd, 'usd');
    await page.close();
    return in_usd;
}

module.exports = names;