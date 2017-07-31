const path = require('path');

function init(chewieConfig){
  const customizationFilePath = path.resolve(path.join(chewieConfig.customization.dirPath, 'config.json'));
  let customizationConfig = null;

  try {
    customizationConfig = require(customizationFilePath);
  } catch(err) {
    if(err.code !== 'MODULE_NOT_FOUND') {
      throw new Error(`Cannot load customization config file from ${err.message}`);
    }
    console.log(`Not found customization config file at ${customizationFilePath}.`);
  }

  const GENERAL_NAV_ITEMS_DEFAULT = [
    { href: '/', name: 'Home', id: 'home-topNav' },
    { href: '/solutions/', name: 'Solutions', id: 'solutions-topNav' },
    { href: '/services/', name: 'API Docs', id: 'apis-topNav' },
    { href: '/rn/', name: 'Release Notes', id: 'rn-topNav' }
  ];

  function getGeneralNavItems(config) {
    if(!customizationConfig || !customizationConfig.generalNav) return GENERAL_NAV_ITEMS_DEFAULT;
    return customizationConfig.generalNav;
  }

  return {
    getGeneralNavItems
  };
}

module.exports = init;
