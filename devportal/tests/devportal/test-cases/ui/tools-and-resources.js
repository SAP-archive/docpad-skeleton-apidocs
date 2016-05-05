'use strict';
const helper = require('../../helpers/testHelper.js');

let randomTools = [];
let randomResources = [];

module.exports = {

  before : (browser) => {
    randomTools = helper.getTwoRandomTools();
    randomResources = helper.getTwoRandomResources();
  },


  'Check tools page': (browser) => {

    const headerValue = 'Tools & Resources';

    browser
      .getHomePage()
      .waitAndClickById('tools-topNav')
      .waitForElementByClassName('featured-items__container')
      .waitForElementByClassName('additional-links__list')
      .assertContainsTextByClass('.jumbotron__title', headerValue)
      .assertContainsTextByClass('.nav-header', headerValue)
      .waitAndClickByLinkText(randomTools[0])
      .assertContainsTextByClass('.nav-header', randomTools[0])
      .goBack()
      .waitAndClickByLinkText(randomResources[0])
      .assertContainsTextByClass('.nav-header', randomResources[0])
      .waitAndClickByLinkText('Back to Tools & Resources')
      .assertContainsTextByClass('.nav-header', headerValue)
      .end();
  }
};
