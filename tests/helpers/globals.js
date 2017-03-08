const config = require('config');

module.exports = {
  waitForConditionTimeout: config.get('waitForConditionTimeout')
};
