const innerConfig = require('./variables');

const availableBrowsers = innerConfig.availableBrowsers;
const availablePlatforms = innerConfig.availablePlatforms;

const defaultBrowser = innerConfig.defaultBrowser;
const defaultPlatform = innerConfig.defaultPlatform;

const _isBrowserNameValid = (browser) => {
  return availableBrowsers.indexOf(browser) !== -1;
};

const _isPlatformValid = (platform) => {
  return availablePlatforms.indexOf(platform) !== -1;
};


const _combineAllEnviromentsByPlatform = (platform) => {

  const allEnviromentsArr = availableBrowsers
  .filter((el) => {
    return el !== 'all';
  })
  .map((el) => {
    return `${el}_${platform}`;
  });

  return allEnviromentsArr.join(',');
};

const _makeEnviromentName = (browser, platform) => {
  return `${browser}_${platform}`;
};

/**
 * Function determine if given browser is valid according to settings
 * @param {string} [browser] - specified browser for tests
 */
const _determineBrowser = (browser) => {
  return (_isBrowserNameValid(browser) ? browser : defaultBrowser);
};

/**
 * Function determine if given platform is valid according to settings
 * @param {string} [browser] - specified browser for tests
 */
const _determinePlatform = (platform) => {
  return (_isPlatformValid(platform) ? platform : defaultPlatform);
};



/**
 * Function determine enviroment(s) for specified browser and platform. When browser is set to all, multiple enviroment will be returned
 * @param {string} [browser] - specified browser for tests
 */
const determineEnviroment = (browser, platform) => {

  const _browser = _determineBrowser(browser);
  const _platform = _determinePlatform(platform);

  const enviroment = _browser === 'all' ? _combineAllEnviromentsByPlatform(_platform) : _makeEnviromentName(_browser, _platform);

  return enviroment;
};



const helper = {
  determineEnviroment
};

module.exports = helper;
