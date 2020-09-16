const logger = require('./logger')('eu');
const config = require('config');
const fetch = require('node-fetch');


const eu = async () => {
    // return 3.1211;
    const response = await fetch(config.nbrb.eu).then(res => res.json());
    logger.debug(response);
    const { Cur_OfficialRate: rate } = response;
    logger.info('rate:', rate);
    return rate;
}

module.exports = eu;