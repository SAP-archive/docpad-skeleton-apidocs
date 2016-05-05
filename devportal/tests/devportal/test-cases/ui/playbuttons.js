'use strict';

const helper = require('../../helpers/testHelper.js');

module.exports = {
  'check if services contain play buttons': (browser) => {

    // We've hardcoded values, because it's hard to find (impossible even) 3 services, which contain play button.
    browser
      .getHomePage()
      .waitAndClickById('apis-topNav')
      .waitAndClickByLinkText('PubSub')
      .waitForElementByLinkText('Back to API Docs')
      .checkIfPageHasSubnavElement('.left-nav li a .left-nav__play-button--is-visible', 'iframe.interactive-tutorial', 1)
      .waitAndClickById('apis-topNav')
      .waitAndClickByLinkText('Product')
      .waitForElementByLinkText('Back to API Docs')
      .checkIfPageHasSubnavElement('.left-nav li a .left-nav__play-button--is-visible', 'iframe.interactive-tutorial', 1)
      .waitAndClickById('apis-topNav')
      .waitAndClickByLinkText('OAuth2')
      .waitForElementByLinkText('Back to API Docs')
      .checkIfPageHasSubnavElement('.left-nav li a .left-nav__play-button--is-visible', 'iframe.interactive-tutorial', 1)
      .end();
  }
};
