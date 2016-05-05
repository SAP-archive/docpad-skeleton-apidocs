const helper = require('../../helpers/testHelper.js');

module.exports = {

  before : (browser) => {
    randomApiHeaders = helper.getTwoRandomApiHeaders();
  },

  'Check if search works + if its persistent + if search links are working': (browser) => {

    browser
      .getHomePage()
      .waitAndClickById('lunr-input')
      .waitLunrToLoad()
      .useXpath()
      .setValue('//*[@id="lunr-input"]', [randomApiHeaders[0], browser.Keys.ENTER])
      .waitAndClickByLinkText(randomApiHeaders[0])
      .assertContainsTextByClass('.nav-header', randomApiHeaders[0])
      .refresh()
      .assert.value('#lunr-input', randomApiHeaders[0])
      .end();
  }
};
