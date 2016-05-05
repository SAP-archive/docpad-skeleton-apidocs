const config = require('config');
const os = require('os');

const _getPlatformName = () => {
  const platform = os.platform();

  return platform === 'darwin' ? 'ios' : platform;
};


const variables = {
  launchUrl: config.get('url'),
  username: config.get('username'),
  accessKey: config.get('accessKey'),
  availableBrowsers: ['firefox', 'chrome', 'all'],
  defaultBrowser : 'firefox',
  availablePlatforms: ['ios', 'linux'],
  defaultPlatform: _getPlatformName()
};

module.exports = variables;
