const path = require('path');
const fs = require('fs');

function init(chewieConfig) {
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

  function getCustomLandingPage() {
    const customLandingPagePath = path.resolve(path.join(chewieConfig.customization.dirPath, 'index.html'));
    try {
      return fs.readFileSync(customLandingPagePath, 'utf8');
    } catch(err){
      if(err.code !== 'ENOENT'){
        throw new Error(`Cannot load custom landing page: ${err.message}`)
      }
      console.log(`Not found custom landing page at ${customLandingPagePath}, will be used default.`);
      return null;
    }
  }

  return {
    getGeneralNavItems,
    getCustomLandingPage
  };
}

module.exports = init;
