const logger = require('./logger')('usd');
const config = require('config');
const fetch = require('node-fetch');

const usd = async () => {
    // return 2.6342;
    const response = await fetch(config.nbrb.usd).then(res => res.json());
    logger.debug(response);
    const { Cur_OfficialRate: rate } = response;
    logger.info('rate:', rate);
    return rate;
}

module.exports = usd;