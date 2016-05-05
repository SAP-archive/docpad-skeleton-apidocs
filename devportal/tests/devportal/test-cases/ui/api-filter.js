'use strict';

const helper = require('../../helpers/testHelper.js');

let randomApiHeaders = [];
let randomApiPackages = [];
let notConsistentPair = [];
let consistentPair = [];

module.exports = {

  before : (browser) => {
    randomApiHeaders = helper.getTwoRandomApiHeaders();
    randomApiPackages = helper.getTwoRandomApiPackages();
    notConsistentPair = helper.getNotConsistentPair();
    consistentPair = helper.getConsistentPair();
  },

  beforeEach : (browser) => {
    browser
      .getHomePage()
      .waitAndClickById('apis-topNav');
  },


  'Should go to apis page and display menu': (browser) => {

    browser
      .assertContainsTextByClass('.nav-header', 'API Docs')
      .end();
  },

  'should check if searching by single package dropdown works + if its persistent': (browser) => {

    const xPathFilterList = '//*[@id="singlePackageFilterList"]';

    browser
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementVisible(xPathFilterList)
      .setValue(xPathFilterList, [randomApiPackages[0], browser.Keys.ENTER])
      .waitForElementNotVisibleBySpanText(randomApiPackages[1])
      .waitForElementBySpanText(randomApiPackages[0])
      .refresh()
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementNotVisibleBySpanText(randomApiPackages[1])
      .setValue(xPathFilterList, ['All Packages', browser.Keys.ENTER])
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementBySpanText(randomApiPackages[1])
      .end();
  },

  'should check if search box works + if its persistent': (browser) => {

    const xPath = '//*[@id="apiFilterInput"]';

    browser
      .waitForElementBySpanText(randomApiPackages[0])
      .waitForElementByLinkText(randomApiHeaders[0])
      .setValue(xPath, [randomApiHeaders[0], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(randomApiHeaders[1])
      .waitAndClickByLinkText(randomApiHeaders[0])
      .waitForElementByClassName('sticky-page-header')
      .goBack()
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementNotVisibleByLinkText(randomApiHeaders[1])
      .clearValue(xPath)
      .setValue(xPath, ['', browser.Keys.ENTER])
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementByLinkText(randomApiHeaders[1])
      .end();
  },

  'should check if search box works + single drop down works together + persistent': (browser) => {

    const xPathSearchBox = '//*[@id="apiFilterInput"]';
    const xPathDropDown= '//*[@id="singlePackageFilterList"]';

    browser
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementBySpanText(randomApiPackages[0])
      .setValue(xPathSearchBox, [consistentPair[0], browser.Keys.ENTER])
      .setValue(xPathDropDown, [consistentPair[1], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(notConsistentPair[0])
      .waitForElementBySpanText(consistentPair[1])
      .waitAndClickByLinkText(consistentPair[0])
      .waitForElementByClassName('sticky-page-header')
      .goBack()
      .waitForElementBySpanText(consistentPair[1])
      .waitForElementByLinkText(consistentPair[0])
      .clearValue(xPathSearchBox)
      .setValue(xPathSearchBox, ['', browser.Keys.ENTER])
      .setValue(xPathDropDown, ['All Packages', browser.Keys.ENTER])
      .waitForElementByLinkText(randomApiHeaders[0])
      .waitForElementByLinkText(notConsistentPair[0])
      .end();
  },


  'should check if text search works after single package dropdown was deleted and then all headers show up after clearing text filter': (browser) => {

    const xPathSearchBox = '//*[@id="apiFilterInput"]';
    const xPathDropDown= '//*[@id="singlePackageFilterList"]';

    browser
      .waitForElementByLinkText(notConsistentPair[0])
      .waitForElementBySpanText(notConsistentPair[1])
      .setValue(xPathSearchBox, [notConsistentPair[0], browser.Keys.ENTER])
      .setValue(xPathDropDown, [notConsistentPair[1], browser.Keys.ENTER])
      .waitForElementNotVisibleByLinkText(notConsistentPair[0])
      .waitForElementNotVisibleBySpanText(randomApiPackages[1])
      .clearValue(xPathSearchBox)
      .setValue(xPathSearchBox, ['', browser.Keys.ENTER])
      .waitForElementBySpanText(notConsistentPair[1])
      .setValue(xPathDropDown, ['All Packages', browser.Keys.ENTER])
      .waitForElementByLinkText(notConsistentPair[0])
      .waitForElementBySpanText(notConsistentPair[1])
      .end();
  }

};
