const logger = require('../logger')('hmr');
const config = require('config');
const fetch = require('node-fetch');
const sum = require('lodash/sum');


const humanRightsFoundation = async () => {
    logger.debug(config.hmr);
    const response = await fetch(config.hmr.url).then(res => res.json());
    logger.debug(response);
    const { raisedAmount } = response.campaignGoal;
    logger.info(raisedAmount, 'usd');
    return raisedAmount;
}

module.exports = humanRightsFoundation;