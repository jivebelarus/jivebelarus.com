const logger = require('../logger')('hp');
const config = require('config');
const fetch = require('node-fetch');
const sum = require('lodash/sum');


const honestPeople = async ({ usd }) => {
    logger.debug(config.hp);
    const response = await fetch(config.hp.url).then(res => res.json());
    logger.debug('peoples:', response.length);
    const collected = response.map(({ collected }) => Number(collected));
    const total_collected = sum(collected);
    logger.info(total_collected, 'byn');
    const in_usd = total_collected / usd;
    logger.debug(in_usd, 'usd');
    return in_usd;
}

module.exports = honestPeople;