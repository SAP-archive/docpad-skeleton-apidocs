'use strict';

let envLink = '';

module.exports = {

  before : (browser) => {
    envLink = browser.globals.envLink;
  },

  'Super header checks': (browser) => {

    const homeLink = `https://www${envLink}`;
    const marketLink = `https://market${envLink}`;
    const builderLink = `https://builder${envLink}`;
    const devportalLink = `${browser.launchUrl}/`;
    const communityLink = `https://community${envLink}`;

    browser
      .getHomePage()
      .useXpath()
      .checkHrefValueByLinkText('Home', homeLink)
      .checkHrefValueByLinkText('YaaS Market', marketLink)
      .checkHrefValueByLinkText('Builder', builderLink)
      .checkHrefValueByLinkText('Community', communityLink)
      .checkHrefValueByLinkText('Builder', builderLink)
      .checkHrefValueByLinkText('Dev Portal', devportalLink)
      .moveToElement('//a[text()="My Account"]', 5, 5)
      .waitForElementByLinkText('Register')
      .waitForElementByLinkText('Sign In')
      .moveToElement('//a[text()="Community"]', 5, 5)
      .waitForElementVisible('//header//a[text() = "Co-Innovation Network"]')
      .waitForElementVisible('//header//a[text() = "hybris Experts"]')
      .end();
  }
};
