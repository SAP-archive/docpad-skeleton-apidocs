const config = require('config');

module.exports = {
  waitForConditionTimeout: config.get('waitForConditionTimeout'),
  envLink: process.env.NODE_ENV=== 'prod' ? '.yaas.io/' : '.stage.yaas.io/'
};
