'use strict';

const helper = require('../../helpers/testHelper.js');

module.exports = {
  'check if service&tools contains visual indicator': (browser) => {

    //We hardcoded values cause its hard to find (impossible by now) 3 tools which contains visual indicator.
    browser
      .getHomePage()
      .waitAndClickById('apis-topNav')
      .waitAndClickByLinkText('Cart')
      .waitForElementByLinkText('Back to API Docs')
      .checkIfPageHasSubnavElement('.left-nav li a .left-nav__icon--is-visible', '.left-nav li a + ul', 0)
      .waitAndClickById('tools-topNav')
      .waitAndClickByLinkText('Builder SDK')
      .waitForElementByLinkText('Back to Tools & Resources')
      .checkIfPageHasSubnavElement('.left-nav li a .left-nav__icon--is-visible', '.left-nav li a + ul', 0)
      .end();
  }
};
