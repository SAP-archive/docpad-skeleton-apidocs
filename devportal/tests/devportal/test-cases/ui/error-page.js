'use strict';

module.exports = {
  'should render proper content when 404 error page appears and check if back to home works': (browser) => {
    browser
      .url(`${browser.launchUrl}/nonexistingurl`)
      .waitForElementById('Layer_1')
      .waitForElementByClassName('error__image')
      .waitForElementByClassName('error__container')
      .waitForElementByClassName('error__subtitle')
      .assertContainsTextByClass('.error__subtitle', 'The page you have requested is not available. 404')
      .waitAndClickByClassName('error__link')
      .waitForElementByClassName('landing-page-wrapper')
      .end();
  }
};
